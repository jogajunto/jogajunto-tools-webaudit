import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks the webpage for the correct usage of H1 header tags and records the findings.
 *
 * @param {Page} page - The Playwright Page object to interact with the web page.
 * @param {string} url - The URL of the web page where the header tags will be checked.
 * @param {string} filePath - The file path where the Excel report will be saved.
 *
 * @returns {Promise<void>} A promise that resolves to void upon completion of the function.
 */
const checkHeaderTags = async (
  page: Page,
  url: string,
  filePath: string
): Promise<void> => {
  try {
    await page.goto(url); // Navigates to the specified URL.

    // Selects all H1 header elements on the page.
    const header = await page.$$("h1");

    // Checks if H1 headers are present and processes them.
    if (header && header.length > 0) {
      const headerText = await header[0]?.innerText();

      if (header.length == 1) {
        // Records the H1 header text to the Excel spreadsheet if only one header is present.
        await addToExcel([url, headerText], {
          filePath: filePath,
          sheetName: "Header Tags",
          columns: ["URL", "Content"],
        });

        // Asserts that the header text is not null or empty.
        expect(headerText).not.toBeNull();
        expect(headerText).not.toBe("");
      } else {
        // Records to the Excel spreadsheet if more than one H1 header is found.
        await addToExcel([url, "Page has more than one title"], {
          filePath: filePath,
          sheetName: "Header Tags",
          columns: ["URL", "Content"],
        });

        // Asserts that there should only be one H1 header.
        expect(header).toHaveLength(1);
      }
    } else {
      // Asserts that at least one H1 header is present.
      expect(header).toBeTruthy();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred"); // Logs a generic error message for unknown errors.
    }
    throw error;
  }
};

export default checkHeaderTags;
