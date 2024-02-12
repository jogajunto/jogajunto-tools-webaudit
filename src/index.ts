// Imports of all your utility and verification functions
import { addToExcel } from "./helpers/addToExcel";
import checkSpelling from "./helpers/checkSpelling";
import { pageSpeedTest } from "./helpers/pageSpeedTest";
import { toSlug } from "./helpers/toSlug";
import checkAccessibilityViolations from "./utils/checkAccessibilityViolations";
import checkAlternativeTextInImages from "./utils/checkAlternativeTextInImages";
import checkHeadingTags from "./utils/checkHeadingTags";
import checkMetaTags from "./utils/checkMetaTags";
import checkOgTags from "./utils/checkOgTags";
import checkSpellingErrors from "./utils/checkSpellingErrors";
import checkValidLinks from "./utils/checkValidLinks";
import checkCanonicalTag from "./utils/checkCanonicalTag";
import checkFontsWoff2 from "./utils/checkFontsWoff2";
import checkTagManager from "./utils/checkTagManager";
import checkImagesLazyWidthHeight from "./utils/checkImagesLazyWidthHeight";
import checkFavIcons from "./utils/checkFavIcons";
import checkButtonLinkStates from "./utils/checkButtonAndLinkStates";
import checkNavigationButtons from "./utils/checkNavigationButtons";
import checkNavigationKeyboardTab from "./utils/checkNavigationKeyboardTab";

// Exporting functions to be accessible to anyone importing your library
export {
  addToExcel,
  checkSpelling,
  pageSpeedTest,
  toSlug,
  checkAccessibilityViolations,
  checkAlternativeTextInImages,
  checkCanonicalTag,
  checkFontsWoff2,
  checkTagManager,
  checkImagesLazyWidthHeight,
  checkButtonLinkStates,
  checkNavigationButtons,
  checkNavigationKeyboardTab,
  checkHeadingTags,
  checkMetaTags,
  checkOgTags,
  checkSpellingErrors,
  checkValidLinks,
  checkFavIcons,
};
