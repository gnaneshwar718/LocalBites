import { describe, test, expect, beforeEach } from "@jest/globals";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ABOUT_DATA, ABOUT_SELECTORS } from '../constants/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import '../about.js';

describe('About Page', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.resolve(__dirname, '../../../public/pages/about.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    });

    beforeEach(() => {
        document.body.innerHTML = htmlContent;
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    test('should render mission text from constants', () => {
        const missionText = document.querySelector(ABOUT_SELECTORS.MISSION_TEXT);
        expect(missionText.textContent).toBe(ABOUT_DATA.MISSION);
    });

    test('should render all team members from constants', () => {
        const teamCards = document.querySelectorAll('.team-card');
        expect(teamCards.length).toBe(ABOUT_DATA.TEAM.length);
        expect(teamCards[0].querySelector('h3').textContent).toBe(ABOUT_DATA.TEAM[0].name);
    });

    test('should render all features from constants', () => {
        const featureCards = document.querySelectorAll('.feature-card');
        expect(featureCards.length).toBe(ABOUT_DATA.FEATURES.length);
        expect(featureCards[0].querySelector('h3').textContent).toBe(ABOUT_DATA.FEATURES[0].title);
    });
});
