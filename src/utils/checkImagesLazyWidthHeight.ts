import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks if images on a webpage are using lazy loading and have width and height attributes set.
 *
 * @param {Page} page - The Playwright Page object to interact with the web page.
 * @param {string} url - The URL of the web page where the image attributes will be checked.
 * @param {string} filePath - The file path where the Excel report will be saved.
 * @param {boolean} testExpect - Optional parameter to decide if the test should assert the expectation (default is true).
 * @returns {Promise<void>} A promise that resolves to void upon completion of the function.
 */
const checkImagesLazyWidthHeight = async (
  page: Page,
  url: string,
  filePath: string,
  testExpect: boolean = true
): Promise<void> => {
  try {
    await page.goto(url); // Navigates to the specified URL.

    // Selects images that do not use lazy loading or lack width/height attributes.
    const imagesWithoutAttributes = await page.$$eval("img", (images) =>
      images
        .filter(
          (img) =>
            !img.loading || img.loading != "lazy" || !img.width || !img.height
        )
        .map((img) => img.outerHTML)
    );

    // Processes each image that does not meet the criteria.
    if (imagesWithoutAttributes.length > 0) {
      imagesWithoutAttributes.map(async (imgTag) => {
        // Records the non-compliant images to the Excel spreadsheet.
        await addToExcel([url, imgTag], {
          filePath: filePath,
          sheetName: "IMG lazy and width height",
          columns: ["URL", "IMG"],
        });
      });
    }

    // Asserts that all images should be using lazy loading with width and height attributes if testExpect is true.
    if (testExpect) {
      expect(imagesWithoutAttributes).toEqual([]);
    }
  } catch (error: unknown) {
    // Error handling: logs the error message and rethrows the error.
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};

export default checkImagesLazyWidthHeight;
