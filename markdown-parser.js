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
    
    // Unordered lists
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');
    
    // Line breaks and paragraphs
    const lines = html.split('\n');
    let inList = false;
    let inBlockquote = false;
    let inCodeBlock = false;
    let result = [];
    let paragraph = [];
    
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
            result.push(line);
            continue;
        }
        
        // Handle special elements
        if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || 
            trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>') ||
            trimmed.startsWith('</ul>') || trimmed.startsWith('</ol>') ||
            trimmed.startsWith('<blockquote>')) {
            
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            result.push(line);
            
        } else if (trimmed.startsWith('<li>')) {
            if (!inList && paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            inList = true;
            result.push(line);
            
        } else if (trimmed === '') {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            inList = false;
            
        } else {
            paragraph.push(line);
        }
    }
    
    // Handle any remaining paragraph
    if (paragraph.length > 0) {
        result.push('<p>' + paragraph.join(' ') + '</p>');
    }
    
    return result.join('\n');
}

// Make it globally available
window.parseMarkdown = parseMarkdown;
