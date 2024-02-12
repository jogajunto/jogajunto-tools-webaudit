import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks for the presence of a specific Tag Manager tag on a webpage.
 * @param page - The Playwright Page object for interacting with the webpage.
 * @param url - The URL of the page to be checked.
 * @param filePath - The file path where the Excel report will be saved.
 * @param idTagCode - The specific identifier code of the Tag Manager tag to look for.
 * @returns A promise that resolves to void upon completion of the function.
 * @async
 */
const checkTagManager = async (
  page: Page,
  url: string,
  filePath: string,
  idTagCode: string
): Promise<void> => {
  try {
    let foundTag: boolean = false; // Flag to indicate if the tag is found.

    // Event listener to capture and check responses for the specific Tag Manager tag.
    page.on("response", (response) => {
      if (response.url().endsWith(`id=${idTagCode}`)) {
        foundTag = true;
      }
    });

    await page.goto(url); // Navigates to the specified URL.

    // Waits for the network activity on the page to become idle.
    await page.waitForLoadState("networkidle");

    // Validates that the Tag Manager tag was found on the page.
    expect(foundTag).toBeTruthy();

    await addToExcel([url, idTagCode], {
      filePath: filePath,
      sheetName: "Tag Manager",
      columns: ["URL", "ID Tag Code"],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      // Logs the error and adds it to the Excel spreadsheet.
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Tag Manager Error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred"); // Logs a generic error message for unknown errors.
    }
    throw error;
  }
};

export default checkTagManager;
