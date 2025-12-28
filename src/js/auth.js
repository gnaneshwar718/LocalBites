'use strict';
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const mobileSignUp = document.getElementById('mobile-signUp');
const mobileSignIn = document.getElementById('mobile-signIn');

const showMessage = (formId, text, type) => {
  const messageElement = document.getElementById(`${formId}-message`);
  if (messageElement) {
    messageElement.textContent = text;
    messageElement.className = `message message-${type}`;
    messageElement.style.visibility = 'visible';
  }
};

const clearMessages = () => {
  document.querySelectorAll('.message').forEach((msg) => {
    msg.style.visibility = 'hidden';
    msg.textContent = '';
    msg.className = 'message';
  });
};

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
  clearMessages();
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
  clearMessages();
});

if (mobileSignUp) {
  mobileSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add('right-panel-active');
    clearMessages();
  });
}

if (mobileSignIn) {
  mobileSignIn.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove('right-panel-active');
    clearMessages();
  });
}

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    const formId = input.closest('form').id.split('-')[0];
    const messageElement = document.getElementById(`${formId}-message`);
    if (messageElement) {
      messageElement.style.visibility = 'hidden';
    }
  });
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const retypePassword = document.getElementById(
    'signup-retype-password'
  ).value;

  if (password !== retypePassword) {
    showMessage('signup', 'Passwords do not match!', 'error');
    return;
  }

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      showMessage('signup', 'Sign up successful! Please sign in.', 'success');
      setTimeout(() => {
        container.classList.remove('right-panel-active');
        clearMessages();
      }, 2000);
    } else {
      showMessage('signup', data.message || 'Sign up failed', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('signup', 'An error occurred during sign up.', 'error');
  }
});

document.getElementById('signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  try {
    const response = await fetch('/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      showMessage('signin', `Welcome back, ${data.user.name}!`, 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      showMessage('signin', data.message || 'Sign in failed', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('signin', 'An error occurred during sign in.', 'error');
  }
});