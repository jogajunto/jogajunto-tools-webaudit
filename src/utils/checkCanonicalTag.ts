import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks the canonical tag of a webpage and reports if it's duplicated or incorrect.
 * @param page - The Playwright Page object representing the page to check.
 * @param url - The URL of the page to be checked.
 * @param filePath - The file path where the Excel report will be saved.
 * @returns {Promise<void>} A promise that resolves to void upon the completion of the function.
 */
const checkCanonicalTag = async (
  page: Page,
  url: string,
  filePath: string
): Promise<void> => {
  try {
    let tagDuplicated: boolean = false; // Flag to indicate if the canonical tag is duplicated.

    await page.goto(url); // Navigates to the specified URL.

    // Fetches all canonical link elements from the page.
    const canonicalTags = await page.$$('link[rel="canonical"]');

    // Process to check and validate the canonical tags.
    if (canonicalTags.length > 0) {
      const canonicalTag = canonicalTags[0];
      expect(canonicalTag).not.toBeNull(); // Checks if the canonical tag is present

      const canonicalHref = await canonicalTag.getAttribute("href");

      // Checks if there is more than one canonical tag
      if (canonicalTags.length > 1) {
        tagDuplicated = true;
      }

      await addToExcel(
        tagDuplicated
          ? [url, canonicalHref, "Tag duplicada na página"]
          : [url, canonicalHref],
        {
          filePath: filePath,
          sheetName: "Tag canonica",
          columns: tagDuplicated
            ? ["URL", "URL Canonica", "Info"]
            : ["URL", "URL Canonica"],
        }
      );

      // Checks if there is only one canonical tag
      expect(canonicalTags.length).toBe(1);
      // Checks if the value of the href attribute is the same as the current URL
      expect(canonicalHref).toBe(url);
    } else {
      // If no canonical tags found, expects at least one canonical tag to be present.
      expect(canonicalTags.length).toBe(1);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error when checking canonical tag:", error.message);
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Tag canonica Error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};

export default checkCanonicalTag;
