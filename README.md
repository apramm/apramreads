# Apram Reads

A simple static blog website to record what I read (mainly for the 2 pages a day challenge).

## Features

- 📝 Write blog posts in Markdown
- 📁 Organize posts by sections (folders)
- 🌙 Dark mode by default
- 📱 Responsive design
- ✨ Clean, minimal styling

## How to Add a New Blog Post

1. **Create a markdown file** in one of the blog section folders:
   - `blog/books/` - For book reviews and notes
   - `blog/articles/` - For article summaries
   - `blog/daily-reads/` - For daily reading logs

2. **Write your post** in Markdown format. Start with a title:
   ```markdown
   # Your Post Title
   
   date: 2024-01-15
   
   Your content here...
   ```

3. **Register your post** in `script.js`:
   - Open `script.js`
   - Find the `BLOG_CONFIG` object
   - Add your markdown filename to the appropriate section:
   ```javascript
   const BLOG_CONFIG = {
       'books': [
           'first-read.md',
           'your-new-post.md'  // Add your file here
       ],
       'articles': [...],
       'daily-reads': [...]
   };
   ```

4. **Commit and push** your changes to GitHub

## Creating a New Section

To add a new blog section:

1. Create a new folder in the `blog/` directory
2. Add your markdown files to the new folder
3. Update `BLOG_CONFIG` in `script.js` with the new section:
   ```javascript
   const BLOG_CONFIG = {
       'books': [...],
       'your-new-section': [
           'your-post.md'
       ]
   };
   ```

## Local Development

Simply open `index.html` in your web browser. For the best experience, use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## GitHub Pages

This site is designed to work with GitHub Pages. Enable it in your repository settings:

1. Go to Settings → Pages
2. Select the branch (e.g., `main`) and root folder
3. Your site will be available at `https://yourusername.github.io/apramreads/`

## License

MIT
