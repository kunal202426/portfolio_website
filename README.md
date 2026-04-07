# Kunal's Portfolio Website

A modern, interactive portfolio website built with React 18, Vite, TypeScript, TailwindCSS, and Framer Motion. Featuring the **OBSIDIAN FLUX** design system – a dark-luxury editorial aesthetic with smooth animations and precisely crafted interactions.

## 🚀 Features

- ✨ **Loading Screen**: Animated lettermark with progress counter
- 🧭 **Glassmorphic Navigation**: Sticky navbar with scroll detection and active section highlighting
- 🎭 **Hero Section**: Full-viewport hero with animated background and staggered content reveal
- 📖 **About Section**: Two-column layout with bio, statistics, and visual constellation
- 🎨 **Projects Showcase**: Interactive masonry grid with 3D card tilt and hover effects
- 📍 **Experience Timeline**: Vertical timeline with alternating layout and smooth animations
- 🎯 **Skills Arsenal**: Categorized skills with progress bars and infinite tool marquee
- 📧 **Contact Hub**: Integrated contact form and social links
- 🖱️ **Custom Cursor**: Interactive cursor that responds to interactive elements
- 🎬 **Smooth Scrolling**: Native CSS smooth scroll throughout
- 📱 **Fully Responsive**: Optimized for 375px to 1536px viewports
- 🌙 **Dark Theme**: OBSIDIAN FLUX color system with electric accents

## 🎨 Design System: OBSIDIAN FLUX

### Color Palette
```css
--bg-primary:       #080810   /* near-void black with blue undertone */
--bg-secondary:     #0D0D1A   /* deep navy surface */
--accent-primary:   #6C63FF   /* electric violet */
--accent-cyan:      #00E5FF   /* electric cyan */
--accent-rose:      #FF3CAC   /* hot pink */
--accent-gold:      #F5C542   /* warm gold */
--text-primary:     #F0EEF8   /* warm white */
```

### Typography Stack
- **Display**: Clash Display (bold headings)
- **Body**: DM Sans (main text)
- **Accent**: Space Grotesk (labels & tags)
- **Mono**: JetBrains Mono (code references)

## 📦 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18, TypeScript |
| Build | Vite 8
| Styling | TailwindCSS v4, PostCSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| 3D Graphics | Three.js (ready for integration) |
| Utilities | GSAP, Lenis, react-intersection-observer |

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to project directory
cd "Portfolio Website"

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📂 Project Structure

```
src/
├── components/
│   ├── canvas/              # Three.js canvas components
│   │   ├── HeroScene.tsx
│   │   ├── ParticleField.tsx
│   │   └── ...
│   ├── sections/            # Full-page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ResumeSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── LoadingScreen.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── ResumeModal.tsx
│   │   ├── ScrollProgress.tsx
│   │   └── SkillBadge.tsx
│   └── providers/           # Context providers
│       ├── CursorProvider.tsx
│       └── LenisProvider.tsx
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useMousePosition.ts
│   ├── useParallax.ts
│   ├── useIntersectionObserver.ts
│   ├── useMagneticEffect.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── resume-data.ts       # All resume content (structured)
│   └── animation-variants.ts # Framer Motion animation configs
├── assets/                  # Static files
├── App.tsx                  # Root component
├── index.css               # Global styles with CSS variables
├── App.css                 # App-specific styles
└── main.tsx                # Entry point
```

## 🎯 Key Components Deep Dive

### LoadingScreen Component
- **Features**: 
  - SVG "K" lettermark with animated stroke
  - Percentage counter (0-100%)
  - Gradient progress bar
  - Automatic completion with 3s timeout
  - Vertical wipe exit animation
  
### Navbar Component
- **Sticky positioning** at top
- **Glassmorphic blur** effect
- **Active section** indicator
- **Mobile hamburger** menu with staggered reveals
- **Scroll detection** compresses height and increases blur
- **Magnetic button** with cursor attraction

### ProjectCard Component
- **3D Mouse Tilt**: Rotates based on cursor within card bounds
- **Hover States**: 
  - Card lifts (translateY: -8px)
  - Border glow intensifies
  - Description slides up
  - Links fade in
- **Tech Badge Pills**: Animated on hover
- **Quick Links**: Both live and GitHub links with icons

### Experience Timeline
- **Gradient Line**: Animated from 0→100% on scroll
- **Alternating Layout**: Cards slide left/right
- **Timeline Dots**: Pulse animation with ripple effect
- **Achievement Bullets**: Individual fade-in animation

### SkillsSection
- **Category Grid**: 4 columns → 2 → 1 (responsive)
- **Animated Bars**: Fill animation with spring physics
- **Tool Marquee**: Infinite horizontal scroll (reversible)
- **Language Pills**: Individual scale animation on hover

### ResumeModal
- **In-Window Viewer**: No external PDF needed
- **Zoom Controls**: Scale between 50% - 200%
- **Page Navigation**: Previous/Next buttons
- **Download Link**: Full resolution PDF
- **Focus Trap**: Keyboard accessible
- **Exit Animation**: Slide down + blur fade

## 🎬 Animation System

### Global Principles
- **Easing Function**: `[0.25, 0.46, 0.45, 0.94]` (custom cubic bezier)
- **Stagger Delay**: 80ms between child animations
- **Spring Config**: `{ stiffness: 300, damping: 25 }`

### Scroll Reveals
```tsx
{
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: customEase }
  }
}
```

### Hover States
- **Buttons**: Scale 1.05 on hover, 0.95 on tap
- **Cards**: Lift + glow + tilt
- **Links**: Text color + underline animation

## ♿ Accessibility Features

- ✅ **WCAG 2.2 AA Compliance**: All interactive elements tested
- ✅ **Focus Management**: Visible focus rings on all buttons/links
- ✅ **Keyboard Navigation**: Full keyboard support with logical tab order
- ✅ **Semantic HTML**: Proper heading hierarchy & landmark regions
- ✅ **ARIA Labels**: For interactive states & icon buttons
- ✅ **Motion Preferences**: Respects `prefers-reduced-motion`
- ✅ **Color Contrast**: 4.5:1+ for body text, 3:1+ for large text
- ✅ **Skip Links**: Jump to main content
- ✅ **Focus Traps**: Inside modal dialogs

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Production Bundle | 363.19 KB |
| Gzipped Bundle | 113.14 KB |
| CSS Size | 10.76 KB (2.84 KB gzip) |
| JS Size | ~350 KB before gzip |
| Lighthouse Target | ≥95 across all metrics |

### Optimization Strategies
- Code splitting by section (lazy components)
- Efficient CSS variable usage
- Minimal third-party dependencies
- Image optimization with blur placeholders
- Spring animations offload to GPU

## 📝 Resume Data Structure

All resume content is centralized in `src/lib/resume-data.ts`:

```typescript
{
  personal: { name, email, phone, linkedin, github }
  summary: "Full Stack Developer..."
  education: [{...}]
  experience: [{
    company, title, period, location,
    achievements: [...]
  }]
  projects: [{
    title, subtitle, description, tags, year,
    liveUrl, githubUrl, featured, color
  }]
  skills: {
    languages: [...],
    frontend: [...],
    backend: [...],
    mlai: [...],
    blockchain: [...],
    tools: [...],
    concepts: [...]
  }
  achievements: [{...}]
  certifications: [{...}]
}
```

## 🎨 Customization Guide

### Change Color Scheme
Edit `tailwind.config.ts` and `src/index.css`:
```css
:root {
  --accent-primary: #YOUR_COLOR;
  --text-primary: #YOUR_FONT_COLOR;
  /* ... other colors ... */
}
```

### Add New Section
1. Create component in `src/components/sections/NewSection.tsx`
2. Import in `App.tsx`
3. Add to main render
4. Update Navbar links

### Modify Animations
Edit `src/lib/animation-variants.ts` to adjust:
- Duration
- Easing
- Stagger amounts
- Spring physics

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist/`

### Manual
```bash
npm run build
# Deploy `dist/` folder to any static host
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## 🔗 External Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Framer Motion API](https://www.framer.com/motion/)
- [Three.js Manual](https://threejs.org/manual/)

## 📄 License

MIT License - feel free to use this portfolio template as inspiration for your own!

## 👤 Author

**Kunal Mathur** - Full Stack Developer & UI/UX Designer

- 📧 Email: [mathurkunal000@gmail.com](mailto:mathurkunal000@gmail.com)
- 🔗 LinkedIn: [kunal-mathur-612108267](https://linkedin.com/in/kunal-mathur-612108267)
- 💻 GitHub: [@kunal202426](https://github.com/kunal202426)
- 📱 Phone: +91 759-720-9058

---

**Built with ❤️ using React, TypeScript, Framer Motion, and TailwindCSS**

*Last Updated: April 2026* ✨
