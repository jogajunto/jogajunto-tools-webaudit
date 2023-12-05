import { Nodehun } from 'nodehun';
import fs from 'fs';

/**
 * Verifica a ortografia das palavras em um texto.
 *
 * @param {string} text - O texto a ser verificado.
 * @param {string} language - A linguagem do dicionário a ser utilizado (ex: 'pt-BR', 'en', 'es').
 * @param {Array<string>} [ignoreWords] - Uma lista opcional de palavras para serem ignoradas na verificação.
 *
 * @returns {Promise<Array<string>>} Uma promessa que resolve em uma lista de palavras mal escritas.
 */
async function checkSpelling(
	text: string,
	language: string,
	ignoreWords?: Array<string>
): Promise<Array<string>> {
	// Preparação do dicionario
	const affixBuffer = fs.readFileSync(`./tests/dictionaries/${language}.aff`);
	const dictionaryBuffer = fs.readFileSync(
		`./tests/dictionaries/${language}.dic`
	);
	const nodehun = new Nodehun(affixBuffer, dictionaryBuffer);

	// Remove a pontuação e converte o texto para minúsculas
	const cleanText = text
		.replace(/[.,\/#!$%\^&\*;\®:{}=\`\´\¿\¡\?\|\–\~\©()]/g, '')
		.toLowerCase();

	// Separa o texto em palavras
	const words = cleanText.split(/\s+/);

	const misspelledWords: Array<string> = [];

	for (const word of words) {
		if (ignoreWords?.includes(word.toLowerCase())) {
			continue; // Ignora a palavra se estiver na lista ignoreWords
		}
		const correct = await nodehun.spell(word);
		if (!correct) misspelledWords.push(word);
	}

	return misspelledWords;
}

export default checkSpelling;
