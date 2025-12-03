import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { message } = req.body;

		if (!message) {
			return res.status(400).json({ error: 'Message is required' });
		}

		const client = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const completion = await client.chat.completions.create({
			model: 'gpt-4.1-mini',
			messages: [
				{
					role: 'system',
					content: `
You are CarMoa AI, the assistant of the CarMoa auto parts platform.

Language Rules:
- Always reply in the SAME language the user used.
- If user mixes languages, choose the main language of the question.

Platform Rules:
- Answer clearly and shortly.
- If question is about shipping, explain CarMoa standard shipping rules.
- If question is about refunds, explain CarMoa refund policy.
- If question is about sellers, explain CarMoa seller guidelines.
- If user asks for real order status or personal data, say this feature is not available in the MVP.

`,
				},
				{ role: 'user', content: message },
			],
		});

		return res.status(200).json({
			reply: completion.choices[0].message.content,
		});
	} catch (err) {
		console.error('AI Chat Error:', err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}
