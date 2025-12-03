/**
 * Cleanup Script - Delete all File Search Stores
 *
 * WARNING: This will delete ALL your File Search Stores
 * Use with caution!
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function cleanupAllStores() {
  try {
    console.log('🧹 Fetching all File Search Stores...\n');

    const stores = await ai.fileSearchStores.list();
    const storeList = [];

    for await (const store of stores) {
      storeList.push(store);
      console.log(`Found: ${store.name} (${store.displayName})`);
    }

    if (storeList.length === 0) {
      console.log('\n✨ No stores found. Already clean!');
      return;
    }

    console.log(`\n🗑️  Deleting ${storeList.length} store(s)...\n`);

    for (const store of storeList) {
      try {
        await ai.fileSearchStores.delete({
          name: store.name,
          config: { force: true } // This deletes the store and all documents
        });
        console.log(`✅ Deleted: ${store.name}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${store.name}:`, error.message);
      }
    }

    console.log('\n✨ Cleanup complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupAllStores();
