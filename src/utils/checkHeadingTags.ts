import { Page, expect } from "@playwright/test";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Creates a tree structure from a list of headers to represent the hierarchy of headers on a web page.
 *
 * @param {Array} headers - An array of objects containing information about the headers captured from the page.
 *
 * Each object should have the form:
 * {
 *   tag: string; // The header tag, for example, 'h2'
 *   text: string; // The text contained within the header
 * }
 *
 * @returns {Array} A tree structure where each node represents an H1 header and its associated subheaders (H2, H3, etc.).
 *
 * The returned tree has the form:
 * [
 *   {
 *     header: string; // The text of the H1 header
 *     subHeaders: Array; // An array of associated subheaders
 *   },
 *   // ... other H1 header nodes
 * ]
 *
 * Each subheader has the form:
 * {
 *   level: number; // The level of the header, for example, 2 for 'h2'
 *   text: string; // The text of the subheader
 * }
 */
const createHeaderTree = (headers: any[]) => {
  const tree: any = [];
  let currentBranch: any = null;

  headers.forEach((header) => {
    const level = parseInt(header.tag.substring(1)); // Converts 'h2' to 2

    if (level === 1) {
      // Starts a new branch for H1
      currentBranch = { header: header.text, subHeaders: [] };
      tree.push(currentBranch);
    } else {
      // Adds to the subheader of the current branch
      currentBranch &&
        currentBranch.subHeaders.push({ level: level, text: header.text });
    }
  });

  return tree;
};

/**
 * Formats a header tree structure into a format suitable for adding to an Excel spreadsheet.
 *
 * @param {Array} tree - The header tree structure created by the `createHeaderTree` function.
 * @param {string} url - The URL of the page from which the headers were extracted.
 *
 * @returns {Array} An array of rows where each row represents a header or subheader and its respective URL.
 *
 * Each row has the form:
 * [string, string] // Where the first element is the URL and the second is the header text with the prefix indicating the level (H1, H2, etc.).
 *
 * Subheaders are indented in the second column to visually reflect the hierarchy in Excel.
 */
const formatForExcel = (tree: any[], url: string) => {
  const rows: any = [];

  tree.forEach((branch) => {
    // Adds the H1 header
    rows.push([url, `H1: ${branch.header}`]); // Assuming 'URL' is a necessary column
    branch.subHeaders.forEach((subHeader: { level: number; text: any }) => {
      // Adds subheaders with indentation
      let indentation: any = " ".repeat((subHeader.level - 2) * 4);
      rows.push([
        url,
        `${" ".repeat(indentation)}H${subHeader.level}: ${subHeader.text}`,
      ]);
    });
  });

  return rows;
};

/**
 * Collects all headers (H1, H2, H3, H4, H5) from a page using Playwright.
 *
 * @param {Page} page - The Playwright page instance on which the collection should occur.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of objects containing information about the found headers.
 *
 * Each object in the array has the form:
 * {
 *   tag: string; // The header tag in lowercase, for example, 'h2'
 *   text: string; // The text contained within the header
 * }
 *
 * The function uses the `$$eval` method of Playwright to execute the collection in the page context.
 */
const collectHeadingTags = async (page: Page) => {
  // Collects all header tags
  const headers = await page.$$eval("h1, h2, h3, h4, h5", (elements: any[]) =>
    elements.map((el: { tagName: string; innerText: any }) => ({
      tag: el.tagName.toLowerCase(),
      text: el.innerText,
    }))
  );
  return headers;
};

/**
 * Checks the webpage for the correct usage of H1 header tags and records the findings.
 *
 * @param {Page} page - The Playwright Page object to interact with the web page.
 * @param {string} url - The URL of the web page where the header tags will be checked.
 * @param {string} filePath - The file path where the Excel report will be saved.
 *
 * @returns {Promise<void>} A promise that resolves to void upon completion of the function.
 */
const checkHeadingTags = async (
  page: Page,
  url: string,
  filePath: string
): Promise<void> => {
  try {
    await page.goto(url); // Navigates to the specified URL.

    // Selects all H1 header elements on the page.
    const header = await page.$$("h1");

    // Checks if H1 headers are present and processes them.
    if (header && header.length > 0) {
      const headerText = await header[0]?.innerText();

      const headers = await collectHeadingTags(page);
      const headerTree = createHeaderTree(headers);
      const excelData = formatForExcel(headerTree, url);

      if (header.length == 1) {
        for (const row of excelData) {
          await addToExcel(row, {
            filePath: filePath,
            sheetName: "Heading Tags",
            columns: ["URL", "Content"],
          });
        }

        // Asserts that the header text is not null or empty.
        expect(headerText).not.toBeNull();
        expect(headerText).not.toBe("");
      } else {
        // Records to the Excel spreadsheet if more than one H1 header is found.
        await addToExcel([url, "Page has more than one title"], {
          filePath: filePath,
          sheetName: "Heading Tags",
          columns: ["URL", "Content"],
        });

        // Asserts that there should only be one H1 header.
        expect(header).toHaveLength(1);
      }
    } else {
      // Asserts that at least one H1 header is present.
      expect(header).toBeTruthy();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Heading Tags Errors",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred"); // Logs a generic error message for unknown errors.
    }
    throw error;
  }
};

export default checkHeadingTags;
