/**
 * Markdown Parser using marked.js
 * This uses the same library as VSCode's markdown preview for consistent rendering
 * 
 * Features:
 * - GitHub Flavored Markdown (GFM) support
 * - Tables, task lists, strikethrough
 * - Syntax highlighting for code blocks via highlight.js
 * - Nested lists and all heading levels
 * - Math equations, footnotes, and more
 */

// Configure marked.js for GitHub Flavored Markdown
function configureMarked() {
    if (typeof marked === 'undefined') {
        console.error('marked.js not loaded');
        return;
    }

    // Set marked options
    marked.setOptions({
        gfm: true,              // GitHub Flavored Markdown
        breaks: false,          // Don't convert \n to <br> (match VSCode default)
        pedantic: false,        // Don't be too strict
        sanitize: false,        // Allow HTML (same as VSCode)
        smartLists: true,       // Use smarter list behavior
        smartypants: false,     // Don't use smart typography
        xhtml: false,           // Don't use XHTML-style tags
        headerIds: true,        // Add IDs to headers
        mangle: false,          // Don't mangle email addresses
    });

    // Configure code highlighting if highlight.js is available
    if (typeof hljs !== 'undefined') {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {
                        console.error('Highlight error:', err);
                    }
                }
                // Auto-detect language if not specified
                try {
                    return hljs.highlightAuto(code).value;
                } catch (err) {
                    console.error('Auto-highlight error:', err);
                }
                return code;
            }
        });
    }
}

// Parse markdown to HTML
function parseMarkdown(markdown) {
    if (typeof marked === 'undefined') {
        console.error('marked.js is not loaded. Falling back to plain text.');
        return `<p>Error: Markdown parser not loaded</p><pre>${markdown}</pre>`;
    }
    
    try {
        configureMarked();
        return marked.parse(markdown);
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return `<p>Error parsing markdown: ${error.message}</p><pre>${markdown}</pre>`;
    }
}

// Make it globally available
window.parseMarkdown = parseMarkdown;
window.configureMarked = configureMarked;

// Auto-configure when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureMarked);
} else {
    configureMarked();
}
