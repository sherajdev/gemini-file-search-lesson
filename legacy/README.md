# Legacy CLI Examples

This directory contains the original Node.js CLI scripts, examples, and documentation from before the Next.js frontend was added.

## Contents

### `examples/`
Original demonstration scripts:
- `test-file-search.js` - Basic file search workflow
- `advanced-examples.js` - Multiple files, metadata, chunking
- `test-import-method.js` - Alternative upload method

### `scripts/`
Utility scripts:
- `cleanup-stores.js` - Delete all File Search Stores

### `docs/`
Original API documentation:
- `gemini-file-search.md` - User guide and tutorials
- `file-search-store.md` - Complete API reference

### Documentation Files
Original CLI project documentation:
- `INDEX.md` - File index and navigation guide
- `PROJECT-SUMMARY.md` - Original setup completion summary
- `QUICK-REFERENCE.md` - CLI API quick reference guide

## Running Legacy Scripts

These scripts still work and can be run from the project root:

```bash
# Basic workflow
node legacy/examples/test-file-search.js

# Advanced features
node legacy/examples/advanced-examples.js

# Clean up stores
node legacy/scripts/cleanup-stores.js
```

## Documentation

For the original CLI documentation:
- Start with `INDEX.md` for navigation
- Read `QUICK-REFERENCE.md` for API patterns
- See `docs/` for detailed API documentation

## Note

The `data/` directory remains at the project root and is used by both the legacy scripts and the new Next.js frontend.
