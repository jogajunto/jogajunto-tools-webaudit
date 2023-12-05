import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';
import checkSpelling from '../helpers/checkSpelling';
import { language } from './types';

/**
 * Perform spelling tests on the website
 *
 * @param {Page} page - The page context passed in the test file
 * @param {string} url - The url where the test will be applied
 * @param {language} language - The website language slug e.g. 'pt-BR', 'en', 'es'
 * @param {string} filePath - The filePath where the xlsx will be saved
 * @param {string} sheetName - xlsx spreadsheet tab name
 * @param {Array<string>} sheetColumns - Array of map columns for the xlsx spreadsheet
 * @param {Array<string>} ignoreWords - The array containing the words that want to be excluded from validation
 *
 * @returns {Promise<void>}
 */
const checkSpellingErrors = async (
	page: Page,
	url: string,
	language: language,
	filePath: string,
	sheetName: string,
	sheetColumns: Array<string>,
	ignoreWords?: Array<string>
): Promise<void> => {
	await page.goto(url);
	const textContent: any = await page.evaluate(() => document.body.innerText);
	const misspelledWords = await checkSpelling(
		textContent,
		language,
		ignoreWords ?? []
	);
	if (misspelledWords.length > 0) {
		misspelledWords.forEach(async (word: string) => {
			// Adicionar os resultados à planilha Excel ou tomar outras ações conforme necessário
			await addToExcel([url, word], {
				filePath: filePath,
				sheetName: sheetName,
				columns: sheetColumns,
			});
		});
	}
	expect(misspelledWords.length).toBe(0);
};

export default checkSpellingErrors;
