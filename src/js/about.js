import { ABOUT_DATA, ABOUT_SELECTORS } from './constants/constants.js';

const select = (selector) => document.querySelector(selector);

const AboutPage = {
  init() {
    this.renderMission();
    this.renderFeatures();
    this.renderTeam();
    this.initAnimations();
  },

  renderMission() {
    const missionText = select(ABOUT_SELECTORS.MISSION_TEXT);
    if (missionText) missionText.textContent = ABOUT_DATA.MISSION;

    const storyText = select(ABOUT_SELECTORS.STORY_TEXT);
    if (storyText) storyText.textContent = ABOUT_DATA.STORY;

    const visionText = select(ABOUT_SELECTORS.VISION_TEXT);
    if (visionText) visionText.textContent = ABOUT_DATA.VISION;
  },

  renderFeatures() {
    const grid = select(ABOUT_SELECTORS.FEATURES_GRID);
    const template = select('#feature-template');
    if (!grid || !template) return;

    const icons = ['fas fa-check-circle', 'fas fa-history', 'fas fa-users'];

    ABOUT_DATA.FEATURES.forEach((feature, index) => {
      const clone = template.content.cloneNode(true);
      const icon = clone.querySelector('.feature-icon');
      icon.className = `feature-icon ${icons[index]}`;
      clone.querySelector('h3').textContent = feature.title;
      clone.querySelector('p').textContent = feature.description;
      grid.appendChild(clone);
    });
  },

  renderTeam() {
    const container = select(ABOUT_SELECTORS.TEAM_CONTAINER);
    const template = select('#team-template');
    if (!container || !template) return;

    ABOUT_DATA.TEAM.forEach((member) => {
      const clone = template.content.cloneNode(true);
      clone.querySelector('h3').textContent = member.name;
      clone.querySelector('.role').textContent = member.role;
      clone.querySelector('p').textContent = member.bio;
      container.appendChild(clone);
    });
  },

  initAnimations() {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card, .team-card').forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
  },
};

document.addEventListener('DOMContentLoaded', () => AboutPage.init());
