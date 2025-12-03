# Quick Reference Guide

## 📋 Common Commands

### Run Examples
```bash
# Basic workflow (START HERE)
node examples/test-file-search.js

# Advanced features
node examples/advanced-examples.js

# Import method
node examples/test-import-method.js

# Clean up stores
node scripts/cleanup-stores.js
```

### View Your Stores
```javascript
const stores = await ai.fileSearchStores.list();
for await (const store of stores) {
  console.log(store.name, store.displayName);
}
```

## 🔑 Core API Methods

### File Search Store Operations

```javascript
// Create a store
const store = await ai.fileSearchStores.create({
  config: { displayName: 'my-store' }
});

// List all stores
const stores = await ai.fileSearchStores.list();

// Get a specific store
const store = await ai.fileSearchStores.get({
  name: 'fileSearchStores/store-id'
});

// Delete a store
await ai.fileSearchStores.delete({
  name: 'fileSearchStores/store-id',
  config: { force: true }  // Also deletes all documents
});
```

### Upload Methods

**Method 1: Direct Upload (Recommended)**
```javascript
const operation = await ai.fileSearchStores.uploadToFileSearchStore({
  file: 'path/to/file.txt',
  fileSearchStoreName: store.name,
  config: {
    displayName: 'My Document',
    customMetadata: [
      { key: "category", stringValue: "electronics" }
    ],
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 200,
        maxOverlapTokens: 20
      }
    }
  }
});

// Wait for completion
while (!operation.done) {
  await new Promise(r => setTimeout(r, 3000));
  operation = await ai.operations.get({ operation });
}
```

**Method 2: Import from Files API**
```javascript
// Step 1: Upload to Files API
const file = await ai.files.upload({
  file: 'path/to/file.txt',
  config: { displayName: 'My File' }
});

// Step 2: Import into File Search Store
const operation = await ai.fileSearchStores.importFile({
  fileSearchStoreName: store.name,
  fileName: file.name
});
```

### Query with File Search

```javascript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Your question here",
  config: {
    tools: [{
      fileSearch: {
        fileSearchStoreNames: [store.name],
        metadataFilter: 'category = "electronics"'  // Optional
      }
    }]
  }
});

console.log(response.text);
```

### Access Citations

```javascript
const metadata = response.candidates[0].groundingMetadata;

// View all chunks used
metadata.groundingChunks.forEach(chunk => {
  console.log('Source:', chunk.retrievedContext.title);
  console.log('Text:', chunk.retrievedContext.text);
});

// View specific supports
metadata.groundingSupports.forEach(support => {
  console.log('Claim:', support.segment.text);
  console.log('Chunk indices:', support.groundingChunkIndices);
});
```

## 🎯 Common Patterns

### Pattern 1: Single File Query
```javascript
// 1. Create store
const store = await ai.fileSearchStores.create({
  config: { displayName: 'my-store' }
});

// 2. Upload file
let op = await ai.fileSearchStores.uploadToFileSearchStore({
  file: 'data.txt',
  fileSearchStoreName: store.name
});
while (!op.done) {
  await new Promise(r => setTimeout(r, 3000));
  op = await ai.operations.get({ operation: op });
}

// 3. Query
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "What is in the document?",
  config: { tools: [{ fileSearch: { fileSearchStoreNames: [store.name] } }] }
});

console.log(response.text);
```

### Pattern 2: Multiple Files with Metadata
```javascript
const store = await ai.fileSearchStores.create({
  config: { displayName: 'multi-doc-store' }
});

// Upload multiple files with metadata
const files = [
  { path: 'products.txt', category: 'catalog' },
  { path: 'policies.txt', category: 'hr' }
];

for (const file of files) {
  let op = await ai.fileSearchStores.uploadToFileSearchStore({
    file: file.path,
    fileSearchStoreName: store.name,
    config: {
      customMetadata: [
        { key: "category", stringValue: file.category }
      ]
    }
  });
  while (!op.done) {
    await new Promise(r => setTimeout(r, 3000));
    op = await ai.operations.get({ operation: op });
  }
}

// Query with filter
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "What products are available?",
  config: {
    tools: [{
      fileSearch: {
        fileSearchStoreNames: [store.name],
        metadataFilter: 'category = "catalog"'
      }
    }]
  }
});
```

### Pattern 3: Custom Chunking
```javascript
const op = await ai.fileSearchStores.uploadToFileSearchStore({
  file: 'large-document.txt',
  fileSearchStoreName: store.name,
  config: {
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 500,    // Larger chunks
        maxOverlapTokens: 50        // More overlap for context
      }
    }
  }
});
```

## 📊 Metadata Filter Syntax

```javascript
// String comparison
metadataFilter: 'category = "electronics"'
metadataFilter: 'author = "John Doe"'

// Numeric comparison
metadataFilter: 'year = 2024'
metadataFilter: 'year > 2020'
metadataFilter: 'price < 100'

// Logical operators
metadataFilter: 'category = "electronics" AND year = 2024'
metadataFilter: 'price < 100 OR category = "sale"'

// See: https://google.aip.dev/160
```

## 🚨 Error Handling

```javascript
try {
  const response = await ai.models.generateContent({...});
  console.log(response.text);
} catch (error) {
  console.error('Error:', error.message);
  if (error.response?.data) {
    console.error('Details:', error.response.data);
  }
}
```

## 🔧 Troubleshooting

### Issue: API Key Not Found
```bash
# Check .env file exists and has:
GEMINI_API_KEY=your-key-here

# Verify path is correct in scripts
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
```

### Issue: File Not Found
```bash
# Check file paths are correct
# From examples/: use '../data/filename.txt'
# From scripts/: use '../data/filename.txt'
```

### Issue: Rate Limit
```bash
# Wait and retry
# Or use a different model: gemini-2.5-flash instead of experimental versions
```

### Issue: Operation Timeout
```javascript
// Increase polling interval or timeout
while (!operation.done) {
  await new Promise(r => setTimeout(r, 5000));  // Wait 5s instead of 3s
  operation = await ai.operations.get({ operation });
}
```

## 📈 Limits

| Item | Free Tier |
|------|-----------|
| Max file size | 100 MB |
| Total storage | 1 GB |
| Store recommendation | < 20 GB each |

## 💰 Pricing

| Operation | Cost |
|-----------|------|
| Indexing embeddings | $0.15 per 1M tokens |
| Storage | Free |
| Query embeddings | Free |
| Retrieved tokens | Normal context pricing |

## 🔗 Quick Links

- [Full README](README.md)
- [User Guide](docs/gemini-file-search.md)
- [API Reference](docs/file-search-store.md)
- [Google AI Studio](https://aistudio.google.com/)

---

**Pro Tip**: Keep this file open while coding for quick reference!
