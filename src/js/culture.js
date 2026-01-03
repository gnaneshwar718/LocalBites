'use strict';

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

  const carouselItems = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  function showSlide(index) {
    carouselItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % carouselItems.length;
    showSlide(newIndex);
  }

  function startAutoPlay() {
    setInterval(nextSlide, 4000);
  }

  carouselItems.forEach((item) => {
    item.addEventListener('click', () => {
      const dishId = item.getAttribute('data-dish');
      const dishCard = document.getElementById(dishId);

      if (dishCard) {
        document.querySelectorAll('.dish-card').forEach((card) => {
          card.classList.remove('active');
        });

        dishCard.classList.add('active');

        dishCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        setTimeout(() => {
          dishCard.classList.remove('active');
        }, 3000);
      }
    });
  });

  startAutoPlay();
});
