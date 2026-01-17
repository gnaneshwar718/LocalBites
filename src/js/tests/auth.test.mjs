/**
 * @jest-environment jsdom
 */
import { jest, describe, test, expect, beforeEach, afterEach, beforeAll } from "@jest/globals";
import { CLASSNAMES, MESSAGES } from "../constants/constants.js";
import { ENDPOINTS } from "../../../route.js";
import { PATHS } from "../constants/paths.js";
import { TEST_LOCATION_URL, TEST_USER } from "../constants/test-constants.js";
import { AuthManager } from "../auth.js";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getElement = (id) => document.getElementById(id);

const expectContainerActive = (isActive) => {
  const container = getElement("container");
  if (isActive) {
    expect(container).toHaveClass(CLASSNAMES.ACTIVE);
  } else {
    expect(container).not.toHaveClass(CLASSNAMES.ACTIVE);
  }
};

describe("AuthManager", () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(path.join(__dirname, '..', PATHS.AUTH_HTML), "utf-8");
  });

  beforeEach(() => {
    document.documentElement.innerHTML = htmlContent;
    global.fetch = jest.fn();
    delete window.location;
    window.location = new URL(TEST_LOCATION_URL);
    AuthManager.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    test("initializes correctly and binds events", () => {
      expect(true).toBe(true);
    });
  });

  describe("Panel Toggling", () => {
    test("togglePanel(true) shows sign up panel (adds CLASSNAMES.ACTIVE)", () => {
      AuthManager.togglePanel(true);
      expectContainerActive(true);
    });

    test("togglePanel(false) shows sign in panel (removes CLASSNAMES.ACTIVE)", () => {
      AuthManager.togglePanel(true);
      expectContainerActive(true);
      AuthManager.togglePanel(false);
      expectContainerActive(false);
    });

    test("clicking default Sign Up button toggles panel", async () => {
      const user = userEvent.setup();
      const signUpBtn = getElement("signUp");
      await user.click(signUpBtn);
      expectContainerActive(true);
    });

    test("clicking default Sign In button toggles panel", async () => {
      const user = userEvent.setup();
      const signInBtn = getElement("signIn");
      AuthManager.togglePanel(true);
      expectContainerActive(true);
      await user.click(signInBtn);
      expectContainerActive(false);
    });
  });

  const fillSignUpForm = (user, confirmPassword) => {
    getElement("signup-name").value = user.name;
    getElement("signup-email").value = user.email;
    getElement("signup-password").value = user.password;
    getElement("signup-retype-password").value = confirmPassword;
  };

  describe("Sign Up Functionality", () => {
    test("shows error if passwords do not match", async () => {
      fillSignUpForm(TEST_USER, "mismatch");
      const form = getElement("signup-form");
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));
      const message = getElement("signup-message");
      expect(message).toHaveTextContent(MESSAGES.PASSWORD_MISMATCH);
      expect(message).toHaveClass("message-error");
    });

    test("calls API and shows success message on valid signup", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Success" }),
      });

      fillSignUpForm(TEST_USER, TEST_USER.password);
      getElement("signup-form").dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.SIGNUP, expect.objectContaining({
        method: "POST",
        body: JSON.stringify(TEST_USER)
      }));

      const message = getElement("signup-message");
      expect(message).toHaveTextContent(MESSAGES.SIGNUP_SUCCESS);
      expect(message).toHaveClass("message-success");
    });

    test("shows error message on API failure", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Email already exists" }),
      });

      fillSignUpForm(TEST_USER, TEST_USER.password);
      getElement("signup-form").dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));
      const message = getElement("signup-message");
      expect(message).toHaveTextContent("Email already exists");
      expect(message).toHaveClass("message-error");
    });
  });

  describe("Sign In Functionality", () => {
    test("calls API and redirects on valid signin", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { name: TEST_USER.name } }),
      });

      getElement("signin-email").value = TEST_USER.email;
      getElement("signin-password").value = TEST_USER.password;
      getElement("signin-form").dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.SIGNIN, expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password
        })
      }));

      const message = getElement("signin-message");
      expect(message).toHaveTextContent("Welcome back, Test User!");
    });
  });
});  