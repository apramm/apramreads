// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        section: params.get('section'),
        file: params.get('file')
    };
}

// Load and render the post
async function loadPost() {
    const { section, file } = getUrlParams();
    const postContent = document.getElementById('post-content');
    const sectionLink = document.getElementById('section-link');
    
    if (!section || !file) {
        postContent.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>Invalid post URL. Missing section or file parameter.</p>
            </div>
        `;
        return;
    }
    
    // Update breadcrumb
    sectionLink.innerHTML = `<a href="index.html#${section}">${section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}</a>`;
    
    try {
        const response = await fetch(`blog/${section}/${file}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        const markdown = await response.text();
        
        // Parse markdown to HTML using our custom parser
        const html = parseMarkdown(markdown);
        
        // Update page title
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            document.title = `${titleMatch[1]} - Apram Reads`;
        }
        
        postContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = `
            <div class="error">
                <h2>Error Loading Post</h2>
                <p>Could not load the blog post. The file might not exist.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadPost();
});

// Theme switching functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
    
    // Add click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '☀️';
        }
    });
}
