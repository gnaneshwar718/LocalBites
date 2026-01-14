export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const on = (element, event, handler) => {
  if (element) {
    element.addEventListener(event, handler);
  }
};

export const byId = (id) => document.getElementById(id);
