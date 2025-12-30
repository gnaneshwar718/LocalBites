/**
 * @jest-environment jsdom
 */
import { jest, describe, test, expect, beforeEach, afterEach, beforeAll } from "@jest/globals";
import { AuthManager } from "./auth.js";
import { CLASSNAMES, ENDPOINTS, MESSAGES } from "./constants.js";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

describe("AuthManager", () => {
  let htmlContent;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const htmlPath = path.join(__dirname, "../../public/pages/auth.html");

  const getElement = (id) => document.getElementById(id);

  beforeAll(() => {
    htmlContent = fs.readFileSync(htmlPath, "utf-8");
  });

  beforeEach(() => {
    document.documentElement.innerHTML = htmlContent;
    global.fetch = jest.fn();
    delete window.location;
    window.location = new URL("http://localhost");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    test("initializes correctly and binds events", () => {
      expect(() => AuthManager.init()).not.toThrow();
    });
  });

  describe("Panel Toggling", () => {
    test("togglePanel(true) shows sign up panel (adds CLASSNAMES.ACTIVE)", () => {
      AuthManager.init();
      AuthManager.togglePanel(true);
      expect(getElement("container")).toHaveClass(CLASSNAMES.ACTIVE);
    });

    test("togglePanel(false) shows sign in panel (removes CLASSNAMES.ACTIVE)", () => {
      AuthManager.init();
      AuthManager.togglePanel(true);
      expect(getElement("container")).toHaveClass(CLASSNAMES.ACTIVE);

      AuthManager.togglePanel(false);
      expect(getElement("container")).not.toHaveClass(CLASSNAMES.ACTIVE);
    });

    test("clicking default Sign Up button toggles panel", async () => {
      AuthManager.init();
      const user = userEvent.setup();
      const signUpBtn = getElement("signUp");

      await user.click(signUpBtn);
      expect(getElement("container")).toHaveClass(CLASSNAMES.ACTIVE);
    });

    test("clicking default Sign In button toggles panel", async () => {
      AuthManager.init();
      const user = userEvent.setup();
      const signInBtn = getElement("signIn");

      AuthManager.togglePanel(true);
      expect(getElement("container")).toHaveClass(CLASSNAMES.ACTIVE);

      await user.click(signInBtn);
      expect(getElement("container")).not.toHaveClass(CLASSNAMES.ACTIVE);
    });
  });

  describe("Sign Up Functionality", () => {
    test("shows error if passwords do not match", async () => {
      AuthManager.init();

      getElement("signup-name").value = "Test User";
      getElement("signup-email").value = "test@example.com";
      getElement("signup-password").value = "password123";
      getElement("signup-retype-password").value = "mismatch";

      const form = getElement("signup-form");
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      const message = getElement("signup-message");
      expect(message).toHaveTextContent(MESSAGES.PASSWORD_MISMATCH);
      expect(message).toHaveClass("message-error");
    });

    test("calls API and shows success message on valid signup", async () => {
      AuthManager.init();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Success" }),
      });

      getElement("signup-name").value = "Test User";
      getElement("signup-email").value = "test@example.com";
      getElement("signup-password").value = "password123";
      getElement("signup-retype-password").value = "password123";

      getElement("signup-form").dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.SIGNUP, expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123"
        })
      }));

      const message = getElement("signup-message");
      expect(message).toHaveTextContent(MESSAGES.SIGNUP_SUCCESS);
      expect(message).toHaveClass("message-success");
    });

    test("shows error message on API failure", async () => {
      AuthManager.init();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Email already exists" }),
      });

      getElement("signup-name").value = "Test User";
      getElement("signup-email").value = "test@example.com";
      getElement("signup-password").value = "password123";
      getElement("signup-retype-password").value = "password123";

      getElement("signup-form").dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 0));

      const message = getElement("signup-message");
      expect(message).toHaveTextContent("Email already exists");
      expect(message).toHaveClass("message-error");
    });
  });

  describe("Sign In Functionality", () => {
    test("calls API and redirects on valid signin", async () => {
      AuthManager.init();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { name: "Test User" } }),
      });

      getElement("signin-email").value = "test@example.com";
      getElement("signin-password").value = "password123";

      getElement("signin-form").dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.SIGNIN, expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123"
        })
      }));

      const message = getElement("signin-message");
      expect(message).toHaveTextContent("Welcome back, Test User!");
    });
  });
});
