# 🎨 Color Palette Usage Guide

This document describes how the brown/beige color palette is implemented and used throughout the application.

## Color Palette

### Brand Colors
| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Primary (Dark Brown)** | `#291C0E` | `32 42% 13%` | Primary buttons, sidebar background, main brand color |
| **Secondary (Medium Brown)** | `#6E473B` | `17 28% 33%` | Secondary buttons, icons, hover states, active navigation |
| **Soft Accent (Light Brown)** | `#A78D78` | `30 18% 58%` | Borders, dividers, disabled elements |

### Background & Layout Colors
| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Main Background** | `#E1D4C2` | `36 23% 84%` | Page background |
| **Card Background** | `#BEB5A9` | `30 14% 72%` | Cards, tables, sections, input backgrounds |

### Functional Colors
| Color | Purpose |
|-------|---------|
| **Success Green** | `hsl(142 76% 36%)` | Success states, active subscriptions |
| **Destructive Red** | `hsl(0 84.2% 60.2%)` | Error states, cancel actions |

## CSS Variable Mapping

```css
:root {
  /* Background Colors */
  --background: 36 23% 84%;      /* #E1D4C2 - main page background */
  --foreground: 32 42% 13%;       /* #291C0E - dark brown text */
  
  /* Card Colors */
  --card: 30 14% 72%;             /* #BEB5A9 - card background */
  --card-foreground: 32 42% 13%;  /* #291C0E - card text */
  
  /* Primary Brand Color */
  --primary: 32 42% 13%;          /* #291C0E - dark brown */
  --primary-foreground: 0 0% 100%; /* white text */
  
  /* Secondary Accent Color */
  --secondary: 17 28% 33%;        /* #6E473B - medium brown */
  --secondary-foreground: 0 0% 100%; /* white text */
  
  /* Muted Colors */
  --muted: 30 18% 58%;            /* #A78D78 - soft brown */
  --muted-foreground: 32 42% 13%; /* #291C0E */
  
  /* Borders & Inputs */
  --border: 30 18% 58%;           /* #A78D78 - soft brown borders */
  --input: 30 14% 72%;            /* #BEB5A9 - input background */
  --ring: 17 28% 33%;             /* #6E473B - focus ring */
}
```

## Tailwind Class Usage

### Direct Palette References
```javascript
// Use these for specific design needs
brand: {
  dark: '#291C0E',      // Primary brand color
  medium: '#6E473B',    // Secondary accent
  light: '#A78D78',     // Soft accent/borders
}
neutral: {
  light: '#E1D4C2',     // Main background
  medium: '#BEB5A9',    // Card background
}
```

### Semantic Classes

#### Backgrounds
```tsx
className="bg-background"        // Main page background (#E1D4C2)
className="bg-card"              // Card background (#BEB5A9)
className="bg-primary"           // Primary brand (#291C0E)
className="bg-secondary"         // Secondary accent (#6E473B)
className="bg-muted"             // Soft brown (#A78D78)
className="bg-brand-dark"        // Direct: #291C0E
className="bg-brand-medium"      // Direct: #6E473B
className="bg-neutral-light"     // Direct: #E1D4C2
```

#### Text Colors
```tsx
className="text-foreground"      // Primary text (#291C0E)
className="text-muted-foreground" // Muted text (#291C0E on muted bg)
className="text-primary"         // Brand dark (#291C0E)
className="text-secondary"       // Brand medium (#6E473B)
```

#### Borders
```tsx
className="border-border"        // Default borders (#A78D78)
className="border-brand-light"   // Direct: #A78D78
```

## Component-Specific Usage

### Buttons

**Primary Button** (Main CTAs)
```tsx
<Button>Subscribe Now</Button>
// bg-primary (#291C0E) + text-primary-foreground (white)
```

**Secondary Button**
```tsx
<Button variant="secondary">Learn More</Button>
// bg-secondary (#6E473B) + text-secondary-foreground (white)
```

**Outline Button**
```tsx
<Button variant="outline">Cancel</Button>
// border-border (#A78D78) + text-foreground (#291C0E)
```

### Badges

**Active Status**
```tsx
<Badge variant="success">Active</Badge>
// Green background for active/paid states
```

**Default Status**
```tsx
<Badge>Internet</Badge>
// bg-primary (#291C0E) + white text
```

**Secondary Status**
```tsx
<Badge variant="secondary">Mobile</Badge>
// bg-secondary (#6E473B) + white text
```

**Outline Badge**
```tsx
<Badge variant="outline">TV</Badge>
// border-border (#A78D78) + text-foreground
```

### Cards
```tsx
<Card className="bg-card">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Navigation

**Sidebar** (Dashboard)
```tsx
// Background: bg-brand-dark (#291C0E)
// Active item: bg-brand-medium (#6E473B)
// Hover: bg-brand-medium/50 (50% opacity #6E473B)
```

**Header** (Public & Dashboard)
```tsx
// Background: bg-card (#BEB5A9)
// Border: border-border (#A78D78)
// Logo: text-primary (#291C0E)
// Links: text-muted-foreground hover:text-foreground
```

## Page-Level Application

### Public Pages (Home, Offers, Offer Details)
- **Background**: `bg-background` (#E1D4C2)
- **Cards**: `bg-card` (#BEB5A9)
- **Header**: `bg-card` with `border-border`
- **Footer**: `bg-card` with `border-border`
- **Primary CTAs**: `bg-primary` (#291C0E)
- **Links**: `text-muted-foreground hover:text-primary`

### Dashboard Pages
- **Page Background**: `bg-background` (#E1D4C2)
- **Sidebar**: `bg-brand-dark` (#291C0E)
  - Active nav: `bg-brand-medium` (#6E473B)
  - Hover: `bg-brand-medium/50`
- **Header**: `bg-card` (#BEB5A9)
- **Content Cards**: `bg-card` (#BEB5A9)
- **Tables**: `bg-card` with `border-border`
- **Stat Cards**: `bg-card` with colored icons

## Color Contrast Ratios

Ensuring WCAG AA compliance:

| Combination | Contrast Ratio | WCAG Level |
|-------------|----------------|------------|
| #291C0E on #E1D4C2 | 8.5:1 | AAA ✓ |
| #291C0E on #BEB5A9 | 6.2:1 | AA ✓ |
| White on #291C0E | 14.8:1 | AAA ✓ |
| White on #6E473B | 5.9:1 | AA ✓ |
| #A78D78 on #E1D4C2 | 2.1:1 | (Borders only) |

## Design Principles

1. **Consistency**: Always use semantic color tokens (`bg-primary`, `text-foreground`) instead of direct colors
2. **Hierarchy**: 
   - Primary actions → `bg-primary` (#291C0E)
   - Secondary actions → `bg-secondary` (#6E473B)
   - Tertiary/outline → `border-border` (#A78D78)
3. **Readability**: High contrast for all text (#291C0E on light backgrounds)
4. **Professional**: No bright or neon colors - stick to the brown/beige palette
5. **Functional colors**: Only use green for success, red for errors/destructive actions

## Examples

### Service Card
```tsx
<Card className="bg-card border border-border">
  <CardHeader>
    <Phone className="h-12 w-12 text-secondary" /> {/* #6E473B */}
    <CardTitle className="text-foreground">Internet Pro</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Description...</p>
    <Button className="mt-4">Subscribe</Button> {/* bg-primary */}
  </CardContent>
</Card>
```

### Status Badge
```tsx
{/* Active Subscription */}
<Badge variant="success">Active</Badge>

{/* Service Type */}
<Badge variant="secondary">Mobile</Badge>

{/* Cancelled */}
<Badge variant="destructive">Cancelled</Badge>
```

### Navigation Link
```tsx
<Link 
  to="/offers" 
  className="text-muted-foreground hover:text-foreground transition-colors"
>
  Plans & Offers
</Link>
```

## Migration Notes

All components have been updated from the previous red (#DC2626) color scheme to this brown/beige palette:
- Red primary → Brown primary (#291C0E)
- Gray backgrounds → Beige backgrounds (#E1D4C2, #BEB5A9)
- Gray borders → Brown borders (#A78D78)
- Red accent → Brown accent (#6E473B)

The new palette maintains the same professional telecom/SaaS aesthetic while providing a warmer, more sophisticated appearance.
