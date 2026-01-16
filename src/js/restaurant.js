import { dishData } from './dish-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get the 'id' query parameter from the URL (now expected to be a dish ID, e.g., 'masala-dosa')
  const urlParams = new URLSearchParams(window.location.search);
  const dishId = urlParams.get('id');

  // DOM Elements
  const contentContainer = document.getElementById('content-container');
  const notFoundMessage = document.getElementById('not-found-message');

  // New container for the restaurant list (we will append sections here)
  let restaurantListContainer = document.getElementById(
    'restaurant-list-container'
  );
  if (!restaurantListContainer) {
    // Create it if it doesn't exist (it won't initially)
    restaurantListContainer = document.createElement('div');
    restaurantListContainer.id = 'restaurant-list-container';
    // Append it after the main details
    document
      .querySelector('.restaurant-details')
      .after(restaurantListContainer);
  }

  if (dishId && dishData[dishId]) {
    const data = dishData[dishId];

    // Clear the container completely to build our new layout
    contentContainer.innerHTML = '';
    contentContainer.style.display = 'block'; // Block layout for scaffolding

    // Helper to create a specific section
    const createSection = (
      image,
      title,
      description,
      link = null,
      id = null,
      isMainDish = false
    ) => {
      // Wrapper for the whole block to target scrolling
      const wrapper = document.createElement('div');
      if (id) wrapper.id = id;

      // 1. Banner
      const banner = document.createElement('section');
      banner.className = 'parallax-banner';
      banner.style.backgroundImage = `url('${image}')`;

      // If main dish, show title in banner. Else empty overlay.
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

      // 2. Content
      const content = document.createElement('section');
      content.className = 'content-block';

      let buttonHtml = '';
      if (link) {
        buttonHtml = `
            <a href="${link}" target="_blank" class="location-btn">
                <i class="fas fa-map-marker-alt"></i> View Location
            </a>`;
      }

      // Only show title in content card if it's NOT the main dish
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

      contentContainer.appendChild(wrapper);
    };

    // A. Render MAIN DISH Section
    createSection(data.image, data.name, data.description, null, null, true);

    // B. Render RESTAURANT Sections
    data.restaurants.forEach((restaurant) => {
      // Pass false for isMainDish (default, but explicit here for clarity)
      createSection(
        restaurant.image,
        restaurant.name,
        restaurant.description,
        restaurant.location,
        restaurant.id,
        false
      );
    });

    // C. Add Back navigation at the very bottom
    const footerNav = document.createElement('div');
    footerNav.style.cssText =
      'padding: 4rem 0 6rem; text-align: center; background: #fff; position: relative; z-index: 10;';
    footerNav.innerHTML = `
        <a href="/pages/culture.html" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #555; text-decoration: none; font-weight: 600; font-size: 1.1rem; transition: color 0.3s ease;">
            <i class="fas fa-arrow-left"></i> Back to Dish Gallery
        </a>
    `;
    // Add hover effect via JS since it's an inline-styled element
    const link = footerNav.querySelector('a');
    link.onmouseover = () => (link.style.color = '#000');
    link.onmouseout = () => (link.style.color = '#555');

    contentContainer.appendChild(footerNav);

    // Hide error
    notFoundMessage.style.display = 'none';

    // C. Handle Deep Linking (Scroll to specific restaurant if hash exists)
    if (window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove '#'
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure rendering
    }
  } else {
    // Show error, hide content
    if (contentContainer) contentContainer.style.display = 'none';
    notFoundMessage.style.display = 'flex';
  }
});
