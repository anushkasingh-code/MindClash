export type DebateDifficulty = "NOVICE" | "CHALLENGER" | "BRUTAL";

export const TOPIC_BUCKETS: Record<DebateDifficulty, string[]> = {
  NOVICE: [
    "Social media does more harm than good",
    "Homework should be abolished in schools",
    "Zoos are unethical even when well-funded",
    "Athletes are paid too much compared to teachers",
    "Video games make people more violent",
    "Space exploration is a waste of money",
    "Bottled water should be banned",
    "Tablets have replaced the need for textbooks",
    "Cities should ban cars from their centers",
    "Celebrity culture is harmful to society",
    "Fast fashion should be made illegal",
    "Everyone should learn to code",
  ],
  CHALLENGER: [
    "Democracy is optimized for popularity, not truth",
    "Privacy is already dead and mourning it is theater",
    "Meritocracy is the most effective lie told to the middle class",
    "Charity makes donors feel better and changes nothing structurally",
    "Free will is an illusion we cannot afford to give up",
    "Morality is just the preferences of whoever holds power",
    "Cancel culture hurts the very groups it claims to protect",
    "Algorithmic feeds have made humans measurably stupider",
    "Open-source AI is more dangerous than corporate AI",
    "Compassion without systemic thinking is self-indulgence",
    "Nostalgia is a cognitive disorder we romanticize",
    "Optimism is a form of intellectual dishonesty",
  ],
  BRUTAL: [
    "Your personality is a product of algorithms you never consented to",
    "Self-awareness is a story you tell yourself to feel special",
    "Ambition is unresolved insecurity wearing a costume",
    "Most published scientific research is wrong and scientists know it",
    "Consciousness is not special — it is just computation",
    "Therapy has made people better at describing problems, not solving them",
    "Success is mostly luck and the successful are last to admit it",
    "Most people do not want freedom — they want comfort with the word freedom",
    "Originality is statistically impossible at this point in human history",
    "The concept of work-life balance is a myth sold to the overworked",
    "You are already addicted to AI and you are not worried enough",
    "Free markets have never existed and never will",
  ],
};

export interface GeneratedTopic {
  text: string;
  difficulty: DebateDifficulty;
  recommendedRounds: number;
}

export function generateMatchTopic(
  difficulty: DebateDifficulty,
  rounds: number
): GeneratedTopic {
  const pool = TOPIC_BUCKETS[difficulty];
  const text = pool[Math.floor(Math.random() * pool.length)];
  return { text, difficulty, recommendedRounds: rounds };
}

/** All topics mixed — for topic reveal spin reel */
export function getAllTopicsMixed(): string[] {
  return [
    ...TOPIC_BUCKETS.NOVICE,
    ...TOPIC_BUCKETS.CHALLENGER,
    ...TOPIC_BUCKETS.BRUTAL,
  ];
}
