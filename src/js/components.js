async function loadPartial(url) {
  const response = await fetch(url);
  return await response.text();
}

class AppHeader extends HTMLElement {
  async connectedCallback() {
    const html = await loadPartial('/partials/header.html');
    this.innerHTML = html;

    const hamburger = this.querySelector('.hamburger');
    const navLinks = this.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }
}

class AppFooter extends HTMLElement {
  async connectedCallback() {
    const html = await loadPartial('/partials/footer.html');
    this.innerHTML = html;
  }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
