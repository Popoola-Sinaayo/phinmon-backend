export const categoryKeywords: Record<string, string[]> = {
  food: ["dominos", "kfc", "eat", "snack", "restaurant", "cold stone"],
  transport: ["uber", "bolt", "ride", "taxi", "bus", "train"],
  shopping: ["order", "shop", "jumia", "cap", "drip", "shein"],
  bills: ["electricity", "data", "airtime", "dstv", "phcn"],
  entertainment: ["netflix", "spotify", "showmax", "movie", "cinema"],
  savings: ["piggyvest", "save", "stash", "vault", "deposit", "cowrywise"],
  health: ["pharmacy", "clinic", "gym", "fitness", "medicine"],
  education: ["school", "tuition", "jamb", "lesson", "exam"],
  subscriptions: ["subscription", "renewal", "apple", "google"],
  gifting: ["gift", "dash", "to mum", "to dad", "allowance"],
  home: ["rent", "house", "furniture", "appliance"],
  income: ["salary", "payment", "credit", "earnings"],
  bank_charges: ["charge", "sms", "fee", "vat", "stamp"],
  donations: ["tithe", "offering", "church", "mosque", "donation"],
};

export function categorizeTransaction(categoryKeywords: Record<string, string[]>, description: string): string {
  const desc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => desc.includes(keyword))) {
      return category;
    }
  }

  return "others";
}
