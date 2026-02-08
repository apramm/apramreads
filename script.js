// Function to load blog manifest (auto-generated list of markdown files)
async function loadBlogManifest() {
    try {
        const response = await fetch('blog-manifest.json');
        if (!response.ok) {
            console.warn('Could not load blog-manifest.json, using empty config');
            return {};
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading blog manifest:', error);
        return {};
    }
}

// Function to extract title from markdown content
function extractTitle(markdown) {
    const lines = markdown.split('\n');
    for (let line of lines) {
        if (line.startsWith('# ')) {
            return line.substring(2).trim();
        }
    }
    return 'Untitled';
}

// Function to extract date from filename or content
function extractDate(filename, markdown) {
    // Try to extract date from filename (e.g., 2024-01-15.md)
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        return dateMatch[1];
    }
    
    // Try to extract date from markdown front matter or content
    const dateLineMatch = markdown.match(/date:\s*(\d{4}-\d{2}-\d{2})/i);
    if (dateLineMatch) {
        return dateLineMatch[1];
    }
    
    return null;
}

// Function to fetch and parse a markdown file
async function fetchPost(section, filename) {
    try {
        const response = await fetch(`blog/${section}/${filename}`);
        if (!response.ok) {
            console.warn(`Could not fetch blog/${section}/${filename}`);
            return null;
        }
        const markdown = await response.text();
        const title = extractTitle(markdown);
        const date = extractDate(filename, markdown);
        
        return {
            section,
            filename,
            title,
            date,
            url: `post.html?section=${section}&file=${filename}`
        };
    } catch (error) {
        console.error(`Error fetching ${section}/${filename}:`, error);
        return null;
    }
}

// Function to render the blog list
async function renderBlogList() {
    const blogList = document.getElementById('blog-list');
    
    // Load the blog manifest
    const BLOG_CONFIG = await loadBlogManifest();
    
    // Fetch all posts
    const allPosts = [];
    for (const [section, files] of Object.entries(BLOG_CONFIG)) {
        for (const file of files) {
            const post = await fetchPost(section, file);
            if (post) {
                allPosts.push(post);
            }
        }
    }
    
    if (allPosts.length === 0) {
        blogList.innerHTML = `
            <div class="empty-state">
                <h2>No posts yet</h2>
                <p>Add markdown files to the blog folders to get started.</p>
                <p>Run <code>node generate-manifest.js</code> to update the blog manifest.</p>
            </div>
        `;
        return;
    }
    
    // Group posts by section
    const postsBySection = {};
    allPosts.forEach(post => {
        if (!postsBySection[post.section]) {
            postsBySection[post.section] = [];
        }
        postsBySection[post.section].push(post);
    });
    
    // Sort posts within each section by date (newest first)
    Object.values(postsBySection).forEach(posts => {
        posts.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return b.date.localeCompare(a.date);
        });
    });
    
    // Render sections and posts
    let html = '';
    for (const [section, posts] of Object.entries(postsBySection)) {
        const sectionId = section.replace(/\s+/g, '-').toLowerCase();
        html += `
            <section class="section">
                <h2 class="section-title collapsible" data-section="${sectionId}">
                    <span class="collapse-icon">▼</span>
                    ${section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                </h2>
                <ul class="post-list" id="section-${sectionId}">
        `;
        
        posts.forEach(post => {
            html += `
                <li class="post-item">
                    <a href="${post.url}" class="post-link">
                        <span class="post-title">${post.title}</span>
                        ${post.date ? `<span class="post-date">${post.date}</span>` : ''}
                    </a>
                </li>
            `;
        });
        
        html += `
                </ul>
            </section>
        `;
    }
    
    blogList.innerHTML = html;
    
    // Add event listeners for collapsible sections
    document.querySelectorAll('.section-title.collapsible').forEach(title => {
        title.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const postList = document.getElementById(`section-${sectionId}`);
            const icon = this.querySelector('.collapse-icon');
            
            if (postList.style.display === 'none') {
                postList.style.display = 'block';
                icon.textContent = '▼';
            } else {
                postList.style.display = 'none';
                icon.textContent = '▶';
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    renderBlogList();
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
