# Implementation Plan: Next.js Frontend for Gemini File Search API

## Overview
Transform the existing Node.js CLI-based Gemini File Search learning environment into a full-stack Next.js application with integrated API routes and modern React frontend.

**User Requirements:**
- Architecture: Next.js 14+ with App Router
- Backend: Integrated API routes (not separate Express server)
- Features: Full MVP with store management, file upload, query interface, and advanced features (metadata filtering, custom chunking, multi-store queries, citation explorer)

## Project Structure

```
gemini-file-search-lesson/
├── legacy/                          # Move existing examples here
│   ├── examples/                    # Original CLI scripts
│   ├── scripts/                     # Original cleanup scripts
│   └── README-legacy.md
│
├── app/                             # Next.js App Router
│   ├── api/                         # API Routes
│   │   ├── stores/route.ts          # GET/POST stores
│   │   ├── stores/[storeId]/route.ts
│   │   ├── stores/[storeId]/upload/route.ts
│   │   ├── queries/route.ts         # POST queries
│   │   └── operations/[operationId]/route.ts
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── stores/page.tsx          # Stores list
│   │   ├── stores/[storeId]/page.tsx
│   │   ├── stores/[storeId]/upload/page.tsx
│   │   ├── stores/[storeId]/query/page.tsx
│   │   └── explorer/page.tsx        # Citation explorer
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
│
├── components/                      # React components
│   ├── ui/                          # Base UI components
│   ├── stores/                      # Store management
│   ├── upload/                      # File upload & config
│   ├── query/                       # Query interface
│   └── explorer/                    # Advanced features
│
├── lib/
│   ├── api/                         # Backend logic
│   │   ├── gemini-client.ts         # Gemini API wrapper
│   │   ├── stores.ts
│   │   ├── uploads.ts
│   │   └── queries.ts
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # TypeScript types
│   └── utils/
│
├── data/                            # Preserved sample files
├── .env.local                       # API key (git-ignored)
└── package.json
```

## Implementation Steps

### Phase 1: Project Setup (Day 1)

**1.1 Initialize Next.js**
- Run: `npx create-next-app@latest . --typescript --tailwind --app --use-npm`
- This creates Next.js in current directory

**1.2 Preserve Existing Code**
- Create `legacy/` directory
- Move `examples/` → `legacy/examples/`
- Move `scripts/` → `legacy/scripts/`
- Keep `data/` at root (used by frontend)

**1.3 Environment Configuration**
- Rename `.env` → `.env.local` (Next.js convention, auto git-ignored)
- Create `.env.example` with: `GEMINI_API_KEY=your-key-here`
- API key will be available server-side via `process.env.GEMINI_API_KEY`

**1.4 Install Dependencies**
```bash
npm install @google/genai dotenv  # Keep existing
npm install zod react-hook-form @hookform/resolvers
npm install react-dropzone react-markdown
npm install lucide-react date-fns
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
```

**1.5 TypeScript Configuration**
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Phase 2: Backend API Layer (Days 2-3)

**2.1 Core Gemini Client** (`lib/api/gemini-client.ts`)
- Create singleton GoogleGenAI instance
- Pattern from existing `examples/test-file-search.js:17`
- Export: `getGeminiClient()` function
- Validate API key on initialization

**2.2 Store Operations** (`lib/api/stores.ts`)
Functions to implement:
- `listStores()` - wraps `ai.fileSearchStores.list()`
- `createStore(displayName)` - wraps `ai.fileSearchStores.create()`
- `getStore(name)` - wraps `ai.fileSearchStores.get()`
- `deleteStore(name)` - wraps `ai.fileSearchStores.delete({ force: true })`

**2.3 Upload Operations** (`lib/api/uploads.ts`)
Functions:
- `uploadFile(params)` - wraps `ai.fileSearchStores.uploadToFileSearchStore()`
- Accepts: file path, store name, config (chunking, metadata)
- Returns operation object (not done yet)
- Pattern from `examples/test-file-search.js:52-58`

**2.4 Query Operations** (`lib/api/queries.ts`)
Functions:
- `queryStores(params)` - wraps `ai.models.generateContent()`
- Accepts: question, store names array, metadata filter
- Returns: answer text + grounding metadata
- Pattern from `examples/test-file-search.js:69-81`

**2.5 Operation Polling** (`lib/api/operations.ts`)
Functions:
- `getOperation(name)` - wraps `ai.operations.get()`
- `waitForOperation(operation)` - polling logic from `examples/test-file-search.js:20-31`

**2.6 TypeScript Types** (`lib/types/`)
Create interfaces for:
- Store, File, Query, Operation, GroundingMetadata
- API request/response types

**2.7 API Routes**
Implement Next.js API routes (run server-side, can use API key):

- `app/api/stores/route.ts`:
  - GET: List all stores → calls `listStores()`
  - POST: Create store → calls `createStore()`

- `app/api/stores/[storeId]/route.ts`:
  - GET: Get store details → calls `getStore()`
  - DELETE: Delete store → calls `deleteStore()`
  - **Note**: Use async/await for params: `const { storeId } = await params`

- `app/api/stores/[storeId]/upload/route.ts`:
  - POST: Upload file (FormData)
  - Save file to `/tmp/` temporarily
  - Call `uploadFile()`
  - Delete temp file
  - Return operation object
  - **Note**: Use async/await for params: `const { storeId } = await params`

- `app/api/queries/route.ts`:
  - POST: Query stores → calls `queryStores()`

- `app/api/operations/[operationId]/route.ts`:
  - GET: Get operation status → calls `getOperation()`
  - **Note**: Use async/await for params: `const { operationId } = await params`

All routes use Zod for validation and return proper error responses.

**Important**: Next.js 15+ requires awaiting `params` in dynamic routes.

### Phase 3: Core UI Components (Days 4-5)

**3.1 Base UI Components** (`components/ui/`)
Create reusable components:
- Button, Card, Input, Select, Modal, Toast, LoadingSpinner
- Use Tailwind CSS for styling
- Follow consistent design patterns

**3.2 Layout Components**
- `app/layout.tsx`: Root layout with global styles
- `app/(dashboard)/layout.tsx`: Dashboard layout with sidebar navigation

Navigation sidebar includes:
- Dashboard (home icon)
- Stores (database icon)
- Citation Explorer (search icon)

**3.3 Landing Page** (`app/page.tsx`)
Simple hero section:
- Title: "Gemini File Search"
- Subtitle: "RAG-powered document search with citations"
- Button: "Get Started" → links to `/stores`
- Feature highlights: Upload docs, Ask questions, View citations

### Phase 4: Store Management (Days 6-7)

**4.1 Stores List Page** (`app/(dashboard)/stores/page.tsx`)
Components to build:
- `components/stores/StoreList.tsx` - Grid of store cards
- `components/stores/StoreCard.tsx` - Individual card with actions
- `components/stores/CreateStoreModal.tsx` - Create form
- `components/stores/DeleteStoreModal.tsx` - Confirm deletion

Custom hook:
- `lib/hooks/useStores.ts`:
  - Fetches stores on mount: `GET /api/stores`
  - Returns: { stores, isLoading, error, createStore, deleteStore }
  - Re-fetches after create/delete

UI Features:
- Empty state: "No stores yet. Create your first store!"
- Create button (top right)
- Each card shows: display name, creation date
- Actions: View, Upload, Query, Delete

**4.2 Store Detail Page** (`app/(dashboard)/stores/[storeId]/page.tsx`)
- Display store metadata
- List files in store (future enhancement)
- Action buttons:
  - "Upload File" → `/stores/[storeId]/upload`
  - "Query Store" → `/stores/[storeId]/query`
- Breadcrumb: Dashboard > Stores > [Store Name]
- **Note**: Use async/await for params: `const { storeId } = await params`

### Phase 5: File Upload (Days 8-10)

**5.1 Upload Page** (`app/(dashboard)/stores/[storeId]/upload/page.tsx`)
Components:
- `components/upload/FileUploader.tsx`
- `components/upload/UploadProgress.tsx`
- `components/upload/ChunkingConfigurator.tsx`
- `components/upload/MetadataEditor.tsx`
- **Note**: Use async/await for params: `const { storeId } = await params`

**5.2 File Uploader Component**
- Drag-and-drop zone (using react-dropzone)
- File validation:
  - Max size: 100MB
  - Allowed types: text/*, application/pdf, etc.
- Display name input (defaults to filename)
- Selected file preview (name, size)

**5.3 Chunking Configurator**
- Slider: maxTokensPerChunk (200-800, default 400)
- Slider: maxOverlapTokens (20-50, default 30)
- Preset buttons:
  - Small: 200/20 (precise retrieval)
  - Medium: 400/30 (balanced)
  - Large: 800/50 (more context)
- Visual explanation of what chunking means

**5.4 Metadata Editor**
- Dynamic key-value rows
- Type selector per row: String or Numeric
- Add/remove row buttons
- Validation: no duplicate keys
- Example: `category: "electronics"`, `year: 2024`

**5.5 Upload Flow**
Hook: `lib/hooks/useFileUpload.ts`
1. User submits form
2. Create FormData with file + config
3. POST to `/api/stores/[storeId]/upload`
4. Get operation object back
5. Start polling with `lib/hooks/useOperationPolling.ts`
6. Poll `/api/operations/[operationId]` every 3 seconds
7. Show progress bar (percentage if available)
8. When `operation.done === true`: show success
9. Redirect to query page or show "Upload another" option

Pattern from `examples/test-file-search.js:52-62` (wait for operation)

### Phase 6: Query Interface (Days 11-13)

**6.1 Query Page** (`app/(dashboard)/stores/[storeId]/query/page.tsx`)
Components:
- `components/query/QueryInterface.tsx`
- `components/query/AnswerDisplay.tsx`
- `components/query/CitationList.tsx`
- `components/query/QueryHistory.tsx` (optional sidebar)
- **Note**: Use async/await for params: `const { storeId } = await params`

**6.2 Query Interface Component**
- Large textarea for question input
- Character counter
- Store selector (multi-select checkbox list for multi-store queries)
- Advanced options (collapsible):
  - Metadata filter input (e.g., `category = "electronics"`)
  - Model selector (default: gemini-2.5-flash)
- Submit button (primary, large)
- Loading state during query

**6.3 Answer Display Component**
- Markdown rendering (react-markdown)
- Syntax highlighting for code blocks
- Copy to clipboard button
- Loading skeleton while querying

**6.4 Citation List Component**
- Expandable citation cards
- Each card shows:
  - Source file name
  - Snippet of retrieved text
  - Expand to view full chunk
- Click to open in Citation Explorer

**6.5 Query Flow**
Hook: `lib/hooks/useQuery.ts`
1. User types question and clicks submit
2. POST to `/api/queries` with:
   - question: string
   - storeNames: string[]
   - metadataFilter?: string
3. API calls `ai.models.generateContent()` (pattern from `examples/test-file-search.js:69-81`)
4. Returns:
   - answer: response.text
   - citations: response.candidates[0].groundingMetadata
5. Display answer and citations
6. Store in query history (localStorage)

### Phase 7: Advanced Features (Days 14-16)

**7.1 Multi-Store Query Selector**
Component: `components/explorer/MultiStoreSelector.tsx`
- Checkbox list of all stores
- Search/filter stores by name
- Select all / Deselect all buttons
- Show file count per store
- Pass selected store names to query API

**7.2 Metadata Filter Builder**
Component: `components/explorer/MetadataFilter.tsx`
- Builder UI:
  - Dropdown: Field name (from known metadata keys)
  - Dropdown: Operator (=, !=, >, <, >=, <=)
  - Input: Value (string or numeric)
- Add multiple filters with AND/OR logic
- Preview generated filter string
- Example: `category = "electronics" AND year > 2023`
- Validate and pass to query API

**7.3 Citation Explorer Page** (`app/(dashboard)/explorer/page.tsx`)
Component: `components/explorer/CitationExplorer.tsx`
- Query history selector (dropdown or sidebar)
- Split-pane layout:
  - Left: Query + Answer
  - Right: Detailed citation view
- Citation details:
  - Full chunk text
  - Source file name
  - Metadata tags
  - Copy citation button
- Filter citations:
  - By file name
  - By metadata values
- Export functionality:
  - JSON: Full data structure
  - CSV: Table format
  - Markdown: Formatted report

### Phase 8: Polish & Testing (Days 17-18)

**8.1 Loading States**
- Add loading skeletons to all pages
- Progress indicators for async operations
- Disable buttons during loading

**8.2 Error Handling**
- Toast notifications for errors
- Error boundaries for React errors
- User-friendly error messages
- Validate API key on app startup (health check)

**8.3 Empty States**
- "No stores yet" with create button
- "No files uploaded" with upload button
- "No queries yet" with example questions

**8.4 Responsive Design**
- Test on mobile (320px, 375px, 414px)
- Test on tablet (768px, 1024px)
- Test on desktop (1280px, 1920px)
- Mobile: Collapse sidebar, stack layouts

**8.5 Accessibility**
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on interactive elements
- Focus visible indicators
- Screen reader testing

**8.6 Performance**
- Lazy load components
- Memoize expensive computations
- Optimize re-renders with React.memo

### Phase 9: Documentation (Day 19)

**9.1 Update README.md**
Add sections:
- Prerequisites (Node.js 20+, Gemini API key)
- Installation steps
- Environment setup (.env.local)
- Running the app (`npm run dev`)
- Building for production (`npm run build`)
- Project structure overview

**9.2 Create USER_GUIDE.md**
Document:
- Creating stores
- Uploading files (with chunking/metadata options)
- Querying stores
- Understanding citations
- Advanced features (multi-store, filters)

**9.3 Update CLAUDE.md**
- Preserve existing CLI documentation
- Add frontend architecture section
- Document API routes
- Explain component structure

## Critical Implementation Details

### API Key Security
- ✅ Stored in `.env.local` (server-side only, git-ignored)
- ✅ Never exposed in client-side code
- ✅ API routes run server-side, safe to use key
- ✅ Health check endpoint validates key exists

### File Upload Pattern
```typescript
// Frontend (FormData)
const formData = new FormData();
formData.append('file', file);
formData.append('displayName', displayName);
formData.append('config', JSON.stringify({ chunkingConfig, customMetadata }));
await fetch('/api/stores/[storeId]/upload', { method: 'POST', body: formData });

// Backend (API route)
const formData = await request.formData();
const file = formData.get('file') as File;
// Save to /tmp/, call geminiClient.upload(), clean up temp file
```

### Operation Polling Pattern
```typescript
// Hook implementation
const { status, progress } = useOperationPolling(operationName);

// Polls every 3 seconds until operation.done === true
// Shows progress bar with percentage
// Timeout after 5 minutes
```

### Query with Citations Pattern
```typescript
// Based on examples/test-file-search.js:69-94
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: question,
  config: {
    tools: [{
      fileSearch: {
        fileSearchStoreNames: storeNames,  // Array for multi-store
        metadataFilter: 'category = "electronics"'  // Optional
      }
    }]
  }
});

// Extract answer and citations
const answer = response.text;
const citations = response.candidates[0].groundingMetadata.groundingChunks;
```

### Dynamic Route Params Pattern (Next.js 15+)
```typescript
// app/api/stores/[storeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  // IMPORTANT: Await params in Next.js 15+
  const { storeId } = await params;

  // Use storeId to fetch store details
  const store = await getStore(storeId);

  return NextResponse.json({ store });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;

  await deleteStore(storeId);

  return NextResponse.json({ success: true });
}
```

```typescript
// app/api/stores/[storeId]/upload/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  const formData = await request.formData();

  // ... handle upload
}
```

```typescript
// app/api/operations/[operationId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const { operationId } = await params;

  const operation = await getOperation(operationId);

  return NextResponse.json({ operation });
}
```

**Key Points:**
- `params` is now a Promise in Next.js 15+
- Always `await params` before destructuring
- This applies to ALL dynamic route segments
- Failure to await will cause runtime errors

## File Priorities

**Phase 1 (Setup):**
1. Initialize Next.js project
2. Move legacy code to `legacy/`
3. Set up `.env.local`

**Phase 2 (Backend - Critical):**
1. `lib/api/gemini-client.ts` - Core API wrapper
2. `lib/types/index.ts` - TypeScript types
3. `lib/api/stores.ts` - Store operations
4. `lib/api/uploads.ts` - Upload operations
5. `lib/api/queries.ts` - Query operations
6. `app/api/stores/route.ts` - First API endpoint

**Phase 3 (Frontend - Critical):**
1. `app/(dashboard)/layout.tsx` - Dashboard layout
2. `app/(dashboard)/stores/page.tsx` - Stores list
3. `lib/hooks/useStores.ts` - Store state management
4. `components/stores/StoreList.tsx` - Store display
5. `components/stores/StoreCard.tsx` - Individual card

**Phase 4 (Upload):**
1. `app/api/stores/[storeId]/upload/route.ts` - Upload endpoint
2. `app/(dashboard)/stores/[storeId]/upload/page.tsx` - Upload page
3. `components/upload/FileUploader.tsx` - File selection
4. `lib/hooks/useFileUpload.ts` - Upload logic
5. `lib/hooks/useOperationPolling.ts` - Polling logic

**Phase 5 (Query):**
1. `app/api/queries/route.ts` - Query endpoint
2. `app/(dashboard)/stores/[storeId]/query/page.tsx` - Query page
3. `components/query/QueryInterface.tsx` - Question input
4. `components/query/AnswerDisplay.tsx` - Answer rendering
5. `components/query/CitationList.tsx` - Citations display

## Success Criteria

✅ Users can create/delete file search stores via web UI
✅ Users can upload files with custom chunking configuration
✅ Users can add metadata to files and filter by metadata
✅ Users can ask questions and see answers with citations
✅ Users can query multiple stores simultaneously
✅ Users can explore citations in detail with export
✅ API key never exposed to client-side
✅ All async operations show progress/loading states
✅ Error handling with user-friendly messages
✅ Responsive design (mobile, tablet, desktop)
✅ Accessible (keyboard nav, screen readers)

## Next Steps After Plan Approval

1. Run `npx create-next-app@latest . --typescript --tailwind --app --use-npm`
2. Move existing code to `legacy/`
3. Install dependencies
4. Create `lib/api/gemini-client.ts` (reuse pattern from `examples/test-file-search.js:17`)
5. Build API routes layer
6. Build frontend components layer by layer
7. Test end-to-end workflow
8. Polish and deploy
