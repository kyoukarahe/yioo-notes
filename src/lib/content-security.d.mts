export type MarkdownHeading = {
  depth: number;
  id: string;
  text: string;
};

export type RenderedMarkdownDocument = {
  headings: MarkdownHeading[];
  html: string;
};

export function renderMarkdownDocumentSafely(markdown: string, options?: {lang?: "ko" | "en"}): RenderedMarkdownDocument;
export function renderMarkdownSafely(markdown: string): string;
export function serializeJsonForScript(value: unknown): string;
