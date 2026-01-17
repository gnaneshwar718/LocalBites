import {
  CLASSNAMES,
  MESSAGES,
  PANEL_TOGGLE_DELAY,
  REDIRECT_DELAY,
} from './constants/constants.js';
import { ENDPOINTS } from '../../route.js';

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

export const AuthManager = {
  init() {
    this.container = $('container');
    this.buttons = {
      signUp: $('signUp'),
      signIn: $('signIn'),
      mobileSignUp: $('mobile-signUp'),
      mobileSignIn: $('mobile-signIn'),
    };
    this.forms = {
      signup: $('signup-form'),
      signin: $('signin-form'),
    };

    this.bindEvents();
  },

  bindEvents() {
    this.buttons.signUp?.addEventListener('click', () =>
      this.togglePanel(true)
    );
    this.buttons.signIn?.addEventListener('click', () =>
      this.togglePanel(false)
    );

    this.buttons.mobileSignUp?.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePanel(true);
    });

    this.buttons.mobileSignIn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePanel(false);
    });

    $$('input').forEach((input) => {
      input.addEventListener('input', () => {
        const form = input.closest('form')?.id.split('-')[0];
        const message = $(`${form}-message`);
        if (message) message.style.visibility = 'hidden';
      });
    });

    this.forms.signup?.addEventListener('submit', (e) => this.handleSignUp(e));
    this.forms.signin?.addEventListener('submit', (e) => this.handleSignIn(e));
  },

  togglePanel(showSignUp) {
    this.container.classList.toggle(CLASSNAMES.ACTIVE, showSignUp);
    this.clearMessages();
  },

  showMessage(form, text, type) {
    const el = $(`${form}-message`);
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
      name: $('signup-name').value,
      email: $('signup-email').value,
      password: $('signup-password').value,
    };

    const retypePassword = $('signup-retype-password').value;

    if (payload.password !== retypePassword) {
      this.showMessage('signup', MESSAGES.PASSWORD_MISMATCH, 'error');
      return;
    }

    try {
      const { response, data } = await this.postJSON(ENDPOINTS.SIGNUP, payload);

      if (response.ok) {
        this.showMessage('signup', MESSAGES.SIGNUP_SUCCESS, 'success');
        setTimeout(() => this.togglePanel(false), PANEL_TOGGLE_DELAY);
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
      email: $('signin-email').value,
      password: $('signin-password').value,
    };

    try {
      const { response, data } = await this.postJSON(ENDPOINTS.SIGNIN, payload);

      if (response.ok) {
        this.showMessage(
          'signin',
          `Welcome back, ${data.user.name}!`,
          'success'
        );
        setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY);
      } else {
        this.showMessage('signin', data.message || 'Sign in failed', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showMessage('signin', MESSAGES.SIGNIN_ERROR, 'error');
    }
  },
};
