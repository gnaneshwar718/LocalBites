import { PlacesApi } from './services/placesApi.js';
import { $, byId, on } from './utils/dom.js';
import { ModalManager } from './utils/modal.js';
import { API_ENDPOINTS } from '../../route.js';
import { GOOGLE_MAPS_CHECK_INTERVAL } from './constants/constants.js';
import './components.js';

class ExplorePage {
  constructor() {
    this.grid = byId('restaurantGrid');
    this.searchInput = byId('restaurantSearch');
    this.filterBtn = byId('filterBtn');
    this.budgetBtn = byId('budgetBtn');
    this.detailModal = byId('detailModal');
    this.filterModal = byId('filterModal');
    this.budgetModal = byId('budget-modal');
    this.modalBody = byId('modalBody');
    this.budgetInputs = {
      total: byId('totalBudget'),
      people: byId('numPeople'),
      meals: byId('numMeals'),
    };
    this.budgetDisplay = byId('budgetPerPerson');
    this.applyBudgetBtn = byId('calcBudgetBtn');
    this.cardTemplate = byId('restaurant-card-template');
    this.detailTemplate = byId('detail-modal-template');
    this.noResultsTemplate = byId('no-results-template');
    this.filters = {
      search: '',
      cuisine: 'all',
      mealType: 'all',
      budget: Infinity,
      rating: 0,
      popular: false,
    };
    this.restaurants = [];
    this.initPromise = this.init();
  }

  async init() {
    try {
      this.apiKey = await this.loadConfig();
      PlacesApi.setApiKey(this.apiKey);
      const apiData = await PlacesApi.fetchRestaurants();

      if (apiData && apiData.length > 0) {
        this.restaurants = apiData;
      } else {
        console.warn('API returned empty or invalid data.');
        this.restaurants = [];
      }
    } catch (error) {
      console.error('Detailed error in ExplorePage init:', error);
      this.restaurants = [];
    } finally {
      this.renderRestaurants();
      this.setupEventListeners();
    }
  }

  async loadConfig() {
    try {
      const response = await fetch(API_ENDPOINTS.CONFIG);
      if (!response.ok) throw new Error('Failed to load configuration');
      const config = await response.json();
      return config.googleMapsApiKey;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  }

  setupEventListeners() {
    if (this.searchInput) {
      on(this.searchInput, 'input', (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderRestaurants();
      });
    }

    if (this.filterBtn) {
      on(this.filterBtn, 'click', () => ModalManager.open(this.filterModal));
    }

    if (this.budgetBtn) {
      on(this.budgetBtn, 'click', () => ModalManager.open(this.budgetModal));
    }

    document.querySelectorAll('.modal-close, .modal-backdrop').forEach((el) => {
      on(el, 'click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          ModalManager.close(modal);
        }
      });
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = $('.modal.active');
        if (activeModal) ModalManager.close(activeModal);
      }
    });

    this.setupFilterGroup('cuisineFilters', 'cuisine', 'cuisine');
    this.setupFilterGroup('mealTypeFilters', 'mealType', 'mealtype');
    const applyFiltersBtn = byId('applyFiltersBtn');
    if (applyFiltersBtn) {
      on(applyFiltersBtn, 'click', () => {
        this.renderRestaurants();
        ModalManager.close(this.filterModal);
      });
    }

    if (this.budgetInputs.total) {
      ['total', 'people', 'meals'].forEach((key) => {
        on(this.budgetInputs[key], 'input', () => this.calculateBudget());
      });
    }

    if (this.applyBudgetBtn) {
      on(this.applyBudgetBtn, 'click', () => {
        const budgetPerPerson = this.calculateBudget();
        if (budgetPerPerson > 0) {
          this.filters.budget = budgetPerPerson;
          this.renderRestaurants();
          ModalManager.close(this.budgetModal);
        }
      });
    }

    if (this.grid) {
      on(this.grid, 'click', (e) => {
        const card = e.target.closest('.restaurant-card');
        if (card) {
          this.openDetails(card.dataset.id);
        }
      });
    }
    const mapModal = byId('mapModal');
    if (mapModal) {
      on(mapModal.querySelector('.map-modal-close'), 'click', () => {
        ModalManager.close(mapModal);
      });
    }
  }

  setupFilterGroup(groupId, filterKey, datasetKey) {
    const container = byId(groupId);
    if (container) {
      on(container, 'click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
          this.updateChipGroup(groupId, e.target);
          this.filters[filterKey] = e.target.dataset[datasetKey];
        }
      });
    }
  }

  calculateBudget() {
    const total = parseFloat(this.budgetInputs.total.value) || 0;
    const people = parseFloat(this.budgetInputs.people.value) || 1;
    const meals = parseFloat(this.budgetInputs.meals.value) || 1;

    if (total > 0 && people > 0 && meals > 0) {
      const budgetPerPerson = Math.floor(total / people / meals);
      this.budgetDisplay.textContent = budgetPerPerson;
      return budgetPerPerson;
    }
    this.budgetDisplay.textContent = '0';
    return 0;
  }

  updateChipGroup(groupId, activeChip) {
    document.querySelectorAll(`#${groupId} .filter-chip`).forEach((chip) => {
      chip.classList.remove('active');
    });
    activeChip.classList.add('active');
  }

  renderRestaurants() {
    if (!this.grid || !this.restaurants.length) return;

    const filtered = this.restaurants.filter((res) => {
      const matchesSearch =
        !this.filters.search ||
        res.name.toLowerCase().includes(this.filters.search) ||
        res.cuisine.toLowerCase().includes(this.filters.search) ||
        res.location.toLowerCase().includes(this.filters.search);

      const matchesCuisine =
        this.filters.cuisine === 'all' ||
        res.cuisine.toLowerCase().includes(this.filters.cuisine.toLowerCase());

      const matchesMealType =
        this.filters.mealType === 'all' ||
        (Array.isArray(res.mealType)
          ? res.mealType.includes(this.filters.mealType)
          : res.mealType.toLowerCase() === this.filters.mealType.toLowerCase());

      const matchesBudget = res.price <= this.filters.budget;
      const matchesRating = res.rating >= this.filters.rating;
      const matchesPopular =
        !this.filters.popular || (res.rating >= 4.2 && res.reviews > 1000);

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesMealType &&
        matchesBudget &&
        matchesRating &&
        matchesPopular
      );
    });

    this.grid.textContent = '';

    if (filtered.length === 0) {
      if (this.noResultsTemplate) {
        this.grid.appendChild(this.noResultsTemplate.content.cloneNode(true));
      }
      return;
    }

    filtered.forEach((res) => {
      const card = this.createRestaurantCard(res);
      this.grid.appendChild(card);
    });
  }

  renderStars(rating) {
    const stars = 5;
    let color = '#ef4444';
    if (rating >= 4.0) color = '#22c55e';
    else if (rating >= 3.0) color = '#eab308';

    let html = `<span style="color: ${color}; display: inline-flex; gap: 2px;">`;
    for (let i = 0; i < stars; i++) {
      if (i < Math.floor(rating)) {
        html += '<i class="fa-solid fa-star"></i>';
      } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
        html += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        html += '<i class="fa-regular fa-star"></i>';
      }
    }
    html += `</span> <span style="color: #666; font-size: 0.9em; margin-left: 4px;">(${rating})</span>`;
    return html;
  }

  createRestaurantCard(restaurant) {
    if (!this.cardTemplate) return document.createElement('div');
    const clone = this.cardTemplate.content.cloneNode(true);
    const article = clone.querySelector('.restaurant-card');
    article.dataset.id = restaurant.id;
    const img = clone.querySelector('img');
    img.src = restaurant.image;
    img.alt = restaurant.name;
    clone.querySelector('h3').textContent = restaurant.name;
    clone.querySelector('.card-price').textContent =
      restaurant.priceString || `₹${restaurant.price}`;
    clone.querySelector('.card-cuisine').textContent = restaurant.cuisine;
    clone.querySelector('.rating').innerHTML = this.renderStars(
      restaurant.rating
    );
    clone.querySelector('.tag .value').textContent = ` ${restaurant.location}`;

    const badge = clone.querySelector('.card-badge');
    if (restaurant.openStatusText) {
      badge.textContent = restaurant.openStatusText;
      if (restaurant.isOpen) {
        badge.style.background = '#d1fae5';
        badge.style.color = '#065f46';
      } else {
        badge.style.background = '#fee2e2';
        badge.style.color = '#991b1b';
      }
    } else {
      badge.style.display = 'none';
    }
    return article;
  }

  openDetails(id) {
    const res = this.restaurants.find((r) => String(r.id) === String(id));
    if (!res || !this.modalBody || !this.detailTemplate) return;
    this.modalBody.textContent = '';
    const clone = this.detailTemplate.content.cloneNode(true);
    const img = clone.querySelector('.modal-img');
    img.src = res.image;
    img.alt = res.name;
    img.alt = res.name;
    clone.querySelector('h2').textContent = res.name;
    const statusBadge = clone.querySelector('.status-badge');
    if (res.openStatusText) {
      statusBadge.textContent = res.openStatusText;
      statusBadge.style.background = res.isOpen ? '#d1fae5' : '#fee2e2';
      statusBadge.style.color = res.isOpen ? '#065f46' : '#991b1b';
      statusBadge.style.display = '';
    } else {
      statusBadge.style.display = 'none';
    }
    clone.querySelector('.rating').innerHTML = this.renderStars(res.rating);
    clone.querySelector('.meta-cuisine .value').textContent = ` ${res.cuisine}`;
    clone.querySelector('.meta-location .value').textContent =
      ` ${res.location}`;
    clone.querySelector('.desc-text').textContent = res.description;
    clone.querySelector('.specialty-text .value').textContent = res.specialty;
    clone.querySelector('.card-price').textContent =
      res.priceString || `₹${res.price}`;
    const btn = clone.querySelector('.btn-map');
    const btnWeb = clone.querySelector('.btn-website');
    if (res.website) {
      btnWeb.style.display = 'inline-flex';
      btnWeb.onclick = () => window.open(res.website, '_blank');
    }

    const btnCall = clone.querySelector('.btn-call');
    if (res.phoneNumber) {
      btnCall.style.display = 'inline-flex';
      btnCall.onclick = () => window.open(`tel:${res.phoneNumber}`);
    }
    btn.onclick = () => {
      this.openMap(res);
    };
    this.modalBody.appendChild(clone);
    ModalManager.open(this.detailModal);
  }

  async openMap(restaurant) {
    try {
      const mapModal = byId('mapModal');
      ModalManager.open(mapModal);
      byId('routeDistance').textContent = 'Loading...';
      byId('routeDuration').textContent = 'Calculating...';
      window.gm_authFailure = () => {
        console.error(
          'Google Maps JS API Authentication Failed. Falling back to Embed API.'
        );
        this.renderEmbedFallback(restaurant);
      };
      if (!window.google || !window.google.maps) {
        await this.loadGoogleMaps();
      }
      const userLocation = await this.getUserLocation();
      this.initMap(userLocation, { lat: restaurant.lat, lng: restaurant.lng });
    } catch (error) {
      console.error('Map Error:', error);
      if (restaurant.lat && restaurant.lng) {
        this.renderEmbedFallback(restaurant);
      } else {
        alert('Unable to load map. Please try again.');
        ModalManager.close(byId('mapModal'));
      }
    }
  }

  renderEmbedFallback(restaurant) {
    const mapError = byId('mapError');
    const mapFrame = byId('mapFrame');

    if (!this.apiKey) {
      if (mapError) mapError.classList.remove('hidden');
      if (mapFrame) mapFrame.classList.add('hidden');
      return;
    }

    if (mapError) mapError.classList.add('hidden');
    if (mapFrame) mapFrame.classList.remove('hidden');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
        const dest = `${restaurant.lat},${restaurant.lng}`;
        if (mapFrame) {
          mapFrame.src = `https://www.google.com/maps/embed/v1/directions?key=${this.apiKey}&origin=${origin}&destination=${dest}&mode=driving`;
        }

        byId('routeDistance').textContent = 'View Map';
        byId('routeDuration').textContent = 'View Map';
      },
      () => {
        if (mapFrame) {
          mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=${
            this.apiKey
          }&q=${encodeURIComponent(
            restaurant.name + ' ' + restaurant.location
          )}`;
        }
        byId('routeDistance').textContent = '-';
        byId('routeDuration').textContent = '-';
      }
    );
  }

  loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      if (document.querySelector('#google-maps-script')) {
        const check = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(check);
            resolve();
          }
        }, GOOGLE_MAPS_CHECK_INTERVAL);
        return;
      }

      if (!this.apiKey) {
        reject(new Error('Google Maps API Key not available'));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation failed, handling fallback or error', error);
          reject(error);
        }
      );
    });
  }

  initMap(origin, destination) {
    const map = new google.maps.Map(byId('map'), {
      zoom: 13,
      center: origin,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
    });

    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        const leg = result.routes[0].legs[0];
        byId('routeDistance').textContent = leg.distance.text;
        byId('routeDuration').textContent = leg.duration.text;
      } else {
        console.error('Directions request failed due to ' + status);
        byId('routeDistance').textContent = 'Error';
        byId('routeDuration').textContent = 'N/A';
      }
    });
  }
}
export { ExplorePage };
if (
  typeof window !== 'undefined' &&
  (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')
) {
  document.addEventListener('DOMContentLoaded', () => {
    new ExplorePage();
  });
}
