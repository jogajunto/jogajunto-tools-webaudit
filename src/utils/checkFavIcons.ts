// Imports the `Page` and `expect` utilities from Playwright for browser automation and assertions.
import { Page, expect } from "@playwright/test";
// Imports a custom helper function for adding data to an Excel file.
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks for the presence of favicon elements on a webpage and adds their HTML to an Excel report.
 * @param page A Playwright Page object representing a browser page.
 * @param url The URL of the webpage to check for favicons.
 * @param filePath The file path for the Excel report where favicon data will be stored.
 * @returns A promise that resolves when the check is complete and data has been added to Excel.
 */
const checkFavIcons = async (
  page: Page,
  url: string,
  filePath: string
): Promise<void> => {
  try {
    // Navigates to the specified URL in the browser.
    await page.goto(url);
    // Finds all elements that are either standard favicons or Apple touch icons, and gets their outer HTML.
    const icons = await page.$$eval(
      'link[rel="icon"], link[rel="apple-touch-icon"]',
      (icons) => icons.map((icon) => icon.outerHTML)
    );
    // Asserts that the icons list is truthy, meaning at least one favicon was found.
    expect(icons).toBeTruthy();
    // Iterates over each found icon and adds its details to an Excel report.
    for (let icon of icons) {
      await addToExcel([url, icon], {
        filePath: filePath,
        sheetName: "Favicons report",
        columns: ["URL", "Content"],
      });
    }
  } catch (error: unknown) {
    // Handles known and unknown errors differently.
    if (error instanceof Error) {
      // Logs the error message if the error is an instance of Error.
      console.error("Favicon missing or error:", error.message);
      // Adds an error entry to a separate sheet in the Excel report for tracking favicon issues.
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Favicon errors",
        columns: ["URL", "Error"],
      });
    } else {
      // Logs a generic error message for unknown error types.
      console.error("An unknown error occurred");
    }
    // Rethrows the error to allow further handling or logging by the caller.
    throw error;
  }
};

// Exports the checkFavIcons function as the default export of this module.
export default checkFavIcons;
