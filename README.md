# Screaming Frog Content to Markdown

Custom JavaScript function for Screaming Frog SEO Spider that extracts main body content from web pages and converts it to clean markdown format.

## Features

- **Intelligent content extraction** with multi-level fallback strategies
  - Primary: Extracts from detected main content containers
  - Secondary: Falls back to full body extraction if content is minimal
  - Tertiary: Extracts from semantic elements (headings, paragraphs, lists) as last resort
- **Advanced element filtering** to exclude navigation, headers, footers, sidebars, and UI overlays
  - ID-based detection (header, footer, site-header, site-footer)
  - Class-based detection (cookie-banners, newsletters, modals, loading animations)
  - Smart ARIA role filtering (role="banner", role="navigation", role="complementary")
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
4. Paste the JavaScript code from `extract-content-convert-md.js` (or `new.js` for enhanced version)
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

### Enhanced Filtering

The script uses multiple filtering strategies to identify and exclude non-content elements:

**HTML Tag Filtering:**
- `<header>`, `<footer>`, `<nav>`, `<aside>`, `<noscript>`, `<script>`, `<style>`

**ID-Based Filtering:**
- Elements with IDs: `header`, `footer`, `site-header`, `site-footer`

**Class-Based Filtering:**
- Common patterns: `theme-header`, `theme-footer`, `site-header`, `site-footer`, `global-header`, `global-footer`
- UI overlays: `loading-animation`, `cookie-banner`, `cookie-consent`, `newsletter-popup`, `modal-overlay`

**ARIA Role Filtering:**
- `role="navigation"` - always excluded
- `role="banner"` - excluded only if contains nav or is at top level
- `role="complementary"` - excluded only if <40% of parent width (sidebar detection)

### Content Detection

The script searches for content in 20+ different selectors before falling back to extraction strategies:

1. WordPress/theme-specific: `.entry-content`, `.wp-block-post-content`
2. Semantic HTML: `main article`, `main`, `article`, `[role="main"]`
3. Common class patterns: `.content`, `.main-content`, `.page-content`, `.site-content`, `.post-content`, `.article-content`, `.body-content`
4. Data attributes: `[data-content]`, `[data-main-content]`
5. Layout containers: `.layout-container`, `.container`
6. IDs: `#content`, `#main`, `#main-content`
7. Full document body as final fallback

To modify filtering rules, edit the condition checks in the `processNode()` function.

## License

MIT License - feel free to modify and use for your own projects.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with improvements or bug fixes.

