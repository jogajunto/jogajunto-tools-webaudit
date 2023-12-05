export const toSlug = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_') // substitui qualquer caractere que não seja alfanumérico por um hífen
		.replace(/^-+/, '') // remove hifens do início da string
		.replace(/-+$/, ''); // remove hifens do final da string
};
