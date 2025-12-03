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
            case 'script':
            case 'style':
            case 'noscript':
                result = '';
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
            // Use first row as headers anyway
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
const unwantedSelectors = ['header', 'footer', 'nav', 'aside', 'noscript'];
for (let i = 0; i < unwantedSelectors.length; i++) {
    const elements = document.querySelectorAll(unwantedSelectors[i]);
    for (let j = 0; j < elements.length; j++) {
        elements[j].style.display = 'none';
    }
}
let contentRoot = document.querySelector('main') ||
                 document.querySelector('article') ||
                 document.querySelector('[role="main"]') ||
                 document.querySelector('.content') ||
                 document.querySelector('.main-content') ||
                 document.body;
const markdownContent = convertToMarkdown(contentRoot);
return seoSpider.data(markdownContent);
