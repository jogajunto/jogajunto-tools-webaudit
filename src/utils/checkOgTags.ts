import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';

/**
 * Check Og Tags from website url
 *
 * @param {Page} page - The page context passed in the test file
 * @param {string} url - The url where the test will be applied
 * @param {string} filePath - The filePath where the xlsx will be saved
 * @param {string} sheetName - xlsx spreadsheet tab name
 * @param {Array<string>} sheetColumns - Array of map columns for the xlsx spreadsheet
 *
 * @returns {Promise<void>}
 */
const checkOgTags = async (
  page: Page,
  url: string,
  filePath: string,
  sheetName: string,
  sheetColumns: Array<string>
): Promise<void> => {
  try {
    await page.goto(url);

    // Check if og-tag meta elements are present on the page
    const ogTags = {
      'OG Title': await page.$('meta[property="og:title"]'),
      'OG Description': await page.$('meta[property="og:description"]'),
      'OG URL': await page.$('meta[property="og:url"]'),
      'OG Image': await page.$('meta[property="og:image"]'),
    };

    const missingTags: any = [];

    for (const [tag, element] of Object.entries(ogTags)) {
      if (element) {
        const content = await element.getAttribute('content');
        expect(content).not.toBeNull();
      } else {
        missingTags.push(tag);
      }
    }

    if (missingTags.length > 0) {
      // Add the missing tags to the Excel spreadsheet
      await addToExcel([url, ...missingTags], {
        filePath: filePath,
        sheetName: `${sheetName} Ausentes`,
        columns: ['URL', ...missingTags.map(() => 'Tag Ausente')],
      });
    } else {
      const ogTitleContent = await ogTags['OG Title']?.getAttribute('content');
      const ogDescriptionContent =
        await ogTags['OG Description']?.getAttribute('content');
      const ogUrlContent = await ogTags['OG URL']?.getAttribute('content');
      const ogImageContent = await ogTags['OG Image']?.getAttribute('content');

      // Add the results to the Excel spreadsheet
      await addToExcel(
        [
          url,
          ogTitleContent,
          ogDescriptionContent,
          ogUrlContent,
          ogImageContent,
        ],
        {
          filePath: filePath,
          sheetName: sheetName,
          columns: sheetColumns,
        }
      );

      // Add additional checks if necessary
      expect(ogTitleContent?.length).toBeGreaterThan(10); // Verification example
      expect(ogUrlContent).toBe(url); // Make sure the og-url is the same as the page URL
    }
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

export default checkOgTags;
