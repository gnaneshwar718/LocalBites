import { RESTAURANTS } from '/data/restaurants.js';

class ExplorePage {
  constructor() {
    this.grid = document.getElementById('restaurantGrid');
    this.searchInput = document.getElementById('restaurantSearch');
    this.filterBtn = document.getElementById('filterBtn');

    this.detailModal = document.getElementById('detailModal');
    this.filterModal = document.getElementById('filterModal');
    this.modalBody = document.getElementById('modalBody');

    this.filters = {
      search: '',
      cuisine: 'all',
      mealType: 'all',
    };

    this.restaurants = [];
    this.init();
  }

  init() {
    this.restaurants = RESTAURANTS;
    this.renderRestaurants();
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderRestaurants();
      });
    }

    if (this.filterBtn) {
      this.filterBtn.addEventListener('click', () =>
        this.openModal(this.filterModal)
      );
    }

    document.querySelectorAll('.modal-close, .modal-backdrop').forEach((el) => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) this.closeModal(activeModal);
      }
    });

    const cuisineFilters = document.getElementById('cuisineFilters');
    if (cuisineFilters) {
      cuisineFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
          this.updateChipGroup('cuisineFilters', e.target);
          this.filters.cuisine = e.target.dataset.cuisine;
        }
      });
    }

    const mealTypeFilters = document.getElementById('mealTypeFilters');
    if (mealTypeFilters) {
      mealTypeFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
          this.updateChipGroup('mealTypeFilters', e.target);
          this.filters.mealType = e.target.dataset.mealtype;
        }
      });
    }

    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        this.renderRestaurants();
        this.closeModal(this.filterModal);
      });
    }

    if (this.grid) {
      this.grid.addEventListener('click', (e) => {
        const card = e.target.closest('.restaurant-card');
        if (card) {
          this.openDetails(parseInt(card.dataset.id));
        }
      });
    }
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
        res.cuisine.includes(this.filters.cuisine);

      const matchesMealType =
        this.filters.mealType === 'all' ||
        res.mealType.includes(this.filters.mealType);

      return matchesSearch && matchesCuisine && matchesMealType;
    });

    if (filtered.length === 0) {
      this.grid.innerHTML =
        '<div class="no-results">No restaurants found matching your criteria.</div>';
      return;
    }

    this.grid.innerHTML = '';
    filtered.forEach((res) => {
      const card = this.createRestaurantCard(res);
      this.grid.appendChild(card);
    });
  }

  createRestaurantCard(restaurant) {
    const article = document.createElement('article');
    article.className = 'restaurant-card';
    article.dataset.id = restaurant.id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';

    const img = document.createElement('img');
    img.src = restaurant.image;
    img.alt = restaurant.name;
    img.loading = 'lazy';

    imageWrapper.appendChild(img);

    const content = document.createElement('div');
    content.className = 'card-content';

    const header = document.createElement('div');
    header.className = 'card-header';

    const title = document.createElement('h3');
    title.textContent = restaurant.name;

    const price = document.createElement('span');
    price.className = 'card-price';
    price.textContent = `₹${restaurant.price}`;

    header.appendChild(title);
    header.appendChild(price);

    const cuisine = document.createElement('div');
    cuisine.className = 'card-cuisine';
    cuisine.textContent = restaurant.cuisine;

    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const rating = document.createElement('span');
    rating.className = 'rating';
    rating.innerHTML = `<i class="fa-solid fa-star"></i> ${restaurant.rating}`;

    const location = document.createElement('span');
    location.className = 'tag';
    location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${restaurant.location}`;

    footer.appendChild(rating);
    footer.appendChild(location);

    content.appendChild(header);
    content.appendChild(cuisine);
    content.appendChild(footer);

    article.appendChild(imageWrapper);
    article.appendChild(content);

    return article;
  }

  openDetails(id) {
    const res = this.restaurants.find((r) => r.id === id);
    if (!res || !this.modalBody) return;

    this.modalBody.innerHTML = '';

    const img = document.createElement('img');
    img.src = res.image;
    img.alt = res.name;
    img.className = 'modal-img';

    const info = document.createElement('div');
    info.className = 'modal-info';

    const title = document.createElement('h2');
    title.textContent = res.name;

    const meta = document.createElement('div');
    meta.className = 'modal-meta';
    meta.innerHTML = `
            <span class="rating"><i class="fa-solid fa-star"></i> ${res.rating}</span>
            <span><i class="fa-solid fa-utensils"></i> ${res.cuisine}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${res.location}</span>
        `;

    const description = document.createElement('div');
    description.className = 'modal-description';

    const descPara = document.createElement('p');
    descPara.textContent = res.description;

    const specialtyPara = document.createElement('p');
    specialtyPara.innerHTML = `<strong>Specialty:</strong> ${res.specialty}`;

    description.appendChild(descPara);
    description.appendChild(specialtyPara);

    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const price = document.createElement('span');
    price.className = 'card-price';
    price.style.fontSize = '1.5rem';
    price.textContent = `₹${res.price}`;

    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = 'Visit Spot';
    button.onclick = () => alert('Booking feature coming soon!');

    footer.appendChild(price);
    footer.appendChild(button);

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(description);
    info.appendChild(footer);

    this.modalBody.appendChild(img);
    this.modalBody.appendChild(info);

    this.openModal(this.detailModal);
  }

  openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

export { ExplorePage, RESTAURANTS };

if (
  typeof window !== 'undefined' &&
  (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')
) {
  document.addEventListener('DOMContentLoaded', () => {
    new ExplorePage();
  });
}
