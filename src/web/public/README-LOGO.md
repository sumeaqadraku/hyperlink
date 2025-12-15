# Logo Setup Instructions

## Where to Place Your Logo

Place your `logo.png` file in the **public** folder:

```
src/web/public/logo.png
```

The logo is referenced in the code as `/logo.png` which automatically points to the public folder.

## Logo Requirements

- **File name**: `logo.png` (exactly)
- **Recommended size**: 512x512 pixels (will be displayed at 32px height)
- **Format**: PNG with transparent background (recommended)
- **Alternative formats**: You can also use `.svg`, `.jpg`, or `.webp` - just update the file extension in the code

## Current Usage

The CoreWave logo appears in:

1. **Public Header** - Top navigation bar (32px height)
2. **Dashboard Sidebar** - Left sidebar brand section (32px height)
3. **Dashboard Header** - Top navigation bar (32px height)
4. **Footer** - Footer brand section (24px height)

## If You Want to Change the Logo Path

If you want to use a different location or filename, update these files:

1. `src/layouts/PublicLayout.tsx` - Lines with `<img src="/logo.png"`
2. `src/layouts/DashboardLayout.tsx` - Lines with `<img src="/logo.png"`

## Current Brand Name

The application is now branded as **CoreWave** throughout all pages and layouts.
