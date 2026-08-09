# Color Customization Guide

## How to Change Colors

All colors in this application are centrally managed through the `app/colors.config.js` file. To change any color, simply edit this file and the changes will be applied throughout the entire application.

## Primary Color Configuration

### Current Primary Colors:
- **Light Theme**: `#3448C5` (Purple-Blue)
- **Dark Theme**: `#5B6FD8` (Light Purple-Blue)

### To Change Primary Colors:

1. Open `app/colors.config.js`
2. Modify the primary colors:

```javascript
const colors = {
  primary: {
    light: '#your-new-color',  // Replace with your desired light theme color
    dark: '#your-new-color',   // Replace with your desired dark theme color
  },
  // ... other colors
};
```

### Examples:

#### Red Theme:
```javascript
primary: {
  light: '#dc2626',  // Red-600
  dark: '#f87171',   // Red-400
}
```

#### Green Theme:
```javascript
primary: {
  light: '#059669',  // Emerald-600
  dark: '#34d399',   // Emerald-400
}
```

#### Purple Theme:
```javascript
primary: {
  light: '#7c3aed',  // Violet-600
  dark: '#a78bfa',   // Violet-400
}
```

## Other Customizable Colors

You can also customize:

- **Secondary Colors**: Used for secondary buttons and accents
- **Accent Colors**: Used for highlights and special elements
- **Base Colors**: Background colors and text colors
- **Status Colors**: Info, success, warning, and error colors

## Files That Are Updated Automatically

When you change colors in `colors.config.js`, these files are automatically updated:

1. `tailwind.config.js` - DaisyUI theme configuration
2. `app/globals.css` - CSS variables and overrides
3. `app/force-colors.css` - Force overrides for consistent styling

## Testing Your Changes

After changing colors:

1. Restart your development server: `npm run dev`
2. Test both light and dark modes using the theme toggle on `/home` and other app pages
3. Check various components like buttons, cards, and navigation

> The `/simple-test`, `/color-test`, and `/debug-colors` pages previously used for this were removed from the app because they were shipped as live, authenticated production routes. If you need a dedicated color-preview page again, add one outside the `(app)` route group (or gate it behind a dev-only environment check) rather than restoring it as a normal authenticated route.

## Color Format

Colors should be provided in HEX format (e.g., `#00a9e7`). The system automatically:
- Converts them to HSL for DaisyUI compatibility
- Generates appropriate hover states
- Ensures proper contrast ratios

## Best Practices

1. **Contrast**: Ensure good contrast between primary colors and white text
2. **Accessibility**: Test colors with accessibility tools
3. **Consistency**: Use the same color family for light and dark themes
4. **Testing**: Always test in both light and dark modes

## Need Help?

If you need help choosing colors or have issues with the color system, inspect the CSS variables defined in `app/globals.css` directly (via browser devtools) or `app/force-colors.css`.