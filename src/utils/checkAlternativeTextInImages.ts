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

		// Verificar se todas as imagens têm texto alternativo
		const imagesWithoutAlt = await page.$$eval('img', (images) =>
			images.filter((img) => !img.alt).map((img) => img.outerHTML)
		);

		if (imagesWithoutAlt.length > 0) {
			// Usando expressão regular para extrair o valor do atributo src
			const imgSrcs = imagesWithoutAlt.map((imgTag) => {
				// TODO - validar se é mesmo uma url de imagem antes de tentar pegar o valor de src
				const match = imgTag.match(/src="(.*?)"/);
				return match ? match[1] : null; // Retorna o valor do atributo src se encontrado
			});

			// Adicionar os resultados à planilha Excel
			await addToExcel([url, imgSrcs.join(', ')], {
				filePath: filePath,
				sheetName: sheetName,
				columns: sheetColumns,
			});
		}

		expect(imagesWithoutAlt.length).toBe(0);
	} catch (error: unknown) {
		if (error instanceof Error) {
			// Adicionar o erro à planilha Excel
			await addToExcel([url, error.message], {
				filePath: filePath,
				sheetName: sheetName,
				columns: sheetColumns,
			});
		} else {
			console.error("An unknown error occurred");
		}
	}
};

export default checkAlternativeTextInImages;
