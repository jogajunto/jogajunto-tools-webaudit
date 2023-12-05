import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';

const checkValidLinks = async (
	page: Page,
	url: string,
	filePath: string,
	sheetName: string,
	sheetColumns: Array<string>
) => {
	await page.goto(url);
	const links = await page.$$eval('a', (as) => as.map((a) => a.href));
	for (let link of links) {
		try {
			// Verifica se o link é um email ou um número
			const isEmail = /^mailto:.+@.+\..+$/.test(link);
			const isNumber = /^\d+$/.test(link);

			if (isEmail || isNumber) {
				await addToExcel([url, link, `Pulando link não válido`], {
					filePath: filePath,
					sheetName: sheetName,
					columns: sheetColumns,
				});
				continue; // Pula para o próximo link
			}
			const response = await page.goto(link, { timeout: 60000 }); // Aumentar o timeout se necessário
			if (response) {
				await addToExcel([url, link, response.status()], {
					filePath: filePath,
					sheetName: sheetName,
					columns: sheetColumns,
				});
				expect(response.status()).not.toBe(404);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(error.message);
			} else {
				console.error("An unknown error occurred");
			}
		}
	}
};

export default checkValidLinks;
