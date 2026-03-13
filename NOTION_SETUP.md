# Notion CMS Setup Guide

Your love story website is now connected to Notion! Here's how to use it.

## Step 1: Get Your Notion Integration Token

1. Go to https://www.notion.com/my-integrations
2. Click "Create new integration"
3. Name it: `OurLoveStory`
4. Click "Create"
5. Copy the "Internal Integration Token" (starts with `secret_`)

## Step 2: First Time Setup

When you visit your website for the first time:

1. A popup will ask for your Notion Integration Token
2. Paste the token you copied
3. Click OK
4. The website will load your timeline and gallery from Notion

## Step 3: Share Your Databases with the Integration

For each database (Timeline and Gallery):

1. Open the database in Notion
2. Click the three dots (•••) in the top right
3. Click "Connections"
4. Search for "OurLoveStory" integration
5. Click to connect it

## Step 4: Add Content to Notion

### Timeline Database

Add rows with these properties:

- **Year** (Text): The year of the milestone
- **Title** (Text): Event name (e.g., "How We Met")
- **Description** (Text): Story details
- **Image** (URL): Optional image URL

Example:

```
Year: 2020
Title: How We Met
Description: We met at a coffee shop on a rainy Tuesday...
Image: https://example.com/photo.jpg
```

### Gallery Database

Add rows with these properties:

- **Title** (Text): Photo title
- **Image** (URL): Direct link to your image
- **Description** (Text): Caption or description
- **Date** (Date): When the photo was taken

Example:

```
Title: Our First Trip
Image: https://example.com/trip-photo.jpg
Description: Beach vacation in summer 2021
Date: 2021-07-15
```

## Step 5: Update Your Website

Once you add content to Notion:

1. Refresh your website
2. Your new timeline and gallery items will appear automatically
3. No code editing needed!

## How to Add Images to Notion

### Option 1: Use Image URLs

- Upload photos to a service like Imgur, Google Photos, or Cloudinary
- Copy the image URL
- Paste it in the Image field

### Option 2: Upload to Notion

- Click the Image field
- Upload directly to Notion
- Copy the image URL from Notion

## Troubleshooting

**"Unable to load timeline/gallery"**

- Make sure you've shared your databases with the OurLoveStory integration
- Check that your token is correct
- Refresh the page

**Images not showing**

- Make sure the image URL is correct and publicly accessible
- Try a different image URL to test

**Token not working**

- Go to https://www.notion.com/my-integrations
- Check if your integration is still active
- Create a new token if needed

## Security Note

Your Notion token is stored in your browser's local storage. It's only used to fetch your data from Notion. Never share your token with anyone.

## Need Help?

- Check Notion's documentation: https://developers.notion.com
- Make sure all databases are shared with your integration
- Verify your token is correct

---

Enjoy updating your love story forever! 💕
