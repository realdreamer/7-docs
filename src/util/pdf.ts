// TODO: Code below was largely generated by gpt-4, can likely be improved

import { extname } from 'node:path';
import 'path2d-polyfill';
import pdf from 'pdfjs-dist/legacy/build/pdf.js';
import { extractTextSections } from './text.js';
import type { TextItem } from 'pdfjs-dist/types/src/display/api.js';

export const isPDF = (filePath: string) => ['.pdf'].includes(extname(filePath));

export async function extractPdfSections(content: Buffer, maxLength: number): Promise<string[]> {
  const loadingTask = pdf.getDocument({ data: new Uint8Array(content) });
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;

  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item): item is TextItem => 'str' in item)
      .map(item => item.str)
      .join(' ');

    fullText += ' ' + pageText;
  }

  return extractTextSections(fullText, maxLength);
}