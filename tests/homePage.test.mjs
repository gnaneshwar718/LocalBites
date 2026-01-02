import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('HomePage DOM Unit Tests', () => {
    let container;

    beforeEach(() => {
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

    });

    test('carousel should change slides automatically', async () => {

        await import('../src/js/script.js?t=' + Date.now());

        document.dispatchEvent(new Event('DOMContentLoaded'));

        const slides = container.querySelectorAll('.carousel-item');
        expect(slides[0]).toHaveClass('active');
        expect(slides[1]).not.toHaveClass('active');


        jest.advanceTimersByTime(4000);

        expect(slides[0]).not.toHaveClass('active');
        expect(slides[1]).toHaveClass('active');


        jest.advanceTimersByTime(4000);

        expect(slides[1]).not.toHaveClass('active');
        expect(slides[2]).toHaveClass('active');


        jest.advanceTimersByTime(4000);
        expect(slides[2]).not.toHaveClass('active');
        expect(slides[0]).toHaveClass('active');
    });

    test('AppHeader should toggle hamburger menu and contain navigation links', async () => {

        await import('../src/js/components.js?t=' + Date.now());


        await waitFor(() => expect(container.querySelector('.hamburger')).toBeInTheDocument());

        const hamburger = container.querySelector('.hamburger');
        const navLinks = container.querySelector('.nav-links');

        expect(navLinks).not.toHaveClass('active');

        fireEvent.click(hamburger);
        expect(navLinks).toHaveClass('active');

        fireEvent.click(hamburger);
        expect(navLinks).not.toHaveClass('active');


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
