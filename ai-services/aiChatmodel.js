import { OpenAI } from "openai";


export default async function getLlamaResponse(systemPrompt,prompt) {
    const client = new OpenAI({
        baseURL: 'http://localhost:11434/v1',
        //apiKey: "ollama"
        });

    const completion = await client.chat.completions.create({
        model: "llama3.2:1b",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    return completion.choices[0].message.content;
}
