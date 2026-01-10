import { CAROUSEL_INTERVAL } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-item');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 0) {
    setInterval(nextSlide, CAROUSEL_INTERVAL);
  }
});
