# LocalBites

LocalBites is a traveler-focused web application for discovering authentic local food spots.

## Tech Stack

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="17" height="17" alt="HTML Logo"> HTML  
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="17" height="17" alt="CSS Logo"> CSS  
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="17" height="17" alt="JS Logo"> JavaScript

## Development Environment

- OS: Lubuntu (VirtualBox)
- Editor: Visual Studio Code
- Version Manager: NVM
- Node Version: LTS

## Folder Structure

```text
LocalBites/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .husky/
│   ├── commit-msg
│   └── pre-commit
│
├── node_modules/
│
├── public/
│   └── index.html
│
├── src/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── script.js
│       ├── sum.js
│       └── sum.test.js
│
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── .stylelintrc.json
├── commitlint.config.js
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── README.md
└── source-analysis.md
```

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

```
<type>: <short description>
```

### Examples

```
feat: add budget-based food recommendations
fix: resolve eslint browser globals issue
docs: update project documentation
chore: setup linting and git hooks
```

Commits that do not follow this format are automatically blocked.

## Contributors

- **B Rakshitha**
- **Gnaneshwar P**
