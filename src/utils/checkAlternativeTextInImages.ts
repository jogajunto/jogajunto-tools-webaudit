// The necessary modules from Playwright are imported for browser interaction and assertions.
// Additionally, an import for a utility function to add results to an Excel file is included.
import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * This function checks for images on a webpage that lack alternative text (alt attribute),
 * and compiles a report of these images into an Excel file. Optionally, it can assert
 * that all images have alternative text as part of a test suite.
 *
 * @param {Page} page - The Playwright Page object used to interact with the browser page.
 * @param {string} url - The URL of the web page to test for alt text on images.
 * @param {string} filePath - The file path to save the Excel report.
 * @param {boolean} testExpect - If true, the function will assert that there are no images without alt text.
 * @returns {Promise<void>} A promise that resolves when the function is complete, with no return value.
 */
const checkAlternativeTextInImages = async (
  page: Page,
  url: string,
  filePath: string,
  testExpect: boolean = true
): Promise<void> => {
  try {
    // Navigate to the specified URL to begin the test.
    await page.goto(url);

    // Execute code within the page context to select all <img> elements and filter out those without an 'alt' attribute.
    const imagesWithoutAlt = await page.$$eval("img", (images) =>
      images.filter((img) => !img.alt).map((img) => img.outerHTML)
    );
    // If any images without alt text are found, process them for reporting.
    if (imagesWithoutAlt.length > 0) {
      // Extract the 'src' attributes of the images without alt text for reporting purposes.
      const imgSrcs = imagesWithoutAlt.map((imgTag) => {
        const match = imgTag.match(/src="(.*?)"/); // Use a regular expression to capture the src attribute.
        return match ? match[1] : null; // Return the src value or null if not found.
      });

      // Compile the results into a row for the Excel report.
      await addToExcel([url, imgSrcs.join(", ")], {
        filePath: filePath,
        sheetName: "Images without alt text",
        columns: ["URL", "Images without Alt"],
      });
    }

    // Similarly, select all images with an 'alt' attribute and prepare them for reporting.
    const imagesWithAlt = await page.$$eval("img", (images) =>
      images.filter((img) => img.alt).map((img) => img.outerHTML)
    );
    // Save the results of images with alt text to an Excel spreadsheet.
    if (imagesWithAlt.length > 0) {
      for (const imageHtml of imagesWithAlt) {
        await addToExcel([url, imageHtml], {
          filePath: filePath,
          sheetName: "Images with alt text",
          columns: ["URL", "Image with Alt"],
        });
      }
    }

    // If the testExpect flag is set to true, perform an assertion to ensure no images are missing alt text.
    // This assertion will cause the test to fail if any images without alt text are found.
    if (testExpect) {
      expect(imagesWithoutAlt.length).toBe(0);
    }
  } catch (error: unknown) {
    // Error handling: log the error message to the console and rethrow the error for further handling.
    if (error instanceof Error) {
      console.error(error.message);
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Images alt text error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};

// Export the function to make it available for import and use in other test files within the project.
export default checkAlternativeTextInImages;
