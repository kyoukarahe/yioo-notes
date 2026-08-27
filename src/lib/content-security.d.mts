export type MarkdownHeading = {
  depth: number;
  id: string;
  text: string;
};

export type RenderedMarkdownDocument = {
  headings: MarkdownHeading[];
  html: string;
};

export function renderMarkdownDocumentSafely(markdown: string): RenderedMarkdownDocument;
export function renderMarkdownSafely(markdown: string): string;
export function serializeJsonForScript(value: unknown): string;
