import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';

const urlSchema = z.string().url();

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    urlSchema.parse(url);
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogSummarizer/1.0)'
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    $('script, style, nav, footer, iframe, noscript, img').remove();
    
    // Try to extract title
    const title = $('h1').first().text() || 
                 $('title').text() || 
                 $('meta[property="og:title"]').attr('content') || 
                 'Untitled Article';

    // Try to extract author
    const author = $('[rel="author"]').text() || 
                  $('.author').first().text() || 
                  $('[itemprop="author"]').text() || 
                  'Unknown Author';

    // Try different content selectors
    let content = $('article').text();
    if (!content) {
      content = $('.post-content, .article-content, .entry-content, .content, main').text();
    }
    if (!content) {
      content = $('body').text();
    }

    // Format the content with title and author
    return `${title}\n\nBy ${author}\n\n${content}`
      .replace(/\s+/g, ' ')
      .replace(/\[.*?\]|\{.*?\}/g, '')
      .trim();
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}