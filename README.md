# Our Love Story Website

A beautiful, responsive website to share your love story with timeline, photo gallery, and more.

## Features

- 💕 Romantic design with gradient colors
- 📅 Interactive timeline for milestones
- 🖼️ Photo gallery section
- 📱 Fully responsive (works on mobile, tablet, desktop)
- ✉️ Contact form
- 🚀 Easy to deploy

## How to Use

### 1. Update Your Story

Edit `index.html` to add your personal details:

- **Timeline**: Replace the placeholder dates and stories with your actual milestones
- **Gallery**: Replace placeholder images with your own photos
- **Hero Section**: Update the title and subtitle

### 2. Add Your Photos

Replace the placeholder image URLs in the gallery section:

```html
<img src="https://via.placeholder.com/300x300?text=Memory+1" alt="Memory 1" />
```

Replace with your actual image URL or local file path:

```html
<img src="images/photo1.jpg" alt="Memory 1" />
```

Create an `images` folder and add your photos there.

### 3. Customize Colors

Edit `styles.css` to change the color scheme:

```css
:root {
  --primary-color: #ff6b9d; /* Main pink color */
  --secondary-color: #ffa07a; /* Light salmon */
  --dark-color: #2c3e50; /* Dark text */
  --light-color: #ecf0f1; /* Light background */
}
```

## Deployment Options

### Option 1: GitHub Pages (Free & Easy)

1. Push your code to GitHub
2. Go to your repository settings
3. Scroll to "GitHub Pages"
4. Select "main" branch as source
5. Your site will be live at: `https://yourusername.github.io/OurLoveStory`

### Option 2: Traditional Server

1. Upload all files to your server via FTP/SSH
2. Make sure `index.html` is in the root directory
3. Access via your domain

### Option 3: Netlify (Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Deploy automatically

## File Structure

```
OurLoveStory/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript functionality
├── images/         # Your photos folder (create this)
└── README.md       # This file
```

## How to Update Frequently

1. Edit the HTML/CSS files locally
2. Add new photos to the `images` folder
3. Commit changes: `git add .` then `git commit -m "Update story"`
4. Push to GitHub: `git push origin main`
5. Your site updates automatically (if using GitHub Pages)

## Tips

- Keep image file sizes small (compress before uploading)
- Use high-quality photos for best results
- Update the timeline with new milestones regularly
- Add captions to gallery photos for context

## Need Help?

- Check the comments in the HTML file for guidance
- Customize the CSS to match your style
- Add more timeline items by copying the timeline-item div

---

Made with 💕 for your love story

## Deployed on Vercel

Your website is now live with Notion integration!
