import { ENDPOINTS, PATHS, SELECTORS } from './constants.js';

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
    if (copyrightElem && config.copyrightText) {
      copyrightElem.innerHTML = config.copyrightText;
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

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
customElements.define('faq-section', FaqSection);

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
customElements.define('feature-card', FeatureCard);

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
customElements.define('faq-item', FaqItem);

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
customElements.define('carousel-slide', CarouselSlide);
