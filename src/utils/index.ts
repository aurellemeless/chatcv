import * as pdfjsLib from 'pdfjs-dist';
import {
	CHATCV_BASE_URL,
	CHATCV_STORAGE_KEY,
	PROMPT_BASE,
	PROMPT_CV,
	PROMPT_DESCRIPTION,
	PROMPT_WORD_SIZE,
} from './constants';
import { CoverPromptType } from '@/contracts/CoverPromptType';
import { CoverState } from '@/app/store';
import { DocumentInitParameters, TextItem, TypedArray } from 'pdfjs-dist/types/src/display/api';

pdfjsLib.GlobalWorkerOptions.workerSrc =
	'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.mjs';
export type FileType = string | string | URL | TypedArray | ArrayBuffer | DocumentInitParameters;

export async function extractTextFromPDF(file: FileType) {
	const pdf = await pdfjsLib.getDocument(file).promise;
	let text = '';

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const content = await page.getTextContent();
		const pageText = content.items.map((item) => (item as TextItem)?.str as string).join(' ');
		text += pageText + '\n';
	}

	return text;
}

export function callApi(route: string = 'cover', prompt: string, action: (arg: string) => void) {
	return fetch(CHATCV_BASE_URL + route, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
		}),
	})
		.then(async (res) => {
			const content = (await res.json())?.choices[0].message.content;
			action(content);
		})
		.catch((e) => {
			console.error(e);
		});
}

export const getPrompt = ({
	cv,
	description,
	maxWords = 80,
	promptBase = PROMPT_BASE,
}: CoverPromptType) => {
	return promptBase
		.replace(PROMPT_CV, cv)
		.replace(PROMPT_DESCRIPTION, description)
		.replace(PROMPT_WORD_SIZE, maxWords.toString());
};
export const storeData = (data: CoverState) => {
	if (global?.window && global?.window?.localStorage) {
		localStorage.setItem(CHATCV_STORAGE_KEY, JSON.stringify(data));
	}
};
export const getData = () =>
	global?.window && global?.window?.localStorage
		? JSON.parse(localStorage.getItem(CHATCV_STORAGE_KEY) || '{}')
		: null;
