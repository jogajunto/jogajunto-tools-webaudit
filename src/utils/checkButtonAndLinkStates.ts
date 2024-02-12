// Necessary Playwright imports for browser automation and assertions.
import { Page, expect } from "@playwright/test";
// Auxiliary function to add results to an Excel file, similar to the previous example.
import { addToExcel } from "../helpers/addToExcel";
import { ElementInteractionStyles } from "./types";

/**
 * Function to check hover, focus, and active states of all buttons and links on a web page.
 * It navigates to the specified URL, checks each interactive element for the specified states,
 * and stores the styles of these states for each element. Results are then added to an Excel file.
 *
 * @param {Page} page - An instance of Playwright's Page class representing a browser page.
 * @param {string} url - The URL of the page to be tested.
 * @param {string} filePath - The path to the Excel file where data will be stored.
 * @param {string} linksSearchSelectorCSS - The CSS selector used to find the buttons and links on the page.
 * @returns {Promise<void>} - A promise that resolves once the checking is complete and the data has been added to Excel.
 */
const checkButtonLinkStates = async (
  page: Page,
  url: string,
  filePath: string,
  linksSearchSelectorCSS: string
): Promise<void> => {
  try {
    // Navigate to the specified URL.
    await page.goto(url);

    // Selects all buttons and links on the page using the provided CSS selector.
    const elements = page.locator(linksSearchSelectorCSS);
    // Counts the number of elements matching the selector.
    const count = await elements.count();
    // Initializes an object to store the interaction styles for hover, focus, and active states.
    let interactionStyles: ElementInteractionStyles = {
      hover: [],
      focus: [],
      active: [],
    };

    // Iterates over each element to check its style states.
    for (let i = 0; i < count; ++i) {
      const link = elements.nth(i); // Retrieves the i-th link.
      const isVisible = await link.isVisible();
      // Proceeds only if the element is visible.
      if (isVisible) {
        // Focus and hover on the element to trigger style changes.
        await link.focus();
        await link.hover();
        // Evaluate styles in the page context for the :focus state.
        const interactions = await page.evaluate(async () => {
          let returned: any = {
            hover: [],
            focus: [],
          };

          // Access the active element, which is the one currently focused or hovered over.
          const activeElement = document.activeElement;
          // Check if the active element is indeed focused, and capture its computed styles.
          if (activeElement?.matches(":focus")) {
            const interactionStyle = getComputedStyle(activeElement);
            // Push the captured styles for the focus state to the returned object.
            returned.focus.push({
              backgroundColor: interactionStyle.backgroundColor,
              color: interactionStyle.color,
              outerHTML: activeElement.outerHTML,
            });
          }
          // Repeat the process for the hover state.
          if (activeElement?.matches(":hover")) {
            const interactionStyle = getComputedStyle(activeElement);
            returned.hover.push({
              backgroundColor: interactionStyle.backgroundColor,
              color: interactionStyle.color,
              outerHTML: activeElement.outerHTML,
            });
          }
          // Return the object containing the styles for both states.
          return returned;
        });

        // Assert that the styles object is not empty, indicating that styles were captured.
        expect(interactions.hover).toBeTruthy();
        // For each hover interaction, assert that the necessary style properties are present.
        for (const interactionHover of interactions.hover) {
          expect(interactionHover.backgroundColor).toBeTruthy();
          expect(interactionHover.color).toBeTruthy();
          expect(interactionHover.outerHTML).toBeTruthy();
        }

        // Perform similar assertions for the focus interactions.
        expect(interactions.focus).toBeTruthy();
        for (const interactionFocus of interactions.focus) {
          expect(interactionFocus.backgroundColor).toBeTruthy();
          expect(interactionFocus.color).toBeTruthy();
          expect(interactionFocus.outerHTML).toBeTruthy();
        }

        // Accumulate the hover and focus styles in the interactionStyles object.
        interactionStyles.hover.push(...interactions.hover);
        interactionStyles.focus.push(...interactions.focus);
      }
    }

    // Evaluate the active state for all elements that match the CSS selector.
    const interactionActive: any = await page.evaluate(
      async (linksSearchSelectorCSS) => {
        let returned: any = [];
        // Prevent the default action to ensure the 'mousedown' event can be captured.
        document
          .querySelector(linksSearchSelectorCSS)
          ?.addEventListener("mousedown", (event) => {
            event.preventDefault();
          });
        // Dispatch the 'mousedown' event on all matching elements to simulate an active state.
        const elements: any = document.querySelectorAll(linksSearchSelectorCSS);
        for (const el of elements) {
          el?.dispatchEvent(
            new MouseEvent("mousedown", { bubbles: true, cancelable: true })
          );
          // Capture the computed styles after the event and push them to the returned array.
          const style = getComputedStyle(el);
          returned.push({
            backgroundColor: style.backgroundColor,
            color: style.color,
            outerHTML: el.outerHTML,
          });
        }
        // Return the array containing the styles for the active state.
        return returned;
      },
      linksSearchSelectorCSS
    );

    // Assert that the active interactions array is not null, implying that data was captured.
    expect(interactionActive).not.toBeNull();
    // Assert that each active interaction has the expected style properties.
    for (const active of interactionActive) {
      expect(active.backgroundColor).toBeTruthy();
      expect(active.color).toBeTruthy();
      expect(active.outerHTML).toBeTruthy();
    }

    // Accumulate the active styles in the interactionStyles object.
    interactionStyles.active.push(...interactionActive);

    // Generate an Excel sheet with the captured interaction styles.
    await generateSheet(interactionStyles, url, filePath);
  } catch (error: unknown) {
    // Error handling: log the error and save it to the Excel file for debugging purposes.
    if (error instanceof Error) {
      console.error("Error when checking element states:", error.message);
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Buttons,Links states Error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
    // Rethrow the error for further handling.
    throw error;
  }
};

/**
 * Generates an Excel sheet with the captured interaction styles for buttons and links.
 *
 * @param {ElementInteractionStyles} interactionStyles - The collected styles for hover, focus, and active states.
 * @param {string} url - The URL of the page where the interactions were checked.
 * @param {string} filePath - The path to the Excel file where the data will be stored.
 * @returns {Promise<void>} - A promise that resolves when the Excel sheet has been generated.
 */
const generateSheet = async (
  interactionStyles: ElementInteractionStyles,
  url: string,
  filePath: string
): Promise<void> => {
  // Loop through the hover interaction styles and add them to the Excel sheet.
  for (const interactionHover of interactionStyles.hover) {
    await addToExcel(
      [
        url, // URL of the page where the interaction was observed.
        "Hover", // Type of interaction.
        interactionHover?.backgroundColor, // Background color during the hover state.
        interactionHover?.color, // Text color during the hover state.
        interactionHover?.outerHTML, // HTML of the element during the hover state.
      ],
      {
        filePath: filePath,
        sheetName: "Buttons, Links states",
        columns: [
          "URL",
          "Interaction",
          "Background Color",
          "Text Color",
          "HTML",
        ],
      }
    );
  }

  // Repeat the process for focus interaction styles.
  for (const interactionFocus of interactionStyles.focus) {
    await addToExcel(
      [
        url, // URL of the page where the interaction was observed.
        "Focus", // Type of interaction.
        interactionFocus?.backgroundColor, // Background color during the focus state.
        interactionFocus?.color, // Text color during the focus state.
        interactionFocus?.outerHTML, // HTML of the element during the focus state.
      ],
      {
        filePath: filePath,
        sheetName: "Buttons, Links states",
        columns: [
          "URL",
          "Interaction",
          "Background Color",
          "Text Color",
          "HTML",
        ],
      }
    );
  }

  // Repeat the process for active interaction styles.
  for (const interactionActive of interactionStyles.active) {
    await addToExcel(
      [
        url, // URL of the page where the interaction was observed.
        "Active", // Type of interaction.
        interactionActive?.backgroundColor, // Background color during the active state.
        interactionActive?.color, // Text color during the active state.
        interactionActive?.outerHTML, // HTML of the element during the active state.
      ],
      {
        filePath: filePath,
        sheetName: "Buttons, Links states",
        columns: [
          "URL",
          "Interaction",
          "Background Color",
          "Text Color",
          "HTML",
        ],
      }
    );
  }
};

// Exports the checkButtonLinkStates function as the default export of this module.
// This makes it available for import and use in other parts of the application.
export default checkButtonLinkStates;
