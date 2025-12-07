# Gemini File Search - User Guide

Welcome to the Gemini File Search application! This guide will help you understand how to use all the features of this powerful document search and RAG (Retrieval Augmented Generation) tool.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Stores](#creating-stores)
3. [Uploading Files](#uploading-files)
4. [Chunking & Metadata Options](#chunking--metadata-options)
5. [Querying Stores](#querying-stores)
6. [Understanding Citations](#understanding-citations)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Before using the application, ensure you have:

1. A valid Google Gemini API key
2. Node.js 18+ installed
3. The application running locally or deployed

### First Time Setup

1. **Configure your API key**:
   - Create a `.env.local` file in the project root
   - Add your API key: `GEMINI_API_KEY=your-api-key-here`

2. **Start the application**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open your browser to `http://localhost:3000`
   - You'll see the landing page with an overview of features

4. **Navigate to Stores**:
   - Click "Get Started" or use the sidebar to navigate to "Stores"

---

## Creating Stores

**What is a Store?**

A File Search Store is a persistent container for your document embeddings. Think of it as a knowledge base that holds processed documents ready for AI-powered queries.

### Creating Your First Store

1. **Navigate to the Stores page** (sidebar → "Stores")

2. **Click "Create New Store"** button

3. **Enter a display name**:
   - Use descriptive names like "Product Manuals", "Research Papers", or "Customer Docs"
   - The name helps you identify the store later
   - Store names must be unique

4. **Click "Create"**:
   - The store is created instantly
   - You'll see it appear in your store list
   - Each store shows:
     - Display name
     - Creation date
     - Number of documents
     - Quick action buttons

### Store Management

**Viewing Store Details**:
- Click on any store card to see its details
- View uploaded documents
- Access upload and query functions

**Deleting a Store**:
- Click the "Delete" button on a store card
- Confirm the deletion in the modal
- **Warning**: This permanently deletes the store and all its documents
- This action cannot be undone

**Best Practices**:
- Create separate stores for different topics or document types
- Use clear, descriptive names
- Regularly clean up unused stores to manage API quota

---

## Uploading Files

Once you have a store created, you can upload documents to it.

### Starting an Upload

1. **Navigate to your store** by clicking on it
2. **Click "Upload File"** button
3. You'll be taken to the upload interface

### Selecting Files

**Drag and Drop**:
- Drag a file from your file explorer
- Drop it onto the dropzone area
- The file will be selected automatically

**Click to Browse**:
- Click the dropzone area
- Your system file picker will open
- Select a file to upload

**Supported File Types**:
- Text documents (`.txt`, `.md`)
- PDFs (`.pdf`)
- Word documents (`.docx`)
- Code files (`.js`, `.py`, `.java`, etc.)
- And many more formats supported by Gemini

**File Size Limits**:
- Maximum file size depends on your Gemini API tier
- The interface will warn you if a file is too large

### Configuring the Upload

After selecting a file, you'll see several configuration options:

**Display Name** (Optional):
- Override the default filename
- Use descriptive names for better organization
- Example: "Product Catalog 2024" instead of "catalog.pdf"

**Chunking Configuration** (See [Chunking & Metadata Options](#chunking--metadata-options))

**Custom Metadata** (See [Chunking & Metadata Options](#chunking--metadata-options))

### Uploading the File

1. **Review your settings**
2. **Click "Upload File"** button
3. **Monitor progress**:
   - A progress bar shows the upload status
   - The operation is asynchronous and may take a few moments
   - You'll see status updates as the file is processed
4. **Success notification**:
   - Once complete, you'll see a success message
   - The file is now in your store and ready to query

### Managing Uploaded Documents

**Viewing Documents**:
- Return to the store detail page
- See a list of all uploaded documents
- Each document shows:
  - File name
  - File size
  - Upload date
  - File type icon

**Deleting Documents**:
- Click the delete icon (trash can) next to a document
- Confirm the deletion
- The document is removed from the store

---

## Chunking & Metadata Options

### Understanding Chunking

**What is Chunking?**

When you upload a document, it's broken into smaller pieces (chunks) for processing. These chunks are:
- Embedded into vector representations
- Used for semantic search during queries
- Retrieved as citations in query results

**Why Does Chunking Matter?**

The chunking configuration affects:
- **Retrieval precision**: Smaller chunks = more focused results
- **Context richness**: Larger chunks = more surrounding context
- **Answer quality**: Balanced chunking improves AI responses

### Chunking Configuration Options

**Max Tokens Per Chunk** (200-512):
- Controls the size of each chunk
- Default: 400 tokens
- Lower values (200-300):
  - More precise retrieval
  - Best for: FAQs, specific facts, code snippets
- Higher values (400-512):
  - More context per chunk
  - Best for: narratives, technical docs, essays

**Max Overlap Tokens** (20-50):
- Controls how much chunks overlap
- Default: 30 tokens
- Lower values (20-30):
  - Less redundancy
  - Faster processing
- Higher values (30-50):
  - Better continuity across chunks
  - Reduces information loss at boundaries

**Preset Configurations**:
- **Small** (300 tokens, 20 overlap): Precise, focused retrieval
- **Medium** (400 tokens, 30 overlap): Balanced (default)
- **Large** (512 tokens, 50 overlap): Maximum context

**How to Configure**:
1. Use the sliders to adjust values
2. Or click a preset button for quick configuration
3. See the visual explanation update as you change settings

### Custom Metadata

**What is Metadata?**

Metadata is additional information you attach to files during upload. It allows you to:
- Categorize documents
- Filter queries to specific subsets
- Add contextual information

**Metadata Types**:
- **String**: Text values (e.g., category, author, department)
- **Numeric**: Numbers (e.g., year, version, priority)

**Adding Metadata**:

1. **Click "Add Metadata"** in the upload form

2. **Enter Key-Value Pairs**:
   - Key: The metadata field name (e.g., "category")
   - Value: The metadata value (e.g., "electronics")
   - Type: Select String or Numeric

3. **Add Multiple Fields**:
   - Click "+" to add more fields
   - Click "×" to remove a field
   - Keys must be unique

**Example Metadata**:
```
category (String): "product-manual"
year (Numeric): 2024
department (String): "engineering"
priority (Numeric): 1
```

**Using Metadata in Queries**:
- See [Advanced Features](#advanced-features) for metadata filtering

---

## Querying Stores

Now that you have documents in your store, you can ask questions!

### Basic Query

1. **Navigate to your store**
2. **Click "Query Store"** button
3. **Enter your question** in the text area:
   - Ask natural language questions
   - Be specific for better results
   - Examples:
     - "What are the system requirements?"
     - "How do I configure authentication?"
     - "Summarize the main features"

4. **Click "Submit Query"**

5. **View the answer**:
   - The AI generates a response based on your documents
   - Answers include citations from source documents
   - Citations show where the information came from

### Query Interface Features

**Character Counter**:
- Shows remaining characters (max varies by model)
- Helps you stay within limits

**Loading States**:
- Spinner indicates query is processing
- Submit button is disabled during queries
- Typical query time: 2-10 seconds

**Answer Display**:
- Formatted with markdown rendering
- Code blocks with syntax highlighting
- Copy button to copy entire answer
- Inline citations linked to sources

### Query Results

**Answer Section**:
- AI-generated response to your question
- Synthesized from document content
- May include direct quotes or paraphrasing

**Citations Section**:
- Listed below the answer
- Each citation includes:
  - Source file name
  - Text snippet that was retrieved
  - Relevance score (if available)
  - Expandable to show full chunk

**No Results**:
- If no relevant information is found, you'll see a message
- Try:
  - Rephrasing your question
  - Using different keywords
  - Checking if the right documents are uploaded

---

## Understanding Citations

Citations are the backbone of RAG (Retrieval Augmented Generation). They show you exactly where the AI got its information.

### Citation Anatomy

Each citation contains:

1. **Source File**:
   - Name of the document
   - File type icon
   - Click to see document details (if implemented)

2. **Text Snippet**:
   - The actual text chunk retrieved
   - Highlighted or formatted for readability
   - May be a partial chunk (truncated for display)

3. **Chunk Metadata** (if available):
   - Chunk index/position in document
   - Relevance score
   - Custom metadata from the file

### Citation Quality Indicators

**Good Citations**:
- Directly relevant to the question
- Contain specific information used in the answer
- Multiple citations from different sources (corroboration)

**Weak Citations**:
- Vague or tangentially related
- Generic text that could apply to many topics
- May indicate the document doesn't contain the answer

### Using Citations

**Verify Information**:
- Read the citation snippets to confirm accuracy
- Check if the AI interpreted the source correctly

**Explore Further**:
- Expand citations to see more context
- Identify which documents are most useful
- Find related information in the same document

**Improve Queries**:
- If citations are off-topic, rephrase your question
- Adjust metadata filters to narrow results
- Consider re-uploading with different chunking settings

### Citation Explorer

For advanced citation analysis:

1. **Navigate to "Explorer"** in the sidebar
2. **Select a past query** from history
3. **View detailed citation breakdown**:
   - All citations in one place
   - Filter by source file
   - Search within citations
   - Export citations (JSON, CSV, Markdown)

---

## Advanced Features

### Multi-Store Queries

Query across multiple stores simultaneously:

1. **Navigate to Query Interface**
2. **Click "Advanced Options"**
3. **Select Multiple Stores**:
   - Checkbox list of all your stores
   - Select 2 or more stores
   - See file count per store
4. **Submit your query**:
   - Results come from all selected stores
   - Citations show which store each result came from

**Use Cases**:
- Query all product documentation at once
- Search across different project repositories
- Compare information from multiple sources

### Metadata Filtering

Filter queries to specific document subsets:

1. **Navigate to Query Interface**
2. **Click "Advanced Options"**
3. **Click "Add Metadata Filter"**
4. **Build your filter**:
   - Select field name (e.g., "category")
   - Select operator (=, !=, <, >, <=, >=)
   - Enter value
5. **Add multiple conditions**:
   - Connect with AND/OR logic
   - Build complex filters

**Filter Syntax Examples**:
```
category = "electronics"
year >= 2024
department = "engineering" AND priority > 5
(category = "manual" OR category = "guide") AND year = 2024
```

**Use Cases**:
- Query only recent documents: `year >= 2024`
- Filter by category: `category = "api-docs"`
- Exclude drafts: `status != "draft"`
- Combine conditions: `department = "sales" AND year = 2024`

### Query History

**Automatic Saving**:
- All queries are saved to local storage
- Includes question, answer, citations, and timestamp

**Accessing History**:
- View past queries in the Query interface
- Click a history item to re-run or view results
- Clear history with the "Clear History" button

**Exporting Queries**:
- Export query results from Citation Explorer
- Formats: JSON (structured data), CSV (spreadsheet), Markdown (documentation)

### Model Selection

**Available Models:**

1. **Gemini 2.5 Flash** (Recommended) ✅ Free Tier
   - Fast responses (2-5 seconds)
   - Balanced quality for most use cases
   - Production-ready, stable
   - Works with free API keys

2. **Gemini 2.5 Pro** ✅ Free Tier
   - Higher quality responses
   - Best for complex queries requiring deep understanding
   - Production-ready, stable
   - May take slightly longer than Flash
   - Works with free API keys

3. **Gemini 2.5 Flash Lite** ✅ Free Tier
   - Fastest responses (1-3 seconds)
   - Lightweight, efficient
   - Best for simple queries
   - Works with free API keys

4. **Gemini 3 Pro Preview** 💳 Paid Tier Required
   - Most capable model with latest features
   - **Requires a paid/upgraded API key**
   - Not available on free tier
   - Experimental - may have limited availability
   - Use for cutting-edge capabilities

5. **Gemini 2.0 Flash Experimental** ⚠️ Experimental
   - Experimental model for testing
   - May have limited availability

**How to Change Models:**
1. Navigate to any store's query interface
2. Click "Advanced Options"
3. Select a model from the dropdown
4. Submit your query

**Important Notes About API Tiers:**

⚠️ **Model availability depends on your API key tier:**

- **Free Tier API Keys**: Can use Gemini 2.5 Flash, Pro, and Flash Lite
- **Paid Tier API Keys**: Can use all models including Gemini 3 Pro Preview
- Models marked with 💳 require a paid/upgraded API plan

If you try to use a paid-tier model with a free API key, you'll see an error message:
> "This model requires a paid API key. Please upgrade your API key or select a different model."

**Rate Limits:**

All API keys have rate limits that vary by tier:
- **Free Tier**: Lower rate limits (exact limits vary by model)
- **Paid Tier**: Higher rate limits based on your plan

If you exceed your rate limit, you'll see a quota exceeded error. Solutions:
- Wait for the rate limit window to reset (usually a few minutes)
- Upgrade to a paid API tier for higher limits
- Use a different model with available quota

**Checking Your API Status:**
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to check your API key
- View your usage at [Gemini API Usage Dashboard](https://ai.dev/usage?tab=rate-limit)
- See rate limits documentation at [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)

**Notes:**
- Different models may have different response times
- Experimental models may occasionally be unavailable
- All models support File Search and citations
- Pricing and rate limits vary by model and API tier

### Keyboard Shortcuts

Speed up your workflow:

- **Submit Query**: `Ctrl/Cmd + Enter` (in query text area)
- **Close Modals**: `Escape`
- **Navigate**: `Tab` through interactive elements

---

## Troubleshooting

### Common Issues

#### "API Key Invalid" Error

**Problem**: Application won't start or shows API key error

**Solutions**:
1. Check `.env.local` file exists in project root
2. Verify the key format: `GEMINI_API_KEY=your-key-here`
3. Ensure no extra spaces or quotes
4. Restart the dev server: `npm run dev`
5. Verify your API key is active in Google AI Studio

#### Upload Fails or Gets Stuck

**Problem**: File upload doesn't complete or shows error

**Solutions**:
1. **Check file size**: Ensure file is under the size limit
2. **Verify file format**: Use supported formats
3. **Check API quota**: You may have hit rate limits
4. **Check network**: Ensure stable internet connection
5. **Retry**: Click "Upload File" again
6. **Check console**: Open browser DevTools for detailed errors

#### No Results from Query

**Problem**: Query returns empty or "No relevant information found"

**Solutions**:
1. **Verify files uploaded**: Check store has documents
2. **Rephrase question**: Try different keywords
3. **Check metadata filters**: Remove filters to broaden search
4. **Wait for processing**: Uploads may still be processing
5. **Review chunking**: Larger chunks may help for some queries

#### Citations Don't Match Answer

**Problem**: AI answer doesn't seem to come from the citations

**Solutions**:
1. **Expand citations**: View full chunks for more context
2. **Check grounding**: AI may be synthesizing from multiple chunks
3. **Adjust chunking**: Larger chunks provide more context
4. **Rephrase query**: More specific questions get better citations
5. **Verify documents**: Ensure uploaded files contain relevant info

#### Store Deletion Fails

**Problem**: Can't delete a store

**Solutions**:
1. **Check for active operations**: Wait for uploads to complete
2. **Refresh page**: Reload to sync state
3. **Check API quota**: Rate limits may prevent deletion
4. **Force delete**: Use legacy CLI if needed:
   ```bash
   node legacy/scripts/cleanup-stores.js
   ```

#### Slow Performance

**Problem**: Application is slow or unresponsive

**Solutions**:
1. **Clear browser cache**: Refresh with cache clear
2. **Reduce query history**: Clear old queries
3. **Check network**: Slow internet affects API calls
4. **Simplify queries**: Shorter questions process faster
5. **Reduce active stores**: Query fewer stores at once
6. **Check browser**: Update to latest browser version

### Error Messages

**"Operation timeout"**:
- The upload/operation took too long
- Check file size and network speed
- Retry the operation

**"Store not found"**:
- Store may have been deleted
- Refresh the page to sync
- Create a new store if needed

**"Invalid metadata filter"**:
- Check filter syntax
- Use proper operators (=, !=, <, >, etc.)
- Ensure field names match uploaded metadata

**"Rate limit exceeded"**:
- You've hit Gemini API quota limits
- Wait a few minutes and retry
- Check your API key tier and limits
- Consider upgrading your API plan

### Getting Help

**Check Logs**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

**Review Documentation**:
- See project README for installation help
- Check CLAUDE.md for technical details
- Review implementation plan for architecture

**Report Issues**:
If you encounter bugs:
1. Note the exact error message
2. Document steps to reproduce
3. Check browser console for errors
4. Create an issue in the project repository

### Best Practices

**Store Management**:
- Use descriptive store names
- Keep stores organized by topic
- Regularly delete unused stores
- Monitor your API quota

**File Uploads**:
- Use appropriate chunking for your use case
- Add meaningful metadata for filtering
- Test with small files first
- Verify uploads complete before querying

**Querying**:
- Start with simple questions
- Be specific and clear
- Review citations for accuracy
- Use metadata filters for precision
- Save important queries for reference

**Performance**:
- Upload files in batches, not all at once
- Clear old query history periodically
- Close unused browser tabs
- Use Chrome/Firefox for best compatibility

---

## Tips & Tricks

### Getting Better Answers

1. **Be Specific**: "What are the system requirements for Windows?" vs "requirements?"
2. **Use Keywords**: Include domain-specific terms from your documents
3. **Ask Follow-ups**: Refine based on initial answers
4. **Check Citations**: Verify the AI understood correctly
5. **Combine Filters**: Use metadata to narrow to relevant docs

### Organizing Your Knowledge Base

1. **Logical Stores**: Group related documents together
2. **Consistent Metadata**: Use standard field names across uploads
3. **Descriptive Names**: Name files and stores clearly
4. **Version Control**: Include version info in metadata
5. **Regular Cleanup**: Remove outdated documents

### Advanced Workflows

**Research Assistant**:
- Upload papers to "Research" store
- Add metadata: `author`, `year`, `topic`
- Query with filters: `topic = "machine-learning" AND year >= 2023`

**Product Documentation**:
- Separate stores for each product
- Add metadata: `version`, `category`, `audience`
- Multi-store query for cross-product questions

**Code Search**:
- Upload codebase files
- Add metadata: `language`, `module`, `author`
- Query with filters for specific modules or languages

**Customer Support**:
- Upload manuals, FAQs, troubleshooting guides
- Add metadata: `product`, `category`, `difficulty`
- Filter by product for targeted answers

---

## Conclusion

You now have a complete guide to using Gemini File Search! Remember:

- **Start simple**: Create a store, upload a file, ask a question
- **Experiment**: Try different chunking settings and metadata
- **Verify**: Always check citations to ensure accuracy
- **Organize**: Keep your stores and files well-organized
- **Iterate**: Refine your queries and settings based on results

Happy searching! If you have questions or feedback, please refer to the project documentation or create an issue in the repository.
