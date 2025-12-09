# Contributing to TÃ¼rkiye Water Risk Map

Thank you for your interest in contributing! This project thrives on community involvement.

## Ways to Contribute

### 1. Report Issues
- Found a bug? [Open an issue](https://github.com/cemdusenkalkan/turkiye-watermap/issues)
- Have a feature request? [Start a discussion](https://github.com/cemdusenkalkan/turkiye-watermap/discussions)
- Data quality concerns? Please document and report

### 2. Improve Data Pipeline
- Add new data sources (with proper citations)
- Enhance data cleaning and validation
- Improve spatial resolution (e.g., basin-level)
- Add time-series functionality

**Key areas:**
- `pipeline/scripts/download/` - Data acquisition modules
- `pipeline/scripts/process/` - Scoring and normalization
- Config files for weights and parameters

### 3. Enhance Frontend
- Improve UI/UX
- Add new visualizations (charts, time-series)
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness

**Key files:**
- `frontend/src/components/` - React components
- `frontend/src/pages/` - Page layouts

### 4. Documentation
- Clarify methodology
- Add tutorials
- Translate to Turkish
- Improve code comments

### 5. Validation & Research
- Conduct ground-truth validation studies
- Compare with alternative methodologies
- Regional case studies
- Publish findings using our data

## Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Clone and Setup

```bash
git clone https://github.com/cemdusenkalkan/turkiye-watermap.git
cd turkiye-watermap

# Python setup
cd pipeline
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Generate demo data
python scripts/synthetic_demo.py

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

3. **Test locally**
   ```bash
   # Python
   cd pipeline
   pytest

   # Frontend
   cd frontend
   npm run build
   npm run preview
   ```

4. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub

## Code Style

### Python
- Follow PEP 8
- Use type hints where appropriate
- Docstrings for all functions
- Use `ruff` for linting

### TypeScript/React
- Use TypeScript strict mode
- Functional components with hooks
- Props interfaces for all components
- ESLint + Prettier for formatting

## Data Guidelines

### Adding New Data Sources
1. Document source, license, and URL in `pipeline/config/sources.yaml`
2. Create download module in `pipeline/scripts/download/`
3. Implement caching and validation
4. Update methodology documentation
5. Cite properly in `docs/DATA_SOURCES.md`

### Data Quality Standards
- **Spatial**: WGS84 (EPSG:4326) for all outputs
- **Temporal**: Document time period clearly
- **Uncertainty**: Quantify and document
- **Provenance**: Full lineage from source to output

## Pull Request Process

1. **Ensure your PR:**
   - Builds successfully (CI/CD passes)
   - Includes tests if adding new functionality
   - Updates documentation if needed
   - Follows code style guidelines

2. **PR Description should include:**
   - What: Brief summary of changes
   - Why: Motivation and context
   - How: Implementation approach
   - Testing: How you verified it works

3. **Review Process:**
   - Maintainers will review within 1 week
   - Address feedback promptly
   - Squash commits if requested
   - Once approved, maintainers will merge

## Questions?

- **General questions:** [Open a discussion](https://github.com/cemdusenkalkan/turkiye-watermap/discussions)
- **Bug reports:** [File an issue](https://github.com/cemdusenkalkan/turkiye-watermap/issues)
- **Security concerns:** See SECURITY.md (if we create one)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment:
- Be respectful and considerate
- Focus on what is best for the community
- Show empathy towards other community members
- Gracefully accept constructive criticism

Thank you for contributing to water security research in Turkey! ŸŒŠ

