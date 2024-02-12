# Changelog

## [0.4.0] - 2024-02-12

### Added

- New utility checkFavIcons to verify the presence of favorite icons on web pages.
adjustColumnWidths function in addToExcel to automatically adjust column widths based on content.
- New utility checkButtonAndLinkStates to check hover, focus, and active states of all buttons and links on a web page, storing the styles of these states for each element and adding the results to an Excel file.
- New utility checkNavigationButtons to verify the functionality of "Skip to Content" and "Back to Top" buttons on web pages, including checking specific classes of the buttons and adding the results to an Excel report.
- New utility checkNavigationKeyboardTab to test keyboard navigation using the Tab key on focusable elements of a page, with the option to exclude elements within specified classes and add the results to an Excel file.

### Modified

- Updated @axe-core/playwright to ^4.8.4 and @playwright/test to ^1.41.2.
- Refactoring and documentation improvement of addToExcel.
- Improvements in checkAccessibilityViolations, checkAlternativeTextInImages, checkCanonicalTag, checkFontsWoff2, including error handling and adjustments according to best practices.

### Fixed

- Fixes in utilities for better error handling and increased checking precision.
- Updates in types.ts to better support new features and fixes implemented.

## [0.3.0] - 2023-12-13

### Added

- **Utils**
  - `checkCanonicalTag.ts`: Checks the canonical tag of a webpage and reports if it's duplicated or incorrect.
  - `checkFontsWoff2.ts`: Checks for the successful loading of .woff2 font files on a webpage.
  - `checkTagManager.ts`: Checks for the presence of a specific Tag Manager tag on a webpage.
  - `checkImagesLazyWidthHeight.ts`: Checks if images on a webpage are using lazy loading and have width and height attributes set.

### Modified

- Refactored `checkAlternativeTextInImages.ts` to improve the process of checking and reporting images without alternative text.
- Enhanced `checkHeaderTags.ts` for better accuracy in checking the correct usage of H1 header tags.
- Updated `checkMetaTags.ts` for more comprehensive meta tags checking, including translation support.
- Improved `checkOgTags.ts` to better identify missing OG tags and handle errors.
- Enhanced `checkValidLinks.ts` to more effectively validate the links on a webpage.
- Updated `.prettierrc` configuration for improved code formatting.
- Modified `src/index.ts` for new function imports and exports.
- Updated various files for improved documentation and comments.

### Fixed

- Various bug fixes and performance improvements in existing utility functions.

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
