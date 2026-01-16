import { dishData } from './dish-data.js';
import { restaurantData } from './restaurant-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  try {
    const [headerResponse, footerResponse] = await Promise.all([
      fetch('/partials/header.html'),
      fetch('/partials/footer.html'),
    ]);

    if (headerResponse.ok) {
      headerPlaceholder.innerHTML = await headerResponse.text();
    }

    if (footerResponse.ok) {
      footerPlaceholder.innerHTML = await footerResponse.text();
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  } catch (error) {
    console.error('Error loading partials:', error);
  }

  /* --- Hero Carousel Logic --- */
  // Dish data for carousel text
  const dishCarouselData = [
    {
      tagline: 'The Iconic Breakfast',
      title: 'Masala Dosa',
      description:
        "A crispy, golden fermented crepe filled with spiced potatoes. Bengaluru's iconic breakfast, served with coconut chutney and sambar.",
    },
    {
      tagline: 'The Spicy Comfort',
      title: 'Bisi Bele Bath',
      description:
        "A wholesome 'hot lentil rice' dish with vegetables and aromatic spices. A cornerstone of Karnataka's culinary heritage.",
    },
    {
      tagline: 'The Royal Feast',
      title: 'Biryani',
      description:
        "Fragrant rice layered with spiced meat or vegetables. Bengaluru's version features both Hyderabadi and unique Donne styles.",
    },
    {
      tagline: 'The Rural Roots',
      title: 'Ragi Mudde',
      description:
        'Nutritious finger millet balls paired with spicy curries. A traditional staple of rural Karnataka cuisine.',
    },
    {
      tagline: 'The Perfect Duo',
      title: 'Idli Vada',
      description:
        "Soft steamed rice cakes paired with crispy lentil donuts. The perfect contrast of textures in South India's beloved breakfast.",
    },
    {
      tagline: 'The Soul',
      title: 'Filter Coffee',
      description:
        "Strong, aromatic coffee brewed in traditional filters. Served in brass tumblers, it's an integral part of Bengaluru's culture.",
    },
  ];

  const carouselItems = document.querySelectorAll('.carousel-item');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroTitle = document.querySelector('.culture-hero-text h1');
  const heroDescription = document.querySelector('.culture-hero-text p');
  let currentIndex = 0;

  function showSlide(index) {
    // Handle Image Transitions
    const currentActive = document.querySelector('.carousel-item.active');

    // Clean up previous states
    carouselItems.forEach((item) => {
      if (item !== currentActive && item !== carouselItems[index]) {
        item.classList.remove('active', 'slide-out');
      }
    });

    if (currentActive && currentActive !== carouselItems[index]) {
      currentActive.classList.remove('active');
      currentActive.classList.add('slide-out');
    }

    carouselItems[index].classList.remove('slide-out');
    carouselItems[index].classList.add('active');

    // Update text content with horizontal slide effect
    if (
      heroTagline &&
      heroTitle &&
      heroDescription &&
      dishCarouselData[index]
    ) {
      const textElements = [heroTagline, heroTitle, heroDescription];

      // 1. Slide out to left
      textElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50px)';
      });

      setTimeout(() => {
        // 2. Update Content
        heroTagline.textContent = dishCarouselData[index].tagline;
        heroTitle.textContent = dishCarouselData[index].title;
        heroDescription.textContent = dishCarouselData[index].description;

        // 3. Reset to right (instant)
        textElements.forEach((el) => {
          el.style.transition = 'none';
          el.style.transform = 'translateX(50px)';
        });

        // Force reflow
        void heroTagline.offsetHeight;

        // 4. Slide in from right
        textElements.forEach((el, i) => {
          el.style.transition = `opacity 0.6s ease-out ${i * 0.1}s, transform 0.6s ease-out ${i * 0.1}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        });
      }, 500); // Wait for exit animation
    }

    currentIndex = index;
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % carouselItems.length;
    showSlide(newIndex);
  }

  function startAutoPlay() {
    setInterval(nextSlide, 4000);
  }

  startAutoPlay();

  /* --- Pagination & Dynamic Rendering Logic --- */

  const ITEMS_PER_PAGE = 6;
  let pageNumber = 0; // Renamed to avoid confusion with parameter names

  // Convert object to array
  const allDishes = Object.entries(dishData).map(([key, value]) => ({
    ...value,
    id: key, // ensure ID is preserved
  }));

  let currentFilteredDishes = [...allDishes];

  const dishesGrid = document.querySelector('.dishes-grid');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const pageDotsContainer = document.querySelector('.page-dots');
  const searchInput = document.getElementById('dish-search');

  function createDishCard(dish) {
    const restaurantsHtml = dish.restaurants
      .map((r) => {
        let rData = r;
        // Handle string IDs by looking up in restaurantData
        if (typeof r === 'string') {
          rData = restaurantData[r] || {
            name: r,
            location: '#',
            id: r.toLowerCase().replace(/\s+/g, '-'),
          };
        }
        if (!rData) return '';

        return `
            <li class="restaurant-item">
              <div class="restaurant-header">
                <span class="restaurant-name">${rData.name}</span>
                ${
                  rData.location && rData.location !== '#'
                    ? `
                <a href="${rData.location}" target="_blank" class="location-icon" aria-label="View ${rData.name} on map">
                  <i class="fas fa-map-marker-alt"></i>
                </a>`
                    : ''
                }
                <a href="/pages/restaurant.html?id=${dish.id}#${rData.id}" class="place-link" aria-label="Learn more about ${rData.name}">
                   <i class="fas fa-chevron-right"></i>
                </a>
              </div>
            </li>
          `;
      })
      .join('');

    // Fallback image if none provided
    const imgSrc =
      dish.image || 'https://via.placeholder.com/400x300?text=No+Image';

    return `
        <article class="dish-card" id="${dish.id}" data-dish-id="${dish.id}">
          <div class="dish-image">
            <img src="${imgSrc}" alt="${dish.name}" loading="lazy" />
          </div>
          <div class="dish-content">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
            <div class="famous-restaurants">
              <h4>Iconic places to try</h4>
              <ul class="restaurant-list">
                ${restaurantsHtml}
              </ul>
            </div>
          </div>
        </article>
      `;
  }

  function renderGrid() {
    const start = pageNumber * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const dishesToShow = currentFilteredDishes.slice(start, end);

    if (dishesToShow.length === 0) {
      dishesGrid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #666;">No dishes found matching your search.</p>';
      return;
    }

    dishesGrid.innerHTML = dishesToShow.map(createDishCard).join('');

    // Add animation class
    dishesGrid.style.opacity = '0';
    requestAnimationFrame(() => {
      dishesGrid.style.transition = 'opacity 0.3s ease';
      dishesGrid.style.opacity = '1';
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(currentFilteredDishes.length / ITEMS_PER_PAGE);

    // Update Buttons
    if (prevBtn) prevBtn.disabled = pageNumber === 0;
    if (nextBtn) nextBtn.disabled = pageNumber >= totalPages - 1;

    // Update Dots
    if (pageDotsContainer) {
      pageDotsContainer.innerHTML = '';
      if (totalPages > 1) {
        // Only show dots if more than 1 page
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('div');
          dot.classList.add('dot');
          if (i === pageNumber) dot.classList.add('active');
          dot.addEventListener('click', () => {
            pageNumber = i;
            renderGrid();
            updatePagination();
          });
          pageDotsContainer.appendChild(dot);
        }
      }
    }
  }

  // Event Listeners for Pagination
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (pageNumber > 0) {
        pageNumber--;
        renderGrid();
        updatePagination();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(
        currentFilteredDishes.length / ITEMS_PER_PAGE
      );
      if (pageNumber < totalPages - 1) {
        pageNumber++;
        renderGrid();
        updatePagination();
      }
    });
  }

  // Hero Item Click Listener (Integrated with Pagination)
  carouselItems.forEach((item) => {
    item.addEventListener('click', () => {
      const dishId = item.getAttribute('data-dish');

      // Find the page this dish is on
      const dishIndex = currentFilteredDishes.findIndex(
        (d) => (d.id || d.name.toLowerCase().replace(/\s+/g, '-')) === dishId
      );

      if (dishIndex !== -1) {
        const page = Math.floor(dishIndex / ITEMS_PER_PAGE);
        if (page !== pageNumber) {
          pageNumber = page;
          renderGrid();
          updatePagination();
        }
        // Allow render to complete before scrolling
        setTimeout(() => {
          const card = document.getElementById(dishId);
          if (card) {
            document
              .querySelectorAll('.dish-card')
              .forEach((c) => c.classList.remove('active'));
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => card.classList.remove('active'), 3000);
          }
        }, 150);
      }
    });
  });

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();

      currentFilteredDishes = allDishes.filter((dish) => {
        const dishName = dish.name.toLowerCase();
        const dishDescription = dish.description.toLowerCase();

        // Helper to get restaurant names strings
        const restaurantNames = dish.restaurants
          .map((r) => {
            if (typeof r === 'string') {
              return (restaurantData[r]?.name || r).toLowerCase();
            }
            return r.name.toLowerCase();
          })
          .join(' ');

        return (
          dishName.includes(searchTerm) ||
          dishDescription.includes(searchTerm) ||
          restaurantNames.includes(searchTerm)
        );
      });

      pageNumber = 0; // Reset to first page of results
      renderGrid();
      updatePagination();
    });
  }

  // Initial Render
  renderGrid();
  updatePagination();
});
