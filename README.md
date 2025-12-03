# Screaming Frog Content to Markdown

Custom JavaScript function for Screaming Frog SEO Spider that extracts main body content from web pages and converts it to clean markdown format.

## Features

- Extracts main content while excluding navigation, headers, footers, and sidebars
- Converts HTML elements to proper markdown syntax
- Supports headings, paragraphs, lists, links, images, tables, code blocks, and more
- Follows best practices from Mozilla's Readability library
- Handles text formatting (bold, italic, strikethrough)
- Preserves document structure and semantic meaning

## Requirements

- JavaScript rendering enabled **Crawl Config > Spider > Rendering**
- Store Rendered HTML enabled **Crawl Config > Spider > Extraction**

## Setup Instructions

1. Open Screaming Frog SEO Spider
2. Navigate to **Configuration > Custom > Custom JavaScript**
3. Click **Add** to create a new custom JavaScript function
4. Paste the JavaScript code from `content-to-markdown.js`
5. Ensure **JavaScript rendering is enabled** (Configuration > Spider > Rendering)
6. Enable **Store Rendered HTML** (Configuration > Spider > Extraction)
7. Save the configuration

## Usage

Once configured, the custom extraction will run automatically during crawls. The markdown output will appear in a custom column that you can:

- Export to CSV or Excel
- View in the Screaming Frog interface
- Use for content analysis and SEO audits

## Supported HTML Elements

- Headings (H1-H6)
- Paragraphs and line breaks
- Text formatting (bold, italic, code)
- Links and images
- Ordered and unordered lists
- Blockquotes
- Tables
- Code blocks
- Horizontal rules

## Configuration

The script automatically excludes the following elements:

- `<header>`, `<footer>`, `<nav>`, `<aside>`, `<noscript>`
- Script and style tags

To modify which elements are excluded, edit the `unwantedSelectors` array in the script.

## License

MIT License - feel free to modify and use for your own projects.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with improvements or bug fixes.

