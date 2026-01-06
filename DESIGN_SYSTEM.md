# Design System Documentation

## Platform: لِمّ المنهج (Lemm Al-Manhaj)

### Overview
Modern Arabic tech-education landing page with original design assets, professional dark theme, and full RTL support.

---

## 1. Color System

### Primary Palette
| Role | Color | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| Background | Dark Navy | #0F172A | 15, 23, 42 | Page background |
| Surface | Steel Blue | #1E293B | 30, 41, 59 | Cards, containers |
| Border | Slate | #334155 | 51, 65, 85 | Dividers, subtle borders |
| Primary Accent | Turquoise | #06D6D6 | 6, 214, 214 | Main highlights, CTAs |
| Secondary Accent | Purple | #A855F7 | 168, 85, 247 | Alternative highlights, buttons |
| Tertiary Accent | Gold | #FBBF24 | 251, 191, 36 | Special elements |

### Text Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | White | #FFFFFF | Main headings |
| Secondary | Light Gray | #CBD5E1 | Body text, descriptions |
| Tertiary | Medium Gray | #94A3B8 | Helper text, captions |

### Opacity Variants
- Full: 1.0 (100%)
- High: 0.8 (80%)
- Medium: 0.5 (50%)
- Low: 0.1 (10%)

---

## 2. Typography System

### Font Stack

**Primary (Headings)**
```
'Cairo', 'IBM Plex Sans Arabic', serif
```
- Modern, bold Arabic font
- High readability
- Strong character

**Secondary (Body)**
```
'IBM Plex Sans Arabic', 'Cairo', sans-serif
```
- Professional, elegant
- Good for long-form text
- Maintains Arabic authenticity

### Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| h1 | 3.75rem (60px) | 900 | Page title, hero headline |
| h2 | 2.25rem (36px) | 700 | Section titles |
| h3 | 1.875rem (30px) | 700 | Card titles, subsections |
| h4 | 1.5rem (24px) | 600 | Feature titles |
| Body Large | 1.125rem (18px) | 400-500 | Descriptions |
| Body Base | 1rem (16px) | 400 | Main body text |
| Body Small | 0.875rem (14px) | 400 | Helper text |
| Caption | 0.75rem (12px) | 500 | Metadata, captions |

### Font Weights
- 400: Regular (body text)
- 500: Medium (emphasis, secondary content)
- 600: Semibold (labels, buttons)
- 700: Bold (headings, titles)
- 900: ExtraBold (hero titles)

---

## 3. Spacing System

Based on 0.5rem base unit:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 0.25rem | Minimal spacing |
| sm | 0.5rem | Small gaps |
| md | 1rem | Base spacing |
| lg | 1.5rem | Standard gaps |
| xl | 2rem | Component spacing |
| 2xl | 3rem | Section spacing |
| 3xl | 4rem | Large sections |

---

## 4. Component Library

### Buttons

**Primary Button**
```
Background: Linear gradient(turquoise → cyan)
Color: Dark navy text
Padding: 1rem 2rem
Border radius: 0.75rem
Box shadow: 0 4px 15px rgba(6, 214, 214, 0.3)
Hover: Translate Y -2px, enhanced shadow
```

**Secondary Button**
```
Background: Transparent
Border: 2px solid turquoise
Color: Turquoise
Padding: 1rem 2rem
Hover: Background rgba(6, 214, 214, 0.1)
```

### Cards

**Feature Card**
```
Background: Gradient (steel blue → slate with transparency)
Border: 1px solid rgba(turquoise, 0.1)
Border radius: 1rem
Padding: 2rem
Hover:
  - Translate Y -8px
  - Border: turquoise
  - Shadow: 0 20px 60px rgba(6, 214, 214, 0.1)
```

### Icons

- Size: 48x48px
- Stroke width: 2px
- Colors: Primary and secondary accents
- Style: Outlined, geometric

---

## 5. Animation System

### Transitions
- Fast: 150ms ease-in-out (hover states)
- Base: 200ms ease-in-out (general transitions)
- Slow: 300ms ease-in-out (page transitions)

### Keyframe Animations
- Float: 6s ease-in-out (continuous, vertical movement)
- Rotate: 20-30s linear (background decorations)
- Fade-in: 0.6s ease-out (intersection observer)
- Typing: 3s ease-in-out (character animation)
- Ripple: 0.6s ease-out (button effect)

---

## 6. Responsive Breakpoints

### Desktop (1200px+)
- Full 2-column layouts
- Max container width: 1200px
- Full feature sets displayed

### Tablet (768px - 1199px)
- Single column layouts
- Adjusted spacing
- Navigation optimization

### Mobile (480px - 767px)
- Single column only
- Reduced font sizes
- Vertical button stacks
- Optimized spacing

### Small Mobile (<480px)
- Minimum viable layout
- Compact spacing
- Touch-friendly elements (min 44px height)

---

## 7. RTL (Right-to-Left) Implementation

### HTML
```html
<html lang="ar" dir="rtl">
```

### CSS Mirroring
- `right` instead of `left`
- `direction: rtl` on body
- `text-align: right` for content
- Grid columns naturally reverse
- Flex direction adapts

### Layout Principles
- Hero content reversed (text on right, image on left)
- Navigation items flow RTL naturally
- All interactive elements properly positioned
- No hardcoded left/right margins

---

## 8. Accessibility (WCAG AA)

### Color Contrast
- Text on background: 14:1 (AAA)
- Accent on dark: 8:1+ (AA)
- Interactive elements: Clear focus states

### Keyboard Navigation
- Tab order: Logical, RTL-aware
- Focus visible: Clear outline
- Link targets: Min 44px height/width

### Semantic HTML
```html
<nav> - Navigation
<section> - Content sections
<h1-h6> - Proper heading hierarchy
<button> - Interactive elements
<a> - Links
<article> - Content blocks
```

### ARIA Labels
- Images: `alt` text for context
- Icons: `aria-label` for meaning
- Interactive: `role` attributes

---

## 9. Design Patterns

### Hero Section Pattern
```
[ Image ]  |  [ Headline ]
[  Hero ]  |  [ Description ]
           |  [ CTA Buttons ]
           |  [ Stats ]
```

### Card Grid Pattern
```
[ Card 1 ]  [ Card 2 ]  [ Card 3 ]
[ Card 4 ]  [ Card 5 ]  [ Card 6 ]
```
Auto-responsive: 3 columns → 2 → 1

### Navigation Pattern
```
[ Logo ]  [ Links... ]  [ CTA ]
```
Sticky top, transparent → opaque on scroll

---

## 10. Custom SVG Illustration Specs

### Character Illustration
- **Viewbox**: 300x350
- **Style**: Flat/semi-flat vector
- **Elements**:
  - Head: Circle (peach tone)
  - Hair: Path element
  - Body: Purple torso
  - Laptop: Dark device with code lines
  - Chair: Dark base with turquoise legs
  - Floating icons: Code brackets, lightbulb

### Color Scheme
- Skin: #FFD4A3 (peach)
- Hair: #2C1810 (dark brown)
- Clothes: #A855F7 (purple)
- Accents: #06D6D6 (turquoise)
- Code: #A855F7 + #06D6D6

### Animation
- Floating: 6s vertical bounce
- Typing: Character arms move subtly
- Drop shadow: Creates depth

---

## 11. Performance Considerations

### Critical Rendering Path
1. HTML loaded
2. CSS parsed (variables loaded immediately)
3. Fonts loaded (Google Fonts CDN)
4. SVG rendered
5. JavaScript initialized

### Optimization Strategies
- Inline SVG (no extra requests)
- CSS variables (efficient theming)
- Hardware acceleration (transform, opacity)
- Lazy animations (reduced motion support)
- No external image files

### File Sizes
- HTML: ~8KB
- CSS: ~15KB
- JS: ~4KB
- Total: ~27KB (uncompressed)

---

## 12. Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✓ | ✓ | ✓ | ✓ |
| CSS Variables | ✓ | ✓ | ✓ | ✓ |
| Flexbox | ✓ | ✓ | ✓ | ✓ |
| SVG | ✓ | ✓ | ✓ | ✓ |
| Animations | ✓ | ✓ | ✓ | ✓ |
| RTL Support | ✓ | ✓ | ✓ | ✓ |
| Intersection Observer | ✓ | ✓ | ✓ | ✓ |

---

## 13. Future Enhancement Ideas

- Dark/Light theme toggle
- Multi-language support
- Advanced filtering in courses
- Student testimonials section
- Blog/news feed
- Contact form
- Video integration
- Live chat widget
- Payment integration
- User authentication

---

## 14. Design Assets

### Fonts Used
- Google Fonts: Cairo, IBM Plex Sans Arabic
- No local font files needed

### Icons
- Custom SVG icons
- No icon library dependency

### Images
- Original custom SVG illustration
- No external image files

### Gradients
Used throughout for depth and visual interest:
- Turquoise → Cyan
- Purple → Transparent
- Dark → Slightly lighter

---

## 15. Version History

**v1.0 - Initial Release**
- Complete landing page design
- Original SVG illustration
- Full RTL support
- Responsive design
- Interactive elements
- Accessibility compliance

---

**Last Updated**: January 6, 2025  
**Status**: Production Ready  
**Compatibility**: All modern browsers

