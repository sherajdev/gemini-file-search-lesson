# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a learning environment for Google's Gemini File Search API, demonstrating RAG (Retrieval Augmented Generation) patterns. The project uses the `@google/genai` SDK to create file search stores, upload documents, and query them using semantic search.

## Essential Commands

### Running Examples
```bash
# Basic workflow (start here for first-time testing)
node examples/test-file-search.js

# Advanced features (multiple files, metadata, chunking)
node examples/advanced-examples.js

# Alternative upload method (Files API → File Search Store)
node examples/test-import-method.js

# Clean up all File Search Stores
node scripts/cleanup-stores.js
```

### Dependencies
```bash
npm install  # Install @google/genai and dotenv
```

### Environment Setup
Requires `.env` file with `GEMINI_API_KEY=your-api-key-here`

## Architecture

### Core Components

**File Search Stores**: Persistent containers for document embeddings. Stores remain until explicitly deleted.

**Two Upload Patterns**:
1. **Direct Upload** (`uploadToFileSearchStore`): File → Store (recommended, used in examples/test-file-search.js)
2. **Import Method** (`importFilesToFileSearchStore`): File → Files API → Store (used in examples/test-import-method.js)

**Async Operations**: File uploads return operations that must be polled until `done === true`. All example scripts include a `waitForOperation` helper that polls every 3 seconds.

**Query Pattern**: Uses `generateContent` with `tools` config containing `fileSearch.fileSearchStoreNames` array. The model automatically retrieves relevant chunks and includes citations in `response.candidates[0].groundingMetadata`.

### Key Configuration Options

**Chunking** (`chunkingConfig.whiteSpaceConfig`):
- `maxTokensPerChunk`: Controls chunk size (200-800 typical)
- `maxOverlapTokens`: Overlap between chunks (20-50 typical)
- Smaller chunks = more focused retrieval, larger chunks = more context

**Metadata** (`customMetadata`):
- Attach key-value pairs to files (string or numeric values)
- Filter queries with `metadataFilter` (e.g., `'category = "electronics"'`)
- See examples/advanced-examples.js:100-117

**Models**: Scripts use `gemini-2.5-flash` for queries. The model parameter is passed to `ai.models.generateContent`.

### File Structure Pattern

- `data/` - Sample files for testing (txt format)
- `examples/` - Executable test scripts demonstrating features
- `scripts/` - Utility scripts (cleanup)
- `docs/` - API documentation and guides

### Important Behaviors

**Store Persistence**: File Search Stores persist indefinitely and must be manually deleted. Always clean up test stores to avoid clutter.

**Operation Polling**: Upload operations are asynchronous. Never assume immediate completion - always wait for `operation.done === true`.

**Path Resolution**: All scripts use `path.join(__dirname, '..', ...)` for reliable path resolution from any working directory.

**Error Handling**: API errors may include `error.response.data` with detailed information. Check this field when debugging.

### Common Modifications

To test with different questions, edit the query string in examples (e.g., line 66 in test-file-search.js):
```javascript
const question = "Your question here";
```

To upload your own files, place them in `data/` and update the `filePath` variable to point to your file.

To adjust chunking strategy, modify the `chunkingConfig` in the upload config (see examples/advanced-examples.js:159-164).
