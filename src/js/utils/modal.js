export const ModalManager = {
  open(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  toggle(modal, shouldOpen) {
    if (shouldOpen) {
      this.open(modal);
    } else {
      this.close(modal);
    }
  },
};
