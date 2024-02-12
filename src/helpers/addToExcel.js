// Required modules for file system operations, path manipulations, and Excel file manipulation.
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

/**
 * Adds data to an Excel file based on specified options. If the file or sheet does not exist,
 * it creates them. It also adjusts column widths based on the content.
 *
 * @param {Array} data - The data to be added to the Excel sheet.
 * @param {Object} options - Configuration options for the Excel file.
 * @async - Indicates the function can be used with asynchronous operations.
 */
export async function addToExcel(data, options) {
  // Destructures options with default values for filePath, sheetName, and columns.
  const {
    filePath = path.resolve(__dirname, "relatorio.xlsx"), // Default file path.
    sheetName = "Relatorio", // Default sheet name.
    columns = ["URL", "Imagens sem Alt"], // Default column names.
  } = options;

  try {
    let workbook;

    // Checks if the Excel file exists. If it does, reads it; otherwise, initializes a new workbook object.
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = { SheetNames: [], Sheets: {} };
    }

    // Attempts to retrieve the specified sheet from the workbook.
    let worksheet = workbook.Sheets[sheetName];

    // If the sheet does not exist, creates it and adds it to the workbook.
    if (!worksheet) {
      const aoa = [columns]; // Array of arrays, starting with column headers.
      worksheet = XLSX.utils.aoa_to_sheet(aoa); // Converts array of arrays to a worksheet.
      workbook.SheetNames.push(sheetName); // Adds the new sheet name to the workbook's list of sheets.
      workbook.Sheets[sheetName] = worksheet; // Assigns the new sheet to the workbook.
    }

    // Adds the data to the worksheet at the next available row, applying cell styles.
    XLSX.utils.sheet_add_aoa(worksheet, [data], {
      origin: -1,
      cellStyles: true,
    });

    // Adjusts the column widths for all sheets in the workbook based on their content.
    adjustAllSheetsColumnWidths(workbook, columns);

    // Writes the workbook to the file, preserving cell styles.
    XLSX.writeFile(workbook, filePath, { cellStyles: true });
  } catch (error) {
    // Logs an error message if an exception occurs during the process.
    console.error("Error adding to Excel:", error);
  }
}

/**
 * Adjusts the widths of columns in a worksheet based on the maximum length of data in each column.
 *
 * @param {Object} worksheet - The worksheet object to adjust.
 * @param {Array} columns - An array of column names to consider.
 * @param {Array} data - The data used to determine the width of each column.
 */
function adjustColumnWidths(worksheet, columns, data) {
  // Initializes an array to hold the maximum width of each column, starting with the length of the column names.
  let maxWidths = columns.map((col) => col.length);

  // Iterates over the data to find the maximum length of content in each column.
  data.forEach((row) => {
    row.forEach((cell, index) => {
      const cellLength = cell.toString().length;
      if (index < maxWidths.length && cellLength > maxWidths[index]) {
        maxWidths[index] = cellLength;
      }
    });
  });

  // Sets the column widths in the worksheet, adding a small margin to the calculated max width.
  worksheet["!cols"] = maxWidths.map((width) => ({ wch: width + 2 }));
}

/**
 * Iterates over all sheets in a workbook to adjust their column widths based on content.
 *
 * @param {Object} workbook - The workbook containing the sheets to adjust.
 * @param {Array} columns - The column names to be used for width adjustment.
 */
function adjustAllSheetsColumnWidths(workbook, columns) {
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: true,
    });
    adjustColumnWidths(worksheet, columns, data);
  });
}
