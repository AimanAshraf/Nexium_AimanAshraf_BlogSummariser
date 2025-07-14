const translate = (await import('@vitalets/google-translate-api')).translate;

export async function translateToUrdu(text: string): Promise<string> {
  try {
    const result = await translate(text, { to: 'ur' });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
