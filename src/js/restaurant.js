document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dishId = urlParams.get('id');

  const contentContainer = document.getElementById('content-container');
  const notFoundMessage = document.getElementById('not-found-message');

  let dishData = {};
  let restaurantData = {};

  try {
    const response = await fetch('/data/culture-data.json');
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
      const wrapper = document.createElement('div');
      if (id) wrapper.id = id;

      const banner = document.createElement('section');
      banner.className = 'parallax-banner';
      banner.style.backgroundImage = `url('${image}')`;

      let bannerContent = '<div class="banner-overlay"></div>';
      if (isMainDish) {
        bannerContent = `
            <div class="banner-overlay">
                <h2 class="banner-title">${title}</h2>
            </div>
            `;
      }
      banner.innerHTML = bannerContent;
      wrapper.appendChild(banner);

      const content = document.createElement('section');
      content.className = 'content-block';

      let buttonHtml = '';
      if (link) {
        buttonHtml = `
            <a href="${link}" target="_blank" class="location-btn">
                <i class="fas fa-map-marker-alt"></i> View Location
            </a>`;
      }

      let contentTitleHtml = '';
      if (!isMainDish) {
        contentTitleHtml = `<h2 class="content-title">${title}</h2>`;
      }

      content.innerHTML = `
            <div class="content-wrapper">
                ${contentTitleHtml}
                <div class="restaurant-desc">${description}</div>
                ${buttonHtml}
            </div>
        `;
      wrapper.appendChild(content);

      if (contentContainer) {
        contentContainer.appendChild(wrapper);
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

    const footerNav = document.createElement('div');
    footerNav.style.cssText =
      'padding: 4rem 0 6rem; text-align: center; background: #fff; position: relative; z-index: 10;';
    footerNav.innerHTML = `
        <a href="/pages/culture.html" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #555; text-decoration: none; font-weight: 600; font-size: 1.1rem; transition: color 0.3s ease;">
            <i class="fas fa-arrow-left"></i> Back to Dish Gallery
        </a>
    `;
    const link = footerNav.querySelector('a');
    if (link) {
      link.onmouseover = () => (link.style.color = '#000');
      link.onmouseout = () => (link.style.color = '#555');
    }

    if (contentContainer) {
      contentContainer.appendChild(footerNav);
      if (notFoundMessage) notFoundMessage.style.display = 'none';
    }

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  } else {
    if (contentContainer) contentContainer.style.display = 'none';
    if (notFoundMessage) notFoundMessage.style.display = 'flex';
  }
});
