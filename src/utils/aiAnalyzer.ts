import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSpendingAdvice(
  transactions: { amount: number; category: string; date: Date }[]
) {
  const prompt = generatePrompt(transactions);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or 'gpt-3.5-turbo' if you're on budget
    messages: [
      {
        role: "system",
        content: `You're a Gen Z money coach who gives funny and practical advice about spending habits, based on categorized transactions.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8, // adds creative flair
    max_tokens: 200,
  });

  return response.choices[0].message.content;
}

function generatePrompt(
  transactions: { amount: number; category: string; date: Date }[]
) {
  const items = transactions
    .map((txn) => `- ₦${txn.amount} on ${txn.category} (${txn.date})`)
    .join("\n");
    
  return `
Here are some recent spending transactions from a user:

${items}

Give a detailed, witty, Gen Z-style advice tips that help them manage money better based on this pattern. Keep it casual and funny. Don’t mention you're an AI.
`;
}
