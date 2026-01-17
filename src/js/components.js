import { COPYRIGHT_TEXT, ENDPOINTS, PATHS, SELECTORS } from './constants.js';

async function loadPartial(url) {
  const response = await fetch(url);
  return await response.text();
}

async function updateContactLinks(container) {
  try {
    const response = await fetch(ENDPOINTS.CONFIG);
    const config = await response.json();
    const contactLinks = container.querySelectorAll(SELECTORS.CONTACT_LINKS);
    contactLinks.forEach((link) => {
      if (config.contactEmail) {
        link.href = `mailto:${config.contactEmail}`;
      }
    });

    const copyrightElem = container.querySelector(SELECTORS.COPYRIGHT);
    if (copyrightElem) {
      copyrightElem.innerHTML = COPYRIGHT_TEXT;
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

class AppHeader extends HTMLElement {
  async connectedCallback() {
    const html = await loadPartial(PATHS.HEADER_PARTIAL);
    this.innerHTML = html;

    const hamburger = this.querySelector(SELECTORS.HAMBURGER);
    const navLinks = this.querySelector(SELECTORS.NAV_LINKS);

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }
}

class AppFooter extends HTMLElement {
  async connectedCallback() {
    const html = await loadPartial(PATHS.FOOTER_PARTIAL);
    this.innerHTML = html;
    await updateContactLinks(this);
  }
}

class FaqSection extends HTMLElement {
  async connectedCallback() {
    const html = await loadPartial(PATHS.FAQ_PARTIAL);
    this.innerHTML = html;
    await updateContactLinks(this);
  }
}

if (!customElements.get('app-header')) {
  customElements.define('app-header', AppHeader);
}
if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}
if (!customElements.get('faq-section')) {
  customElements.define('faq-section', FaqSection);
}

class FeatureCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    const subtitle = this.getAttribute('subtitle');
    const description = this.getAttribute('description');
    const link = this.getAttribute('link') || '#';
    const image = this.getAttribute('image');
    this.innerHTML = `
      <article class="feature-card">
        <div>
          <h3>${title}</h3>
          <div class="subtitle">${subtitle}</div>
          <p>${description}</p>
          <a href="${link}" class="feature-link">Explore <i class="fa-solid fa-chevron-right"></i></a>
        </div>
        <div class="feature-image">
          <img src="${image}" alt="${title}">
        </div>
      </article>
    `;
  }
}
if (!customElements.get('feature-card')) {
  customElements.define('feature-card', FeatureCard);
}

class FaqItem extends HTMLElement {
  connectedCallback() {
    const question = this.getAttribute('question');
    const answer = this.getAttribute('answer');
    this.innerHTML = `
      <div class="faq-item">
        <h4>${question}</h4>
        <p>${answer}</p>
      </div>
    `;
  }
}
if (!customElements.get('faq-item')) {
  customElements.define('faq-item', FaqItem);
}

class CarouselSlide extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');
    const active = this.hasAttribute('active');
    this.innerHTML = `
      <div class="carousel-item ${active ? 'active' : ''}">
        <img src="${src}" alt="Local Food">
      </div>
    `;
  }
}
if (!customElements.get('carousel-slide')) {
  customElements.define('carousel-slide', CarouselSlide);
}
