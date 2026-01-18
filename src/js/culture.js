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
      dishesGrid.innerHTML = '';
      if (visibleDishes.length === 0) {
        const noDishesTemplate = getById('no-dishes-template');
        dishesGrid.appendChild(noDishesTemplate.content.cloneNode(true));
      } else {
        const dishTemplate = getById('dish-card-template');
        const restaurantTemplate = getById('restaurant-item-template');

        visibleDishes.forEach((dish) => {
          const dishClone = dishTemplate.content.cloneNode(true);
          const dishCard = dishClone.querySelector('.dish-card');
          dishCard.id = dish.id;
          const imageLink = dishClone.querySelector('.dish-image-link');
          imageLink.href = `${PATHS.RESTAURANT_PAGE}?id=${dish.id}`;
          const img = dishClone.querySelector('.dish-image img');
          img.src = dish.image || '';
          img.alt = dish.name;
          dishClone.querySelector('h3').textContent = dish.name;
          dishClone.querySelector('p').textContent = dish.description;
          const restaurantList = dishClone.querySelector('.restaurant-list');
          dish.restaurants.forEach((restaurantId) => {
            const restaurant = restaurantData[restaurantId];
            if (restaurant) {
              const resClone = restaurantTemplate.content.cloneNode(true);
              resClone.querySelector('.restaurant-name').textContent =
                restaurant.name;

              const locationIcon = resClone.querySelector('.location-icon');
              if (restaurant.location && restaurant.location !== '#') {
                locationIcon.href = restaurant.location;
              } else {
                locationIcon.remove();
              }
              const placeLink = resClone.querySelector('.place-link');
              placeLink.href = `${PATHS.RESTAURANT_PAGE}?id=${dish.id}#${restaurant.id}`;
              restaurantList.appendChild(resClone);
            }
          });

          dishesGrid.appendChild(dishClone);
        });
      }

      const totalPages = Math.ceil(filteredDishes.length / LIMIT);
      const prevBtn = select('.prev-btn');
      const nextBtn = select('.next-btn');
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('reveal');
              }, index * ANIMATION_TIMINGS.STAGGER_DELAY);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: ANIMATION_TIMINGS.REVEAL_THRESHOLD }
      );

      selectAll('.dish-card').forEach((card) => observer.observe(card));

      const dotsContainer = select('.page-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        if (totalPages > 1) {
          const dotTemplate = getById('pagination-dot-template');
          for (let i = 0; i < totalPages; i++) {
            const dotClone = dotTemplate.content.cloneNode(true);
            const dot = dotClone.querySelector('.dot');
            dot.dataset.idx = i;
            if (i === currentPage) dot.classList.add('active');
            dot.onclick = () => {
              currentPage = i;
              updateUI();
              select('.must-try-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            };
            dotsContainer.appendChild(dotClone);
          }
        }
      }
    };

    select('.prev-btn')?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateUI();
        select('.must-try-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });

    select('.next-btn')?.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredDishes.length / LIMIT);
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateUI();
        select('.must-try-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
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
