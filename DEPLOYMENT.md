# Deployment Instructions

## Local Development

Frontend is running at: **http://localhost:5173**

## GitHub Pages Setup

### Repository Setup
1. Create a new repository on GitHub named `turkeywatermap`
2. Do NOT initialize with README, .gitignore, or license (we already have these)

### Push to GitHub

```bash
git remote add origin https://github.com/cemdusenkalkan/turkeywatermap.git
git push -u origin main
```

### GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Under "Source", select:
   - **Source**: `GitHub Actions` (not "Deploy from a branch")
   - The workflow will automatically deploy from `frontend/dist`
3. GitHub Actions will automatically build and deploy on every push to `main`

### What Gets Deployed

- **Source**: GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Build Output**: `frontend/dist` folder
- **Deployment**: Automatic on every push to `main` branch

### Data Files

- ✅ **Processed data IS committed** (`data/processed/` and `frontend/public/data/`)
- ❌ **Raw data is NOT committed** (excluded via `.gitignore`)
- Map loads from `frontend/public/data/turkey_water_risk.json` (processed, ~2.3 MB)

### After First Push

1. GitHub Actions will run automatically
2. Wait ~5-10 minutes for build to complete
3. Site will be live at: `https://cemdusenkalkan.github.io/turkeywatermap/`

### Manual Deployment (if needed)

If you want to deploy manually:

```bash
cd frontend
npm run build
# Then push frontend/dist to gh-pages branch
```

But the GitHub Actions workflow handles this automatically.

