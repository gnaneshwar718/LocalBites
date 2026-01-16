const CLASSNAMES = {
  ACTIVE: 'right-panel-active',
};

const ENDPOINTS = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
};

const MESSAGES = {
  PASSWORD_MISMATCH: 'Passwords do not match!',
  SIGNUP_SUCCESS: 'Sign up successful! Please sign in.',
  SIGNUP_ERROR: 'An error occurred during sign up.',
  SIGNIN_ERROR: 'An error occurred during sign in.',
};

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

const container = $('container');

const buttons = {
  signUp: $('signUp'),
  signIn: $('signIn'),
  mobileSignUp: $('mobile-signUp'),
  mobileSignIn: $('mobile-signIn'),
};

const showMessage = (form, text, type) => {
  const el = $(`${form}-message`);
  if (!el) return;

  el.textContent = text;
  el.className = `message message-${type}`;
  el.style.visibility = 'visible';
};

const clearMessages = () => {
  $$('.message').forEach((el) => {
    el.textContent = '';
    el.className = 'message';
    el.style.visibility = 'hidden';
  });
};

const togglePanel = (showSignUp) => {
  container.classList.toggle(CLASSNAMES.ACTIVE, showSignUp);
  clearMessages();
};

const postJSON = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
};

buttons.signUp?.addEventListener('click', () => togglePanel(true));
buttons.signIn?.addEventListener('click', () => togglePanel(false));

buttons.mobileSignUp?.addEventListener('click', (e) => {
  e.preventDefault();
  togglePanel(true);
});

buttons.mobileSignIn?.addEventListener('click', (e) => {
  e.preventDefault();
  togglePanel(false);
});

$$('input').forEach((input) => {
  input.addEventListener('input', () => {
    const form = input.closest('form')?.id.split('-')[0];
    const message = $(`${form}-message`);
    if (message) message.style.visibility = 'hidden';
  });
});

$('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: $('signup-name').value,
    email: $('signup-email').value,
    password: $('signup-password').value,
  };

  const retypePassword = $('signup-retype-password').value;

  if (payload.password !== retypePassword) {
    showMessage('signup', MESSAGES.PASSWORD_MISMATCH, 'error');
    return;
  }

  try {
    const { response, data } = await postJSON(ENDPOINTS.SIGNUP, payload);

    if (response.ok) {
      showMessage('signup', MESSAGES.SIGNUP_SUCCESS, 'success');
      setTimeout(() => togglePanel(false), 2000);
    } else {
      showMessage('signup', data.message || 'Sign up failed', 'error');
    }
  } catch (err) {
    console.error(err);
    showMessage('signup', MESSAGES.SIGNUP_ERROR, 'error');
  }
});

$('signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    email: $('signin-email').value,
    password: $('signin-password').value,
  };

  try {
    const { response, data } = await postJSON(ENDPOINTS.SIGNIN, payload);

    if (response.ok) {
      showMessage('signin', `Welcome back, ${data.user.name}!`, 'success');
      setTimeout(() => (window.location.href = '/'), 1500);
    } else {
      showMessage('signin', data.message || 'Sign in failed', 'error');
    }
  } catch (err) {
    console.error(err);
    showMessage('signin', MESSAGES.SIGNIN_ERROR, 'error');
  }
});
