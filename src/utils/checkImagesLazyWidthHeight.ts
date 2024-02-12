// Importing necessary modules from Playwright for interacting with the browser page and performing assertions.
// Additionally, importing a helper function to log results into an Excel report.
import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';

/**
 * This function checks for the presence of lazy loading attributes and defined width and height
 * on all <img> elements on a given webpage. It aims to validate good practices for image loading 
 * performance and layout stability.
 *
 * @param {Page} page - Playwright's Page instance for browser interaction.
 * @param {string} url - The URL of the webpage to be evaluated.
 * @param {string} filePath - The path where the results will be saved in an Excel format.
 * @param {boolean} testExpect - Flag to determine if the function should perform assertions
 *                               to enforce the presence of attributes. Defaults to true.
 * @returns {Promise<void>} - Signifies asynchronous completion of the function.
 */
const checkImagesLazyWidthHeight = async (
	page: Page,
	url: string,
	filePath: string,
	testExpect: boolean = true
): Promise<void> => {
	try {
		// Navigate to the given URL to start the check.
		await page.goto(url);

		// Evaluate all <img> elements on the page to find those not adhering to lazy loading best practices.
		const imagesWithoutAttributes = await page.$$eval('img', (images) =>
			images
				.filter((img) => {
					// Checks if the image has 'loading=lazy' attribute specifically.
					const isLazyLoaded = img.getAttribute('loading') === 'lazy';
					// Ensures both width and height attributes are set.
					const hasWidthAndHeight =
						img.hasAttribute('width') && img.hasAttribute('height');

					// Images are excluded from the report if they are correctly lazy-loaded and have both dimensions specified.
					return !(isLazyLoaded && hasWidthAndHeight);
				})
				.map((img) => img.outerHTML) // Maps the non-compliant images to their outerHTML for reporting.
		);

		// Iterate through the identified images and log them into the Excel report.
		if (imagesWithoutAttributes.length > 0) {
			imagesWithoutAttributes.map(async (imgTag) => {
				await addToExcel([url, imgTag], {
					filePath: filePath,
					sheetName: 'Lazy, width, height',
					columns: ['URL', 'IMG'], // Defines the columns for the report.
				});
			});
		}

		// Performs an assertion that expects no images to be missing lazy loading and dimension attributes if `testExpect` is true.
		if (testExpect) {
			expect(imagesWithoutAttributes).toEqual([]);
		}
	} catch (error: unknown) {
		// Catch block for handling errors during the function execution.
		if (error instanceof Error) {
			// Logs the specific error message for troubleshooting.
			console.error(error.message);
			// Optionally logs the error in the Excel report for further analysis.
			await addToExcel([url, error.message], {
				filePath: filePath,
				sheetName: 'Lazy, width, height error',
				columns: ['URL', 'Error'], // Defines the columns for the error report.
			});
		} else {
			console.error('An unknown error occurred'); // Logs a generic message for unknown errors.
		}
		// Rethrows the error for upstream error handling.
		throw error;
	}
};

// Exports the function to make it available for use in other parts of the application.
export default checkImagesLazyWidthHeight;
