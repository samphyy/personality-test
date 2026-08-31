export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'What is the Big Five (OCEAN) personality model?',
    answer: 'The Big Five personality model (also known as OCEAN) is the gold standard in academic and empirical psychology. It measures human personality across five continuous dimensions: Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (Emotional Reactivity). Rather than forcing you into a single restrictive label, it provides your exact percentile on continuous spectrums.',
  },
  {
    question: 'How is the Big Five different from Myers-Briggs (MBTI)?',
    answer: 'While Myers-Briggs (MBTI) assigns rigid either/or categories (like Introvert vs. Extrovert), real psychological research shows personality exists on continuous spectrums. The Big Five is backed by decades of peer-reviewed empirical research, high test-retest reliability, and strong predictive validity for workplace success, leadership, and relationship dynamics.',
  },
  {
    question: 'How long does this assessment take to complete?',
    answer: 'The Full Assessment contains 30 validated questions from the International Personality Item Pool (IPIP) and takes approximately 3 to 5 minutes. We also offer a 15-question Quick Test that can be completed in under 2 minutes.',
  },
  {
    question: 'Is this assessment free and private?',
    answer: 'Yes, 100% free and client-side private. You do not need to create an account or pay to see your results. All scores and radar maps are calculated instantly in your browser, with an optional email report delivery.',
  },
  {
    question: 'What do the results include?',
    answer: 'Your assessment result includes an interactive 5-factor dimensional radar map, your primary dominant archetype, an in-depth breakdown of strengths and growth areas, career and workplace dynamics, communication style insights, and a 1-click downloadable 3-page executive PDF report.',
  },
  {
    question: 'Can I use this report for career and team development?',
    answer: 'Absolutely. Understanding your dimensional balance (e.g. high Conscientiousness paired with low Extraversion or high Openness) provides actionable insight into your ideal work environment, execution style, and team collaboration dynamics.',
  },
];
