/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

describe("Homepage UI", () => {
    let htmlContent;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    beforeAll(() => {
        const htmlPath = path.join(__dirname, "../public/pages/index.html");
        htmlContent = fs.readFileSync(htmlPath, "utf-8");
    });

    beforeEach(() => {
        document.documentElement.innerHTML = htmlContent;

        const scriptPath = path.join(__dirname, "../src/js/script.js");
        const scriptContent = fs.readFileSync(scriptPath, "utf-8");
        eval(scriptContent);

        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
    });

    describe("Hamburger Menu", () => {
        test("toggles nav-links active class when clicked", async () => {
            const hamburger = document.querySelector(".hamburger");
            const navLinks = document.querySelector(".nav-links");

            expect(hamburger).toBeInTheDocument();
            expect(navLinks).toBeInTheDocument();
            expect(navLinks).not.toHaveClass("active");

            fireEvent.click(hamburger);

            expect(navLinks).toHaveClass("active");

            fireEvent.click(hamburger);

            expect(navLinks).not.toHaveClass("active");
        });
    });

    describe("Carousel", () => {
        test("initializes with active slide", () => {
            const slides = document.querySelectorAll(".carousel-item");
            expect(slides.length).toBeGreaterThan(0);

            const activeSlide = document.querySelector(".carousel-item.active");
            expect(activeSlide).toBeInTheDocument();
        });
    });
});
