/**
 * File Import Method Test
 *
 * This demonstrates the alternative upload workflow:
 * 1. Upload file to Files API first
 * 2. Import the file into File Search Store
 *
 * Compare this with the direct upload method in test-file-search.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function waitForOperation(operation, label = '') {
  console.log(`⏳ ${label}Waiting...`);
  let currentOp = operation;
  while (!currentOp.done) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    currentOp = await ai.operations.get({ operation: currentOp });
    process.stdout.write('.');
  }
  console.log(' ✅\n');
  return currentOp;
}

async function main() {
  try {
    console.log('🚀 Testing Import Method\n');

    // Step 1: Upload file to Files API
    console.log('📤 Step 1: Uploading file to Files API...');
    const filePath = path.join(__dirname, '..', 'data', 'sample-product-info.txt');
    const uploadedFile = await ai.files.upload({
      file: filePath,
      config: { displayName: 'Product Catalog File' }
    });
    console.log(`✅ File uploaded: ${uploadedFile.name}`);
    console.log(`   State: ${uploadedFile.state}`);
    console.log(`   URI: ${uploadedFile.uri}\n`);

    // Step 2: Create File Search Store
    console.log('📦 Step 2: Creating File Search Store...');
    const store = await ai.fileSearchStores.create({
      config: { displayName: 'import-test-store-' + Date.now() }
    });
    console.log(`✅ Created store: ${store.name}\n`);

    // Step 3: Import file into store
    console.log('📥 Step 3: Importing file into store...');
    let operation = await ai.fileSearchStores.importFile({
      fileSearchStoreName: store.name,
      fileName: uploadedFile.name
    });
    await waitForOperation(operation, 'Import: ');

    // Step 4: Query the store
    console.log('🔍 Step 4: Querying the imported file...');
    const question = "What is the most expensive product?";
    console.log(`Question: "${question}"\n`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        tools: [{ fileSearch: { fileSearchStoreNames: [store.name] } }]
      }
    });

    console.log('💬 Answer:');
    console.log(response.text);
    console.log('\n' + '='.repeat(70) + '\n');

    // Show grounding
    if (response.candidates?.[0]?.groundingMetadata) {
      console.log('📚 Source used:');
      const chunks = response.candidates[0].groundingMetadata.groundingChunks || [];
      chunks.forEach((chunk, i) => {
        if (chunk.retrievedContext) {
          console.log(`  ${i + 1}. ${chunk.retrievedContext.title}`);
        }
      });
    }

    console.log('\n' + '='.repeat(70) + '\n');
    console.log('ℹ️  Key Difference:');
    console.log('   Direct Upload: file -> File Search Store (one step)');
    console.log('   Import Method: file -> Files API -> File Search Store (two steps)');
    console.log('\n   The uploaded file will be deleted after 48 hours,');
    console.log('   but the data in the File Search Store persists.');
    console.log('\n🧹 Cleanup: Run node cleanup-stores.js');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
