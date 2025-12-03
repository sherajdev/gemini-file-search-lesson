# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application for Google's Gemini File Search API, demonstrating RAG (Retrieval Augmented Generation) patterns. The project uses the `@google/genai` SDK with a modern React frontend and Next.js API routes.

**Branch:** `feature/nextjs-frontend`
**Status:** Phase 1 Complete - Building Next.js Frontend

## Essential Commands

### Development
```bash
# Start Next.js dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Legacy CLI Examples
```bash
# Basic workflow
node legacy/examples/test-file-search.js

# Advanced features
node legacy/examples/advanced-examples.js

# Clean up all File Search Stores
node legacy/scripts/cleanup-stores.js
```

### Dependencies
```bash
npm install  # Install all dependencies
```

### Environment Setup
Requires `.env.local` file (Next.js convention) with `GEMINI_API_KEY=your-api-key-here`

## Project Structure

```
gemini-file-search-lesson/
├── app/                        # Next.js App Router
│   ├── api/                   # API routes (server-side)
│   │   ├── stores/           # Store CRUD operations
│   │   ├── queries/          # Query endpoints
│   │   └── operations/       # Operation polling
│   ├── (dashboard)/          # Dashboard pages
│   │   ├── stores/          # Store management UI
│   │   └── explorer/        # Citation explorer
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/               # React components
│   ├── ui/                  # Base UI components (Button, Card, etc.)
│   ├── stores/              # Store management components
│   ├── upload/              # File upload components
│   ├── query/               # Query interface components
│   └── explorer/            # Citation explorer components
├── lib/                     # Backend logic and utilities
│   ├── api/                # Gemini API wrappers
│   │   ├── gemini-client.ts  # Singleton client
│   │   ├── stores.ts        # Store operations
│   │   ├── uploads.ts       # Upload operations
│   │   └── queries.ts       # Query operations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── data/                    # Sample test files
├── legacy/                  # Original CLI code
│   ├── examples/           # CLI scripts
│   ├── scripts/            # Utilities
│   └── docs/               # API documentation
└── features/                # Feature planning
    └── frontend-build/     # Implementation plan & tasks
```

## Architecture

### Next.js 15+ Patterns

**Important:** This project uses Next.js 16 which requires async params in dynamic routes:

```typescript
// CORRECT: app/api/stores/[storeId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params; // Must await params
  // ... use storeId
}
```

### Backend Architecture (API Routes)

**API Key Security:**
- API key stored in `.env.local` (server-side only, git-ignored)
- Never exposed to client-side code
- All Gemini API calls happen in API routes

**Core API Operations:**

1. **Store Management** (`lib/api/stores.ts`):
   - `listStores()` - List all file search stores
   - `createStore(displayName)` - Create new store
   - `getStore(name)` - Get store details
   - `deleteStore(name)` - Delete store (force: true)

2. **Upload Operations** (`lib/api/uploads.ts`):
   - `uploadFile(params)` - Upload file with config
   - Handles: file path, store name, chunking, metadata
   - Returns operation object for polling

3. **Query Operations** (`lib/api/queries.ts`):
   - `queryStores(params)` - Query with AI
   - Supports: multi-store queries, metadata filtering
   - Returns: answer text + grounding metadata

4. **Operation Polling** (`lib/api/operations.ts`):
   - `getOperation(name)` - Get operation status
   - `waitForOperation(operation)` - Poll until done
   - Poll every 3 seconds until `operation.done === true`

### Frontend Architecture (React Components)

**Component Organization:**

- **UI Components** (`components/ui/`): Reusable base components using Radix UI
- **Feature Components**: Organized by feature (stores, upload, query, explorer)
- **Hooks** (`lib/hooks/`): Custom React hooks for data fetching and state

**Key Patterns:**

1. **Data Fetching**: Custom hooks (e.g., `useStores`, `useFileUpload`)
2. **Forms**: React Hook Form + Zod validation
3. **Styling**: Tailwind CSS with utility classes
4. **State**: React hooks + localStorage for persistence

### Gemini File Search API Patterns

**File Search Stores**: Persistent containers for document embeddings. Stores remain until explicitly deleted.

**Upload Patterns**:
1. **Direct Upload** (`uploadToFileSearchStore`): File → Store (recommended)
2. **Import Method** (`importFilesToFileSearchStore`): File → Files API → Store

**Query Pattern**:
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: question,
  config: {
    tools: [{
      fileSearch: {
        fileSearchStoreNames: [store.name],
        metadataFilter: 'category = "electronics"' // Optional
      }
    }]
  }
});
```

**Citations**: Extract from `response.candidates[0].groundingMetadata.groundingChunks`

### Key Configuration Options

**Chunking** (`chunkingConfig.whiteSpaceConfig`):
- `maxTokensPerChunk`: 200-800 (default: 400)
- `maxOverlapTokens`: 20-50 (default: 30)
- Smaller chunks = more focused retrieval, larger chunks = more context

**Metadata** (`customMetadata`):
- Attach key-value pairs to files (string or numeric values)
- Filter queries with `metadataFilter` syntax (e.g., `'category = "electronics" AND year = 2024'`)
- See legacy/examples/advanced-examples.js for examples

**Models**: Use `gemini-2.5-flash` for queries

### Important Behaviors

**Store Persistence**: File Search Stores persist indefinitely. Always clean up test stores.

**Operation Polling**: Upload operations are asynchronous. Always poll until `operation.done === true`.

**Path Resolution**: Use absolute paths or Next.js `@/*` aliases.

**Error Handling**: API errors may include `error.response.data` with detailed information.

## Development Workflow

### Phase Tracking

Track progress in `features/frontend-build/TASKS.md`:
- Phase 1: Project Setup ✅
- Phase 2: Backend API Layer (Next)
- Phase 3-9: Frontend features

### Implementation Pattern

1. Read implementation plan: `features/frontend-build/implementation-plan.md`
2. Follow task checklist: `features/frontend-build/TASKS.md`
3. Update task checkboxes as you complete them
4. Commit after completing each phase

### Testing

```bash
# Type checking
npm run type-check

# Development server
npm run dev

# Test legacy CLI (to verify API works)
node legacy/examples/test-file-search.js
```

## Common Tasks

### Creating API Routes

```typescript
// app/api/stores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listStores, createStore } from '@/lib/api/stores';

export async function GET() {
  const stores = await listStores();
  return NextResponse.json({ stores });
}

export async function POST(request: NextRequest) {
  const { displayName } = await request.json();
  const store = await createStore(displayName);
  return NextResponse.json({ store });
}
```

### Creating React Components

```typescript
// components/stores/StoreCard.tsx
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function StoreCard({ store }: { store: Store }) {
  return (
    <Card>
      <h3>{store.displayName}</h3>
      <Button onClick={() => handleDelete(store.name)}>
        Delete
      </Button>
    </Card>
  );
}
```

### Using Custom Hooks

```typescript
// In a component
const { stores, isLoading, createStore, deleteStore } = useStores();
```

## Resources

- **Implementation Plan**: `features/frontend-build/implementation-plan.md`
- **Task Tracker**: `features/frontend-build/TASKS.md`
- **Legacy CLI Docs**: `legacy/` directory
- **Next.js Docs**: https://nextjs.org/docs
- **Gemini API Docs**: https://ai.google.dev/docs
