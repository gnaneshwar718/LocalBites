import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { RESTAURANTS as TEST_RESTAURANTS } from '/data/restaurants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Explore Page Comprehensive Tests", () => {
    let htmlContent;
    let ExplorePage;
    let exploreInstance;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, "..", "..", "public", "pages", "explore.html");
        htmlContent = fs.readFileSync(htmlPath, "utf-8");
    });

    beforeEach(async () => {
        document.documentElement.innerHTML = htmlContent;
        process.env.NODE_ENV = 'test';
        const module = await import('./explore.js');
        ExplorePage = module.ExplorePage;
        exploreInstance = new ExplorePage();
        exploreInstance.restaurants = TEST_RESTAURANTS;
        exploreInstance.renderRestaurants();
    });

    describe("Initial State", () => {
        test("renders all initial restaurants", () => {
            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(6);
            expect(document.querySelector("h1").textContent).toBe("Popular Local Discoveries");
        });

        test("prices use Indian Rupee symbol", () => {
            const prices = document.querySelectorAll(".card-price");
            expect(prices[0].textContent).toContain("₹");
        });
    });

    describe("Search Functionality", () => {
        test("filters by name", () => {
            const searchInput = document.getElementById("restaurantSearch");
            searchInput.value = "Vidyarthi";
            searchInput.dispatchEvent(new Event("input"));

            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(1);
            expect(cards[0].querySelector("h3").textContent).toBe("Vidyarthi Bhavan");
        });

        test("filters by cuisine", () => {
            const searchInput = document.getElementById("restaurantSearch");
            searchInput.value = "Andhra";
            searchInput.dispatchEvent(new Event("input"));

            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(1);
            expect(cards[0].querySelector(".card-cuisine").textContent).toBe("Andhra");
        });

        test("shows no-results message for invalid search", () => {
            const searchInput = document.getElementById("restaurantSearch");
            searchInput.value = "NonExistentPlace";
            searchInput.dispatchEvent(new Event("input"));

            expect(document.querySelector(".no-results")).toBeTruthy();
        });
    });

    describe("Filter Modal Functionality", () => {
        test("opens filter modal on button click", () => {
            const filterBtn = document.getElementById("filterBtn");
            const filterModal = document.getElementById("filterModal");

            expect(filterModal.classList.contains("active")).toBe(false);
            filterBtn.click();
            expect(filterModal.classList.contains("active")).toBe(true);
        });

        test("filters by cuisine chip", () => {
            const cuisineFilters = document.getElementById("cuisineFilters");
            const southIndianChip = cuisineFilters.querySelector('[data-cuisine="South Indian"]');
            const applyBtn = document.getElementById("applyFiltersBtn");

            southIndianChip.click();
            applyBtn.click();

            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(2);
        });

        test("filters by meal type (breakfast)", () => {
            const mealTypeFilters = document.getElementById("mealTypeFilters");
            const breakfastChip = mealTypeFilters.querySelector('[data-mealtype="breakfast"]');
            const applyBtn = document.getElementById("applyFiltersBtn");

            breakfastChip.click();
            applyBtn.click();

            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(4);
        });
    });

    describe("Combined Multi-Filtering", () => {
        test("search + cuisine chip + meal type chip", () => {
            const searchInput = document.getElementById("restaurantSearch");
            const cuisineFilters = document.getElementById("cuisineFilters");
            const mealTypeFilters = document.getElementById("mealTypeFilters");
            const applyBtn = document.getElementById("applyFiltersBtn");

            searchInput.value = "Rooms";
            searchInput.dispatchEvent(new Event("input"));

            cuisineFilters.querySelector('[data-cuisine="South Indian"]').click();
            mealTypeFilters.querySelector('[data-mealtype="breakfast"]').click();

            applyBtn.click();

            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(1);
            expect(cards[0].querySelector("h3").textContent).toContain("MTR");
        });
    });

    describe("Detail Modal", () => {
        test("opens detail modal with correct content", () => {
            const firstCard = document.querySelector(".restaurant-card");
            const detailModal = document.getElementById("detailModal");
            const modalBody = document.getElementById("modalBody");

            expect(detailModal.classList.contains("active")).toBe(false);
            firstCard.click();
            expect(detailModal.classList.contains("active")).toBe(true);
            expect(modalBody.innerHTML).toContain("Vidyarthi Bhavan");
        });


        test("closes modal via ESC key", () => {
            const firstCard = document.querySelector(".restaurant-card");
            const detailModal = document.getElementById("detailModal");

            firstCard.click();
            expect(detailModal.classList.contains("active")).toBe(true);

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(detailModal.classList.contains("active")).toBe(false);
        });
    });
});
