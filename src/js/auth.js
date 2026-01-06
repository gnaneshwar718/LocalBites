import { CLASSNAMES, ENDPOINTS, MESSAGES } from './constants.js';
import { $$, byId, on } from './utils/dom.js';

export const AuthManager = {
  init() {
    this.container = byId('container');
    this.buttons = {
      signUp: byId('signUp'),
      signIn: byId('signIn'),
      mobileSignUp: byId('mobile-signUp'),
      mobileSignIn: byId('mobile-signIn'),
    };
    this.forms = {
      signup: byId('signup-form'),
      signin: byId('signin-form'),
    };

    this.bindEvents();
  },

  bindEvents() {
    on(this.buttons.signUp, 'click', () => this.togglePanel(true));
    on(this.buttons.signIn, 'click', () => this.togglePanel(false));

    on(this.buttons.mobileSignUp, 'click', (e) => {
      e.preventDefault();
      this.togglePanel(true);
    });

    on(this.buttons.mobileSignIn, 'click', (e) => {
      e.preventDefault();
      this.togglePanel(false);
    });

    $$('input').forEach((input) => {
      on(input, 'input', () => {
        const form = input.closest('form')?.id.split('-')[0];
        const message = byId(`${form}-message`);
        if (message) message.style.visibility = 'hidden';
      });
    });

    on(this.forms.signup, 'submit', (e) => this.handleSignUp(e));
    on(this.forms.signin, 'submit', (e) => this.handleSignIn(e));
  },

  togglePanel(showSignUp) {
    this.container.classList.toggle(CLASSNAMES.ACTIVE, showSignUp);
    this.clearMessages();
  },

  showMessage(form, text, type) {
    const el = byId(`${form}-message`);
    if (!el) return;

    el.textContent = text;
    el.className = `message message-${type}`;
    el.style.visibility = 'visible';
  },

  clearMessages() {
    $$('.message').forEach((el) => {
      el.textContent = '';
      el.className = 'message';
      el.style.visibility = 'hidden';
    });
  },

  async postJSON(url, payload) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { response, data };
  },

  async handleSignUp(e) {
    e.preventDefault();

    const payload = {
      name: byId('signup-name').value,
      email: byId('signup-email').value,
      password: byId('signup-password').value,
    };

    const retypePassword = byId('signup-retype-password').value;

    if (payload.password !== retypePassword) {
      this.showMessage('signup', MESSAGES.PASSWORD_MISMATCH, 'error');
      return;
    }

    try {
      const { response, data } = await this.postJSON(ENDPOINTS.SIGNUP, payload);

      if (response.ok) {
        this.showMessage('signup', MESSAGES.SIGNUP_SUCCESS, 'success');
        setTimeout(() => this.togglePanel(false), 2000);
      } else {
        this.showMessage('signup', data.message || 'Sign up failed', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showMessage('signup', MESSAGES.SIGNUP_ERROR, 'error');
    }
  },

  async handleSignIn(e) {
    e.preventDefault();

    const payload = {
      email: byId('signin-email').value,
      password: byId('signin-password').value,
    };

    try {
      const { response, data } = await this.postJSON(ENDPOINTS.SIGNIN, payload);

      if (response.ok) {
        this.showMessage(
          'signin',
          `Welcome back, ${data.user.name}!`,
          'success'
        );
        setTimeout(() => (window.location.href = '/'), 1500);
      } else {
        this.showMessage('signin', data.message || 'Sign in failed', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showMessage('signin', MESSAGES.SIGNIN_ERROR, 'error');
    }
  },
};
