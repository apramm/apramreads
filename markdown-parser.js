// Simple Markdown Parser
// This is a lightweight parser for basic markdown features
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Escape HTML
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
        };
        return text.replace(/[&<>]/g, (m) => map[m]);
    };
    
    // Code blocks (must come before inline code)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Mark unordered list items
    html = html.replace(/^\- (.*$)/gm, '<UL_LI>$1</UL_LI>');
    
    // Mark ordered list items
    html = html.replace(/^\d+\. (.*$)/gm, '<OL_LI>$1</OL_LI>');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');
    
    // Line breaks and paragraphs
    const lines = html.split('\n');
    let inCodeBlock = false;
    let result = [];
    let paragraph = [];
    let ulItems = [];
    let olItems = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Check if we're in a code block
        if (trimmed.startsWith('<pre>')) {
            inCodeBlock = true;
        }
        if (trimmed.endsWith('</pre>')) {
            inCodeBlock = false;
        }
        
        // Skip processing if in code block
        if (inCodeBlock || trimmed.startsWith('<pre>') || trimmed.includes('</pre>')) {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            // Flush any pending lists
            if (ulItems.length > 0) {
                result.push('<ul>');
                ulItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ul>');
                ulItems = [];
            }
            if (olItems.length > 0) {
                result.push('<ol>');
                olItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ol>');
                olItems = [];
            }
            result.push(line);
            continue;
        }
        
        // Handle unordered list items
        if (trimmed.startsWith('<UL_LI>')) {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            // Flush ordered list if switching to unordered
            if (olItems.length > 0) {
                result.push('<ol>');
                olItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ol>');
                olItems = [];
            }
            const content = trimmed.replace('<UL_LI>', '').replace('</UL_LI>', '');
            ulItems.push(content);
            
        // Handle ordered list items
        } else if (trimmed.startsWith('<OL_LI>')) {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            // Flush unordered list if switching to ordered
            if (ulItems.length > 0) {
                result.push('<ul>');
                ulItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ul>');
                ulItems = [];
            }
            const content = trimmed.replace('<OL_LI>', '').replace('</OL_LI>', '');
            olItems.push(content);
            
        // Handle special elements (headers, hr, blockquote)
        } else if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || 
                   trimmed.startsWith('<blockquote>')) {
            
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            // Flush any pending lists
            if (ulItems.length > 0) {
                result.push('<ul>');
                ulItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ul>');
                ulItems = [];
            }
            if (olItems.length > 0) {
                result.push('<ol>');
                olItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ol>');
                olItems = [];
            }
            result.push(line);
            
        // Handle empty lines
        } else if (trimmed === '') {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            // Flush any pending lists on empty line
            if (ulItems.length > 0) {
                result.push('<ul>');
                ulItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ul>');
                ulItems = [];
            }
            if (olItems.length > 0) {
                result.push('<ol>');
                olItems.forEach(item => result.push('<li>' + item + '</li>'));
                result.push('</ol>');
                olItems = [];
            }
            
        } else {
            paragraph.push(line);
        }
    }
    
    // Handle any remaining content
    if (paragraph.length > 0) {
        result.push('<p>' + paragraph.join(' ') + '</p>');
    }
    if (ulItems.length > 0) {
        result.push('<ul>');
        ulItems.forEach(item => result.push('<li>' + item + '</li>'));
        result.push('</ul>');
    }
    if (olItems.length > 0) {
        result.push('<ol>');
        olItems.forEach(item => result.push('<li>' + item + '</li>'));
        result.push('</ol>');
    }
    
    return result.join('\n');
}

// Make it globally available
window.parseMarkdown = parseMarkdown;
