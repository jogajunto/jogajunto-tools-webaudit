// Importing necessary modules from Playwright for browser interaction and assertions.
// Also importing a helper function for adding results to an Excel file.
import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * This function is responsible for checking the validity of all the links on a given webpage.
 * It navigates to the page, collects all the links, and then checks each one to see if it is valid.
 * Valid links will have their status codes logged in an Excel report. Invalid links, like emails
 * or phone numbers, are noted and skipped.
 *
 * @param {Page} page - The Playwright Page object that represents the browser page.
 * @param {string} url - The URL of the webpage where the links will be checked.
 * @param {string} filePath - The path to the Excel file where the report will be saved.
 * @async - Indicates that the function is asynchronous.
 */
const checkValidLinks = async (page: Page, url: string, filePath: string) => {
  try {
    // Navigates to the specified URL to begin the link checking process.
    await page.goto(url);

    // Retrieves all href attributes from anchor tags on the page.
    const links = await page.$$eval("a", (as) => as.map((a) => a.href));

    // Iterates through the array of links to check each one.
    for (let link of links) {
      // Uses regular expressions to test if the link is an email address or a telephone number.
      const isEmail = /^mailto:.+@.+\..+$/.test(link);
      const isNumber = /^\d+$/.test(link);

      // If the link is an email or a number, logs it as invalid and skips further checks.
      if (isEmail || isNumber) {
        await addToExcel([url, link, `Skipping invalid link`], {
          filePath: filePath,
          sheetName: "Url Check",
          columns: ["URL", "Link", "Status Code"],
        });
        continue; // Continues to the next iteration of the loop without executing the remaining code.
      }

      // Navigates to the link and waits for the response, with a timeout of 60 seconds to handle slow-loading pages.
      const response = await page.goto(link, { timeout: 60000 });
      // If a response is received, logs the link with its status code to the Excel report.
      if (response) {
        await addToExcel([url, link, response.status()], {
          filePath: filePath,
          sheetName: "Url Check",
          columns: ["URL", "Link", "Status Code"],
        });

        // Uses an assertion to ensure that the response status is not 404 (Not Found),
        // indicating that the link should be valid.
        expect(response.status()).not.toBe(404);
      }
    }
  } catch (error: unknown) {
    // Error handling block to catch any exceptions that may occur during the function execution.
    if (error instanceof Error) {
      // Logs the error message to the console for debugging.
      console.error(error.message);
      // Optionally, logs the error details to the Excel file for further analysis.
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Url Check Error",
        columns: ["URL", "Error"],
      });
    } else {
      // Logs a generic error message if the error is not an instance of Error.
      console.error("An unknown error occurred");
    }
    // Rethrows the error to be handled by the calling function or the higher level error handling mechanisms.
    throw error;
  }
};

// Exports the function to make it available for use in other files.
export default checkValidLinks;
