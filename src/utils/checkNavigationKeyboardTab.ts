// Necessary imports from Playwright are included for page interaction and assertions.
// Additionally, a helper function to add results to an Excel file is imported.
import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * This function is designed to test keyboard navigation using the Tab key across focusable elements
 * on a page, with the option to exclude elements within specified classes.
 *
 * @param {Page} page - Playwright's Page instance for interacting with the page.
 * @param {string} url - The URL of the page to be tested.
 * @param {string} filePath - The path to the Excel file where results will be saved.
 * @param {string} linksSearchSelectorCSS - The CSS selector to find focusable elements.
 * @param {Array<string>} classesToCheck - Optional array of CSS classes to exclude elements from the test.
 *
 * @returns {Promise<void>} - A promise that resolves once the test is complete.
 */
const checkNavigationKeyboardTab = async (
  page: Page,
  url: string,
  filePath: string,
  linksSearchSelectorCSS: string,
  classesToCheck?: Array<string>
): Promise<void> => {
  try {
    // Navigate to the provided URL to begin the test.
    await page.goto(url);

    // Use the provided CSS selector to locate focusable elements on the page.
    const elements = page.locator(linksSearchSelectorCSS);
    // Count the total number of focusable elements found.
    const count = await elements.count();

    // Initialize an array to hold the results of the focusable elements check.
    let elementsResults: any = [];

    // Iterate over each focusable element found.
    for (let i = 0; i < count; ++i) {
      const link = elements.nth(i); // Selects the i-th element from the list.
      const isVisible = await link.isVisible(); // Checks if the element is visible.
      if (isVisible) {
        // Simulate pressing the Tab key to navigate to the next focusable element.
        await page.keyboard.press("Tab");

        // Evaluate code in the browser context to check the currently focused element.
        const elementInFocus = await page.evaluate(async (classesToCheck) => {
          // Capture the active (focused) element on the page.
          const activeElement = document.activeElement;
          let parent = activeElement?.parentElement;
          let parentNotContinue: boolean = false;

          // If classes to check are provided, execute the exclusion logic.
          if (classesToCheck) {
            // Validate that classesToCheck is an array of strings.
            if (!Array.isArray(classesToCheck)) {
              throw new TypeError("classesToCheck must be an array of strings");
            }
            if (classesToCheck.some((element) => typeof element !== "string")) {
              throw new TypeError(
                "All elements of classesToCheck must be strings"
              );
            }
            // Iterate through parent elements to check if any have the specified classes.
            while (parent) {
              const hasAnyClass = classesToCheck.some((className) =>
                parent?.classList.contains(className)
              );
              // If any parent has one of the classes, mark not to continue the test with this element.
              if (hasAnyClass) {
                parentNotContinue = true;
                break; // Exit the loop as a matching class has been found.
              }
              parent = parent.parentElement; // Move to the next parent element.
            }
          }

          // If the element is not excluded by class check, proceed.
          if (!parentNotContinue) {
            // Check if the active element is truly in focus.
            if (activeElement?.matches(":focus")) {
              // Collect and return attributes of the focused element.
              const attributesList = activeElement?.attributes;
              let elementAttributes: any = [];
              if (attributesList) {
                for (const attribute of attributesList) {
                  elementAttributes.push({
                    value: attribute.nodeValue,
                    name: attribute.nodeName,
                  });
                }
                return {
                  nodeName: activeElement?.nodeName,
                  classList: activeElement?.classList,
                  attributes: elementAttributes,
                };
              }
            }
          }
          return null; // Return null if none of the above conditions are met.
        }, classesToCheck);

        // Push the results of the focused element check into the results array.
        elementsResults.push(elementInFocus);
      }
    }
    // Assert that the results array is truthful, indicating that data was collected.
    expect(elementsResults).toBeTruthy();

    // Initialize a variable to count the number of elements that are not null in the results array.
    let countNotNull: number = 0;

    // Define an array with the names of attributes in the order they should appear in the Excel file.
    const expectedAttributes = [
      "href",
      "title",
      "target",
      "class",
      "rel",
      "aria-label",
      "data-index",
      "role",
      "tabindex",
    ];

    // Iterate through the results of elements that have been checked for focus state.
    for (const result of elementsResults) {
      if (result) {
        countNotNull++; // Increment the count for each non-null result.

        // Initialize an array with default values for each expected attribute.
        let attributeValues = new Array(expectedAttributes.length).fill("");

        // Fill the array with the values of the attributes found in the focused element.
        result.attributes.forEach((attr: { name: string; value: any }) => {
          const index = expectedAttributes.indexOf(attr.name);
          if (index !== -1) {
            attributeValues[index] = attr.value; // Assign the value to the correct position based on the attribute name.
          }
        });

        // Prepare the data to be added to the Excel file.
        const data = [
          url, // The URL of the page where the focused element was found.
          result.nodeName, // The tag name of the focused element.
          Object.values(result.classList).join(", "), // A comma-separated list of classes of the focused element.
          ...attributeValues, // Spread the attribute values into the data array.
        ];

        // Add the prepared data to the Excel file.
        await addToExcel(data, {
          filePath: filePath,
          sheetName: "Navigation Tab",
          columns: ["URL", "nodeName", "classList", ...expectedAttributes],
        });
      }
    }

    // Assert that there is at least one non-null result in the elementsResults array.
    expect(countNotNull).not.toEqual(0);
  } catch (error: unknown) {
    // Handle any errors that may occur during the execution of the test.
    if (error instanceof Error) {
      console.error(
        "Error while verifying keyboard Tab navigation:",
        error.message
      );
      // Optionally, add error details to an Excel file for further analysis.
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Error navigation keyboard Tab",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
    // Rethrow the error for further handling if necessary.
    throw error;
  }
};

// Make the function available to be imported and used in other files.
export default checkNavigationKeyboardTab;
