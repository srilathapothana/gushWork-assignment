# HDPE Pipes & Coils — Product Detail Page

> Gushwork Web Developer Assignment — submitted by **Srilatha**

A fully responsive product detail page built with **vanilla HTML, CSS, and JavaScript** — no frameworks or libraries. Faithfully implements the Figma design with all interactive features working across desktop, tablet, and mobile.

🔗 **Figma Reference:** [Gushwork Assignment Design](https://www.figma.com/design/DOv07H7C2tA5UrVLhmfwfW/Gushwork-Assignment?node-id=490-8785)

---

## 🚀 Getting Started

Open `index.html` directly in any browser — no build step, no server required.

```
double-click index.html  →  opens in browser
```

---

## 📁 Project Structure

```
gushWork_assignment/
├── index.html        # Semantic HTML structure
├── styles.css        # All styles (3,400+ lines, 39 media queries)
├── script.js         # All interactivity (single DOMContentLoaded entry point)
└── Asset/            # Images, icons, SVGs
    ├── Frame-1.png / Frame-2.jpg / Frame-3.jpg   # Product images
    ├── NavBarImg/                                 # Logo & nav icons
    └── *.svg / *.png                              # Icons & certifications
```

---

## ✅ Features Implemented

### 1. Sticky Header
- Hidden by default; slides in smoothly once the user scrolls **past the product section**
- Disappears cleanly when scrolling back to the top fold
- Uses `getBoundingClientRect()` on the product section — no arbitrary pixel thresholds

### 2. Image Carousel with Zoom Preview
- Navigate via **thumbnail clicks** or **left / right arrow buttons**
- Each thumbnail slot maps to a distinct product image (`Frame-1`, `Frame-2`, `Frame-3`)
- **Hover zoom:** a 300×300px preview box tracks the cursor over the main image
  - Calculates `backgroundPosition` from cursor percentage within the image
  - Uses `position: fixed` + viewport-aware coords — works correctly at any scroll depth
  - Auto-flips to the left side when too close to the right edge of the screen

### 3. Navigation
- **Desktop:** dropdown menu on "Products" with smooth-scroll to each product section
- **Mobile (≤992px):** hamburger menu toggles `.show` class matching the CSS transition
- **"About Us"** and all nav links smooth-scroll to their respective page sections
- Dropdown closes on outside click; mobile menu closes on nav-link click

### 4. Manufacturing Process
- **Desktop (>800px):** tab buttons switch between 8 process steps with content panels
- **Mobile (<800px):** full-screen card carousel with prev/next buttons, touch swipe, and keyboard arrow support
- Step badge updates (`Step N/8: Title`) on every navigation

### 5. Applications Carousel
- Horizontally scrollable card track with prev/next buttons
- Responsive: recalculates visible cards and max index on window resize
- Touch swipe support (50px threshold)

### 6. Testimonials
- Drag-to-scroll carousel (mouse drag + touch swipe)
- Cursor changes to `grabbing` during drag via `.active-drag` class

### 7. FAQ Accordion
- Only one item open at a time; `aria-expanded` updated for accessibility
- Smooth CSS transitions on open/close

### 8. Forms & CTAs
| Element | Behaviour |
|---|---|
| **Get Custom Quote** | Scrolls to contact form |
| **View Technical Specs** | Scrolls to specs section |
| **Request a Quote** | Scrolls to contact form |
| **Contact Us** (nav) | Scrolls to contact section |
| **Talk to an Expert** | Confirmation alert |
| **Download Datasheet** | Download alert with filename |
| **Resource download buttons** | Download alert with filename |
| **Catalogue email form** | Email validation → simulated send with loading state |
| **Contact form** | Full validation (name, email, phone) before submit |

### 9. Scroll Reveal Animations
- `IntersectionObserver` fades in `.feature-card`, `.testimonial-card`, `.portfolio-card`, `.faq-item`, `.application-card`, `.specs-row` as they enter the viewport
- 0.5s ease transition; element unobserved after first reveal (performance)

### 10. Responsive Company Logos
- Dynamically shows/hides logos based on viewport width (3–6 logos visible)
- Recalculates on `resize` event

---

## 🛠️ Tech Stack

| Technology | Details |
|---|---|
| **HTML5** | Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<address>`) |
| **CSS3** | Custom properties (`:root`), Flexbox, Grid, transitions, 39 media queries |
| **JavaScript ES6+** | `const`/`let`, arrow functions, classes (`ManufacturingCarousel`), `IntersectionObserver`, optional chaining |

> ✅ Zero frameworks. Zero libraries. Pure vanilla code.

---

## 📐 Responsive Breakpoints

| Breakpoint | Layout change |
|---|---|
| `≤ 1600px` | Container width adjusts |
| `≤ 1240px` | Manufacturing carousel activates |
| `≤ 992px` | Hamburger menu replaces nav |
| `≤ 800px` | Product grid stacks, mobile carousel for manufacturing |
| `≤ 768px` | Thumbnail row, specs table adjust |
| `≤ 480px` | Single-column everything, smaller font sizes |

---

## 🌐 Browser Compatibility

Compatible with all modern browsers: Chrome, Firefox, Edge, Safari.

---

## 🔍 Code Quality Notes

- Single `DOMContentLoaded` entry point — all DOM-dependent code runs after parse
- Null-guards on every `querySelector` before attaching listeners
- `{ passive: true }` on all scroll/touch listeners for performance
- CSS toggle classes (`.show`, `.active`, `.sticky`) kept in CSS — JS only adds/removes class names
- No `var`, no `console.log`, no `!important` overuse (1 instance)
- All `<img>` tags have descriptive `alt` attributes
- `aria-expanded` and `aria-label` used on interactive controls
