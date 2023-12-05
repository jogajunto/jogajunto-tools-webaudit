const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

export async function addToExcel(data, options) {
    const {
        filePath = path.resolve(__dirname, 'relatorio.xlsx'), // Caminho do arquivo
        sheetName = 'Relatorio', // Nome da planilha
        columns = ['URL', 'Imagens sem Alt'] // Colunas
    } = options;

    // console.log('Adicionando ao Excel', data);

    try {
        let workbook;

        if (fs.existsSync(filePath)) {
            workbook = XLSX.readFile(filePath);
        } else {
            workbook = { SheetNames: [], Sheets: {} };
        }

        let worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            const aoa = [columns];
            worksheet = XLSX.utils.aoa_to_sheet(aoa);
            workbook.SheetNames.push(sheetName);
            workbook.Sheets[sheetName] = worksheet;
        }

        XLSX.utils.sheet_add_aoa(worksheet, [data], { origin: -1 });
        XLSX.writeFile(workbook, filePath);
        // console.log("Linha adicionada: ", data);  // Log adicional
    } catch (error) {
        console.error('Erro ao adicionar ao Excel:', error);
    }
}