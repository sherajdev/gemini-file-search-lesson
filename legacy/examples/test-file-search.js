/**
 * Gemini File Search API - Starter Script
 *
 * This script demonstrates:
 * 1. Creating a File Search Store
 * 2. Uploading a file to the store
 * 3. Querying the file with a question
 * 4. Viewing citations and grounding metadata
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to wait for operation to complete
async function waitForOperation(operation) {
  console.log('⏳ Waiting for operation to complete...');
  let currentOp = operation;

  while (!currentOp.done) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    currentOp = await ai.operations.get({ operation: currentOp });
    process.stdout.write('.');
  }
  console.log('\n✅ Operation completed!');
  return currentOp;
}

async function main() {
  try {
    console.log('🚀 Starting Gemini File Search Test\n');

    // Step 1: Create a File Search Store
    console.log('📦 Step 1: Creating File Search Store...');
    const fileSearchStore = await ai.fileSearchStores.create({
      config: { displayName: 'test-store-' + Date.now() }
    });
    console.log(`✅ Created store: ${fileSearchStore.name}\n`);

    // Step 2: Upload a file to the File Search Store
    console.log('📤 Step 2: Uploading file to store...');
    const filePath = path.join(__dirname, '..', 'data', 'sample-product-info.txt');

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: fileSearchStore.name,
      config: {
        displayName: 'Product Catalog',
      }
    });

    // Wait for upload to complete
    operation = await waitForOperation(operation);
    console.log('✅ File uploaded successfully!\n');

    // Step 3: Query the File Search Store
    console.log('🔍 Step 3: Querying the uploaded file...');
    const question = "What is the price of the SmartWatch Pro X?";
    console.log(`Question: "${question}"\n`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [fileSearchStore.name]
            }
          }
        ]
      }
    });

    // Step 4: Display the response
    console.log('💬 Answer:');
    console.log(response.text);
    console.log('\n' + '='.repeat(60) + '\n');

    // Step 5: Show grounding metadata (citations)
    if (response.candidates?.[0]?.groundingMetadata) {
      console.log('📚 Grounding Metadata (Citations):');
      console.log(JSON.stringify(response.candidates[0].groundingMetadata, null, 2));
    } else {
      console.log('ℹ️  No grounding metadata available');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Step 6: List all File Search Stores
    console.log('📋 All your File Search Stores:');
    const stores = await ai.fileSearchStores.list();
    for await (const store of stores) {
      console.log(`  - ${store.name} (${store.displayName})`);
    }

    console.log('\n' + '='.repeat(60) + '\n');
    console.log('💡 Next Steps:');
    console.log('  1. Try asking different questions about the products');
    console.log('  2. Upload the company-policy file and query it');
    console.log('  3. Check out advanced-examples.js for more features');
    console.log('\n⚠️  Remember to clean up:');
    console.log(`     Delete the store with: ai.fileSearchStores.delete({ name: '${fileSearchStore.name}', config: { force: true } })`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the main function
main();
