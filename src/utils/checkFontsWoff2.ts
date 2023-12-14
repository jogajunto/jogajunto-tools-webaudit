import { Page, expect, Response } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks for the successful loading of .woff2 font files on a webpage and logs the results.
 * @param page - The Playwright Page object for interacting with the webpage.
 * @param url - The URL of the page to be checked for .woff2 font files.
 * @param filePath - The file path where the Excel report will be saved.
 * @param testExpect - Optional parameter to decide if the test should assert the expectation (default is true).
 * @returns {Promise<void>} A promise that resolves to void upon completion of the function.
 */
const checkFontsWoff2 = async (
  page: Page,
  url: string,
  filePath: string,
  testExpect: boolean = true
): Promise<void> => {
  try {
    const fontResponses: Response[] = []; // Stores responses for .woff2 font files.

    // Event listener to capture responses for .woff2 font files.
    page.on("response", (response) => {
      if (response.url().endsWith(".woff2")) {
        fontResponses.push(response);
      }
    });

    await page.goto(url); // Navigates to the specified URL.

    // Waits for the page's network activity to be idle.
    await page.waitForLoadState("networkidle");

    if (fontResponses.length > 0) {
      // Add the fonts results to the Excel spreadsheet
      for (const response of fontResponses) {
        await addToExcel([url, response.url(), response.status()], {
          filePath: filePath,
          sheetName: "Check Fonts Woff2",
          columns: ["URL", "Font URL", "Font Status"],
        });
      }
    } else {
      // Logs if no .woff2 fonts were found.
      await addToExcel([url, "Not found fonts Woff2"], {
        filePath: filePath,
        sheetName: "Check Fonts Woff2",
        columns: ["URL", "Font URL"],
      });
    }

    // Asserts expectations about the font file responses if testExpect is true.
    if (testExpect) {
      for (const response of fontResponses) {
        expect(response.status()).toBe(200); // Expects HTTP status 200 for each font file.
      }
      expect(fontResponses).not.toEqual([]); // Expects at least one .woff2 font response to be present.
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

export default checkFontsWoff2;
