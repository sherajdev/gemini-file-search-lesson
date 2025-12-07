# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application for Google's Gemini File Search API, demonstrating RAG (Retrieval Augmented Generation) patterns. The project uses the `@google/genai` SDK with a modern React frontend and Next.js API routes.

**Branch:** `feature/nextjs-frontend`
**Status:** Phase 9 Complete - Production Ready with Full Documentation

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

**Models**:

Supported models for File Search queries:
- `gemini-2.5-flash` - Fast, balanced (recommended default)
- `gemini-2.5-pro` - High quality, production-ready
- `gemini-2.5-flash-lite` - Fastest, lightweight
- `gemini-3-pro-preview` - Most capable (experimental)
- `gemini-2.0-flash-exp` - Experimental

Model configuration centralized in `lib/config/models.ts`.
To add new models: Update `GEMINI_MODELS` array - UI updates automatically.

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

- **User Guide**: `docs/USER_GUIDE.md` - End-user documentation
- **Implementation Plan**: `features/frontend-build/implementation-plan.md`
- **Task Tracker**: `features/frontend-build/TASKS.md`
- **Legacy CLI Docs**: `legacy/` directory
- **Next.js Docs**: https://nextjs.org/docs
- **Gemini API Docs**: https://ai.google.dev/docs

---

## Detailed Frontend Architecture

### Component Hierarchy

```
App Layout (app/layout.tsx)
├── Landing Page (app/page.tsx)
└── Dashboard Layout (app/(dashboard)/layout.tsx)
    ├── Sidebar Navigation
    ├── Stores Page (app/(dashboard)/stores/page.tsx)
    │   ├── StoreList (components/stores/StoreList.tsx)
    │   │   ├── StoreCard (components/stores/StoreCard.tsx)
    │   │   ├── CreateStoreModal (components/stores/CreateStoreModal.tsx)
    │   │   └── DeleteStoreModal (components/stores/DeleteStoreModal.tsx)
    │   └── EmptyDocumentsState
    ├── Store Detail Page (app/(dashboard)/stores/[storeId]/page.tsx)
    │   ├── DocumentsList (components/documents/DocumentsList.tsx)
    │   │   ├── DocumentItem (components/documents/DocumentItem.tsx)
    │   │   └── DeleteDocumentModal (components/documents/DeleteDocumentModal.tsx)
    │   └── Action Buttons (Upload, Query)
    ├── Upload Page (app/(dashboard)/stores/[storeId]/upload/page.tsx)
    │   ├── FileUploader (components/upload/FileUploader.tsx)
    │   ├── ChunkingConfigurator (components/upload/ChunkingConfigurator.tsx)
    │   ├── MetadataEditor (components/upload/MetadataEditor.tsx)
    │   └── UploadProgress (components/upload/UploadProgress.tsx)
    ├── Query Page (app/(dashboard)/stores/[storeId]/query/page.tsx)
    │   ├── QueryInterface (components/query/QueryInterface.tsx)
    │   ├── AnswerDisplay (components/query/AnswerDisplay.tsx)
    │   └── CitationList (components/query/CitationList.tsx)
    └── Explorer Page (app/(dashboard)/explorer/page.tsx)
        └── CitationExplorer (components/explorer/CitationExplorer.tsx)
            ├── MultiStoreSelector (components/explorer/MultiStoreSelector.tsx)
            └── MetadataFilter (components/explorer/MetadataFilter.tsx)
```

### Custom Hooks

**Data Fetching Hooks:**

1. **`useStores.ts`** - Store management
   ```typescript
   const { stores, isLoading, error, createStore, deleteStore, refetch } = useStores();
   ```
   - Fetches all stores from `/api/stores`
   - Provides CRUD operations
   - Automatic refetch after mutations

2. **`useDocuments.ts`** - Document management
   ```typescript
   const { documents, isLoading, error, deleteDocument, refetch } = useDocuments(storeId);
   ```
   - Fetches documents for a specific store
   - Provides delete operation
   - Auto-refresh on changes

3. **`useFileUpload.ts`** - File upload flow
   ```typescript
   const { uploadFile, isUploading, progress, error } = useFileUpload();
   ```
   - Handles multipart form upload
   - Polls operation status
   - Progress tracking

4. **`useQuery.ts`** - Query submission
   ```typescript
   const { submitQuery, isQuerying, result, error } = useQuery();
   ```
   - Submits queries to API
   - Parses grounding metadata
   - Stores query history

5. **`useOperationPolling.ts`** - Operation status polling
   ```typescript
   const { pollOperation, status, error } = useOperationPolling();
   ```
   - Polls operation status every 3 seconds
   - Resolves when operation completes
   - Error handling

**State Management Hooks:**

- **Query History**: Stored in localStorage, managed by `useQuery`
- **Toast Notifications**: Radix UI Toast for user feedback
- **Modal State**: Local component state with Radix UI Dialog

### UI Component Library

**Base Components** (`components/ui/`):

- **Button.tsx**: Primary, secondary, destructive variants
- **Card.tsx**: Content containers with padding/borders
- **Input.tsx**: Text input with validation states
- **Select.tsx**: Dropdown selector (Radix UI)
- **Modal.tsx**: Dialog modals (Radix UI Dialog)
- **Toast.tsx**: Notifications (Radix UI Toast)
- **LoadingSpinner.tsx**: Loading indicators
- **Badge.tsx**: Labels and tags
- **Slider.tsx**: Range inputs (Radix UI Slider)

**Styling System:**

- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority (CVA)**: Variant-based component styling
- **clsx + tailwind-merge**: Dynamic class composition
- **Responsive**: Mobile-first breakpoints (sm, md, lg, xl, 2xl)

### State Flow Patterns

**1. Data Fetching Pattern:**
```
Component Mount → Hook Fetch → API Route → Gemini API → Response → State Update → UI Render
```

**2. Form Submission Pattern:**
```
User Input → React Hook Form → Zod Validation → Submit Handler → API Route → Operation Poll → Success/Error → Toast Notification
```

**3. Operation Polling Pattern:**
```
API Returns Operation → Start Polling → Check Status Every 3s → Operation Done → Fetch Result → Update State
```

---

## API Routes Documentation

### Stores API

**GET `/api/stores`**
- **Purpose**: List all File Search Stores
- **Authentication**: None (API key in server env)
- **Response**:
  ```json
  {
    "stores": [
      {
        "name": "fileSearchStores/xyz",
        "displayName": "Product Manuals",
        "createTime": "2024-01-15T10:30:00Z",
        "updateTime": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```
- **Implementation**: Calls `listStores()` from `lib/api/stores.ts`

**POST `/api/stores`**
- **Purpose**: Create new File Search Store
- **Request Body**:
  ```json
  {
    "displayName": "My New Store"
  }
  ```
- **Validation**: Zod schema validates displayName (string, 1-100 chars)
- **Response**: Returns created store object
- **Implementation**: Calls `createStore(displayName)`

**GET `/api/stores/[storeId]`**
- **Purpose**: Get single store details
- **URL Parameter**: `storeId` (store name)
- **Response**: Store object with metadata
- **Error**: 404 if store not found

**DELETE `/api/stores/[storeId]`**
- **Purpose**: Delete a store
- **URL Parameter**: `storeId` (store name)
- **Force Delete**: Always uses `force: true` to delete even with files
- **Response**: `{ success: true }`
- **Error**: 404 if store not found

### Documents API

**GET `/api/stores/[storeId]/documents`**
- **Purpose**: List all documents in a store
- **URL Parameter**: `storeId` (store name)
- **Response**:
  ```json
  {
    "documents": [
      {
        "name": "fileSearchStores/xyz/documents/abc",
        "displayName": "manual.pdf",
        "mimeType": "application/pdf",
        "sizeBytes": "1024000",
        "createTime": "2024-01-15T10:30:00Z",
        "updateTime": "2024-01-15T10:30:00Z",
        "metadata": {
          "category": "manual"
        }
      }
    ]
  }
  ```
- **Implementation**: Calls `listDocuments(storeId)` from `lib/api/documents.ts`

**DELETE `/api/stores/[storeId]/documents/[documentId]`**
- **Purpose**: Delete a document from a store
- **URL Parameters**: `storeId`, `documentId`
- **Response**: `{ success: true }`
- **Error**: 404 if document not found

### Upload API

**POST `/api/stores/[storeId]/upload`**
- **Purpose**: Upload file to store
- **URL Parameter**: `storeId` (store name)
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: File to upload (required)
  - `displayName`: Override filename (optional)
  - `maxTokensPerChunk`: Number 200-512 (optional, default: 400)
  - `maxOverlapTokens`: Number 20-50 (optional, default: 30)
  - `metadata`: JSON string of custom metadata (optional)
- **Validation**:
  - File required
  - Chunking values in valid range
  - Metadata is valid JSON
- **Response**:
  ```json
  {
    "operation": {
      "name": "operations/xyz",
      "done": false,
      "metadata": {...}
    }
  }
  ```
- **Implementation**:
  1. Parse multipart form data
  2. Save file to temp location
  3. Call `uploadFile()` from `lib/api/uploads.ts`
  4. Return operation for client-side polling

### Query API

**POST `/api/queries`**
- **Purpose**: Query stores with AI
- **Request Body**:
  ```json
  {
    "question": "What are the system requirements?",
    "storeNames": ["fileSearchStores/xyz"],
    "metadataFilter": "category = \"manual\"",
    "model": "gemini-2.5-flash"
  }
  ```
- **Validation**:
  - `question`: Required, 1-5000 chars
  - `storeNames`: Required, array of store names
  - `metadataFilter`: Optional string
  - `model`: Optional, defaults to gemini-2.5-flash
- **Response**:
  ```json
  {
    "answer": "The system requirements are...",
    "groundingMetadata": {
      "groundingChunks": [
        {
          "retrievedContext": {
            "uri": "fileSearchStores/xyz/documents/abc",
            "title": "manual.pdf",
            "text": "System requirements: ..."
          }
        }
      ]
    }
  }
  ```
- **Implementation**: Calls `queryStores()` from `lib/api/queries.ts`

### Operations API

**GET `/api/operations/[operationId]`**
- **Purpose**: Check operation status
- **URL Parameter**: `operationId` (operation name)
- **Response**:
  ```json
  {
    "operation": {
      "name": "operations/xyz",
      "done": true,
      "response": {
        "document": {...}
      }
    }
  }
  ```
- **Polling**: Client should poll every 3 seconds until `done: true`
- **Implementation**: Calls `getOperation(operationId)`

---

## Component Structure Details

### Store Management Components

**StoreList.tsx**:
- Displays grid of store cards
- "Create New Store" button
- Empty state when no stores
- Loading skeleton during fetch
- Props: None (uses `useStores` hook)

**StoreCard.tsx**:
- Display name, creation date
- Document count badge
- View, Upload, Query, Delete buttons
- Hover effects and transitions
- Props: `{ store: Store }`

**CreateStoreModal.tsx**:
- Modal dialog with form
- Text input for display name
- Form validation with Zod
- Submit handler calls `createStore()`
- Success toast notification
- Props: `{ open: boolean, onClose: () => void }`

**DeleteStoreModal.tsx**:
- Confirmation dialog
- Warning message about permanent deletion
- Cancel and Confirm buttons
- Props: `{ store: Store, open: boolean, onClose: () => void }`

### Document Management Components

**DocumentsList.tsx**:
- Lists all documents in a store
- Grid/list view toggle
- Search/filter functionality
- Loading states
- Empty state when no documents
- Props: `{ storeId: string }`

**DocumentItem.tsx**:
- File icon based on mime type
- File name and size
- Upload date
- Delete button
- Props: `{ document: Document, onDelete: () => void }`

**DeleteDocumentModal.tsx**:
- Confirmation dialog for document deletion
- Shows document name
- Props: `{ document: Document, open: boolean, onClose: () => void }`

### Upload Components

**FileUploader.tsx**:
- React Dropzone integration
- Drag-and-drop zone
- Click to browse
- File validation (size, type)
- Display name input
- Selected file preview
- Props: `{ onFileSelect: (file: File) => void }`

**ChunkingConfigurator.tsx**:
- Two sliders: maxTokensPerChunk, maxOverlapTokens
- Preset buttons (Small, Medium, Large)
- Visual explanation of chunking
- Real-time value updates
- Props: `{ value: ChunkingConfig, onChange: (config) => void }`

**MetadataEditor.tsx**:
- Dynamic key-value pair rows
- Add/remove row buttons
- Type selector (String/Numeric)
- Duplicate key validation
- Props: `{ value: Metadata[], onChange: (metadata) => void }`

**UploadProgress.tsx**:
- Progress bar (0-100%)
- Status text (Uploading, Processing, Complete)
- Cancel button (if supported)
- Error display
- Props: `{ progress: number, status: string, error?: string }`

### Query Components

**QueryInterface.tsx**:
- Large textarea for question input
- Character counter
- Multi-store selector
- Advanced options toggle (metadata filter, model)
- Submit button with loading state
- Props: `{ storeId?: string }`

**AnswerDisplay.tsx**:
- Markdown rendering (react-markdown)
- Syntax highlighting for code blocks
- Copy to clipboard button
- Loading skeleton
- Props: `{ answer: string, isLoading: boolean }`

**CitationList.tsx**:
- Expandable citation cards
- Source file name with icon
- Text snippet preview
- Expand to view full chunk
- Relevance indicators
- Props: `{ citations: GroundingChunk[] }`

### Explorer Components

**CitationExplorer.tsx**:
- Split-pane layout
- Query history selector
- Citation filtering
- Export functionality (JSON, CSV, Markdown)
- Props: None (uses query history from localStorage)

**MultiStoreSelector.tsx**:
- Checkbox list of all stores
- Search/filter stores
- Select all/deselect all
- File count per store
- Props: `{ selected: string[], onChange: (selected: string[]) => void }`

**MetadataFilter.tsx**:
- Field name dropdown
- Operator selector (=, !=, <, >, <=, >=)
- Value input
- AND/OR logic builder
- Filter string preview
- Syntax validation
- Props: `{ value: string, onChange: (filter: string) => void }`

---

## Development Workflow (Enhanced)

### Project Setup

1. **Clone and Install**:
   ```bash
   git clone <repo-url>
   cd gemini-file-search-lesson
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

3. **Verify Setup**:
   ```bash
   npm run type-check  # Should pass with no errors
   npm run dev         # Start dev server
   ```

### Daily Development Workflow

1. **Start Dev Server**:
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

2. **Make Changes**:
   - Edit files in `app/`, `components/`, or `lib/`
   - Hot reload shows changes instantly
   - Check console for errors

3. **Type Check**:
   ```bash
   npm run type-check
   # Fix any TypeScript errors
   ```

4. **Test Manually**:
   - Navigate through UI
   - Test CRUD operations
   - Check browser console for errors
   - Verify API responses in Network tab

5. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Feature Development Pattern

1. **Plan** (if complex feature):
   - Review `features/frontend-build/TASKS.md`
   - Break down into subtasks
   - Identify affected components

2. **Backend First** (if API changes needed):
   - Create/update types in `lib/types/`
   - Implement API wrapper in `lib/api/`
   - Create/update API route in `app/api/`
   - Test with curl or Postman

3. **Frontend Next**:
   - Create/update custom hook in `lib/hooks/`
   - Create/update components
   - Wire up state management
   - Add loading/error states

4. **Test & Polish**:
   - Test happy path
   - Test error cases
   - Check responsive design
   - Verify accessibility

5. **Update Docs**:
   - Update TASKS.md checkboxes
   - Add comments for complex logic
   - Update USER_GUIDE.md if user-facing

### Code Organization Guidelines

**File Naming**:
- Components: PascalCase (e.g., `StoreCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useStores.ts`)
- Utils: camelCase (e.g., `formatters.ts`)
- Types: camelCase (e.g., `index.ts`)
- API routes: lowercase (e.g., `route.ts`)

**Import Order**:
1. React/Next.js imports
2. Third-party libraries
3. Local components (`@/components`)
4. Local hooks (`@/lib/hooks`)
5. Local utils/types (`@/lib/utils`, `@/lib/types`)
6. Relative imports

**Component Structure**:
```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/Button';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {};

  // 6. Effects
  useEffect(() => {}, []);

  // 7. Render
  return <div>...</div>;
}
```

### Debugging Tips

**Browser DevTools**:
- Console: Check for errors and logs
- Network: Inspect API requests/responses
- React DevTools: Inspect component props/state
- Performance: Profile rendering performance

**Next.js Dev Mode**:
- Error overlay shows compile errors
- Fast refresh updates on save
- API routes show errors in terminal

**Common Issues**:
- **"Module not found"**: Check import paths, use `@/*` aliases
- **"Hydration error"**: Ensure server/client render match
- **"API error"**: Check `.env.local`, verify API key
- **"Type error"**: Run `npm run type-check` for details

---

## Testing Guidelines

### Manual Testing Checklist

**Store Management**:
- [ ] Create store with valid name
- [ ] Create store with duplicate name (should error)
- [ ] View store details
- [ ] Delete empty store
- [ ] Delete store with documents (force delete)
- [ ] Verify stores persist after refresh

**File Upload**:
- [ ] Upload file via drag-and-drop
- [ ] Upload file via file picker
- [ ] Upload with custom display name
- [ ] Upload with different chunking configs
- [ ] Upload with custom metadata
- [ ] Verify upload progress shows
- [ ] Verify operation polling completes
- [ ] Upload large file (check limits)
- [ ] Upload unsupported file type (should error)

**Document Management**:
- [ ] View documents in store
- [ ] Delete single document
- [ ] View empty state when no documents
- [ ] Verify document metadata displays correctly

**Query**:
- [ ] Submit simple query
- [ ] Query returns relevant answer
- [ ] Citations display correctly
- [ ] Expand citation to view full chunk
- [ ] Query with metadata filter
- [ ] Multi-store query
- [ ] Query with no results
- [ ] Query too long (should error)

**Explorer**:
- [ ] View query history
- [ ] Filter citations
- [ ] Export citations (JSON, CSV, Markdown)
- [ ] Multi-store selector works
- [ ] Metadata filter builder works

**UI/UX**:
- [ ] Loading states show correctly
- [ ] Error messages are user-friendly
- [ ] Toast notifications appear
- [ ] Modals open/close properly
- [ ] Navigation works (sidebar, breadcrumbs)
- [ ] Empty states are helpful

**Responsive Design**:
- [ ] Test mobile (375px)
- [ ] Test tablet (768px)
- [ ] Test desktop (1280px)
- [ ] Touch interactions work
- [ ] Sidebar collapses on mobile

**Accessibility**:
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader friendly (test with NVDA/VoiceOver)

### API Testing with curl

**List Stores**:
```bash
curl http://localhost:3000/api/stores
```

**Create Store**:
```bash
curl -X POST http://localhost:3000/api/stores \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test Store"}'
```

**Delete Store**:
```bash
curl -X DELETE http://localhost:3000/api/stores/fileSearchStores%2FSTORE_ID
```

**Upload File**:
```bash
curl -X POST http://localhost:3000/api/stores/fileSearchStores%2FSTORE_ID/upload \
  -F "file=@/path/to/file.pdf" \
  -F "displayName=My Document" \
  -F "maxTokensPerChunk=400"
```

**Query**:
```bash
curl -X POST http://localhost:3000/api/queries \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is this about?",
    "storeNames": ["fileSearchStores/STORE_ID"]
  }'
```

### TypeScript Type Checking

```bash
# Check all types
npm run type-check

# Watch mode (auto-check on save)
npx tsc --noEmit --watch
```

**Common Type Errors**:
- Missing properties in interfaces
- Wrong parameter types
- Async/await without proper typing
- Next.js 16 params not awaited

### Performance Testing

**React DevTools Profiler**:
1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Record"
4. Interact with app
5. Click "Stop"
6. Analyze component render times

**Lighthouse**:
1. Open Chrome DevTools
2. Lighthouse tab
3. Run audit (Desktop/Mobile)
4. Check Performance, Accessibility, Best Practices, SEO

**Optimization Targets**:
- Performance score: 90+
- Accessibility score: 100
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

### Error Scenarios to Test

1. **API Key Missing/Invalid**:
   - Remove API key from `.env.local`
   - App should show error message
   - API calls should fail gracefully

2. **Network Errors**:
   - Simulate offline mode (DevTools → Network → Offline)
   - App should show error toasts
   - Retry mechanisms should work

3. **Invalid Input**:
   - Submit forms with empty fields
   - Enter invalid metadata filter syntax
   - Upload oversized files
   - All should show validation errors

4. **Edge Cases**:
   - Store with 0 documents
   - Query with no results
   - Very long store names
   - Special characters in input

### Automated Testing (Future Improvement)

**Unit Tests** (not yet implemented):
- Jest for utility functions
- React Testing Library for components
- Mock API responses

**Integration Tests** (not yet implemented):
- Playwright or Cypress for E2E tests
- Test full user workflows
- Test API routes

**Example Test Structure** (for future reference):
```typescript
// __tests__/lib/api/stores.test.ts
describe('Store API', () => {
  it('should list all stores', async () => {
    const stores = await listStores();
    expect(stores).toBeInstanceOf(Array);
  });

  it('should create a store', async () => {
    const store = await createStore('Test Store');
    expect(store.displayName).toBe('Test Store');
  });
});
```

---

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

### Environment Variables

**Required**:
- `GEMINI_API_KEY`: Your Google Gemini API key

**Optional**:
- `NEXT_PUBLIC_APP_URL`: Public URL for the app (for absolute URLs)

### Deployment Platforms

**Vercel** (Recommended):
1. Connect GitHub repository
2. Add `GEMINI_API_KEY` to environment variables
3. Deploy automatically on push

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Manual**:
```bash
npm ci
npm run build
npm start
```

### Production Considerations

**Security**:
- API key is server-side only (✓)
- Input validation with Zod (✓)
- XSS protection via React (✓)
- CSRF protection (consider adding for sensitive ops)

**Performance**:
- Image optimization (Next.js built-in)
- Code splitting (Next.js automatic)
- Lazy loading components
- Caching API responses (consider adding)

**Monitoring**:
- Error logging (consider Sentry)
- Performance monitoring (consider Vercel Analytics)
- API quota monitoring
- User analytics (consider Google Analytics)

---

## Troubleshooting Development Issues

### Common Problems

**"Cannot find module '@/...'"**:
- Check `tsconfig.json` has `paths` configured
- Restart TypeScript server in VS Code
- Restart dev server

**"API key not found"**:
- Verify `.env.local` exists
- Check variable name is `GEMINI_API_KEY`
- Restart dev server after changing env vars

**"Type error: params is not awaitable"**:
- Update to Next.js 16+ pattern
- Await params in dynamic routes
- See example in Architecture section

**"Hydration mismatch"**:
- Ensure server and client render same HTML
- Avoid using browser-only APIs in render
- Use `useEffect` for client-only code

**"Module not found: Can't resolve 'fs'"**:
- Importing Node.js modules in client code
- Use API routes for server-side operations
- Check if component is marked "use client"

---

## Additional Resources

### Documentation Files
- **End User Guide**: `docs/USER_GUIDE.md`
- **Implementation Progress**: `features/frontend-build/TASKS.md`
- **Implementation Plan**: `features/frontend-build/implementation-plan.md`
- **Update Log**: `features/frontend-build/UPDATE-LOG.md`

### External Documentation
- **Next.js 15 Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/primitives/docs
- **Gemini API**: https://ai.google.dev/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### Community & Support
- **Next.js Discord**: https://nextjs.org/discord
- **GitHub Issues**: Create issue in repository
- **Stack Overflow**: Tag with `next.js`, `gemini-api`
