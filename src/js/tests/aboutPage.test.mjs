import { describe, test, expect, beforeEach, beforeAll } from "@jest/globals";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ABOUT_DATA, ABOUT_SELECTORS } from '../constants/constants.js';
import { PATHS } from '../constants/paths.js';
import { TEST_CONSTANTS } from '../constants/test-constants.js';
import '../about.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('About Page', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, PATHS.PARENT_DIR, ...PATHS.ABOUT_PAGE_HTML);
        htmlContent = fs.readFileSync(htmlPath, TEST_CONSTANTS.UTF8);
    });

    beforeEach(() => {
        document.body.innerHTML = htmlContent;
        document.dispatchEvent(new Event(TEST_CONSTANTS.DOM_CONTENT_LOADED));
    });

    test('should render mission text from constants', () => {
        const missionText = document.querySelector(ABOUT_SELECTORS.MISSION_TEXT);
        expect(missionText.textContent).toBe(ABOUT_DATA.MISSION);
    });

    test('should render all team members from constants', () => {
        const teamCards = document.querySelectorAll(TEST_CONSTANTS.TEAM_CARD_SELECTOR);
        expect(teamCards.length).toBe(ABOUT_DATA.TEAM.length);
        expect(teamCards[TEST_CONSTANTS.FIRST_INDEX].querySelector(TEST_CONSTANTS.H3_TAG).textContent).toBe(ABOUT_DATA.TEAM[TEST_CONSTANTS.FIRST_INDEX].name);
    });

    test('should render all features from constants', () => {
        const featureCards = document.querySelectorAll(TEST_CONSTANTS.FEATURE_CARD_SELECTOR);
        expect(featureCards.length).toBe(ABOUT_DATA.FEATURES.length);
        expect(featureCards[TEST_CONSTANTS.FIRST_INDEX].querySelector(TEST_CONSTANTS.H3_TAG).textContent).toBe(ABOUT_DATA.FEATURES[TEST_CONSTANTS.FIRST_INDEX].title);
    });
});
