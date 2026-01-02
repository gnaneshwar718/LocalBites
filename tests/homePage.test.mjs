import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';

// Helper to load external files
const loadFile = (filePath) => {
    return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
};

describe('HomePage DOM Unit Tests', () => {
    let container;

    beforeEach(() => {
        // Setup JSDOM environment
        document.body.innerHTML = `
            <app-header></app-header>
            <div class="hero-image carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">item 1</div>
                    <div class="carousel-item">item 2</div>
                    <div class="carousel-item">item 3</div>
                </div>
            </div>
            <app-footer></app-footer>
        `;
        container = document.body;

        // Mock fetch for components.js
        global.fetch = jest.fn((url) => {
            if (url.includes('header.html')) {
                return Promise.resolve({
                    text: () => Promise.resolve(`
                        <header>
                            <div class="hamburger"></div>
                            <nav class="nav-links">
                                <a href="/">Explore</a>
                                <a href="/budget">Budget Planner</a>
                                <a href="/auth">Profile</a>
                            </nav>
                        </header>
                    `),
                });
            }
            if (url.includes('footer.html')) {
                return Promise.resolve({
                    text: () => Promise.resolve('<footer><p>&copy; 2025 LocalBites</p></footer>'),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        // Reset custom elements to avoid errors on re-definition
        // JSDOM doesn't easily allow unregistering, so we might need to be careful
    });

    test('carousel should change slides automatically', async () => {
        // Load the script
        // We need to trigger DOMContentLoaded because script.js listens for it
        await import('../src/js/script.js?t=' + Date.now());

        document.dispatchEvent(new Event('DOMContentLoaded'));

        const slides = container.querySelectorAll('.carousel-item');
        expect(slides[0]).toHaveClass('active');
        expect(slides[1]).not.toHaveClass('active');

        // Fast-forward 4 seconds
        jest.advanceTimersByTime(4000);

        expect(slides[0]).not.toHaveClass('active');
        expect(slides[1]).toHaveClass('active');

        // Fast-forward another 4 seconds
        jest.advanceTimersByTime(4000);

        expect(slides[1]).not.toHaveClass('active');
        expect(slides[2]).toHaveClass('active');

        // Wrap around
        jest.advanceTimersByTime(4000);
        expect(slides[2]).not.toHaveClass('active');
        expect(slides[0]).toHaveClass('active');
    });

    test('AppHeader should toggle hamburger menu and contain navigation links', async () => {
        // Load components
        await import('../src/js/components.js?t=' + Date.now());

        // Wait for Custom Element to be defined and connected
        await waitFor(() => expect(container.querySelector('.hamburger')).toBeInTheDocument());

        const hamburger = container.querySelector('.hamburger');
        const navLinks = container.querySelector('.nav-links');

        expect(navLinks).not.toHaveClass('active');

        fireEvent.click(hamburger);
        expect(navLinks).toHaveClass('active');

        fireEvent.click(hamburger);
        expect(navLinks).not.toHaveClass('active');

        // Check for specific links
        expect(container.querySelector('a[href="/"]')).toHaveTextContent('Explore');
        expect(container.querySelector('a[href="/budget"]')).toHaveTextContent('Budget Planner');
        expect(container.querySelector('a[href="/auth"]')).toHaveTextContent('Profile');
    });

    test('AppFooter should render correctly', async () => {
        await import('../src/js/components.js?t=' + (Date.now() + 1));

        await waitFor(() => expect(container.querySelector('footer')).toBeInTheDocument());
        expect(container.querySelector('footer')).toHaveTextContent('LocalBites');
    });
});
