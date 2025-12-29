/**
 * @jest-environment jsdom
 */

'use strict';

describe('auth.js', () => {
  let signUpButton, signInButton, container, signupForm, signinForm;

  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <div id="container">
        <div class="form-container sign-up-container">
          <form id="signup-form">
            <input type="text" id="signup-name" value="Test User" />
            <input type="email" id="signup-email" value="test@example.com" />
            <input type="password" id="signup-password" value="password123" />
            <input type="password" id="signup-retype-password" value="password123" />
            <div id="signup-message" class="message"></div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div class="form-container sign-in-container">
          <form id="signin-form">
            <input type="email" id="signin-email" value="test@example.com" />
            <input type="password" id="signin-password" value="password123" />
            <div id="signin-message" class="message"></div>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div class="overlay-container">
          <button id="signUp">Sign Up Overlay</button>
          <button id="signIn">Sign In Overlay</button>
        </div>
      </div>
    `;

    // Mock fetch
    global.fetch = jest.fn();

    // Reset modules to re-run the script for each test
    jest.resetModules();
    require('./auth.js');

    signUpButton = document.getElementById('signUp');
    signInButton = document.getElementById('signIn');
    container = document.getElementById('container');
    signupForm = document.getElementById('signup-form');
    signinForm = document.getElementById('signin-form');
  });

  test('should toggle right-panel-active class when signUp/signIn buttons are clicked', () => {
    signUpButton.click();
    expect(container.classList.contains('right-panel-active')).toBe(true);

    signInButton.click();
    expect(container.classList.contains('right-panel-active')).toBe(false);
  });

  test('should show error if passwords mismatch on signup', async () => {
    document.getElementById('signup-retype-password').value = 'wrongpassword';

    signupForm.dispatchEvent(new Event('submit'));

    const signupMessage = document.getElementById('signup-message');
    expect(signupMessage.textContent).toBe('Passwords do not match!');
    expect(signupMessage.className).toContain('message-error');
  });

  test('should call fetch with correct data on signup success', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' }),
      })
    );

    // Use a helper to resolve the async submit handler
    // Since the handler is async and attached via addEventListener,
    // we need to wait for the promises to resolve.

    signupForm.dispatchEvent(new Event('submit'));

    // Wait for the async flow
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(global.fetch).toHaveBeenCalledWith(
      '/signup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    const signupMessage = document.getElementById('signup-message');
    expect(signupMessage.textContent).toBe(
      'Sign up successful! Please sign in.'
    );
    expect(signupMessage.className).toContain('message-success');
  });

  test('should call fetch with correct data on signin success', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { name: 'Test User' } }),
      })
    );

    signinForm.dispatchEvent(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(global.fetch).toHaveBeenCalledWith(
      '/signin',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    const signinMessage = document.getElementById('signin-message');
    expect(signinMessage.textContent).toBe('Welcome back, Test User!');
  });

  test('should handle signin failure', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    signinForm.dispatchEvent(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const signinMessage = document.getElementById('signin-message');
    expect(signinMessage.textContent).toBe('Invalid credentials');
    expect(signinMessage.className).toContain('message-error');
  });
});
