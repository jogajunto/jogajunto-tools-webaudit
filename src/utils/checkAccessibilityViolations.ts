import { Page, expect } from '@playwright/test';
import { addToExcel } from '../helpers/addToExcel';
import AxeBuilder from '@axe-core/playwright';

/**
 * Perform accessibility violation tests on the website
 *
 * @param {Page} page - The page context passed in the test file
 * @param {string} url - The url where the test will be applied
 * @param {string} filePath - The filePath where the xlsx will be saved
 * @param {Array<string>} axeBuilderTags - Array containing the slugs for patterns the accessibility
 *
 * @returns {Promise<void>}
 */
const checkAccessibilityViolations = async (
	page: Page,
	url: string,
	filePath: string,
	axeBuilderTags: Array<string>
): Promise<void> => {
	await page.goto(url);
	const accessibilityScanResults = await new AxeBuilder({ page })
		.withTags(axeBuilderTags)
		.analyze();

	let sheetColumns: Array<string> = [
		'URL',
		'Description',
		'Help',
		'Impact',
		'HTML',
		'failureSummary',
	];

	if (accessibilityScanResults.violations.length > 0) {
		// Transforms statements into a format that can be added to Excel
		accessibilityScanResults.violations.flatMap(async (result) => {
			await createLineResults(
				result,
				url,
				filePath,
				'Violations',
				sheetColumns
			);
		});
	}

	// if (accessibilityScanResults.incomplete.length > 0) {
	// 	// Transforms statements into a format that can be added to Excel
	// 	accessibilityScanResults.incomplete.flatMap(async (result) => {
	// 		await createLineResults(
	// 			result,
	// 			url,
	// 			filePath,
	// 			'Incomplete',
	// 			sheetColumns
	// 		);
	// 	});
	// }

	expect(accessibilityScanResults.violations).toEqual([]);
};

const createLineResults = async (
	result: any,
	url: string,
	filePath: string,
	sheetName: string,
	sheetColumns: Array<string>
) => {
	await result.nodes.map(async (node: any) => {
		const nodeHtml = node ? (node.html ? node.html : 'UNDEFINED') : 'UNDEFINED';
		const nodeFailureSummary = node
			? node.failureSummary
				? node.failureSummary
				: 'UNDEFINED'
			: 'UNDEFINED';

		const line = [
			url,
			result.description,
			`${result.help}. Visit: ${result.helpUrl}`,
			result.impact,
			`'${nodeHtml}'`,
			nodeFailureSummary,
		];
		await addToExcel(line, {
			filePath: filePath,
			sheetName: sheetName,
			columns: sheetColumns,
		});
	});
};

export default checkAccessibilityViolations;
