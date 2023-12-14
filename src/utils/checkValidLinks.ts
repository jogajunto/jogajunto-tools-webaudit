import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks and validates the links on a webpage.
 * @param page - The Playwright Page object representing the page to check.
 * @param url - The URL of the page where links will be checked.
 * @param filePath - The file path where the Excel report will be saved.
 * @async
 */
const checkValidLinks = async (page: Page, url: string, filePath: string) => {
  try {
    await page.goto(url); // Navigates to the specified URL.

    // Fetches all href attributes from anchor tags on the page.
    const links = await page.$$eval("a", (as) => as.map((a) => a.href));

    // Iterates over each link to check its validity.
    for (let link of links) {
      // Checks if the link is an email or a number
      const isEmail = /^mailto:.+@.+\..+$/.test(link);
      const isNumber = /^\d+$/.test(link);

      if (isEmail || isNumber) {
        await addToExcel([url, link, `Skipping invalid link`], {
          filePath: filePath,
          sheetName: "Url Check",
          columns: ["URL", "Link", "Status Code"],
        });
        continue; // Skip to next link
      }
      const response = await page.goto(link, { timeout: 60000 }); // Increase the timeout if necessary
      if (response) {
        await addToExcel([url, link, response.status()], {
          filePath: filePath,
          sheetName: "Url Check",
          columns: ["URL", "Link", "Status Code"],
        });
        expect(response.status()).not.toBe(404);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};

export default checkValidLinks;
