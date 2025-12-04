# Use Cases & User Journeys
## Gemini File Search - Next.js Application

This document illustrates how the fully-completed application would be used in real-world scenarios, with detailed step-by-step user journeys.

---

## Use Case 1: Customer Support Knowledge Base

### Scenario
**Sarah** is a Customer Support Manager at a SaaS company with 200+ support articles, troubleshooting guides, and FAQ documents scattered across multiple Word and PDF files. She wants to build a searchable knowledge base so support agents can quickly find answers.

### User Journey

#### Step 1: Initial Setup (Day 1 - Morning)
Sarah opens the app at `localhost:3000` and sees the landing page.

**Landing Page:**
```
🔍 Gemini File Search
Build powerful AI-powered document search with RAG

[Get Started] button → clicks
```

She clicks "Get Started" and lands on the **Stores List** page.

**Stores Page (Empty State):**
```
📁 File Search Stores

No stores yet
Create your first file search store to start uploading documents

[+ Create Store] button
```

Sarah clicks **"+ Create Store"**

**Create Store Modal:**
```
Create File Search Store
━━━━━━━━━━━━━━━━━━━
Display Name: *
[Customer Support Knowledge Base___________]

                    [Cancel] [Create Store]
```

She types "Customer Support Knowledge Base" and clicks **Create Store**.

**Toast Notification:**
```
✅ Store created successfully!
```

The page refreshes and shows her new store:

**Stores Page:**
```
📁 File Search Stores                [+ Create Store]

┌─────────────────────────────────────┐
│ 📦 Customer Support Knowledge Base  │
│                                     │
│ Created: 10 minutes ago             │
│ Files: 0                            │
│                                     │
│ [Upload Files] [Query Store] [⋮]   │
└─────────────────────────────────────┘
```

---

#### Step 2: Uploading Documents (Day 1 - Morning)

Sarah clicks **"Upload Files"** on her store card.

**Upload Page:**
```
Customer Support Knowledge Base > Upload

┌────────────────────────────────────────────┐
│  📤 Drop files here or click to browse     │
│                                            │
│  Supports: TXT, PDF, DOCX, MD and more    │
│  Max size: 100 MB per file                │
└────────────────────────────────────────────┘

Selected Files: None

Chunking Configuration
━━━━━━━━━━━━━━━━━━━━
Tokens per chunk:  [200]────○────[800]  (400)
Overlap tokens:    [20]─○──[50]         (30)

[Presets: Small | Medium | Large]

Custom Metadata (Optional)
━━━━━━━━━━━━━━━━━━━━
+ Add metadata tag
```

Sarah **drags and drops** 5 PDF files:
- billing-faq.pdf
- account-setup-guide.pdf
- api-troubleshooting.pdf
- feature-requests-policy.pdf
- refund-policy.pdf

**Upload Page (Files Selected):**
```
Selected Files (5):

┌────────────────────────────────────────────┐
│ ✓ billing-faq.pdf (2.3 MB)                 │
│   Display name: [Billing FAQ___________]   │
│   Category: [Billing_______________]       │
│   [✗ Remove]                               │
├────────────────────────────────────────────┤
│ ✓ account-setup-guide.pdf (1.8 MB)        │
│   Display name: [Account Setup Guide___]   │
│   Category: [Onboarding___________]       │
│   [✗ Remove]                               │
├────────────────────────────────────────────┤
│ ✓ api-troubleshooting.pdf (3.1 MB)        │
│   Display name: [API Troubleshooting___]   │
│   Category: [Technical_____________]       │
│   [✗ Remove]                               │
├────────────────────────────────────────────┤
│ ✓ feature-requests-policy.pdf (0.9 MB)    │
│   Display name: [Feature Requests______]   │
│   Category: [Policy________________]       │
│   [✗ Remove]                               │
├────────────────────────────────────────────┤
│ ✓ refund-policy.pdf (1.2 MB)              │
│   Display name: [Refund Policy_________]   │
│   Category: [Policy________________]       │
│   [✗ Remove]                               │
└────────────────────────────────────────────┘

Chunking: Medium (400 tokens, 30 overlap)

Metadata for all files:
┌────────────────────────────────────┐
│ department  [String▼] [Support___] │ [✗]
│ last_updated [String▼] [2024-Q4__] │ [✗]
└────────────────────────────────────┘
                        [+ Add tag]

                        [Upload All Files]
```

She adds metadata tags (department: Support, last_updated: 2024-Q4) and clicks **"Upload All Files"**.

**Upload Progress:**
```
Uploading files...

billing-faq.pdf             ████████████ 100%
account-setup-guide.pdf     ████████████ 100%
api-troubleshooting.pdf     ████████░░░░  75%
feature-requests-policy.pdf ░░░░░░░░░░░░   0%
refund-policy.pdf          ░░░░░░░░░░░░   0%

Processing: 3/5 complete
Estimated time: 2 minutes
```

After uploads complete:

**Toast Notification:**
```
✅ All 5 files uploaded successfully!
Indexing in progress...
```

---

#### Step 3: First Query (Day 1 - Afternoon)

Sarah navigates back to her store and clicks **"Query Store"**.

**Query Interface:**
```
Customer Support Knowledge Base > Query

Ask a question about your documents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────────┐
│ How do I process a refund for a customer?  │
│                                            │
│                                            │
└────────────────────────────────────────────┘
(225 characters)

Search in stores:
☑ Customer Support Knowledge Base (5 files)

Advanced Options ▼
  Metadata filter: [All files__________▼]
  Model: [gemini-2.0-flash-exp_______▼]

                          [Search] 🔍
```

She types her question and clicks **Search**.

**Query Results:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To process a refund for a customer:

1. **Verify eligibility**: Check that the refund request
   is within 30 days of purchase and the account is in
   good standing.

2. **Access the billing dashboard**: Go to Admin >
   Billing > Customer Accounts

3. **Locate the transaction**: Search by customer email
   or transaction ID

4. **Initiate refund**: Click "Process Refund" and select:
   - Full refund (100%)
   - Partial refund (specify amount)
   - Store credit option

5. **Add notes**: Document the reason for the refund in
   the notes field for audit purposes

6. **Confirm**: Processing takes 3-5 business days

Note: Refunds requested after 30 days require manager
approval.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCES (3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📄 Refund Policy                        │
│ Relevance: ████████░░ 85%              │
│                                         │
│ "Refund requests must be submitted     │
│  within 30 days of the original        │
│  purchase date. Customers can receive   │
│  either a full refund back to their    │
│  original payment method or store      │
│  credit..."                            │
│                                         │
│ [View full chunk] [📋 Copy]            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📄 Billing FAQ                          │
│ Relevance: ████████░░ 82%              │
│                                         │
│ "Q: How do I process a refund?         │
│  A: Navigate to the billing dashboard  │
│  and locate the customer's transaction │
│  in the Admin panel. Click Process     │
│  Refund and follow the prompts..."     │
│                                         │
│ [View full chunk] [📋 Copy]            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📄 Account Setup Guide                  │
│ Relevance: ██████░░░░ 64%              │
│                                         │
│ "Manager-level accounts have access    │
│  to billing features including refund  │
│  processing, invoice generation, and   │
│  payment method updates..."            │
│                                         │
│ [View full chunk] [📋 Copy]            │
└─────────────────────────────────────────┘

[Export: JSON | CSV | Markdown]  [Copy Answer]
```

**Sarah's Reaction:** "Perfect! This is exactly what I needed. Now any support agent can find this instantly."

---

#### Step 4: Advanced Filtering (Day 2)

The next day, a support agent asks Sarah: "Where's the info about billing specifically?"

Sarah uses **metadata filtering**:

**Query Interface (Advanced):**
```
Advanced Options ▲
  Metadata filter: [category = "Billing"_______]
                   [+ Add condition]
  Model: [gemini-2.0-flash-exp_____▼]

Question:
"What are common billing issues customers face?"
```

**Results show only billing-related documents**, filtering out the other policies.

---

## Use Case 2: Legal Document Research

### Scenario
**Marcus** is a paralegal at a law firm. He has 50+ case files, contracts, and legal briefs from past cases. He needs to find relevant precedents and clauses quickly when preparing new cases.

### User Journey

#### Step 1: Organization by Case Type (Week 1)

Marcus creates **3 separate stores** for different practice areas:

**Stores Page:**
```
📁 File Search Stores                [+ Create Store]

┌─────────────────────────────────────┐
│ ⚖️ Employment Law Cases             │
│ Created: 2 days ago                 │
│ Files: 18                           │
│ [Upload] [Query] [⋮]               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📜 Contract Templates & Precedents   │
│ Created: 1 day ago                  │
│ Files: 25                           │
│ [Upload] [Query] [⋮]               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🏢 Corporate Governance Documents    │
│ Created: 6 hours ago                │
│ Files: 12                           │
│ [Upload] [Query] [⋮]               │
└─────────────────────────────────────┘
```

#### Step 2: Uploading with Rich Metadata

When uploading to "Employment Law Cases", Marcus uses **detailed metadata**:

**Upload Page:**
```
Employment Law Cases > Upload

Selected File: smith-vs-techcorp-2022.pdf

Custom Metadata
━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────┐
│ case_type      [String▼] [Wrongful Termination]
│ outcome        [String▼] [Settlement___________]
│ year           [Numeric] [2022_________________]
│ state          [String▼] [California___________]
│ settlement_amt [Numeric] [750000_______________]
│ precedent      [String▼] [Yes__________________]
└────────────────────────────────────────────────┘
```

This metadata allows precise filtering later.

---

#### Step 3: Multi-Store Query (New Case Research)

Marcus is working on a new wrongful termination case and needs to search across **both** employment cases AND contract templates:

**Query Interface:**
```
Search across multiple stores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question:
┌────────────────────────────────────────────┐
│ What compensation ranges are typical in    │
│ California wrongful termination cases      │
│ settled in the last 3 years?              │
└────────────────────────────────────────────┘

Search in stores:
☑ Employment Law Cases (18 files)
☑ Contract Templates & Precedents (25 files)
☐ Corporate Governance Documents (12 files)

Advanced Options ▲
  Metadata filter:
    case_type = "Wrongful Termination"
    AND state = "California"
    AND year >= 2021

  Model: [gemini-2.0-flash-exp_____▼]

                          [Search] 🔍
```

**Results:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on California wrongful termination cases from
2021-2023, compensation ranges typically fall into:

**Settlement Ranges:**
- Low-end cases: $50,000 - $150,000
  (Limited documentation, shorter employment)

- Mid-range cases: $200,000 - $500,000
  (Clear documentation, medium tenure, emotional distress)

- High-end cases: $600,000 - $1,200,000+
  (Senior positions, significant documentation,
   retaliation claims)

**Key factors affecting compensation:**
1. Length of employment
2. Salary level at time of termination
3. Evidence quality (emails, performance reviews)
4. Emotional distress documentation
5. Retaliation or discrimination elements

The average settlement across 6 comparable cases in
our database is approximately $485,000.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCES (6 cases)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Shows 6 relevant case files with settlement amounts]
```

Marcus clicks **"Export: Markdown"** and copies the entire response into his case notes.

---

#### Step 4: Citation Explorer (Deep Dive)

Marcus wants to dig deeper into one of the cases. He clicks the citation and is taken to the **Citation Explorer**:

**Explorer Page:**
```
Citation Explorer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Query History Dropdown: Latest 10 queries]
Selected: "California wrongful termination compensation"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CITATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document: smith-vs-techcorp-2022.pdf
Chunk ID: chunk_7_of_23
Relevance Score: 94%
Token Count: 387

Metadata:
  case_type: Wrongful Termination
  outcome: Settlement
  year: 2022
  state: California
  settlement_amt: 750000
  precedent: Yes

Full Chunk Text:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"The settlement agreement reached on March 15, 2022
established a total compensation package of $750,000,
broken down as follows: $300,000 in lost wages and
benefits, $250,000 for emotional distress, and $200,000
in punitive damages.

The plaintiff, a senior engineering manager with 8 years
of service, was terminated three days after filing an
internal complaint regarding discriminatory practices in
the performance review process. Key evidence included
email correspondence showing retaliatory intent and
testimony from four colleagues corroborating the
plaintiff's account..."

[View Previous Chunk] [View Next Chunk]
[Export Citation] [Copy to Clipboard]
```

This gives Marcus the **exact details** he needs for his case memo.

---

## Use Case 3: Academic Research Paper Database

### Scenario
**Dr. Elena Rodriguez** is a climate science researcher with 80+ research papers (PDFs) she's collected over the years. She wants to quickly find papers related to specific topics for her literature reviews.

### User Journey

#### Step 1: Bulk Upload (Research Archive)

Elena creates a store called "Climate Research Papers" and uses the **chunking configurator** strategically:

**Upload Page (Chunking Config):**
```
Chunking Configuration
━━━━━━━━━━━━━━━━━━━━
Tokens per chunk:  [200]────────○[800]  (800)
Overlap tokens:    [20]─────○[50]       (50)

[Presets: Small | Medium | Large]
                           ↑ Selected

Why? Academic papers need larger chunks to preserve
context around citations and methodology sections.
```

She uploads **80 PDF papers** with metadata:

**Metadata for Research Papers:**
```
Custom Metadata
━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────┐
│ topic          [String] [Ocean Acidification]
│ year_published [Numeric] [2019______________]
│ journal        [String] [Nature Climate Change]
│ author_last    [String] [Hansen_____________]
│ cited_count    [Numeric] [245_______________]
│ study_type     [String] [Field Study________]
└────────────────────────────────────────────┘
```

---

#### Step 2: Literature Review Query

Elena is writing a paper on coral reef decline and needs to find relevant studies:

**Query:**
```
Question:
"What are the main causes of coral reef decline
according to recent field studies?"

Metadata filter:
  topic CONTAINS "coral" OR topic CONTAINS "reef"
  AND study_type = "Field Study"
  AND year_published >= 2018
```

**Answer with Academic Citations:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent field studies (2018-2024) identify four primary
causes of coral reef decline:

1. **Ocean Acidification** (Most cited factor)
   - pH decrease of 0.1 units since pre-industrial times
   - Inhibits coral calcification rates by 20-30%
   - Particularly affects Acropora species
   (Hansen et al., 2019; Yates & Halley, 2020)

2. **Rising Sea Temperatures**
   - Thermal stress triggers coral bleaching events
   - 1-2°C above normal causes symbiont expulsion
   - Mass bleaching events increasing in frequency
   (Hughes et al., 2018; Skirving et al., 2019)

3. **Coastal Development & Pollution**
   - Nutrient runoff promotes algal overgrowth
   - Sediment loading reduces light penetration
   - Chemical pollutants affect coral reproduction
   (Fabricius et al., 2020; Wear & Vega Thurber, 2021)

4. **Overfishing & Ecosystem Imbalance**
   - Removal of herbivorous fish allows algal dominance
   - Loss of apex predators disrupts food webs
   - Reduced reef resilience to other stressors
   (Mumby et al., 2019; Graham et al., 2020)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCES (12 papers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[12 relevant papers listed with citation info]
```

Elena clicks **"Export: Markdown"** and the entire formatted answer with citations is ready to paste into her manuscript.

---

#### Step 3: Query History for Reproducibility

Two weeks later, Elena's colleague asks: "How did you find those coral studies?"

Elena navigates to **Explorer → Query History**:

**Query History:**
```
Recent Queries (Last 30 days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────┐
│ 📅 Dec 1, 2024 - 2:34 PM               │
│ "coral reef decline field studies"    │
│ Filters: study_type="Field Study"     │
│ Sources: 12 papers                     │
│ [Rerun Query] [View Details] [Export] │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 📅 Nov 28, 2024 - 10:15 AM            │
│ "microplastic impact on marine life"  │
│ Filters: year >= 2020                 │
│ Sources: 8 papers                      │
│ [Rerun Query] [View Details] [Export] │
└────────────────────────────────────────┘
```

She clicks **"Rerun Query"** and gets the same results, ensuring **reproducibility** for her research.

---

## Use Case 4: Product Documentation for Developer Team

### Scenario
**Alex** is a Developer Relations Engineer at a SaaS company. The company has APIs, SDKs, and integration guides scattered across markdown files, PDFs, and Google Docs exports. Developers constantly ask the same questions in Slack.

### User Journey

#### Step 1: Consolidating Documentation

Alex creates a store called "API & Integration Docs" and uploads:
- 15 API endpoint documentation files
- 10 SDK guides (Python, JavaScript, Ruby, Go)
- 20 integration tutorials
- 12 troubleshooting guides
- 8 changelog documents

**Metadata Strategy:**
```
Each file tagged with:
- doc_type: [API | SDK | Tutorial | Troubleshooting | Changelog]
- language: [Python | JavaScript | Ruby | Go | Language-agnostic]
- api_version: [v1 | v2 | v3]
- difficulty: [Beginner | Intermediate | Advanced]
```

---

#### Step 2: Slack Bot Integration (Future Feature)

Alex sets up a Slack bot that uses the query API endpoint:

**In Slack:**
```
Developer: @docsbot How do I authenticate API requests in Python?

DocsBot: 🔍 Searching documentation...

✅ Found answer:

To authenticate API requests in Python:

1. Install the SDK: `pip install ourcompany-sdk`
2. Import and configure:

```python
from ourcompany import Client

client = Client(
    api_key='your-api-key',
    region='us-east-1'
)
```

3. All requests are now automatically authenticated.

📚 Source: Python SDK Guide v2.1
🔗 [View full documentation]
```

The bot queries the file search store via the API and returns answers instantly.

---

#### Step 3: Multi-Language Support

A developer asks a complex question:

**Query:**
```
"How do I implement rate limiting in both Python and
JavaScript SDKs?"

Metadata filter:
  doc_type = "SDK"
  AND (language = "Python" OR language = "JavaScript")
```

**Answer shows side-by-side examples:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Both SDKs handle rate limiting automatically with
exponential backoff:

**Python SDK:**
```python
from ourcompany import Client, RateLimitConfig

client = Client(
    api_key='key',
    rate_limit=RateLimitConfig(
        max_retries=3,
        backoff_factor=2.0
    )
)
```

**JavaScript SDK:**
```javascript
import { Client } from '@ourcompany/sdk';

const client = new Client({
  apiKey: 'key',
  rateLimit: {
    maxRetries: 3,
    backoffFactor: 2.0
  }
});
```

Both implementations will automatically retry on 429
responses with exponential backoff (2s, 4s, 8s).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Python SDK Guide v2.1 - Rate Limiting
📄 JavaScript SDK Guide v2.0 - Error Handling
```

---

#### Step 4: Changelog Queries

Six months later, a customer asks: "What changed in v3 of the API?"

**Query:**
```
"What are the breaking changes between v2 and v3?"

Metadata filter:
  doc_type = "Changelog"
  AND api_version = "v3"
```

**Answer:**
```
Breaking changes in API v3:

1. Authentication endpoints moved from /auth to /v3/auth
2. Response format changed: timestamps now in ISO 8601
3. Deprecated endpoints removed: /users/search (use /v3/search)
4. Required field added: user_id in all POST requests
5. Rate limits reduced from 1000/hr to 500/hr for free tier

Migration guide available at /docs/v2-to-v3-migration
```

Alex copies this and posts it to the company blog, properly citing the sources.

---

## Key Features Demonstrated Across Use Cases

### 1. **Store Organization**
- Multiple stores for different domains (legal, research, documentation)
- Logical separation of concerns
- Easy navigation between stores

### 2. **Rich Metadata**
- Custom tags (category, year, case_type, language, etc.)
- Both string and numeric metadata
- Powerful filtering capabilities

### 3. **Smart Chunking**
- Configurable chunk sizes for different document types
- Larger chunks for academic papers (preserve context)
- Smaller chunks for FAQs (precise answers)

### 4. **Multi-Store Queries**
- Search across multiple stores simultaneously
- Useful for cross-domain questions
- Consolidated results

### 5. **Advanced Filtering**
- Boolean logic (AND, OR, NOT)
- Numeric comparisons (>=, <=, =)
- String matching (CONTAINS, =)

### 6. **Citation Explorer**
- Deep dive into specific citations
- View full chunk context
- Navigate between adjacent chunks
- Export capabilities

### 7. **Query History**
- Reproducible research
- Rerun past queries
- Share query patterns with team

### 8. **Export Options**
- JSON (for programmatic use)
- CSV (for spreadsheets)
- Markdown (for documentation)

### 9. **Real-World Integration**
- API endpoints for bot integration
- Embeddable in existing workflows
- Slack, Discord, internal tools

---

## Summary: Why This App Is Valuable

### For Support Teams
✅ Instant answers from knowledge bases
✅ Reduce repetitive Slack questions
✅ Onboard new agents faster

### For Legal Teams
✅ Find precedents in seconds, not hours
✅ Precise filtering by case characteristics
✅ Export citations for case memos

### For Researchers
✅ Literature review in minutes
✅ Reproducible searches
✅ Proper citation tracking

### For Developer Relations
✅ Self-service documentation search
✅ Multi-language support examples
✅ Bot integration for communities

---

**The Power of RAG + UI:**
The combination of Google's Gemini File Search API with an intuitive, feature-rich interface transforms document search from a technical challenge into a seamless user experience. Each use case demonstrates how the fully-completed application would provide immediate, measurable value to diverse user groups.
