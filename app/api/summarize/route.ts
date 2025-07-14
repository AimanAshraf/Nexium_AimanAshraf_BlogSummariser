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