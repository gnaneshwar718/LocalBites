import { PATHS } from './constants/paths.js';
import { ANIMATION_TIMINGS } from './constants/constants.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dishId = urlParams.get('id');
  const contentContainer = document.getElementById('content-container');
  const notFoundMessage = document.getElementById('not-found-message');

  let dishData = {};
  let restaurantData = {};

  try {
    const response = await fetch(PATHS.CULTURE_DATA);
    if (response.ok) {
      const data = await response.json();
      dishData = data.dishes;
      restaurantData = data.restaurants;
    }
  } catch (error) {
    console.error('Error loading culture data:', error);
  }

  let restaurantListContainer = document.getElementById(
    'restaurant-list-container'
  );
  if (!restaurantListContainer) {
    restaurantListContainer = document.createElement('div');
    restaurantListContainer.id = 'restaurant-list-container';
    const details = document.querySelector('.restaurant-details');
    if (details) {
      details.after(restaurantListContainer);
    }
  }

  if (dishId && dishData[dishId]) {
    const data = dishData[dishId];

    if (contentContainer) {
      contentContainer.innerHTML = '';
      contentContainer.style.display = 'block';
    }

    const createSection = (
      image,
      title,
      description,
      link = null,
      id = null,
      isMainDish = false
    ) => {
      const bannerTemplate = document.getElementById(
        'parallax-banner-template'
      );
      const contentTemplate = document.getElementById('content-block-template');
      const bannerClone = bannerTemplate.content.cloneNode(true);
      const bannerSection = bannerClone.querySelector('.parallax-banner');
      bannerSection.style.backgroundImage = `url('${image}')`;

      if (isMainDish) {
        const titleH2 = document.createElement('h2');
        titleH2.className = 'banner-title';
        titleH2.textContent = title;
        bannerClone.querySelector('.banner-overlay').appendChild(titleH2);
      }

      const contentClone = contentTemplate.content.cloneNode(true);
      const contentSection = contentClone.querySelector('.content-block');
      if (id) contentSection.id = id;

      if (!isMainDish) {
        contentClone.querySelector('.content-title').textContent = title;
      } else {
        contentClone.querySelector('.content-title').remove();
      }

      contentClone.querySelector('.restaurant-desc').innerHTML = description;
      const locationBtn = contentClone.querySelector('.location-btn');
      if (link) {
        locationBtn.href = link;
      } else {
        locationBtn.remove();
      }

      if (contentContainer) {
        contentContainer.appendChild(bannerClone);
        contentContainer.appendChild(contentClone);
      }
    };

    createSection(data.image, data.name, data.description, null, null, true);

    data.restaurants.forEach((rId) => {
      const rData = restaurantData[rId];
      if (rData) {
        createSection(
          rData.image,
          rData.name,
          rData.description,
          rData.location,
          rData.id,
          false
        );
      }
    });

    const footerNavTemplate = document.getElementById('footer-nav-template');
    if (footerNavTemplate && contentContainer) {
      const footerNavClone = footerNavTemplate.content.cloneNode(true);
      contentContainer.appendChild(footerNavClone);
      if (notFoundMessage) notFoundMessage.style.display = 'none';
    }

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, ANIMATION_TIMINGS.HASH_SCROLL_DELAY);
    }
  } else {
    if (contentContainer) contentContainer.style.display = 'none';
    if (notFoundMessage) notFoundMessage.style.display = 'flex';
  }
});
