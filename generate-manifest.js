#!/usr/bin/env node

/**
 * Generate a manifest of all markdown files in the blog directory
 * This script should be run whenever new markdown files are added
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'blog');
const OUTPUT_FILE = path.join(__dirname, 'blog-manifest.json');

function getAllMarkdownFiles(dir, baseDir = dir) {
    const manifest = {};
    
    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively traverse subdirectories
                traverse(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                // Get the section name (relative directory from blog root)
                const relativePath = path.relative(baseDir, currentDir);
                const section = relativePath || 'root';
                
                if (!manifest[section]) {
                    manifest[section] = [];
                }
                
                manifest[section].push(entry.name);
            }
        }
    }
    
    traverse(dir);
    return manifest;
}

try {
    console.log('Scanning blog directory for markdown files...');
    const manifest = getAllMarkdownFiles(BLOG_DIR);
    
    // Sort files in each section alphabetically
    for (const section in manifest) {
        manifest[section].sort();
    }
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log('✓ Manifest generated successfully!');
    console.log('  File:', OUTPUT_FILE);
    console.log('  Sections found:', Object.keys(manifest).length);
    console.log('  Total files:', Object.values(manifest).reduce((sum, files) => sum + files.length, 0));
    console.log('\nManifest content:');
    console.log(JSON.stringify(manifest, null, 2));
} catch (error) {
    console.error('Error generating manifest:', error.message);
    process.exit(1);
}
