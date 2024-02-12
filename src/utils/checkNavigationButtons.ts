// Imports the `Page` and `expect` utilities from Playwright for browser automation and assertions.
import { Page, expect } from "@playwright/test";
// Imports a custom helper function for adding data to an Excel file.
import { addToExcel } from "../helpers/addToExcel";

/**
 * Checks the functionality of "Skip to Content" and "Back to Top" buttons on a webpage and adds the results to an Excel report.
 * The function can also check for the presence of specific classes on the buttons and allows for dynamic text values for the buttons.
 * @param page A Playwright Page object representing a browser page.
 * @param url The URL of the webpage to check for the navigation buttons.
 * @param filePath The file path for the Excel report where the test results will be stored.
 * @param skipButtonClasses Optional RegExp of classes to check on the "Skip to Content" button.
 * @param backButtonClasses Optional RegExp of classes to check on the "Back to Top" button.
 * @param skipButtonText Optional text content for the "Skip to Content" button, defaults to 'Pular para o conteúdo'.
 * @param backButtonText Optional text content for the "Back to Top" button, defaults to 'Voltar ao topo'.
 * @returns A promise that resolves when the check is complete and data has been added to Excel.
 */
const checkNavigationButtons = async (
  page: Page,
  url: string,
  filePath: string,
  skipButtonClasses?: RegExp,
  backButtonClasses?: RegExp,
  skipButtonText?: string,
  backButtonText?: string
): Promise<void> => {
  try {
    // Navigates to the specified URL in the browser.
    await page.goto(url);

    // Locates the "Skip to Content" button using the provided text or default text.
    const skipButtonLocator = `text="${
      skipButtonText || "Pular para o conteúdo"
    }"`;
    const skipButton = page.locator(skipButtonLocator);
    // Asserts the button has the expected 'href' attribute pointing to the '#hero' section.
    await expect(skipButton).toHaveAttribute("href", "#hero");
    // If provided, asserts the button has all specified classes.
    if (skipButtonClasses) {
      await expect(skipButton).toHaveClass(skipButtonClasses);
    }
    // Sets focus on the button and simulates a click to test functionality.
    await skipButton.focus();
    await skipButton.click();

    // Locates the "Back to Top" button using the provided text or default text.
    const backButtonLocator = `text="${backButtonText || "Voltar ao topo"}"`;
    const backButton = page.locator(backButtonLocator);
    // Asserts the button has the expected 'href' attribute pointing to the '#top' of the page.
    await expect(backButton).toHaveAttribute("href", "#top");
    // If provided, asserts the button has all specified classes.
    if (backButtonClasses) {
      await expect(backButton).toHaveClass(backButtonClasses);
    }
    // Sets focus on the button and simulates a click to test functionality.
    await backButton.focus();
    await backButton.click();

    // Records the successful test result to an Excel report.
    await addToExcel([url, "Navigation buttons check passed"], {
      filePath: filePath,
      sheetName: "Navigation Buttons report",
      columns: ["URL", "Test Result"],
    });
  } catch (error: unknown) {
    // Logs and handles errors.
    if (error instanceof Error) {
      console.error("Error with navigation buttons:", error.message);
      // Records a detailed error entry to the Excel report for troubleshooting.
      await addToExcel([url, `Error: ${error.message}`], {
        filePath: filePath,
        sheetName: "Navigation Buttons Errors",
        columns: ["URL", "Error"],
      });
    } else {
      // Logs a generic error message for unknown error types.
      console.error("An unknown error occurred");
    }
    // Rethrows the error for further handling.
    throw error;
  }
};

// Exports the checkNavigationButtons function as the default export of this module.
export default checkNavigationButtons;
