import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TIMINGS, MOCK_CULTURE_DATA as mockCultureData } from '../constants/test-constants.js';

describe('Culture Page', () => {
    beforeEach(() => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const htmlPath = path.resolve(__dirname, '../../../public/pages/culture.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
        document.body.innerHTML = html;

        const carouselInner = document.querySelector('.carousel-inner');
        if (carouselInner) {
            carouselInner.innerHTML = `
            <div class="carousel-item active" data-dish="d1"></div>
            <div class="carousel-item" data-dish="d7"></div>
            `;
        }

        global.fetch = jest.fn((url) => {
            if (url.includes('header.html')) return Promise.resolve({ ok: true, text: () => Promise.resolve('<header></header>') });
            if (url.includes('footer.html')) return Promise.resolve({ ok: true, text: () => Promise.resolve('<footer></footer>') });
            if (url.includes('culture-data.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockCultureData) });
            return Promise.reject(new Error('Unknown URL: ' + url));
        });
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        jest.useRealTimers();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    const setupAndLoad = async () => {
        await import('../culture.js?t=' + Date.now());
        document.dispatchEvent(new Event('DOMContentLoaded'));
        if (setTimeout.clock === undefined) {
            await new Promise(resolve => setTimeout(resolve, TIMINGS.SETUP_DELAY));
        } else {
            jest.advanceTimersByTime(TIMINGS.SETUP_DELAY);
            await Promise.resolve();
        }
    };

    const verifyGridState = (expectedCount, includeText = null, excludeText = null) => {
        const grid = document.querySelector('.dishes-grid');
        expect(grid.children.length).toBe(expectedCount);
        if (includeText) expect(grid.innerHTML).toContain(includeText);
        if (excludeText) expect(grid.innerHTML).not.toContain(excludeText);
    };

    const getUI = () => ({
        grid: document.querySelector('.dishes-grid'),
        nextBtn: document.querySelector('.next-btn'),
        prevBtn: document.querySelector('.prev-btn'),
        dotsContainer: document.querySelector('.page-dots'),
        searchInput: document.getElementById('dish-search'),
        slides: document.querySelectorAll('.carousel-item'),
    });

    const triggerSearch = (term) => {
        const { searchInput } = getUI();
        searchInput.value = term;
        searchInput.dispatchEvent(new Event('input'));
    };

    const verifyActiveDot = (index) => {
        const { dotsContainer } = getUI();
        expect(dotsContainer.children[index].classList.contains('active')).toBe(true);
    };

    test('should load data and render 6 items on first page', async () => {
        await setupAndLoad();
        verifyGridState(6, 'Dish 1', 'Dish 7');
    });

    test('should handle pagination: next, prev, and dots', async () => {
        await setupAndLoad();
        const { nextBtn, prevBtn, dotsContainer } = getUI();

        expect(dotsContainer.children.length).toBe(2);
        verifyActiveDot(0);

        nextBtn.click();
        verifyGridState(1, 'Dish 7');
        verifyActiveDot(1);

        prevBtn.click();
        verifyGridState(6, 'Dish 1');

        dotsContainer.children[1].click();
        verifyGridState(1, 'Dish 7');
    });

    test('should display "No dishes found" on empty search', async () => {
        await setupAndLoad();
        triggerSearch('NonExistentDish');
        const { grid, dotsContainer } = getUI();
        expect(grid.innerHTML).toContain('No dishes found.');
        expect(dotsContainer.innerHTML).toBe('');
    });

    test('should verify dish and restaurant links are correctly formatted', async () => {
        await setupAndLoad();
        const grid = document.querySelector('.dishes-grid');
        const imgLink = grid.querySelector('.dish-image-link');
        expect(imgLink.getAttribute('href')).toBe('/pages/restaurant.html?id=d1');
        const locIcon = grid.querySelector('.location-icon');
        expect(locIcon.getAttribute('href')).toBe('https://maps.google.com/?q=MTR');
        expect(locIcon.getAttribute('target')).toBe('_blank');
        const placeLink = grid.querySelector('.place-link');
        expect(placeLink.getAttribute('href')).toBe('/pages/restaurant.html?id=d1#mtr');
    });

    test('should jump to specific dish when carousel item is clicked', async () => {
        await setupAndLoad();
        const carouselItem = document.querySelector('.carousel-item[data-dish="d7"]');
        carouselItem.click();
        const grid = document.querySelector('.dishes-grid');
        expect(grid.innerHTML).toContain('Dish 7');
        await new Promise(resolve => setTimeout(resolve, TIMINGS.SCROLL_DELAY));
        const card = document.getElementById('d7');
        expect(card.classList.contains('active')).toBe(true);
        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    test('should filter by restaurant name in search', async () => {
        await setupAndLoad();
        triggerSearch('Mavalli');
        const { grid } = getUI();
        expect(grid.children.length).toBe(1);
    });

    test('should update carousel slides automatically', async () => {
        jest.useFakeTimers();
        await import('../culture.js?t=' + Date.now());
        document.dispatchEvent(new Event('DOMContentLoaded'));
        for (let i = 0; i < TIMINGS.LOOP_COUNT; i++) await Promise.resolve();
        for (let i = 0; i < TIMINGS.LOOP_COUNT; i++) await Promise.resolve();
        jest.advanceTimersByTime(TIMINGS.CAROUSEL_ADVANCE);
        for (let i = 0; i < TIMINGS.LOOP_COUNT; i++) await Promise.resolve();
        const { slides } = getUI();
        expect(slides[0].classList.contains('slide-out')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(true);
    });
});
