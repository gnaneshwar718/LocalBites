import {
  LIMIT,
  CAROUSEL_INTERVAL,
  HERO_DATA,
  ANIMATION_TIMINGS,
} from './constants/constants.js';
import { PATHS } from './constants/paths.js';

document.addEventListener('DOMContentLoaded', async () => {
  const getById = (id) => document.getElementById(id);
  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => document.querySelectorAll(selector);

  let dishData = {},
    restaurantData = {},
    allDishes = [],
    filteredDishes = [];
  let currentPage = 0;

  try {
    const response = await fetch(PATHS.CULTURE_DATA);
    if (response.ok) {
      const data = await response.json();
      dishData = data.dishes;
      restaurantData = data.restaurants;
      allDishes = Object.entries(dishData).map(([id, value]) => ({
        id,
        ...value,
      }));
      filteredDishes = [...allDishes];
    }

    const hamburger = select('.hamburger');
    if (hamburger) {
      hamburger.onclick = () => select('.nav-links').classList.toggle('active');
    }

    const heroData = HERO_DATA;
    const slides = selectAll('.carousel-item');
    const heroTagline = select('.hero-tagline');
    const heroTitle = select('.culture-hero-text h1');
    const heroDescription = select('.culture-hero-text p');

    let currentSlideIndex = 0;

    const showSlide = (index) => {
      const activeSlide = select('.carousel-item.active');
      if (activeSlide) {
        activeSlide.classList.replace('active', 'slide-out');
      }
      slides[index].classList.remove('slide-out');
      slides[index].classList.add('active');

      [heroTagline, heroTitle, heroDescription].forEach((element) => {
        element.style.opacity = 0;
        element.style.transform = 'translateX(-50px)';
      });

      setTimeout(() => {
        const item = heroData[index];
        heroTagline.textContent = item.t;
        heroTitle.textContent = item.h;
        heroDescription.textContent = item.d;

        [heroTagline, heroTitle, heroDescription].forEach((element, idx) => {
          element.style.transition = 'none';
          element.style.transform = 'translateX(50px)';
          void element.offsetHeight;
          element.style.transition = `all ${ANIMATION_TIMINGS.HERO_TEXT_TRANSITION_BASE}s ease-out ${idx * ANIMATION_TIMINGS.HERO_TEXT_TRANSITION_DELAY}s`;
          element.style.opacity = 1;
          element.style.transform = 'translateX(0)';
        });
      }, ANIMATION_TIMINGS.HERO_TEXT_FADE_OUT);
      currentSlideIndex = index;
    };

    setInterval(
      () => showSlide((currentSlideIndex + 1) % slides.length),
      CAROUSEL_INTERVAL
    );

    const updateUI = () => {
      const dishesGrid = select('.dishes-grid');
      const start = currentPage * LIMIT;
      const visibleDishes = filteredDishes.slice(start, start + LIMIT);

      dishesGrid.innerHTML = visibleDishes.length
        ? visibleDishes
            .map(
              (dish) => `
        <article class="dish-card" id="${dish.id}">
          <a href="${PATHS.RESTAURANT_PAGE}?id=${dish.id}" class="dish-image-link">
            <div class="dish-image"><img src="${dish.image || ''}" alt="${dish.name}" loading="lazy"></div>
          </a>
          <div class="dish-content">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
            <div class="famous-restaurants">
              <h4>Iconic places to try</h4>
              <ul class="restaurant-list">
                ${dish.restaurants
                  .map((restaurantId) => {
                    const restaurant = restaurantData[restaurantId];
                    return restaurant
                      ? `<li class="restaurant-item"><div class="restaurant-header">
                    <span class="restaurant-name">${restaurant.name}</span>
                    ${restaurant.location && restaurant.location !== '#' ? `<a href="${restaurant.location}" target="_blank" class="location-icon"><i class="fas fa-map-marker-alt"></i></a>` : ''}
                    <a href="${PATHS.RESTAURANT_PAGE}?id=${dish.id}#${restaurant.id}" class="place-link"><i class="fas fa-chevron-right"></i></a>
                  </div></li>`
                      : '';
                  })
                  .join('')}
              </ul>
            </div>
          </div>
        </article>`
            )
            .join('')
        : '<p style="grid-column: 1/-1; text-align: center;">No dishes found.</p>';

      const totalPages = Math.ceil(filteredDishes.length / LIMIT);
      const prevBtn = select('.prev-btn');
      const nextBtn = select('.next-btn');

      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;

      const dotsContainer = select('.page-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML =
          totalPages > 1
            ? Array.from(
                { length: totalPages },
                (_, i) =>
                  `<div class="dot ${i === currentPage ? 'active' : ''}" data-idx="${i}"></div>`
              ).join('')
            : '';
        selectAll('.dot').forEach(
          (dot) =>
            (dot.onclick = () => {
              currentPage = +dot.dataset.idx;
              updateUI();
            })
        );
      }
    };

    select('.prev-btn')?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateUI();
      }
    });

    select('.next-btn')?.addEventListener('click', () => {
      if (currentPage < Math.ceil(filteredDishes.length / LIMIT) - 1) {
        currentPage++;
        updateUI();
      }
    });

    slides.forEach(
      (slide) =>
        (slide.onclick = () => {
          const dishId = slide.dataset.dish;
          const dishIndex = filteredDishes.findIndex((d) => d.id === dishId);
          if (dishIndex !== -1) {
            currentPage = Math.floor(dishIndex / LIMIT);
            updateUI();
            setTimeout(() => {
              const dishElement = getById(dishId);
              if (dishElement) {
                selectAll('.dish-card').forEach((card) =>
                  card.classList.remove('active')
                );
                dishElement.classList.add('active');
                dishElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
                setTimeout(
                  () => dishElement.classList.remove('active'),
                  ANIMATION_TIMINGS.DISH_HIGHLIGHT_DURATION
                );
              }
            }, ANIMATION_TIMINGS.DISH_SCROLL_DELAY);
          }
        })
    );

    getById('dish-search')?.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      filteredDishes = allDishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm) ||
          dish.description.toLowerCase().includes(searchTerm) ||
          dish.restaurants.some((restaurantId) =>
            (restaurantData[restaurantId]?.name || '')
              .toLowerCase()
              .includes(searchTerm)
          )
      );
      currentPage = 0;
      updateUI();
    });

    if (response.ok) updateUI();
  } catch (error) {
    console.error('Error:', error);
  }
});
