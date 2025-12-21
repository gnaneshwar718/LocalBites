# LocalBites

LocalBites is a traveler-focused web application for discovering authentic local food spots.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)

## Development Environment

- OS: Lubuntu (VirtualBox)
- Editor: Visual Studio Code
- Version Manager: NVM
- Node Version: LTS

## Folder Structure

- public/ → HTML files
- src/css → Stylesheets
- src/js → JavaScript logic
- assets/ → Images & icons
- docs/ → Documentation

## How to Run

Open `public/index.html` in a browser.

## Source Analysis & Code Quality

This project follows modern development best practices:

- **ESLint** for JavaScript linting
- **Stylelint** for CSS linting
- **Prettier** for consistent formatting
- **Husky + lint-staged** to enforce linting and formatting before commits

These tools ensure clean, readable, and maintainable code.

## Version Control & Git Workflow

- Git is used for source control
- Automated checks prevent:
  - Invalid commit messages
  - Linting errors
  - Poor formatting

## Commit Message Convention

This project follows the **Conventional Commits** specification.

### Format

<type>: <short description>

### Examples

feat: add budget-based food recommendations
fix: resolve eslint browser globals issue
docs: update project documentation
chore: setup linting and git hooks

Commits that do not follow this format are automatically blocked.

## Contributors

- **B Rakshitha**
- **Gnaneshwar P**
