import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { translateToUrdu } from '@/lib/translate';

async function summarizeText(text: string): Promise<string> {
  const sentences = text
    .split(/(?<=[.?!])\s+/) // better sentence segmentation
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  return sentences.join(' ');
}

function cleanText(html: string): string {
  const $ = cheerio.load(html);

  $('nav, header, footer, script, style, noscript, iframe, form, aside, svg').remove();

  const candidates = ['article', 'main', '[role=main]', 'section', 'div'];
  for (const selector of candidates) {
    const content = $(selector).text().trim();
    if (content.length > 500) return content;
  }

  return $('body').text().replace(/\s+/g, ' ').trim();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const cleanedText = cleanText(response.data);
    if (!cleanedText || cleanedText.length < 200) {
      throw new Error('Could not extract sufficient content');
    }

    const englishSummary = await summarizeText(cleanedText);
    const urduSummary = await translateToUrdu(englishSummary);
    const wordCount = cleanedText.split(/\s+/).length;

    return NextResponse.json({ englishSummary, urduSummary, wordCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    );
  }
}
