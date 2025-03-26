import { useState } from 'react';
import { marked } from 'marked';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');

  const convertToHtml = () => {
    const convertedHtml = marked(markdown);
    setHtml(convertedHtml);
  };

  const generateStaticSite = () => {
    // Create a complete HTML document
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Generated Page'}</title>
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      pre {
        background: #f4f4f4;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
      }
      code {
        background: #f4f4f4;
        padding: 0.2rem 0.4rem;
        border-radius: 2px;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

    // Create a Blob containing the HTML
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="title" className="font-medium">
          Page Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter page title..."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="markdown" className="font-medium">
          Enter Markdown
        </label>
        <textarea
          id="markdown"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-64 p-4 border rounded-lg font-mono"
          placeholder="Type your markdown here..."
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={convertToHtml}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Preview HTML
        </button>

        {html && (
          <button
            onClick={generateStaticSite}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download HTML
          </button>
        )}
      </div>

      {html && (
        <div className="grid gap-2">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div
            className="prose max-w-none p-4 border rounded-lg"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}