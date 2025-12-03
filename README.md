# Gemini File Search API - Testing Guide

A comprehensive, well-organized testing environment for learning and experimenting with Google's Gemini File Search API. This repository provides working examples, sample data, and complete documentation to help you get started with RAG (Retrieval Augmented Generation) using Gemini.

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/sherajdev/gemini-file-search-lesson.git
cd gemini-file-search-lesson

# Install dependencies
npm install

# Set up your API key
# Create a .env file and add: GEMINI_API_KEY=your-api-key-here

# Run the basic example
node examples/test-file-search.js

# Try advanced features
node examples/advanced-examples.js

# Test alternative upload method
node examples/test-import-method.js

# Clean up test stores
node scripts/cleanup-stores.js
```

## 📁 Project Structure

```
gemini-file-search-lesson/
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
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## 🚀 Examples Overview

### 1. Basic Workflow (`examples/test-file-search.js`)
**⭐ Start here for your first test**

Demonstrates:
- Creating a File Search Store
- Uploading a file directly
- Querying with semantic search
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

## 🧪 Learning Path

### Beginner
1. Run `examples/test-file-search.js` - Understand basic workflow
2. Modify the question and re-run - See how responses change
3. Try different questions about the sample data

### Intermediate
4. Run `examples/advanced-examples.js` - Explore advanced features
   - Multiple files working together
   - Metadata filtering
   - Chunking strategies

5. Run `examples/test-import-method.js` - Learn alternative workflows

### Advanced
6. Create your own test files
   - Add custom documents to `data/`
   - Modify scripts to use your files
   - Experiment with different file types (PDF, DOCX, etc.)

7. Build custom solutions
   - Combine multiple features
   - Create domain-specific search
   - Implement production use cases

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

This deletes ALL stores. Alternatively, delete specific stores programmatically:

```javascript
await ai.fileSearchStores.delete({
  name: 'fileSearchStores/store-name',
  config: { force: true }
});
```

## 📝 Configuration

### API Key Setup

1. Get your API key from [Google AI Studio](https://aistudio.google.com/)
2. Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your-api-key-here
```

### Supported File Types
- **Text**: `.txt`, `.md`, `.csv`, `.json`, `.xml`
- **Documents**: `.pdf`, `.docx`, `.xlsx`, `.pptx`
- **Code**: `.js`, `.py`, `.java`, `.cpp`, and 100+ more

See [docs/gemini-file-search.md](docs/gemini-file-search.md) for the complete list.

## 📚 Documentation

- **[docs/gemini-file-search.md](docs/gemini-file-search.md)** - Comprehensive user guide with tutorials
- **[docs/file-search-store.md](docs/file-search-store.md)** - Complete API reference
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - API cheat sheet with code patterns
- **[INDEX.md](INDEX.md)** - Project navigation guide

## 🔗 External Resources

- [Google AI Studio](https://aistudio.google.com/) - Get API key
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/file-search)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Pricing](https://ai.google.dev/gemini-api/docs/pricing)

## 📊 Limits & Pricing

### Storage Limits (Free Tier)
- **Max file size**: 100 MB per file
- **Total storage**: 1 GB (Free tier)
- **Recommended**: Keep individual stores under 20 GB for optimal performance

### Pricing
- **Indexing**: $0.15 per 1M tokens (one-time cost when uploading)
- **Storage**: Free
- **Query embeddings**: Free
- **Retrieved tokens**: Normal context token pricing

## 🌟 Features

- ✅ **Well-organized structure** - Separate folders for data, examples, docs, scripts
- ✅ **Working examples** - All scripts tested and functional
- ✅ **Comprehensive docs** - Multiple guides for different needs
- ✅ **Sample data** - Ready-to-use test files
- ✅ **Clean code** - Proper error handling and path management

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new example scripts
- Improve documentation
- Add more sample data files
- Report issues or suggest improvements

## 📄 License

MIT License - Feel free to use this project for learning and experimentation.

## 🙏 Acknowledgments

Built with [Google's Gemini API](https://ai.google.dev/gemini-api) and the [@google/genai](https://www.npmjs.com/package/@google/genai) SDK.

---

**Getting Started**: Clone this repo, set up your API key, and run `node examples/test-file-search.js`

**Need Help?**: Check out [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for common patterns and troubleshooting

Happy learning! 🚀
