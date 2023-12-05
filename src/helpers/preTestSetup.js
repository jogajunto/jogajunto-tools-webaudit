const path = require('path');
const fs = require('fs');

const directory = process.argv[2]; // Pega o diretório do argumento da linha de comando
const filePattern = process.argv[3]; // Pega o padrão do arquivo do argumento da linha de comando

if (!directory) {
	console.error('Por favor, forneça o diretório como um argumento.');
	process.exit(1);
}

if (!filePattern) {
	console.error('Por favor, forneça o padrão do arquivo como um argumento.');
	process.exit(1);
}

fs.readdir(directory, (err, files) => {
	if (err) {
		console.error('Erro ao ler o diretório:', err);
		process.exit(1);
	}

	const matchedFiles = files.filter(
		(file) => file.includes(filePattern) || path.extname(file) === filePattern
	);

	if (matchedFiles.length === 0) {
		console.log('Nenhum arquivo encontrado com o padrão fornecido.');
		process.exit(0);
	}

	matchedFiles.forEach((file) => {
		const filePath = path.join(directory, file);
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error('Erro ao remover o arquivo:', err);
			} else {
				console.log('Arquivo removido:', filePath);
			}
		});
	});
});
