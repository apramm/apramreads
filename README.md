# Apram Reads

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

3. **Generate the blog manifest** to automatically discover your new post:
   ```bash
   node generate-manifest.js
   # Or using npm:
   npm run update-manifest
   ```
   
   This will scan all markdown files in the `blog/` directory and update the `blog-manifest.json` file.

4. **Commit and push** your changes to GitHub

## Creating a New Section

To add a new blog section:

1. Create a new folder in the `blog/` directory
2. Add your markdown files to the new folder
3. Run `node generate-manifest.js` to update the manifest
4. Your new section will automatically appear on the site!

## Local Development

Simply open `index.html` in your web browser. For the best experience, use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## License

MIT
