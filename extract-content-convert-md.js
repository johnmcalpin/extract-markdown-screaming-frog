/**
 * Custom JavaScript for Screaming Frog SEO Spider
 * Extracts main body content (excluding header, footer, nav, aside, noscript)
 * and converts it to markdown format following Mozilla Readability best practices
 */
function convertToMarkdown(element) {

    function processNode(node) {
        if (!node) return '';

        if (node.nodeType === 3) {
            let text = node.textContent;
            text = text.replace(/\s+/g, ' ');
            return text;
        }

        if (node.nodeType !== 1) {
            return '';
        }

        const tagName = node.tagName.toLowerCase();
        let result = '';

        if (['header', 'footer', 'nav', 'aside', 'noscript', 'script', 'style'].indexOf(tagName) !== -1) {
            return '';
        }

        const className = node.className || '';
        const classString = typeof className === 'string' ? className : '';
        const id = node.id || '';
        const role = node.getAttribute('role') || '';

        // Skip common header/footer/nav patterns by class or id
        if (classString.indexOf('theme-header') !== -1 ||
            classString.indexOf('theme-footer') !== -1 ||
            classString.indexOf('site-header') !== -1 ||
            classString.indexOf('site-footer') !== -1 ||
            classString.indexOf('global-header') !== -1 ||
            classString.indexOf('global-footer') !== -1 ||
            classString.indexOf('loading-animation') !== -1 ||
            classString.indexOf('cookie-banner') !== -1 ||
            classString.indexOf('cookie-consent') !== -1 ||
            classString.indexOf('newsletter-popup') !== -1 ||
            classString.indexOf('modal-overlay') !== -1 ||
            id === 'header' ||
            id === 'footer' ||
            id === 'site-header' ||
            id === 'site-footer') {
            return '';
        }

        // Only exclude role="banner" if it looks like a site header (at top level or has nav)
        if (role === 'banner' && (node.querySelector('nav') || node.parentElement === document.body)) {
            return '';
        }

        // Only exclude role="navigation"
        if (role === 'navigation') {
            return '';
        }

        // Only exclude role="complementary" if it's a sidebar-like element (small portion of content)
        if (role === 'complementary') {
            const parentWidth = node.parentElement ? node.parentElement.offsetWidth : 0;
            const nodeWidth = node.offsetWidth || 0;
            // Skip if it's less than 40% of parent width (likely a sidebar)
            if (parentWidth > 0 && nodeWidth < parentWidth * 0.4) {
                return '';
            }
        }

        function getChildrenText() {
            let text = '';
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                text += processNode(children[i]);
            }
            return text;
        }

        switch (tagName) {
            case 'h1':
                result = '\n\n# ' + getChildrenText().trim() + '\n\n';
                break;
            case 'h2':
                result = '\n\n## ' + getChildrenText().trim() + '\n\n';
                break;
            case 'h3':
                result = '\n\n### ' + getChildrenText().trim() + '\n\n';
                break;
            case 'h4':
                result = '\n\n#### ' + getChildrenText().trim() + '\n\n';
                break;
            case 'h5':
                result = '\n\n##### ' + getChildrenText().trim() + '\n\n';
                break;
            case 'h6':
                result = '\n\n###### ' + getChildrenText().trim() + '\n\n';
                break;
            case 'p':
                result = '\n\n' + getChildrenText().trim() + '\n\n';
                break;
            case 'br':
                result = '  \n';
                break;
            case 'strong':
            case 'b':
                result = '**' + getChildrenText() + '**';
                break;
            case 'em':
            case 'i':
                result = '*' + getChildrenText() + '*';
                break;
            case 'code':
                if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
                    result = getChildrenText();
                } else {
                    result = '`' + getChildrenText() + '`';
                }
                break;
            case 'pre':
                result = '\n\n```\n' + getChildrenText().trim() + '\n```\n\n';
                break;
            case 'a':
                const href = node.getAttribute('href') || '';
                const linkText = getChildrenText().trim();
                if (href && linkText) {
                    result = '[' + linkText + '](' + href + ')';
                } else {
                    result = linkText;
                }
                break;
            case 'img':
                const src = node.getAttribute('src') || '';
                const alt = node.getAttribute('alt') || '';
                if (src) {
                    result = '![' + alt + '](' + src + ')';
                }
                break;
            case 'ul':
            case 'ol':
                result = '\n\n';
                const items = node.children;
                let itemIndex = 0;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].tagName.toLowerCase() === 'li') {
                        itemIndex++;
                        const prefix = tagName === 'ul' ? '- ' : itemIndex + '. ';
                        result += prefix + processNode(items[i]).trim() + '\n';
                    }
                }
                result += '\n';
                break;
            case 'li':
                result = getChildrenText();
                break;
            case 'blockquote':
                const quoteText = getChildrenText().trim();
                result = '\n\n> ' + quoteText.replace(/\n/g, '\n> ') + '\n\n';
                break;
            case 'hr':
                result = '\n\n---\n\n';
                break;
            case 'table':
                result = '\n\n' + processTable(node) + '\n\n';
                break;
            case 'del':
            case 's':
            case 'strike':
                result = '~~' + getChildrenText() + '~~';
                break;
            default:
                result = getChildrenText();
                break;
        }

        return result;
    }

    function processTable(table) {
        let md = '';
        const rows = table.querySelectorAll('tr');

        if (rows.length === 0) return '';

        let headers = [];
        let isFirstRowHeader = false;

        const firstRowCells = rows[0].querySelectorAll('th, td');
        if (rows[0].querySelector('th')) {
            isFirstRowHeader = true;
            for (let i = 0; i < firstRowCells.length; i++) {
                headers.push(firstRowCells[i].textContent.trim());
            }
        } else {
            for (let i = 0; i < firstRowCells.length; i++) {
                headers.push(firstRowCells[i].textContent.trim());
            }
            isFirstRowHeader = true;
        }

        md += '| ' + headers.join(' | ') + ' |\n';
        md += '| ' + headers.map(function() { return '---'; }).join(' | ') + ' |\n';

        const startRow = isFirstRowHeader ? 1 : 0;
        for (let i = startRow; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td, th');
            const cellTexts = [];
            for (let j = 0; j < cells.length; j++) {
                cellTexts.push(cells[j].textContent.trim());
            }
            if (cellTexts.length > 0) {
                md += '| ' + cellTexts.join(' | ') + ' |\n';
            }
        }

        return md;
    }

    let markdown = processNode(element);

    markdown = markdown
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
        .replace(/ +/g, ' ');

    return markdown;
}

let contentRoot = document.querySelector('.entry-content') ||
                 document.querySelector('.wp-block-post-content') ||
                 document.querySelector('main article') ||
                 document.querySelector('main') ||
                 document.querySelector('article') ||
                 document.querySelector('[role="main"]') ||
                 document.querySelector('.content') ||
                 document.querySelector('.main-content') ||
                 document.querySelector('.page-content') ||
                 document.querySelector('.site-content') ||
                 document.querySelector('.post-content') ||
                 document.querySelector('.article-content') ||
                 document.querySelector('.body-content') ||
                 document.querySelector('[data-content]') ||
                 document.querySelector('[data-main-content]') ||
                 document.querySelector('.layout-container') ||
                 document.querySelector('.container') ||
                 document.querySelector('#content') ||
                 document.querySelector('#main') ||
                 document.querySelector('#main-content') ||
                 document.body;

let markdownContent = convertToMarkdown(contentRoot);

// Fallback: if content is too short, try extracting from body with relaxed filtering
if (markdownContent.length < 500 && contentRoot !== document.body) {
    const bodyContent = convertToMarkdown(document.body);
    if (bodyContent.length > markdownContent.length) {
        markdownContent = bodyContent;
    }
}

// Second fallback: if still too short, extract all visible text from common content elements
if (markdownContent.length < 500) {
    const contentSelectors = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'li', 'td', 'th', 'blockquote', 'figcaption',
        '[class*="text"]', '[class*="content"]', '[class*="body"]',
        '[class*="description"]', '[class*="paragraph"]'
    ];

    let fallbackText = [];
    contentSelectors.forEach(function(selector) {
        try {
            document.querySelectorAll(selector).forEach(function(el) {
                // Skip if inside excluded elements
                if (el.closest('header, footer, nav, aside, noscript, script, style')) {
                    return;
                }
                const text = el.textContent.trim();
                if (text.length > 20 && fallbackText.indexOf(text) === -1) {
                    fallbackText.push(text);
                }
            });
        } catch(e) {}
    });

    if (fallbackText.join('\n\n').length > markdownContent.length) {
        markdownContent = fallbackText.join('\n\n');
    }
}

return seoSpider.data(markdownContent);