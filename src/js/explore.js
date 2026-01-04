import { RESTAURANTS } from '../data/restaurants.js';

class ExplorePage {
  constructor() {
    this.grid = document.getElementById('restaurantGrid');
    this.searchInput = document.getElementById('restaurantSearch');
    this.filterBtn = document.getElementById('filterBtn');
    this.budgetBtn = document.getElementById('budgetBtn');

    this.detailModal = document.getElementById('detailModal');
    this.filterModal = document.getElementById('filterModal');
    this.budgetModal = document.getElementById('budget-modal');
    this.modalBody = document.getElementById('modalBody');

    this.budgetInputs = {
      total: document.getElementById('totalBudget'),
      people: document.getElementById('numPeople'),
      meals: document.getElementById('numMeals'),
    };
    this.budgetDisplay = document.getElementById('budgetPerPerson');
    this.applyBudgetBtn = document.getElementById('calcBudgetBtn');

    this.cardTemplate = document.getElementById('restaurant-card-template');
    this.detailTemplate = document.getElementById('detail-modal-template');
    this.noResultsTemplate = document.getElementById('no-results-template');

    this.filters = {
      search: '',
      cuisine: 'all',
      mealType: 'all',
      budget: Infinity,
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

    if (this.budgetBtn) {
      this.budgetBtn.addEventListener('click', () =>
        this.openModal(this.budgetModal)
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

    if (this.budgetInputs.total) {
      ['total', 'people', 'meals'].forEach((key) => {
        this.budgetInputs[key].addEventListener('input', () =>
          this.calculateBudget()
        );
      });
    }

    if (this.applyBudgetBtn) {
      this.applyBudgetBtn.addEventListener('click', () => {
        const budgetPerPerson = this.calculateBudget();
        if (budgetPerPerson > 0) {
          this.filters.budget = budgetPerPerson;
          this.renderRestaurants();
          this.closeModal(this.budgetModal);
        }
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
        res.cuisine.includes(this.filters.cuisine);

      const matchesMealType =
        this.filters.mealType === 'all' ||
        res.mealType.includes(this.filters.mealType);

      const matchesBudget = res.price <= this.filters.budget;

      return (
        matchesSearch && matchesCuisine && matchesMealType && matchesBudget
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

  createRestaurantCard(restaurant) {
    if (!this.cardTemplate) return document.createElement('div');

    const clone = this.cardTemplate.content.cloneNode(true);
    const article = clone.querySelector('.restaurant-card');
    article.dataset.id = restaurant.id;

    const img = clone.querySelector('img');
    img.src = restaurant.image;
    img.alt = restaurant.name;

    clone.querySelector('h3').textContent = restaurant.name;
    clone.querySelector('.card-price').textContent = `₹${restaurant.price}`;
    clone.querySelector('.card-cuisine').textContent = restaurant.cuisine;

    clone.querySelector('.rating .value').textContent = ` ${restaurant.rating}`;
    clone.querySelector('.tag .value').textContent = ` ${restaurant.location}`;

    return article;
  }

  openDetails(id) {
    const res = this.restaurants.find((r) => r.id === id);
    if (!res || !this.modalBody || !this.detailTemplate) return;

    this.modalBody.textContent = '';
    const clone = this.detailTemplate.content.cloneNode(true);

    const img = clone.querySelector('.modal-img');
    img.src = res.image;
    img.alt = res.name;

    clone.querySelector('h2').textContent = res.name;

    clone.querySelector('.rating .value').textContent = ` ${res.rating}`;
    clone.querySelector('.meta-cuisine .value').textContent = ` ${res.cuisine}`;
    clone.querySelector('.meta-location .value').textContent =
      ` ${res.location}`;

    clone.querySelector('.desc-text').textContent = res.description;
    clone.querySelector('.specialty-text .value').textContent = res.specialty;

    clone.querySelector('.card-price').textContent = `₹${res.price}`;

    const btn = clone.querySelector('.btn-primary');
    btn.onclick = () => {
      const query = encodeURIComponent(`${res.name} ${res.location} Bengaluru`);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        '_blank'
      );
    };

    this.modalBody.appendChild(clone);
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
