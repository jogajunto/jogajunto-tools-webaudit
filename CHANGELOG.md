# Changelog

## [0.2.0] - 2023-12-08

### Added

- **Utils**
  - `checkCanonicalTags.ts`: Checks the canonical tag of a webpage and reports if it's duplicated or incorrect.

### Modified

- Updated .npmignore to include `tsconfig.json` and `.vscode/`.
- Moved @axe-core/playwright to dependencies and formatted the file in `package.json`.
- Refactored `pageSpeedTest` for improved documentation and fetch logic.
- Optimized check for alternative text in images.
- Expanded meta tags check to include additional tags and translation.
- Improved OG Tags check.
- Enhanced spell check functionality.
- Improved valid links check.
- Updated `types.ts` with MetaTags type definitions.
- Updated `README.md`

### Fixed

- Improvements in documentation and explanatory comments.
- Code refinement for efficiency and reliability.

## [0.1.0] - 2023-12-06

### Added

- **Helpers**

  - `addToExcel.ts/js`: Implementation of a function to add data to an Excel spreadsheet, supporting file creation and updating.
  - `checkSpelling.ts`: Spelling check function that supports multiple languages, using `nodehun`.
  - `pageSpeedTest.ts`: Function to assess web page performance using the PageSpeed API, logging metrics in Excel.
  - `preTestSetup.js`: Script for test environment setup, removing files based on defined patterns.
  - `toSlug.ts`: Functionality for converting strings to slugs, removing non-alphanumeric characters.

- **Utils**

  - `checkAccessibilityViolations.ts`: Automated function to test accessibility violations on websites, using `axe-playwright`.
  - `checkAlternativeTextInImages.ts`: Checks for the presence of alternative text in images on a page.
  - `checkHeaderTags.ts`: Test for the proper use of headers for SEO and accessibility.
  - `checkMetaTags.ts`: Verification of essential meta tags for SEO, with support for different languages.
  - `checkOgTags.ts`: Evaluation of a page's Open Graph tags.
  - `checkSpellingErrors.ts`: Identification of spelling errors in web page content.
  - `checkValidLinks.ts`: Verification of the validity of links on a page.

- **Types**
  - `types.ts`: Definition of `language` type for language settings.

### Fixed

- Improvements in documentation and explanatory comments.
- Code refinement for efficiency and reliability.
