import { Page, expect } from '@playwright/test';

const buildLocalizedUrl = (base: string, lang: string) => {
	const langSegment = `/${lang}/`;
	if (base.includes(langSegment)) {
		return base; // Retorne a base URL se ela já contiver o segmento do idioma
	}
	const urlWithoutTrailingSlash = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${urlWithoutTrailingSlash}/${lang}/`;
};

const checkMetaTags = async (page: Page, url: string) => {
	await page.goto(url);

	const html = await page.$('html');
	const lang = await html?.getAttribute('lang');

	expect(lang).not.toBeNull();
	expect(lang).not.toEqual('');

	const selectors = [
		'meta[charset="UTF-8"]',
		'meta[name="viewport"][content="width=device-width, initial-scale=1"]',
		'title',
		`meta[property="og:url"][content="${url}"]`,
	];

	// Validade lang for current lang
	switch (lang) {
		case 'en-US':
			selectors.push(
				`link[hreflang="en"][href="${buildLocalizedUrl(url, 'en')}"]`
			);
			break;

		case 'pt-br':
			selectors.push(`link[hreflang="pt-br"][href="${url}"]`);
			break;

		case 'es-ES':
			selectors.push(
				`link[hreflang="es"][href="${buildLocalizedUrl(url, 'es')}"]`
			);
			break;

		default:
			break;
	}

	for (const selector of selectors) {
		const element = await page.$(selector);
		if (!element) {
			console.error(
				`A metatag "${selector}" não foi encontrada na URL: ${url}`
			);
			// Adicione sua lógica de reporte aqui, se necessário
		}
	}
};

export default checkMetaTags;
