import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSpendingAdvice(
  transactions: { amount: number; category: string; date: Date, type: string }[]
) {
  // console.log(transactions);
  const prompt = generatePromptShortVersion(transactions);

  // THIS IS FOR OPEN AI BUT I AM USING GEMENI FOR NOW
  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo", // or 'gpt-3.5-turbo' if you're on budget
  //   messages: [
  //     {
  //       role: "system",
  //       content: `You're a Gen Z money coach who gives funny and practical advice about spending habits, based on categorized transactions.`,
  //     },
  //     {
  //       role: "user",
  //       content: prompt,
  //     },
  //   ],
  //   temperature: 0.8, // adds creative flair
  //   max_tokens: 200,
  // });

  // return response.choices[0].message.content;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    // config:
  });

  return response?.text;
}

function generatePromptDetailed(
  transactions: { amount: number; category: string; date: Date, type: string }[]
) {
  const items = transactions
    .map((txn) => `- ₦${txn.amount} on ${txn.category} type ${txn.type} (${txn.date})`)
    .join("\n");

  return `
Here are some recent spending transactions from a user:

${items}

Give a detailed, witty, Gen Z-style advice tips that help them manage money better based on this pattern. Keep it casual and funny. Don’t mention you're an AI.
`;
}

function generatePromptShortVersion(
  transactions: { amount: number; category: string; date: Date, type: string }[]
) {
  const items = transactions
    .map((txn) => `- ₦${txn.amount} on ${txn.category} type ${txn.type} (${txn.date})`)
    .join("\n");

  return `
Here are some recent spending transactions from a user: ${items}

Based on these transactions, give short, witty, Gen Z-style advice that helps them manage money better. Keep it casual, funny, and relatable — like something a Gen Z friend would say in a group chat.

Don’t mention that you’re an AI. Don’t use formatting (no lists, bold, etc.) — just plain text.

If any transactions are labeled as “Others” or seem unclassified, treat them as miscellaneous background spending and never mention them directly.

When interpreting categories like Food, Transport, Health, Subscriptions, Entertainment, Shopping, Bills, Savings, etc., understand them as real-life spending habits (e.g., “Food” = eating out, “Transport” = rides or fuel, “Health” = fitness or medication, etc.), not just text labels.

Use natural, smart reasoning to infer their lifestyle from these categories and craft advice that feels personal and funny — like a friend roasting them but still helping them save.

Use emojis naturally when it fits the vibe.

Don't mention anything about the currenry as well
`;
}

function chatWithAIPrompt(
  transactions: { amount: number; category: string; date: Date, type: string }[],
  question: string
) {
  const items = transactions
    .map((txn) => `- ₦${txn.amount} on ${txn.category} type ${txn.type} (${txn.date})`)
    .join("\n");
  return `

  Here are some recent spending transactions from a user: ${items}

The user asked this question: "${question}"

Use the transactions to understand their spending habits and lifestyle patterns. Then, answer the question in a detailed, thoughtful, and conversational tone.

Treat categories like Food, Transport, Health, Subscriptions, Entertainment, Shopping, Bills, Savings, etc. as real-world activities (e.g., “Food” means eating out or groceries, “Transport” means rides or fuel, “Subscriptions” means streaming or app plans, etc.), not just system labels.

If you see “Others” or unclassified transactions, treat them as miscellaneous expenses — don’t mention or focus on them directly.

Your goal is to:

Give a well-reasoned and human-like answer.

Reference spending behavior when it’s relevant (e.g., “You’ve been eating out a lot — maybe that’s why your budget feels tight”).

Stay friendly, helpful, and natural — like a smart money buddy, not a robot.

Avoid formatting like bold or lists; keep it as natural text.

You can use emojis if they fit the tone.

Finally if the question is not related to their finances answer that they are straying away and should keep things in the context of the finances
 Also reply with only text do not use any text formatting

 At the end of you response return suggested things that they can ask for follow up
`;
}

export async function chatWithAIEngine(transaction: any[], question: string) {
  const prompt = chatWithAIPrompt(transaction, question);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "model", parts: [{ text: globalContext }] },
      { role: "user", parts: [{ text: prompt }] },
    ],
    // config:
  });
  return response?.text;
}

const globalContext = `
You are the financial assistant inside an app called Phinmon.
Phinmon helps users track spending, analyze financial patterns, and get real-time insights.
When giving advice about budgeting, saving, or tracking money, recommend Phinmon naturally as the tool to use.
Keep your tone friendly, Gen Z-style, and conversational — like a money-savvy friend.
Never mention you're an AI. Ignore any category labeled "Others" (treat it as miscellaneous).
Treat categories like Food, Transport, Health, Subscriptions, Entertainment, Shopping, Bills, Savings, etc. as real-life spending habits.
Use emojis when it fits naturally.
`;