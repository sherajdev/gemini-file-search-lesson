# Gemini File Search API - Testing Guide

A well-organized testing environment for learning and experimenting with Google's Gemini File Search API.

## 🎯 Quick Start

```bash
# Run the basic example
node examples/test-file-search.js

# Try advanced features
node examples/advanced-examples.js

# Test alternative upload method
node examples/test-import-method.js

# Clean up all stores
node scripts/cleanup-stores.js
```

## 📁 Project Structure

```
gemini-file-search/
├── data/                          # Sample test files
│   ├── sample-product-info.txt    # Product catalog
│   └── sample-company-policy.txt  # HR policies
│
├── docs/                          # API documentation
│   ├── gemini-file-search.md      # User guide
│   └── file-search-store.md       # API reference
│
├── examples/                      # Example scripts
│   ├── test-file-search.js        # ⭐ Basic workflow (START HERE)
│   ├── advanced-examples.js       # Advanced features
│   └── test-import-method.js      # Alternative upload method
│
├── scripts/                       # Utility scripts
│   └── cleanup-stores.js          # Delete all stores
│
├── .env                           # Your API key configuration
├── .gitignore                     # Git ignore rules
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## ✅ What You've Accomplished

- [x] Set up Node.js environment
- [x] Installed Gemini SDK (`@google/genai`)
- [x] Organized project structure
- [x] Created sample test files
- [x] Successfully ran first File Search query!

## 🚀 Examples Overview

### 1. Basic Workflow (`examples/test-file-search.js`)
**⭐ You've already run this successfully!**

Demonstrates:
- Creating a File Search Store
- Uploading a file directly
- Querying with a question
- Viewing citations and grounding metadata

```bash
node examples/test-file-search.js
```

**Try modifying the question** (line 66):
```javascript
const question = "What features does the UltraBook Air have?";
const question = "Which product has the longest battery life?";
const question = "What's the cheapest product?";
```

### 2. Advanced Examples (`examples/advanced-examples.js`)

Demonstrates:
- **Multiple files in one store** - Search across different documents
- **Custom metadata** - Add tags and filter queries
- **Custom chunking** - Control how files are split

```bash
node examples/advanced-examples.js
```

### 3. Import Method (`examples/test-import-method.js`)

Demonstrates:
- Uploading to Files API first
- Importing into File Search Store
- Comparing with direct upload method

```bash
node examples/test-import-method.js
```

## 📊 Key Concepts

### File Search Store
A container for your document embeddings. Stores persist indefinitely until manually deleted.

### Two Upload Methods

| Method | Steps | Use Case |
|--------|-------|----------|
| **Direct Upload** | File → File Search Store | Simplest, recommended for most cases |
| **Import** | File → Files API → File Search Store | When you need to reuse files |

### Chunking
Files are automatically split into chunks for better retrieval.

```javascript
chunkingConfig: {
  whiteSpaceConfig: {
    maxTokensPerChunk: 200,    // Size of each chunk
    maxOverlapTokens: 20        // Overlap between chunks
  }
}
```

### Metadata & Filtering
Add custom tags to files and filter queries:

```javascript
// Upload with metadata
customMetadata: [
  { key: "category", stringValue: "electronics" },
  { key: "year", numericValue: 2024 }
]

// Query with filter
metadataFilter: 'category = "electronics"'
```

### Citations
Responses include `groundingMetadata` showing which files/chunks were used:

```javascript
response.candidates[0].groundingMetadata.groundingChunks
```

## 🧪 Testing Roadmap

### Beginner (You are here! ✅)
1. ✅ Run `examples/test-file-search.js`
2. Modify the question and re-run
3. Try different questions about the products

### Intermediate
4. Run `examples/advanced-examples.js`
   - See multiple files working together
   - Understand metadata filtering
   - Compare chunking strategies

5. Run `examples/test-import-method.js`
   - Learn the alternative upload workflow

### Advanced
6. Create your own test files
   - Add custom documents to `data/`
   - Modify scripts to use your files
   - Experiment with different file types

7. Build custom scripts
   - Combine multiple features
   - Create domain-specific search
   - Implement real use cases

## 💡 Sample Questions to Try

### Product Queries
```
"What's the cheapest product?"
"Which products are water resistant?"
"Compare the battery life of all products"
"What products were released in 2024?"
```

### Policy Queries
```
"What's the remote work policy?"
"How much is the professional development budget?"
"What does health insurance cover?"
"How many vacation days for 4 years of service?"
```

### Cross-Document Queries
```
"Tell me about wireless products and the remote work policy"
"What benefits support professional development?"
```

## 🧹 Cleanup

After testing, clean up your File Search Stores:

```bash
node scripts/cleanup-stores.js
```

This deletes ALL stores. Alternatively, delete specific stores:

```javascript
await ai.fileSearchStores.delete({
  name: 'fileSearchStores/store-name',
  config: { force: true }
});
```

## 📝 Configuration

### API Key (`.env`)
```env
GEMINI_API_KEY=your-api-key-here
```

### Supported File Types
- Text: `.txt`, `.md`, `.csv`, `.json`, `.xml`
- Documents: `.pdf`, `.docx`, `.xlsx`, `.pptx`
- Code: `.js`, `.py`, `.java`, `.cpp`, and 100+ more

See [docs/gemini-file-search.md](docs/gemini-file-search.md) for complete list.

## 📚 Documentation

- **[docs/gemini-file-search.md](docs/gemini-file-search.md)** - Comprehensive user guide
- **[docs/file-search-store.md](docs/file-search-store.md)** - API reference

## 🔗 External Resources

- [Google AI Studio](https://aistudio.google.com/) - Get API key
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/file-search)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Pricing](https://ai.google.dev/gemini-api/docs/pricing)

## 📊 Limits & Pricing

### Storage Limits (Free Tier)
- **Max file size**: 100 MB per file
- **Total storage**: 1 GB (Free tier)
- **Recommended**: Keep stores under 20 GB for optimal performance

### Pricing
- **Indexing**: $0.15 per 1M tokens (one-time when uploading)
- **Storage**: Free
- **Query embeddings**: Free
- **Retrieved tokens**: Normal context token pricing

## 🎉 Success!

Your File Search test showed:
- ✅ Store created successfully
- ✅ File uploaded and indexed
- ✅ Query answered accurately: "$299.99"
- ✅ Citations provided automatically

## 🚀 What's Next?

1. Run the advanced examples
2. Create your own test documents
3. Experiment with metadata and chunking
4. Build a real use case!

---

**Current Status**: ✅ Setup complete, basic test successful!

**Your Stores**: 2 active (remember to clean up)

Happy testing! 🎊
