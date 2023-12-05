import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';

/**
 *
 * @param {Page} page - The page context passed in the test file
 * @param {string} url - The url where the test will be applied
 * @param {string} filePath - The filePath where the xlsx will be saved
 * @param {string} sheetName - xlsx spreadsheet tab name
 * @param {Array<string>} sheetColumns - Array of map columns for the xlsx spreadsheet
 *
 * @returns {Promise<void>}
 */
const checkHeaderTags = async (
	page: Page,
	url: string,
	filePath: string,
	sheetName: string,
	sheetColumns: Array<string>
): Promise<void> => {
	await page.goto(url);
	const header = await page.$$('h1');

	if (header && header.length > 0) {
		const headerText = await header[0]?.innerText();

		if (header.length == 1) {
			await addToExcel([url, headerText], {
				filePath: filePath,
				sheetName: sheetName,
				columns: sheetColumns,
			});
			expect(headerText).not.toBeNull();
			expect(headerText).not.toBe('');
		} else {
			await addToExcel([url, 'Página possui mais de um titulo'], {
				filePath: filePath,
				sheetName: sheetName,
				columns: sheetColumns,
			});
			expect(header).toHaveLength(1);
		}
	} else {
		expect(header).toBeTruthy();
	}
};

export default checkHeaderTags;
