# TÃ¼rkiye Water Risk Map - Frontend

React + TypeScript + Vite frontend for the TÃ¼rkiye Water Risk Map project.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 7
- **Mapping:** MapLibre GL JS 5.0 + PMTiles
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 3
- **Animation:** Motion for React
- **Data Viz:** D3 scales and utilities

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
”œâ”€â”€ components/
”‚   â”œâ”€â”€ Map/              # Map-related components
”‚   â”‚   â”œâ”€â”€ MapShell.tsx  # Main map wrapper
”‚   â”‚   â”œâ”€â”€ LayerPanel.tsx
”‚   â”‚   â”œâ”€â”€ Legend.tsx
”‚   â”‚   â””â”€â”€ TooltipCard.tsx
”‚   â”œâ”€â”€ Layout.tsx        # App layout with header/footer
”‚   â””â”€â”€ CategoryCard.tsx
”œâ”€â”€ pages/                # Route pages
”‚   â”œâ”€â”€ Home.tsx
”‚   â”œâ”€â”€ MapPage.tsx
”‚   â”œâ”€â”€ Categories.tsx
”‚   â”œâ”€â”€ Methodology.tsx
”‚   â””â”€â”€ About.tsx
”œâ”€â”€ lib/                  # Utilities
”‚   â”œâ”€â”€ data-loader.ts    # Data fetching
”‚   â”œâ”€â”€ color-scales.ts   # Choropleth palettes
”‚   â””â”€â”€ calculations.ts   # Stats functions
”œâ”€â”€ types/
”‚   â””â”€â”€ index.ts          # TypeScript interfaces
”œâ”€â”€ App.tsx               # Router setup
”œâ”€â”€ main.tsx              # Entry point
””â”€â”€ index.css             # Global styles
```

## Key Features

### Interactive Map
- Province-level choropleth visualization
- 7 risk categories + combined index
- Hover tooltips with scores and percentiles
- Dynamic legend with quantile breaks
- Smooth layer transitions

### Performance
- Code splitting by route and vendor chunks
- Lazy loading of heavy map assets
- Optimized bundle size (<500KB initial)
- GPU-accelerated rendering via WebGL

### Accessibility
- Keyboard navigation
- ARIA labels on interactive elements
- Focus indicators
- Color-blind safe palettes

### Animation
- Motion-based page transitions
- Smooth layer switching
- Micro-interactions on hover

## Data Loading

### Static Assets
Data files are loaded from `public/data/`:
- `index.json` - Manifest with metadata
- `provinces.geojson` - Province boundaries + scores
- `category_*.csv` - Individual category data

### Dynamic Loading
```typescript
import { loadManifest, loadProvincesGeoJSON } from '@/lib/data-loader'

const manifest = await loadManifest()
const geoData = await loadProvincesGeoJSON()
```

## Customization

### Base Path
Update `vite.config.ts` for different deployment paths:
```typescript
export default defineConfig({
  base: '/your-repo-name/',  // For GitHub Pages
})
```

### Colors
Edit `tailwind.config.js` or `src/lib/color-scales.ts`

### Map Center
Adjust in `src/components/Map/MapShell.tsx`:
```typescript
center: [35.0, 39.0], // [lon, lat]
zoom: 5.5,
```

## Environment Variables

None required for basic operation. For production:
- Adjust `BASE_URL` in `vite.config.ts`

## Linting & Formatting

```bash
npm run lint      # ESLint
npm run format    # Prettier
```

## Testing

Unit tests (planned):
```bash
npm test
```

Manual testing checklist:
- [ ] All routes load
- [ ] Map renders with synthetic data
- [ ] Layer switching works
- [ ] Tooltips appear on hover
- [ ] Legend updates dynamically
- [ ] Responsive on mobile
- [ ] No console errors

## Deployment

### GitHub Pages (via Actions)
See `.github/workflows/deploy.yml` - automated on push to main.

### Manual Deployment
```bash
npm run build
# Upload dist/ to your hosting provider
```

### Custom Domain
Add `CNAME` file to `public/` with your domain.

## Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify `public/data/` contains generated files
- Check MapLibre GL JS CSS is loaded
- Ensure WebGL is enabled in browser

### Data Not Found
- Run `python pipeline/scripts/synthetic_demo.py` first
- Copy `data/processed/` to `frontend/public/data/`
- Check file paths in data-loader.ts

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues
- Check browser DevTools Performance tab
- Reduce data precision in CSV exports
- Simplify geometries in GeoJSON
- Enable production mode (not dev server)

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md).

Frontend-specific contributions:
- UI/UX improvements
- Accessibility enhancements
- Mobile optimizations
- Additional visualizations (charts, time-series)
- Turkish localization

## License

MIT - see [LICENSE](../LICENSE)

---

**Need help?** Open an issue on GitHub.

