import { addToExcel } from "./addToExcel";

/**
 * Performs a PageSpeed test on a given URL and logs the results.
 * @param url - The URL of the page to test.
 * @param testStrategy - The strategy to use for the PageSpeed test (e.g., 'mobile', 'desktop').
 * @param filePath - The file path where the Excel report will be saved.
 * @async
 */
export async function pageSpeedTest(
  url: string,
  testStrategy: string,
  filePath: string
) {
  try {
    // Fetches the PageSpeed Insights data from the Google API.
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${testStrategy}`
    );
    if (response.ok) {
      // Processes the response data if the request was successful.
      const json = await response.json();
      const pageSpeedScore =
        json.lighthouseResult.categories.performance.score * 100;

      // Extracts specific metrics from the PageSpeed results.
      const metrics = json.lighthouseResult.audits;
      const fcp = metrics["first-contentful-paint"].displayValue;
      const lcp = metrics["largest-contentful-paint-element"].displayValue;
      const tti = metrics["interactive"].displayValue;
      const cls = metrics["cumulative-layout-shift"].displayValue;
      const tbw = metrics["total-byte-weight"].displayValue;
      const unusedJs = metrics["unused-javascript"].displayValue;

      // Saves the extracted metrics to an Excel file.
      await addToExcel(
        [
          url,
          testStrategy,
          pageSpeedScore.toString(),
          fcp,
          lcp,
          tti,
          cls,
          tbw,
          unusedJs,
        ],
        {
          filePath: filePath,
          sheetName: "PageSpeed Metrics",
          columns: [
            "URL",
            "Device",
            "Score",
            "FCP",
            "LCP",
            "TTI",
            "CLS",
            "Total Byte Weight",
            "Unused JS",
          ],
        }
      );
    } else {
      // Logs an error message if the HTTP request failed.
      console.error("HTTP-Error: " + response.status);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      await addToExcel([url, error.message], {
        filePath: filePath,
        sheetName: "PageSpeed Metrics Error",
        columns: ["URL", "Error"],
      });
    } else {
      console.error("An unknown error occurred");
    }
  }
}
