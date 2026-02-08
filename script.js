// Configuration: Define your blog sections and their markdown files here
const BLOG_CONFIG = {
    'books': [
        'first-read.md',
        'another-book.md'
    ],
    'articles': [
        'interesting-article.md'
    ],
    'daily-reads': [
        '2024-01-15.md'
    ]
};

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
                <p>Edit the <code>BLOG_CONFIG</code> in <code>script.js</code> to register your posts.</p>
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
        html += `
            <section class="section">
                <h2 class="section-title">${section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}</h2>
                <ul class="post-list">
        `;
        
        posts.forEach(post => {
            html += `
                <li class="post-item">
                    <h3 class="post-title"><a href="${post.url}">${post.title}</a></h3>
                    ${post.date ? `<p class="post-date">${post.date}</p>` : ''}
                </li>
            `;
        });
        
        html += `
                </ul>
            </section>
        `;
    }
    
    blogList.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderBlogList);
