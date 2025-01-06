import * as pdfjsLib from 'pdfjs-dist';
import { PROMPT_BASE, PROMPT_CV, PROMPT_DESCRIPTION, PROMPT_WORD_SIZE } from './constants';
import { CoverPromptType } from '@/contracts/CoverPromptType';

pdfjsLib.GlobalWorkerOptions.workerSrc =
	'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.mjs';

export async function extractTextFromPDF(file) {
	const pdf = await pdfjsLib.getDocument(file).promise;
	let text = '';

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const content = await page.getTextContent();
		const pageText = content.items.map((item) => item?.str as string).join(' ');
		text += pageText + '\n';
	}

	return text;
}

export async function sendToChatCv(prompt: string) {
	const response = await fetch('http://localhost:3000/api/chatcv', {
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
	});

	const result = await response.json();
	return result.choices[0].message.content;
}

export const getPrompt = ({ cv, description, maxWords = 80 }: CoverPromptType) => {
	return PROMPT_BASE.replace(PROMPT_CV, cv)
		.replace(PROMPT_DESCRIPTION, description)
		.replace(PROMPT_WORD_SIZE, maxWords.toString());
};
