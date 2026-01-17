/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import fs from 'fs';

describe('Culture Page', () => {
    let mockCultureData;

    beforeEach(() => {
        mockCultureData = {
            restaurants: {
                mtr: { id: 'mtr', name: 'Mavalli Tiffin Rooms', location: 'https://maps.google.com/?q=MTR' },
                ctr: { id: 'ctr', name: 'CTR - Shri Sagar', location: 'https://maps.google.com/?q=CTR' },
                'vidyarthi-bhavan': { id: 'vidyarthi-bhavan', name: 'Vidyarthi Bhavan', location: 'https://maps.google.com/?q=vidyarthi' },
                'halli-mane': { id: 'halli-mane', name: 'Halli Mane', location: 'https://maps.google.com/?q=hallimane' },
                maiyas: { id: 'maiyas', name: 'Maiyas', location: 'https://maps.google.com/?q=maiyas' },
                'meghana-foods': { id: 'meghana-foods', name: 'Meghana Foods', location: 'https://maps.google.com/?q=meghana' },
                nagarjuna: { id: 'nagarjuna', name: 'Nagarjuna', location: 'https://maps.google.com/?q=nagarjuna' },
            },
            dishes: {
                'd1': { id: 'd1', name: 'Dish 1', description: 'Desc 1', restaurants: ['mtr'] },
                'd2': { id: 'd2', name: 'Dish 2', description: 'Desc 2', restaurants: ['ctr'] },
                'd3': { id: 'd3', name: 'Dish 3', description: 'Desc 3', restaurants: ['vidyarthi-bhavan'] },
                'd4': { id: 'd4', name: 'Dish 4', description: 'Desc 4', restaurants: ['halli-mane'] },
                'd5': { id: 'd5', name: 'Dish 5', description: 'Desc 5', restaurants: ['maiyas'] },
                'd6': { id: 'd6', name: 'Dish 6', description: 'Desc 6', restaurants: ['meghana-foods'] },
                'd7': { id: 'd7', name: 'Dish 7', description: 'Desc 7', restaurants: ['nagarjuna'] },
            },
        };

        document.body.innerHTML = `
            <div id="header-placeholder"></div>
            <div class="hamburger"></div>
            <div class="nav-links"></div>
            <div class="hero-tagline"></div>
            <div class="culture-hero-text"><h1></h1><p></p></div>
            <div class="carousel-inner">
            <div class="carousel-item active" data-dish="d1"></div>
            <div class="carousel-item" data-dish="d7"></div>
            </div>
            <input type="text" id="dish-search" />
            <div class="dishes-grid"></div>
            <div class="pagination-controls">
            <button class="prev-btn"></button>
            <div class="page-dots"></div>
            <button class="next-btn"></button>
            </div>
            <div id="footer-placeholder"></div>
        `;

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
            await new Promise(resolve => setTimeout(resolve, 50));
        } else {
            jest.advanceTimersByTime(50);
            await Promise.resolve();
        }
    };

    test('should load data and render 6 items on first page', async () => {
        await setupAndLoad();
        const grid = document.querySelector('.dishes-grid');
        expect(grid.children.length).toBe(6);
        expect(grid.innerHTML).toContain('Dish 1');
        expect(grid.innerHTML).not.toContain('Dish 7');
    });

    test('should handle pagination: next, prev, and dots', async () => {
        await setupAndLoad();
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const dotsContainer = document.querySelector('.page-dots');
        expect(dotsContainer.children.length).toBe(2);
        expect(dotsContainer.children[0].classList.contains('active')).toBe(true);
        nextBtn.click();
        const grid = document.querySelector('.dishes-grid');
        expect(grid.children.length).toBe(1);
        expect(grid.innerHTML).toContain('Dish 7');
        expect(dotsContainer.children[1].classList.contains('active')).toBe(true);
        prevBtn.click();
        expect(grid.children.length).toBe(6);
        expect(grid.innerHTML).toContain('Dish 1');
        dotsContainer.children[1].click();
        expect(grid.innerHTML).toContain('Dish 7');
    });

    test('should display "No dishes found" on empty search', async () => {
        await setupAndLoad();
        const searchInput = document.getElementById('dish-search');
        searchInput.value = 'NonExistentDish';
        searchInput.dispatchEvent(new Event('input'));
        const grid = document.querySelector('.dishes-grid');
        expect(grid.innerHTML).toContain('No dishes found.');
        const dotsContainer = document.querySelector('.page-dots');
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
        await new Promise(resolve => setTimeout(resolve, 200));
        const card = document.getElementById('d7');
        expect(card.classList.contains('active')).toBe(true);
        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    test('should filter by restaurant name in search', async () => {
        await setupAndLoad();
        const searchInput = document.getElementById('dish-search');
        searchInput.value = 'Mavalli';
        searchInput.dispatchEvent(new Event('input'));
        const grid = document.querySelector('.dishes-grid');
        expect(grid.children.length).toBe(1);
    });

    test('should update carousel slides automatically', async () => {
        jest.useFakeTimers();
        await import('../culture.js?t=' + Date.now());
        document.dispatchEvent(new Event('DOMContentLoaded'));
        for (let i = 0; i < 20; i++) await Promise.resolve();
        jest.advanceTimersByTime(4000);
        for (let i = 0; i < 20; i++) await Promise.resolve();
        const slides = document.querySelectorAll('.carousel-item');
        expect(slides[0].classList.contains('slide-out')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(true);
    });
});
