import { marked } from 'marked'

// Configure marked for safe use
marked.setOptions({ async: false })

/** Render a Markdown string to sanitized HTML. */
export function renderBody(raw: string): string {
  const html = marked.parse(raw) as string
  // Basic server-side sanitization: strip script tags and inline event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
}
