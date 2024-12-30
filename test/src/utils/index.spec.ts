import { extractTextFromPDF, getPrompt, sendToOpenAI } from '@/utils';

jest.mock('pdfjs-dist', () => {
	const getTextContent = jest.fn(() =>
		Promise.resolve({
			items: [{ str: "j'aime" }, { str: 'vraiment' }, { str: 'Paris' }],
		})
	);

	return {
		GlobalWorkerOptions: { workerSrc: null },
		getDocument: () => ({
			promise: Promise.resolve({
				numPages: 1,
				getPage: jest.fn(() =>
					Promise.resolve({
						getTextContent,
					})
				),
			}),
		}),
	};
});
describe('utils', () => {
	describe('extractTextFromPDF', () => {
		it('should return file content as test', async () => {
			const res = await extractTextFromPDF('dupont');
			expect(res).toBe("j'aime vraiment Paris\n");
		});
	});

	describe('sendToOpenAI', () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ choices: [{ message: { content: 'response_from_open_ai' } }] }),
			})
		) as jest.Mock;
		it('should return response from api', async () => {
			const res = await sendToOpenAI('my cv content');
			expect(res).toBe('response_from_open_ai');
			expect(global.fetch).toHaveBeenCalled();
		});
	});
	describe('getPrompt', () => {
		it('should return prompt with replaced values', async () => {
			const res = await getPrompt('my cv content', 'https://whatever.io', 100);
			const expected = `Je suis à la recherche d'un emploi voici mon cv resumé en text : my cv content . 
je veux candidater à cette offre : https://whatever.io
propose une lettre de motivation qui me met en valeur pour le poste demandé en 100 mots`;

			expect(res).toBe(expected);
		});
	});
});
