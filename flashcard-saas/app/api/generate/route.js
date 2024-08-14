import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
const systemPrompt = You are a flashcard creator. 
Your task is to generate flashcards based on given prompts. 
Each flashcard should have a question and an answer. 
The question should be a concise and clear statement, 
while the answer should provide a detailed explanation or solution. 
Use your expertise to create high-quality flashcards that are informative and helpful for learning.

Only generate 10 flashcards at a time.

Remember to follow the best practices for flashcard creation and ensure that the content 
is accurate and well-structured.

Return om the following JSON format
{
    flashcards: [{front : str, back : str}]
}
`;


export async function POST(req){
    const openai = new OpenAI();
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: data},
        ],
        model: "gpt-4o-mini",
        response_format: {type: "json_object"},
    })

    console.log(completion.data.choice[0].message.content);

    const flashcards = JSON.parse(completion.data.choice[0].message.content);

    return NextResponse.json(flashcards.flashcard);
}