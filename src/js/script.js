import { $$, on } from './utils/dom.js';

on(document, 'DOMContentLoaded', () => {
  const slides = $$('.carousel-item');
  let currentSlide = 0;
  const slideInterval = 4000;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 0) {
    setInterval(nextSlide, slideInterval);
  }
});
