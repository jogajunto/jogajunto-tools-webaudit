import { addToExcel } from './addToExcel';

// Função para testar o PageSpeed
export async function pageSpeedTest(
	testUrl: string,
	testStrategy: string,
	browser: string,
	filePath: string
) {
	try {
		const response = await fetch(
			`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${testUrl}&strategy=${testStrategy}`
		);
		if (response.ok) {
			const json = await response.json();
			const pageSpeedScore =
				json.lighthouseResult.categories.performance.score * 100;

			// Coleta apenas as métricas específicas necessárias
			const metrics = json.lighthouseResult.audits;
			const fcp = metrics['first-contentful-paint'].displayValue;
			const lcp = metrics['largest-contentful-paint-element'].displayValue;
			const tti = metrics['interactive'].displayValue;
			const cls = metrics['cumulative-layout-shift'].displayValue;
			const tbw = metrics['total-byte-weight'].displayValue;
			const unusedJs = metrics['unused-javascript'].displayValue;

			await addToExcel(
				[
					testUrl,
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
					sheetName: 'PageSpeed Metrics',
					columns: [
						'URL',
						'Device',
						'Score',
						'FCP',
						'LCP',
						'TTI',
						'CLS',
						'Total Byte Weight',
						'Unused JS',
					],
				}
			);
		} else {
			console.error('HTTP-Error: ' + response.status);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error("An unknown error occurred");
		}
	}
}
