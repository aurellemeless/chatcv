import { callApi, extractTextFromPDF, getData, getPrompt, storeData } from '@/utils';
import { CHATCV_STORAGE_KEY, PROMPT_MATCH_BASE } from '@/utils/constants';

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

	describe('callApi', () => {
		beforeEach(() => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						choices: [{ message: 'resolved_fetch' }],
					}),
			});
		});
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should return response from api', async () => {
			const mockAction = jest.fn();
			await callApi('route', 'my cv content', mockAction);
			expect(global.fetch).toHaveBeenCalled();
			expect(mockAction).toHaveBeenCalled();
		});
		it('should return response from api', async () => {
			const mockConsole = jest.spyOn(global.console, 'error');
			global.fetch = jest.fn().mockRejectedValue({
				err: 'err',
			});
			const mockAction = jest.fn();
			await callApi('route', 'my cv content', mockAction);
			expect(global.fetch).toHaveBeenCalled();
			expect(mockConsole).toHaveBeenCalled();
		});
	});
	describe('getPrompt', () => {
		it('should return prompt with replaced values of PROMPT_BASE as default', async () => {
			const res = await getPrompt({
				cv: 'my cv content',
				description: 'https://whatever.io',
				maxWords: 100,
			});
			const expected = `Je suis à la recherche d'un emploi voici mon cv resumé en text : my cv content . 
je veux candidater à cette offre : https://whatever.io
propose une lettre de motivation qui me met en valeur pour le poste demandé en 100 mots`;

			expect(res).toBe(expected);
		});

		it('should return prompt with replaced values', async () => {
			const res = await getPrompt({
				cv: 'my cv content',
				description: 'https://whatever.io',
				maxWords: 100,
				promptBase: PROMPT_MATCH_BASE,
			});
			const expected = `Je suis à la recherche d'un emploi voici mon cv resumé en text : my cv content . 
je veux candidater à cette offre : https://whatever.io quels sont les points faibles de mon cv sous forme de tirets en 100 mots,
 ensuite exprime en pourcentage le match avec cette offre`;

			expect(res).toBe(expected);
		});
	});

	describe('storeData', () => {
		it('should set data to localStorage', () => {
			jest.spyOn(Storage.prototype, 'setItem');
			Storage.prototype.setItem = jest.fn();
			const data = { content: 'content', match: 'match' };
			const expected = JSON.stringify(data);
			storeData(data);
			expect(localStorage.setItem).toHaveBeenCalledWith(CHATCV_STORAGE_KEY, expected);
		});
	});

	describe('getData', () => {
		it('should return stored data from localStorage', () => {
			jest.spyOn(Storage.prototype, 'getItem');
			const data = { content: 'content', match: 'match' };
			Storage.prototype.getItem = jest.fn(() => JSON.stringify(data));
			expect(getData()).toEqual(data);
			expect(localStorage.getItem).toHaveBeenCalledWith(CHATCV_STORAGE_KEY);
		});
		it('should return {} on empty localStorage', () => {
			jest.spyOn(Storage.prototype, 'getItem');
			const data = {};
			Storage.prototype.getItem = jest.fn(() => JSON.stringify(data));
			expect(getData()).toEqual(data);
			expect(localStorage.getItem).toHaveBeenCalledWith(CHATCV_STORAGE_KEY);
		});

		it('should return null on undefined localStorage', () => {
			jest.spyOn(Storage.prototype, 'getItem');
			Object.defineProperty(global, 'window', {
				value: {},
				writable: true,
			});
			const data = null;
			Storage.prototype.getItem = jest.fn(() => JSON.stringify(data));
			expect(getData()).toEqual(data);
			expect(localStorage.getItem).not.toHaveBeenCalled();
		});
	});
});
