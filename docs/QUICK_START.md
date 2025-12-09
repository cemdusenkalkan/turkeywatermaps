# Quick Start Guide

Get the TÃ¼rkiye Water Risk Map running locally in 10 minutes.

## Prerequisites

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))

## Step 1: Clone Repository

```bash
git clone https://github.com/cemdusenkalkan/turkiye-watermap.git
cd turkiye-watermap
```

## Step 2: Setup Python Environment

```bash
cd pipeline

# Create virtual environment
python3 -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Generate Demo Data

```bash
# Still in pipeline/ directory
python scripts/synthetic_demo.py
```

**Output:** Creates synthetic water risk data in `data/processed/`
- œ… `provinces.geojson` (81 provinces with scores)
- œ… `category_*.csv` (7 category files)
- œ… `index.json` (manifest)

This takes ~5 seconds and requires no external data downloads.

## Step 4: Setup Frontend

Open a **new terminal** window:

```bash
cd turkiye-watermap/frontend

# Install dependencies
npm install

# Copy data to public directory
mkdir -p public/data
cp -r ../data/processed/* public/data/
```

## Step 5: Run Development Server

```bash
# Still in frontend/ directory
npm run dev
```

**Output:**
```
  VITE v7.0.0  ready in XXX ms

  žœ  Local:   http://localhost:5173/turkiye-watermap/
  žœ  Network: use --host to expose
  žœ  press h + enter to show help
```

## Step 6: Open in Browser

Visit: **http://localhost:5173/turkiye-watermap/**

You should see:
- œ… Home page with hero section
- œ… Interactive map (click "Explore the Map")
- œ… 81 Turkish provinces with color-coded risk scores
- œ… Layer switcher panel
- œ… Hover tooltips on provinces

## Troubleshooting

### Python: "No module named geopandas"
```bash
# Make sure you're in the venv
cd pipeline
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### Frontend: "Cannot find module"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Data Not Loading
```bash
# Regenerate and copy
cd turkiye-watermap
python pipeline/scripts/synthetic_demo.py
mkdir -p frontend/public/data
cp -r data/processed/* frontend/public/data/
cd frontend
npm run dev
```

### Map Not Rendering
- Check browser console (F12) for errors
- Verify WebGL is supported: https://get.webgl.org/
- Try a different browser (Chrome, Firefox, Safari)

### "404 Not Found" on Navigation
The app uses client-side routing. In development, Vite handles this automatically. If you see 404s, make sure you're accessing through the dev server, not opening `index.html` directly.

## What's Next?

### Explore the Application
1. **Home:** Overview and key statistics
2. **Map:** Interactive visualization with all risk categories
3. **Categories:** Detailed descriptions of each risk dimension
4. **Methodology:** Technical documentation
5. **About:** Project background and contributing info

### Customize
- **Change colors:** Edit `frontend/src/lib/color-scales.ts`
- **Adjust weights:** Modify `pipeline/config/categories.yaml`
- **Add your logo:** Replace `frontend/public/favicon.svg`

### Deploy
See `.github/workflows/deploy.yml` for automated GitHub Pages deployment.

Or build manually:
```bash
cd frontend
npm run build
# Upload dist/ to your hosting provider
```

### Add Real Data
See `pipeline/README.md` for instructions on acquiring and processing:
- ERA5-Land climate data
- TÃÄ°K socioeconomic statistics
- GRACE groundwater data
- DSÄ° hydrological reports

## Getting Help

- **Issues:** https://github.com/cemdusenkalkan/turkiye-watermap/issues
- **Discussions:** https://github.com/cemdusenkalkan/turkiye-watermap/discussions
- **Documentation:** See `docs/` folder

## Next Steps

- Read [METHODOLOGY.md](METHODOLOGY.md) to understand the risk calculations
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Check [DATA_SOURCES.md](DATA_SOURCES.md) for data citations

---

**Ready to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)!

