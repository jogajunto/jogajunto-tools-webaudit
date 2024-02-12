// Import necessary modules from Playwright for browser interaction, assertions, and axe-core for accessibility testing.
import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";
import AxeBuilder from "@axe-core/playwright";

/**
 * This function performs accessibility checks on a webpage using axe-core with Playwright.
 * It captures any accessibility violations and logs them into an Excel file for review.
 *
 * @param {Page} page - The Playwright Page object, representing the browser page to test.
 * @param {string} url - The URL of the page where accessibility tests will be run.
 * @param {string} filePath - The file path where the Excel report will be saved.
 * @param {Array<string>} axeBuilderTags - An array of tags used by axe-core to filter specific accessibility rules.
 *
 * @returns {Promise<void>} - A promise that resolves when the checks are complete.
 */
const checkAccessibilityViolations = async (
  page: Page,
  url: string,
  filePath: string,
  axeBuilderTags: Array<string>
): Promise<void> => {
  try {
    // Navigate to the specified URL.
    await page.goto(url);

    // Run the accessibility analysis with the provided tags.
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(axeBuilderTags)
      .analyze();

    // Define the column headers for the Excel report.
    let sheetColumns: Array<string> = [
      "URL",
      "Description",
      "Help",
      "Impact",
      "HTML",
      "failureSummary",
    ];

    // If there are any violations, process them for the Excel report.
    if (accessibilityScanResults.violations.length > 0) {
      for (const result of accessibilityScanResults.violations) {
        await createLineResults(
          result,
          url,
          filePath,
          "Violations",
          sheetColumns
        );

        // Assert that the impact of violations is not 'serious' or 'critical'.
        // These assertions will fail the test if such impacts are found.
        expect(result.impact).not.toEqual("serious");
        expect(result.impact).not.toEqual("critical");
      }
    }

    // Process any incomplete accessibility checks for the Excel report.
    if (accessibilityScanResults.incomplete.length > 0) {
      for (const result of accessibilityScanResults.incomplete) {
        await createLineResults(
          result,
          url,
          filePath,
          "Incomplete",
          sheetColumns
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        console.error(error.message);
        await addToExcel([url, error.message], {
          filePath: filePath,
          sheetName: "Accessibility Check Error",
          columns: ["URL", "Erro"],
        });
      } else {
        console.error("An unknown error occurred");
      }
      throw error;
    }
  }
};

/**
 * Helper function to create a row of results for each accessibility issue and add it to an Excel file.
 *
 * @param {any} result - The result object from axe-core containing the accessibility issue data.
 * @param {string} url - The URL of the page where the issue was found.
 * @param {string} filePath - The file path for the Excel report.
 * @param {string} sheetName - The name of the sheet within the Excel file where the data will be added.
 * @param {Array<string>} sheetColumns - The headers for the columns in the Excel sheet.
 */
const createLineResults = async (
  result: any,
  url: string,
  filePath: string,
  sheetName: string,
  sheetColumns: Array<string>
) => {
  // Iterate over each node (element) that has an issue and create a row for the Excel report.
  await result.nodes.map(async (node: any) => {
    // Extract HTML and failure summary from the node, default to "UNDEFINED" if not available.
    const nodeHtml = node ? (node.html ? node.html : "UNDEFINED") : "UNDEFINED";
    const nodeFailureSummary = node
      ? node.failureSummary
        ? node.failureSummary
        : "UNDEFINED"
      : "UNDEFINED";

    // Compile the data row with the issue details.
    const line = [
      url,
      result.description,
      `${result.help}. Visit: ${result.helpUrl}`,
      result.impact,
      `'${nodeHtml}'`,
      nodeFailureSummary,
    ];

    // Add the row to the Excel report.
    await addToExcel(line, {
      filePath: filePath,
      sheetName: sheetName,
      columns: sheetColumns,
    });
  });
};

// Export the function to make it available for import in other test files.
export default checkAccessibilityViolations;
