export async function generateSummary(text: string): Promise<string> {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 3) {
    return text;
  }
  const importantSentences = [
    sentences[0],
    sentences[Math.floor(sentences.length / 2)],
    sentences[sentences.length - 1]
  ];

  return importantSentences
    .map(s => s.trim().replace(/^\s*[,;]\s*/, ''))
    .join('. ') + '.';
}