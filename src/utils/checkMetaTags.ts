import { Page, expect } from "@playwright/test";
import { MetaTags } from "./types";
import { addToExcel } from "../helpers/addToExcel";

/**
 * Builds a localized URL by appending a language segment to the base URL.
 * @param base - The base URL to localize.
 * @param lang - The language code to append.
 * @returns The localized URL. If the base URL already contains the language segment, it returns the base URL.
 */
const buildLocalizedUrl = (base: string, lang: string) => {
  const langSegment = `/${lang}/`;
  if (base.includes(langSegment)) {
    return base; // Return the base URL if it already contains the language segment
  }
  const urlWithoutTrailingSlash = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${urlWithoutTrailingSlash}/${lang}/`;
};

/**
 * Checks and validates meta tags for translation on a given page.
 * @param page - The Playwright Page object representing the page to check.
 * @param url - The URL of the page to validate.
 * @async
 */
const checkTranslateMetaTags = async (page: Page, url: string) => {
  const html = await page.$("html");
  const lang = await html?.getAttribute("lang");

  expect(lang).not.toBeNull();
  expect(lang).not.toEqual("");

  const selectors = [
    'meta[charset="UTF-8"]',
    'meta[name="viewport"][content="width=device-width, initial-scale=1"]',
    "title",
    `meta[property="og:url"][content="${url}"]`,
  ];

  // Validate lang for current lang
  switch (lang) {
    case "en-US":
      selectors.push(
        `link[hreflang="en"][href="${buildLocalizedUrl(url, "en")}"]`
      );
      break;

    case "pt-br":
      selectors.push(`link[hreflang="pt-br"][href="${url}"]`);
      break;

    case "es-ES":
      selectors.push(
        `link[hreflang="es"][href="${buildLocalizedUrl(url, "es")}"]`
      );
      break;

    default:
      break;
  }

  for (const selector of selectors) {
    const element = await page.$(selector);
    if (!element) {
      expect(element).toBeTruthy();
    }
  }
};

/**
 * Main function to check and validate meta tags on a webpage.
 * @param page - The Playwright Page object representing the page to check.
 * @param url - The URL of the page to validate.
 * @param filePath - The file path where the Excel report will be saved.
 * @param additionalMetaTags - Additional meta tags to be checked, defined in 'MetaTags' type.
 * @param translation - A boolean indicating if translation checks are needed.
 * @async
 */
const checkMetaTags = async (
  page: Page,
  url: string,
  filePath: string,
  additionalMetaTags?: MetaTags,
  translation: boolean = false
) => {
  try {
    await page.goto(url);

    if (translation) {
      await checkTranslateMetaTags(page, url);
    }

    const title = await page.title();

    // Expect for a title to exist
    expect(title).not.toBeNull();

    // Map all important meta tags
    const metaTags = {
      Description: await page.$('meta[name="description"]'),
      Robots: await page.$('meta[name="robots"]'),
      Viewport: await page.$('meta[name="viewport"]'),
      Title: await page.$("title"),
      ...(additionalMetaTags ?? {}), // Spread syntax to include additionalMetaTags if they exist
    };

    const missingTags: any = [];
    const tagContents: any = {};

    for (const [tag, element] of Object.entries(metaTags)) {
      if (element) {
        const content = await element.getAttribute("content");
        if (tag === "Description") {
          // Checks if the description tag has less than 160 characters
          expect(content?.length).toBeLessThan(160);

          // Make sure the description is a minimum length
          expect(content?.length).toBeGreaterThan(15);
        }
        // Title is validated in initial test
        if (tag !== "Title") {
          expect(content).not.toBeNull();
          tagContents[tag] = content;
        } else {
          tagContents[tag] = await element.textContent();
        }
      } else {
        missingTags.push(tag);
      }
    }

    // Add the missing tags to the Excel spreadsheet
    if (missingTags.length > 0) {
      await addToExcel([url, ...missingTags], {
        filePath: filePath,
        sheetName: "Meta tags Missing",
        columns: ["URL", ...missingTags.map(() => "Missing Tag")],
      });
    }

    // Get keys to add in header columns
    const keysToExcel = Object.keys(tagContents).filter(
      (item) => item !== null
    );
    // Get values to add in content rows
    const valuesToExcel = Object.values(tagContents).filter(
      (item) => item !== null
    );

    // Add the results to the Excel spreadsheet
    await addToExcel([url, ...valuesToExcel], {
      filePath: filePath,
      sheetName: "Meta tags Found",
      columns: ["URL", ...keysToExcel],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "Meta tags error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};

export default checkMetaTags;
