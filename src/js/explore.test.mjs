import fs from 'fs';
import path from 'path';
import { RESTAURANTS } from '../data/restaurants.js';

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
        exploreInstance.restaurants = RESTAURANTS;
        exploreInstance.renderRestaurants();
    });

    describe("Initial State", () => {
        test("renders all initial restaurants", () => {
            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(RESTAURANTS.length);
            expect(document.querySelector("h1").textContent).toBe("Popular Local Discoveries");
        });

        test("prices use Indian Rupee symbol", () => {
            const prices = document.querySelectorAll(".card-price");

            if (RESTAURANTS.length > 0) {
                expect(prices[0].textContent).toContain("₹");
            }
        });
    });

    describe("Search Functionality", () => {
        test("filters by name", () => {
            const target = RESTAURANTS[0];
            const searchInput = document.getElementById("restaurantSearch");
            const query = target.name.split(' ')[0];

            searchInput.value = query;
            searchInput.dispatchEvent(new Event("input"));

            const expectedCount = RESTAURANTS.filter(r => r.name.toLowerCase().includes(query.toLowerCase())).length;
            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(expectedCount);
            expect(cards[0].querySelector("h3").textContent).toContain(target.name);
        });

        test("filters by cuisine", () => {
            const targetCuisine = RESTAURANTS[0].cuisine;
            const searchInput = document.getElementById("restaurantSearch");

            searchInput.value = targetCuisine;
            searchInput.dispatchEvent(new Event("input"));

            const expectedCount = RESTAURANTS.filter(r => r.cuisine.toLowerCase().includes(targetCuisine.toLowerCase())).length;
            const cards = document.querySelectorAll(".restaurant-card");

            expect(cards.length).toBe(expectedCount);
            const cardCuisine = cards[0].querySelector(".card-cuisine").textContent;
            expect(cardCuisine.toLowerCase()).toContain(targetCuisine.toLowerCase());
        });

        test("shows no-results message for invalid search", () => {
            const searchInput = document.getElementById("restaurantSearch");
            searchInput.value = "NonExistentPlaceXYZ123";
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
            if (!southIndianChip) return;

            const cuisineType = southIndianChip.dataset.cuisine;

            southIndianChip.click();
            document.getElementById("applyFiltersBtn").click();
            const expectedCount = RESTAURANTS.filter(r => r.cuisine === cuisineType).length;
            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(expectedCount);
        });

        test("filters by meal type (breakfast)", () => {
            const mealTypeFilters = document.getElementById("mealTypeFilters");
            const breakfastChip = mealTypeFilters.querySelector('[data-mealtype="breakfast"]');
            if (!breakfastChip) return;
            const mealType = breakfastChip.dataset.mealtype;
            breakfastChip.click();
            document.getElementById("applyFiltersBtn").click();
            const expectedCount = RESTAURANTS.filter(r => r.mealType.includes(mealType)).length;
            const cards = document.querySelectorAll(".restaurant-card");
            expect(cards.length).toBe(expectedCount);
        });
    });

    describe("Combined Multi-Filtering", () => {
        test("search + cuisine chip + meal type chip", () => {
            const target = RESTAURANTS.find(r => r.name.includes("MTR"));
            if (!target) return;
            const searchInput = document.getElementById("restaurantSearch");
            const cuisineFilters = document.getElementById("cuisineFilters");
            const mealTypeFilters = document.getElementById("mealTypeFilters");
            const applyBtn = document.getElementById("applyFiltersBtn");
            searchInput.value = "MTR";
            searchInput.dispatchEvent(new Event("input"));
            const cuisineChip = cuisineFilters.querySelector(`[data-cuisine="${target.cuisine}"]`);
            const targetMealType = target.mealType[0];
            const mealChip = mealTypeFilters.querySelector(`[data-mealtype="${targetMealType}"]`);
            if (cuisineChip && mealChip) {
                cuisineChip.click();
                mealChip.click();
                applyBtn.click();

                const cards = document.querySelectorAll(".restaurant-card");
                expect(cards.length).toBeGreaterThanOrEqual(1);
                expect(cards[0].querySelector("h3").textContent).toContain(target.name);
            }
        });
    });

    describe("Detail Modal", () => {
        test("opens detail modal with correct content", () => {
            const firstCard = document.querySelector(".restaurant-card");
            const targetData = RESTAURANTS[0];

            const detailModal = document.getElementById("detailModal");
            const modalBody = document.getElementById("modalBody");

            expect(detailModal.classList.contains("active")).toBe(false);
            firstCard.click();
            expect(detailModal.classList.contains("active")).toBe(true);
            expect(modalBody.textContent).toContain(targetData.name);
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
