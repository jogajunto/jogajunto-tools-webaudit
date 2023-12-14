import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks and reports images without alternative text on a given web page.
 *
 * @param {Page} page - The Playwright Page object to interact with the web page.
 * @param {string} url - The URL of the web page to be tested.
 * @param {string} filePath - The file path where the Excel report will be saved.
 * @param {boolean} testExpect - Optional parameter to decide if the test should assert the expectation (default is true).
 * @returns {Promise<void>} A promise that resolves to void upon the completion of the function.
 */
const checkAlternativeTextInImages = async (
  page: Page,
  url: string,
  filePath: string,
  testExpect: boolean = true
): Promise<void> => {
  try {
    await page.goto(url);

    // Check if all images have alt text
    const imagesWithoutAlt = await page.$$eval("img", (images) =>
      images.filter((img) => !img.alt).map((img) => img.outerHTML)
    );
    if (imagesWithoutAlt.length > 0) {
      // Extracts the source URLs of images missing alternative text.
      const imgSrcs = imagesWithoutAlt.map((imgTag) => {
        const match = imgTag.match(/src="(.*?)"/); // Regular expression to extract 'src' attribute.
        return match ? match[1] : null; // Returns the value of the src attribute if found
      });

      // Saves the results to an Excel spreadsheet.
      await addToExcel([url, imgSrcs.join(", ")], {
        filePath: filePath,
        sheetName: "Images without alternative text",
        columns: ["URL", "Images without Alt"],
      });
    }

    // Asserts that no images are missing alternative text if testExpect is true.
    if (testExpect) {
      expect(imagesWithoutAlt.length).toBe(0);
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

export default checkAlternativeTextInImages;
