import OpenAI from 'openai';

export async function POST(req: Request) {
	const { messages } = await req.json();
	const client = new OpenAI({
		apiKey: process.env['OPENAI_API_KEY'],
	});

	const chatCompletion = await client.chat.completions.create({
		messages,
		model: 'gpt-4o',
		max_tokens: 1000,
	});

	return Response.json(chatCompletion);
}
