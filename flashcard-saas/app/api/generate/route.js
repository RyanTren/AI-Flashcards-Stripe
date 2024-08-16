import { NextResponse } from "next/server";
import OpenAI from "openai";




export async function POST(req){
    const openai = new OpenAI();
    const {topic, cardNum} = await req.json()
    const systemPrompt = `
    Your task is to generate flashcards based on given prompts. 
    Each flashcard should have a question and an answer. 
    The question should be a concise and clear statement, 
    while the answer should provide a detailed explanation up to 15 words or solution. 
    Use your expertise to create high-quality flashcards that are informative and helpful for learning.

    Only generate ${cardNum} flashcards at a time.

    Remember to follow the best practices for flashcard creation and ensure that the content 
    is accurate and well-structured.

    Return om the following JSON format
    {
        flashcards: [{front : str, back : str}]
    }
    `;

    try {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: topic },
        ],
        model: "gpt-4o-mini",
    });

    if (completion && completion.choices && completion.choices.length > 0) {
        const messageContent = completion.choices[0].message.content;
        // console.log(messageContent);
        const flashcards = JSON.parse(messageContent);
        return NextResponse.json(flashcards.flashcards);
    } else {
        throw new Error("No choices found in the API response");
    }
} catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" });
}
}