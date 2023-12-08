import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';

/**
 * Check alternative text in images from html page
 *
 * @param {Page} page - The page context passed in the test file
 * @param {string} url - The url where the test will be applied
 * @param {string} filePath - The filePath where the xlsx will be saved
 * @param {string} sheetName - xlsx spreadsheet tab name
 * @param {Array<string>} sheetColumns - Array of map columns for the xlsx spreadsheet
 *
 * @returns {Promise<void>}
 */
const checkAlternativeTextInImages = async (
  page: Page,
  url: string,
  filePath: string,
  sheetName: string,
  sheetColumns: Array<string>
): Promise<void> => {
  try {
    await page.goto(url);

    // Check if all images have alt text
    const imagesWithoutAlt = await page.$$eval('img', (images) =>
      images.filter((img) => !img.alt).map((img) => img.outerHTML)
    );
    if (imagesWithoutAlt.length > 0) {
      // Using regular expression to extract value from src attribute
      const imgSrcs = imagesWithoutAlt.map((imgTag) => {
        // TODO - validate that it is really an image url before trying to get the src value
        const match = imgTag.match(/src="(.*?)"/);
        return match ? match[1] : null; // Returns the value of the src attribute if found
      });

      // Add the results to the Excel spreadsheet
      await addToExcel([url, imgSrcs.join(', ')], {
        filePath: filePath,
        sheetName: sheetName,
        columns: sheetColumns,
      });
    }

    expect(imagesWithoutAlt.length).toBe(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Add the error to the Excel spreadsheet
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: sheetName,
        columns: sheetColumns,
      });
    } else {
      console.error('An unknown error occurred');
    }
  }
};

export default checkAlternativeTextInImages;
