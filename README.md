# Gemini File Search - Next.js Frontend

A modern web application for exploring Google's Gemini File Search API with RAG (Retrieval Augmented Generation) capabilities.

## Screenshots

<table>
  <tr>
    <td width="50%">
      <h3 align="center">Dashboard</h3>
      <img src="docs/screenshots/dashboard.png" alt="Dashboard" />
    </td>
    <td width="50%">
      <h3 align="center">Store Management</h3>
      <img src="docs/screenshots/stores-page.png" alt="Stores Page" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">Query Interface</h3>
      <img src="docs/screenshots/query-interface.png" alt="Query Interface" />
    </td>
    <td width="50%">
      <h3 align="center">Landing Page</h3>
      <img src="docs/screenshots/landing-page.png" alt="Landing Page" />
    </td>
  </tr>
</table>

## Features

- **File Search Store Management** - Create and manage document stores
- **Document Management** - View and delete uploaded files with metadata display
- **File Upload** - Upload documents with custom chunking and metadata
- **Semantic Search** - Query documents with AI-powered search
- **Citation Explorer** - View detailed source citations and grounding metadata
- **Advanced Filtering** - Filter results by metadata
- **Multi-Store Queries** - Search across multiple document stores

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Forms:** React Hook Form + Zod
- **API:** Google Gemini AI (`@google/genai`)

## Prerequisites

- Node.js 20+
- npm
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/sherajdev/gemini-file-search-lesson.git
cd gemini-file-search-lesson

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local

# Add your API key
GEMINI_API_KEY=your-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gemini-file-search-lesson/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (server-side)
│   ├── (dashboard)/       # Dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── stores/           # Store management
│   ├── upload/           # File upload
│   ├── query/            # Query interface
│   └── explorer/         # Citation explorer
├── lib/                   # Backend logic and utilities
│   ├── api/              # Gemini API wrappers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── data/                  # Sample test files
├── legacy/                # Original CLI examples
└── features/              # Feature planning docs
```

## Development Status

**Current Phase:** Phase 7.5 Complete ✅

- [x] Next.js project setup
- [x] Dependencies installed
- [x] Environment configured
- [x] Backend API layer (Phase 2) ✅
- [x] UI components (Phase 3) ✅
- [x] Store management (Phase 4) ✅
- [x] File upload (Phase 5) ✅
- [x] Query interface (Phase 6) ✅
- [x] Advanced features (Phase 7) ✅
- [x] Document management (Phase 7.5) ✅
- [ ] Polish & Testing (Phase 8)
- [ ] Documentation (Phase 9)

**Progress:** 154/170 tasks complete (91% - Phases 1-7.5)

See [features/frontend-build/TASKS.md](features/frontend-build/TASKS.md) for detailed progress tracking.

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## API Routes

✅ **All API endpoints are now implemented and functional:**

### Store Management
- `GET /api/stores` - List all file search stores
- `POST /api/stores` - Create a new store
- `GET /api/stores/[storeId]` - Get store details
- `DELETE /api/stores/[storeId]` - Delete a store

### Document Management
- `GET /api/stores/[storeId]/documents` - List all documents in a store
- `DELETE /api/stores/[storeId]/documents/[documentId]` - Delete a document

### File Upload & Queries
- `POST /api/stores/[storeId]/upload` - Upload file to store with chunking & metadata
- `POST /api/queries` - Query stores with AI-powered retrieval and citations
- `GET /api/operations/[operationId]` - Check operation status for async operations

All routes include:
- Zod validation for request payloads
- Comprehensive error handling
- TypeScript type safety
- Proper Next.js 15+ async params pattern

## Legacy CLI Examples

The original Node.js CLI scripts are preserved in the `legacy/` directory:

```bash
# Run legacy examples
node legacy/examples/test-file-search.js
node legacy/examples/advanced-examples.js

# Clean up test stores
node legacy/scripts/cleanup-stores.js
```

See [legacy/README.md](legacy/README.md) for the original CLI documentation.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Architecture

### Backend (API Routes)

API routes run server-side and handle:
- Gemini API authentication
- File uploads and processing
- Document indexing
- Query processing
- Operation polling

### Frontend (React Components)

React components provide the UI for:
- Store management (create, view, delete)
- File upload with drag-and-drop
- Query interface with real-time results
- Citation viewing and exploration
- Metadata filtering

## Security

- API keys are stored in `.env.local` (git-ignored)
- Keys are only accessible server-side (API routes)
- Never exposed to client-side code
- All sensitive operations happen in API routes

## Features (Planned)

### Store Management
- Create and delete file search stores
- View all stores in a grid layout
- Store metadata display

### File Upload
- Drag-and-drop file upload
- Custom chunking configuration
- Metadata tagging
- Upload progress tracking

### Query Interface
- Natural language queries
- Real-time AI responses
- Multi-store search
- Metadata filtering

### Citation Explorer
- Detailed source citations
- Grounding metadata display
- Export functionality (JSON, CSV, Markdown)

## Resources

- [Implementation Plan](features/frontend-build/implementation-plan.md)
- [Task Tracker](features/frontend-build/TASKS.md)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Contributing

This is a learning project for exploring the Gemini File Search API. Feel free to:
- Experiment with the code
- Try different features
- Build custom implementations
- Share your learnings

## License

MIT License - Feel free to use this project for learning and experimentation.

---

**Branch:** `feature/nextjs-frontend`
**Status:** In Development - Phase 7.5 Complete ✅
**Last Updated:** 2025-12-05
**Progress:** 154/170 tasks (91% - Document Management Complete!)

## What's New in Phase 6

✅ **Query Interface Fully Implemented:**
- Natural language question input with character counter
- AI-powered semantic search with Gemini 2.5 Flash
- Real-time answer generation with markdown rendering
- Syntax highlighting for code blocks
- Citation display with expandable source documents
- Advanced options (metadata filters, model selection)
- Query history stored in localStorage
- Copy-to-clipboard functionality
- Example questions to help users get started
- Comprehensive error handling

**Key Components:**
- `QueryInterface` - Full-featured question form with advanced options
- `AnswerDisplay` - Beautiful markdown rendering with syntax highlighting
- `CitationList` - Expandable citation cards showing source documents
- `useQuery` hook - Handles query submission and state management
- Query page at `/stores/[storeId]/query`

**Features:**
- Ask questions about uploaded documents in natural language
- Get AI-generated answers with proper markdown formatting
- View source citations showing which document chunks were used
- Filter by metadata (e.g., `category = "electronics"`)
- Choose between different Gemini models
- Copy answers to clipboard
- Automatic query history tracking

**The Complete RAG Workflow is Now Functional:**
1. Create a file search store
2. Upload documents with custom chunking and metadata
3. Ask questions about your documents
4. Get AI-generated answers with source citations
5. View and explore the grounding metadata

The core MVP is complete! The application now demonstrates the full Retrieval Augmented Generation (RAG) pattern with Google's Gemini File Search API.

## What's New in Phase 7.5

✅ **Document Management Fully Implemented:**
- View all uploaded files in a store with detailed metadata
- Delete individual documents with confirmation modal
- Real-time document status tracking (Processing/Ready/Failed)
- File size and upload date display in human-readable format
- Custom metadata badge display
- Empty state with upload CTA
- Comprehensive error handling and retry functionality
- Auto-refresh after upload or deletion

**Key Components:**
- `DocumentsList` - Main container for document management
- `DocumentItem` - Individual document display with state badges
- `DeleteDocumentModal` - Confirmation dialog for document deletion
- `EmptyDocumentsState` - Beautiful empty state with upload link
- `useDocuments` hook - Document state management and operations
- Document management at `/stores/[storeId]` (integrated into store detail page)

**Features:**
- List all documents in a store with status indicators
- Color-coded badges: 🟡 Processing, 🟢 Ready, 🔴 Failed
- Display file metadata: name, size, MIME type, upload date
- Delete individual files without deleting entire store
- View custom metadata tags for each document
- Automatic status updates with refresh button
- Mobile-responsive design (stacked on mobile, row layout on desktop)
- File type icons (PDF, text, image, video, code files)

**API Routes Added:**
- `GET /api/stores/[storeId]/documents` - List documents
- `DELETE /api/stores/[storeId]/documents/[documentId]` - Delete document

**Backend Components:**
- `lib/api/documents.ts` - Document operations (list, get, delete)
- `lib/utils/formatters.ts` - File size and date formatting utilities

**The Enhanced Workflow:**
1. Create a file search store
2. Upload multiple documents with custom chunking and metadata
3. **View and manage uploaded files in the store**
4. **Delete individual files as needed**
5. Ask questions about your documents
6. Get AI-generated answers with source citations
7. View and explore the grounding metadata

Document management is now fully integrated! Users can now manage their uploaded files directly from the store detail page.
