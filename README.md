# Gemini File Search - Next.js Frontend

A modern web application for exploring Google's Gemini File Search API with RAG (Retrieval Augmented Generation) capabilities.

![Landing Page](docs/screenshots/landing-page.png)

## Features

- **File Search Store Management** - Create and manage document stores
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

**Current Phase:** Phase 5 Complete ✅

- [x] Next.js project setup
- [x] Dependencies installed
- [x] Environment configured
- [x] Backend API layer (Phase 2) ✅
- [x] UI components (Phase 3) ✅
- [x] Store management (Phase 4) ✅
- [x] File upload (Phase 5) ✅
- [ ] Query interface (Phase 6)
- [ ] Advanced features (Phase 7)

**Progress:** 113/134 tasks complete (84.3%)

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

- `GET /api/stores` - List all file search stores
- `POST /api/stores` - Create a new store
- `GET /api/stores/[storeId]` - Get store details
- `DELETE /api/stores/[storeId]` - Delete a store
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
**Status:** In Development - Phase 5 Complete ✅
**Last Updated:** 2025-12-04
**Progress:** 113/134 tasks (84.3%)

## What's New in Phase 5

✅ **File Upload Fully Implemented:**
- Drag-and-drop file upload with react-dropzone
- File validation (size limits, type checking)
- Customizable chunking configuration with sliders
- Preset chunking options (Small, Medium, Large)
- Dynamic metadata editor with key-value pairs
- Support for string and numeric metadata values
- Real-time upload progress tracking
- Operation polling for async uploads
- Success/error state handling
- Upload another file or navigate to query

**Key Features:**
- `useFileUpload` hook for upload logic
- `useOperationPolling` hook for async operation tracking
- FileUploader component with drag-and-drop
- ChunkingConfigurator with visual sliders (200-800 tokens per chunk)
- MetadataEditor with add/remove rows and type selection
- UploadProgress component with loading states
- Full FormData submission to API
- Automatic operation polling until completion

The app now has a complete file upload system! You can upload documents with custom chunking and metadata, track upload progress, and prepare files for semantic search.
