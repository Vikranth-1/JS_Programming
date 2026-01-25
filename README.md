# JavaScript Programming Notes Website

A comprehensive, dark-mode-first notes website for structured JavaScript programming study.

## Features

- **Dark Mode by Default**: With optional theme switching (light, sepia, blue light)
- **Multi-level Navigation**: Expandable dropdowns for all topics
- **File Preview**: Direct viewing of .txt notes within the interface
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Filter through topics and files
- **Metadata Display**: Shows reading time and word count

## GitHub Pages Deployment

To deploy this website on GitHub Pages:

1. Push this repository to GitHub
2. Go to your repository Settings → Pages
3. Select source as "Deploy from a branch"
4. Choose the main branch and root folder
5. Your site will be available at `https://yourusername.github.io/repository-name`

## File Structure Compatibility

For best compatibility with GitHub Pages, ensure filenames:
- Don't contain special characters like en-dashes (–) or em-dashes (—)
- Use regular hyphens (-) instead
- Avoid special Unicode characters in filenames

If you have files with special characters (like "JAVASCRIPT COURSE - INDEX"), consider renaming them to use standard ASCII characters before deploying to GitHub Pages.

## Local Development

To run locally:
1. Open `index.html` in your browser (some features may not work due to CORS)
2. Or use a local server like `python -m http.server` or Live Server extension

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks)
- CSS variables for theming
- Responsive design with Flexbox
- Font Awesome for icons
- LocalStorage for theme persistence

## Note

This project is designed as a frontend-only application that dynamically loads .txt files from the same directory structure. When deployed to GitHub Pages, all .txt files will be served as static assets and accessible via fetch requests.