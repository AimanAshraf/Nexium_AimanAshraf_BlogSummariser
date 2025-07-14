/*import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { translateToUrdu } from '@/lib/translate';

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

function summarizeText(text: string): string {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  return sentences.join(' ');
}

export async function POST(req: NextRequest) {
  try {
    const { url }: { url: string } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const cleanedText = cleanText(response.data);
    if (!cleanedText || cleanedText.length < 200)
      throw new Error('Could not extract sufficient content');

    const englishSummary = summarizeText(cleanedText);
    const urduSummary = await translateToUrdu(englishSummary);
    const wordCount = cleanedText.split(/\s+/).length;

    return NextResponse.json({ englishSummary, urduSummary, wordCount });
  } catch (err: any) {
    console.error('API error:', err.message || err);
    return NextResponse.json(
      { error: err.message || 'Failed to process blog' },
      { status: 500 }
    );
  }
}*/










import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { translateToUrdu } from '@/lib/translate';
import { generateSummary } from '@/lib/summarize';

export async function POST(req: Request) {
  const { url } = await req.json();
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $('nav, footer, header, aside, .sidebar, .menu, .navigation, .navbar').remove();

    const selectors = [
      'article', 
      'main', 
      '.post-content', 
      '.article-body', 
      '.entry-content',
      '#content',
      '.content'
    ];
    
    let articleText = '';
    for (const selector of selectors) {
      if ($(selector).length) {
        articleText = $(selector).text();
        break;
      }
    }
    if (!articleText) {
      articleText = $('body').text();
    }
    articleText = articleText
      .replace(/\s+/g, ' ')
      .trim();

    if (!articleText) {
      throw new Error('Could not extract article content');
    }

    const englishSummary = await generateSummary(articleText);
    const urduSummary = await translateToUrdu(englishSummary);

    return NextResponse.json({ 
      englishSummary, 
      urduSummary,
      wordCount: articleText.split(/\s+/).length,
      title: $('title').text() || 'Untitled Article',
      readingTime: Math.ceil(articleText.split(/\s+/).length / 200) // 200 wpm
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process URL' },
      { status: 500 }
    );
  }
}
