import { jest } from '@jest/globals';
import 'dotenv/config';
import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';
import { CAROUSEL_INTERVAL } from '../src/js/constants.js';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const CACHE_BUST_OFFSET_FOOTER = 4;
const CACHE_BUST_OFFSET_FAQ = 3;

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
                    text: () => Promise.resolve('<footer><p id="footer-copyright"></p><a href="mailto:#" id="footer-contact-link">Contact</a></footer>'),
                });
            }
            if (url.includes('faq.html')) {
                return Promise.resolve({
                    text: () => Promise.resolve('<section id="faq"><h2>Questions</h2><div class="faq-list"><faq-item question="Q1" answer="A1"></faq-item></div><a href="mailto:#" id="faq-contact-link">CONTACT US</a></section>'),
                });
            }
            if (url.includes('/api/config')) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        contactEmail: CONTACT_EMAIL
                    }),
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
        for (let i = 0; i < slides.length; i++) {
            const nextIndex = (i + 1) % slides.length;
            jest.advanceTimersByTime(CAROUSEL_INTERVAL);
            expect(slides[i]).not.toHaveClass('active');
            expect(slides[nextIndex]).toHaveClass('active');
        }
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

    test('AppFooter should render correctly and have dynamic content', async () => {
        document.body.innerHTML = '<app-footer></app-footer>';
        await import('../src/js/components.js?t=' + (Date.now() + CACHE_BUST_OFFSET_FOOTER));
        await waitFor(() => expect(document.querySelector('footer')).toBeInTheDocument());
        const copyright = document.querySelector('#footer-copyright');
        await waitFor(() => expect(copyright).toHaveTextContent('Copyright © 2026 by LocalBites, All Rights Reserved'));
    });

    test('FaqSection should render correctly and have dynamic email', async () => {
        document.body.innerHTML = '<faq-section></faq-section>';
        await import('../src/js/components.js?t=' + (Date.now() + CACHE_BUST_OFFSET_FAQ));
        await waitFor(() => expect(document.querySelector('#faq')).toBeInTheDocument());
        expect(document.querySelector('#faq h2')).toHaveTextContent('Questions');
        expect(document.querySelector('faq-item')).toBeInTheDocument();
        const contactLink = document.querySelector('#faq-contact-link');
        expect(contactLink).toBeInTheDocument();
        await waitFor(() => expect(contactLink).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`));
    });
});
