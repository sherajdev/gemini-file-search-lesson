/**
 * Advanced File Search Examples
 *
 * This script demonstrates:
 * 1. Multiple file uploads to the same store
 * 2. Custom metadata and filtering
 * 3. Custom chunking configuration
 * 4. Comparing different queries
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function waitForOperation(operation, label = '') {
  console.log(`⏳ ${label}Waiting for operation...`);
  let currentOp = operation;
  while (!currentOp.done) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    currentOp = await ai.operations.get({ operation: currentOp });
    process.stdout.write('.');
  }
  console.log(' ✅\n');
  return currentOp;
}

async function example1_MultipleFiles() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 1: Multiple Files in One Store');
  console.log('='.repeat(70) + '\n');

  // Create store
  const store = await ai.fileSearchStores.create({
    config: { displayName: 'multi-file-store-' + Date.now() }
  });
  console.log(`✅ Created store: ${store.name}\n`);

  // Upload multiple files
  const files = [
    { path: 'sample-product-info.txt', name: 'Product Catalog' },
    { path: 'sample-company-policy.txt', name: 'Company Policies' }
  ];

  for (const file of files) {
    console.log(`📤 Uploading: ${file.name}...`);
    const op = await ai.fileSearchStores.uploadToFileSearchStore({
      file: path.join(__dirname, '..', 'data', file.path),
      fileSearchStoreName: store.name,
      config: { displayName: file.name }
    });
    await waitForOperation(op, file.name + ': ');
  }

  // Query about products
  console.log('🔍 Query 1: About products...');
  let response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What wireless products are available?",
    config: {
      tools: [{ fileSearch: { fileSearchStoreNames: [store.name] } }]
    }
  });
  console.log('💬 Answer:', response.text);
  console.log('\n' + '-'.repeat(70) + '\n');

  // Query about policies
  console.log('🔍 Query 2: About company policy...');
  response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "How many vacation days do employees with 4 years get?",
    config: {
      tools: [{ fileSearch: { fileSearchStoreNames: [store.name] } }]
    }
  });
  console.log('💬 Answer:', response.text);
  console.log('\n' + '-'.repeat(70) + '\n');

  return store.name;
}

async function example2_CustomMetadata() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 2: Custom Metadata and Filtering');
  console.log('='.repeat(70) + '\n');

  const store = await ai.fileSearchStores.create({
    config: { displayName: 'metadata-store-' + Date.now() }
  });
  console.log(`✅ Created store: ${store.name}\n`);

  // Upload with metadata
  console.log('📤 Uploading products with metadata (category: electronics, year: 2024)...');
  let op = await ai.fileSearchStores.uploadToFileSearchStore({
    file: path.join(__dirname, '..', 'data', 'sample-product-info.txt'),
    fileSearchStoreName: store.name,
    config: {
      displayName: 'Products 2024',
      customMetadata: [
        { key: "category", stringValue: "electronics" },
        { key: "year", numericValue: 2024 }
      ]
    }
  });
  await waitForOperation(op);

  console.log('📤 Uploading policies with metadata (category: hr, year: 2024)...');
  op = await ai.fileSearchStores.uploadToFileSearchStore({
    file: path.join(__dirname, '..', 'data', 'sample-company-policy.txt'),
    fileSearchStoreName: store.name,
    config: {
      displayName: 'HR Policies 2024',
      customMetadata: [
        { key: "category", stringValue: "hr" },
        { key: "year", numericValue: 2024 }
      ]
    }
  });
  await waitForOperation(op);

  // Query with metadata filter
  console.log('🔍 Query with filter (category = electronics)...');
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What products are available?",
    config: {
      tools: [{
        fileSearch: {
          fileSearchStoreNames: [store.name],
          metadataFilter: 'category = "electronics"'
        }
      }]
    }
  });
  console.log('💬 Answer:', response.text);
  console.log('ℹ️  This should only mention electronics, not HR policies');
  console.log('\n' + '-'.repeat(70) + '\n');

  return store.name;
}

async function example3_CustomChunking() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 3: Custom Chunking Configuration');
  console.log('='.repeat(70) + '\n');

  const store = await ai.fileSearchStores.create({
    config: { displayName: 'chunking-test-' + Date.now() }
  });
  console.log(`✅ Created store: ${store.name}\n`);

  console.log('📤 Uploading with SMALL chunks (200 tokens per chunk, 20 overlap)...');
  const op = await ai.fileSearchStores.uploadToFileSearchStore({
    file: path.join(__dirname, '..', 'data', 'sample-product-info.txt'),
    fileSearchStoreName: store.name,
    config: {
      displayName: 'Products - Small Chunks',
      chunkingConfig: {
        whiteSpaceConfig: {
          maxTokensPerChunk: 200,
          maxOverlapTokens: 20
        }
      }
    }
  });
  await waitForOperation(op);

  console.log('🔍 Querying with small chunks...');
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "List all the products with their prices",
    config: {
      tools: [{ fileSearch: { fileSearchStoreNames: [store.name] } }]
    }
  });
  console.log('💬 Answer:', response.text);
  console.log('\nℹ️  With smaller chunks, the model retrieves more focused pieces of information');
  console.log('\n' + '-'.repeat(70) + '\n');

  return store.name;
}

async function main() {
  try {
    console.log('🚀 Running Advanced File Search Examples\n');

    const storesToCleanup = [];

    // Run examples
    storesToCleanup.push(await example1_MultipleFiles());
    storesToCleanup.push(await example2_CustomMetadata());
    storesToCleanup.push(await example3_CustomChunking());

    console.log('\n✨ All examples completed!\n');
    console.log('🧹 Cleanup instructions:');
    console.log('   Run: node cleanup-stores.js');
    console.log('\n   Or delete individual stores:');
    storesToCleanup.forEach(name => {
      console.log(`   - ${name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
