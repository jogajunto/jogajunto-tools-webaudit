/**
 * Adds data to an Excel file based on specified options. If the file or sheet does not exist,
 * it creates them. It also adjusts column widths based on the content.
 *
 * @param {Array} data - The data to be added to the Excel sheet.
 * @param {Object} options - Configuration options for the Excel file.
 * @async - Indicates the function can be used with asynchronous operations.
 */
export function addToExcel(data: any, options: any): Promise<void>;
