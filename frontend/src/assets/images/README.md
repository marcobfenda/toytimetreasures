# Hero Background Image Setup

## How to Add Your Hero Background Image

1. **Place your image file** in this directory (`src/assets/images/`)
2. **Rename it to** `hero-bg.jpg` (or update the CSS path below)
3. **Recommended image specifications:**
   - **Format**: JPG, PNG, or WebP
   - **Dimensions**: 1920x1080px or larger (16:9 aspect ratio)
   - **File size**: Under 500KB for optimal performance
   - **Content**: High-quality, relevant to your business

## Image Sources

Here are some great places to find royalty-free images:

### Free Options:
- **Unsplash** (https://unsplash.com) - High-quality free photos
- **Pexels** (https://pexels.com) - Free stock photos
- **Pixabay** (https://pixabay.com) - Free images and videos
- **StockSnap** (https://stocksnap.io) - Free stock photos

### Search Terms for E-commerce:
- "shopping", "retail", "products", "lifestyle"
- "modern office", "business", "technology"
- "clean background", "minimal", "professional"

## CSS Configuration

The hero section is configured in `src/views/Home.vue` with these CSS properties:

```css
.hero-section {
  background-image: url('/src/assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 50vh;
  display: flex;
  align-items: center;
  position: relative;
}
```

## Customization Options

### Change Image Path:
If you want to use a different filename, update the CSS:
```css
background-image: url('/src/assets/images/your-image-name.jpg');
```

### Adjust Overlay Darkness:
The dark overlay can be adjusted in the CSS:
```css
.hero-background-overlay {
  background: rgba(0, 0, 0, 0.5); /* 0.5 = 50% darkness */
}
```

### Change Background Position:
```css
background-position: center; /* Options: center, top, bottom, left, right */
```

## Current Setup

- ✅ Background image support added
- ✅ Dark overlay for text readability
- ✅ Responsive design maintained
- ✅ Text shadows enhanced for better visibility
- ✅ 50vh height maintained as requested

## Troubleshooting

If the image doesn't appear:
1. Check the file path is correct
2. Ensure the image file exists in the right directory
3. Verify the image format is supported
4. Check browser console for any errors

The hero section will fall back to a dark background if no image is found.
