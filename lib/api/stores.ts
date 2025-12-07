/**
 * File Search Store Operations
 *
 * Provides functions to manage File Search Stores in the Gemini API.
 * Stores are persistent containers for document embeddings.
 *
 * Patterns from:
 * - Create: legacy/examples/test-file-search.js:39-42
 * - List: legacy/examples/test-file-search.js:100-103
 * - Delete: Implicit in cleanup operations
 */

import { getGeminiClient } from './gemini-client';
import { Store, GeminiApiError } from '@/lib/types';

/**
 * List all File Search Stores
 *
 * @returns {Promise<Store[]>} Array of stores
 * @throws {GeminiApiError} If listing fails
 */
export async function listStores(): Promise<Store[]> {
  try {
    const ai = getGeminiClient();
    const stores: Store[] = [];

    // The API returns an async iterator
    const storeIterator = await ai.fileSearchStores.list();

    for await (const store of storeIterator) {
      stores.push({
        name: store.name || '',
        displayName: store.displayName || store.name || '',
        createTime: store.createTime,
        updateTime: store.updateTime,
      });
    }

    return stores;
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to list stores: ${error.message}`,
      500,
      error.response?.data
    );
  }
}

/**
 * Create a new File Search Store
 *
 * Pattern from test-file-search.js:39-42
 *
 * @param {string} displayName - Human-readable name for the store
 * @returns {Promise<Store>} The created store
 * @throws {GeminiApiError} If creation fails
 */
export async function createStore(displayName: string): Promise<Store> {
  try {
    const ai = getGeminiClient();

    const fileSearchStore = await ai.fileSearchStores.create({
      config: { displayName }
    });

    return {
      name: fileSearchStore.name || '',
      displayName: fileSearchStore.displayName || displayName,
      createTime: fileSearchStore.createTime,
      updateTime: fileSearchStore.updateTime,
    };
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to create store: ${error.message}`,
      500,
      error.response?.data
    );
  }
}

/**
 * Get details of a specific File Search Store
 *
 * @param {string} storeName - The store name (e.g., "fileSearchStores/abc123")
 * @returns {Promise<Store>} The store details
 * @throws {GeminiApiError} If retrieval fails or store not found
 */
export async function getStore(storeName: string): Promise<Store> {
  try {
    const ai = getGeminiClient();

    const store = await ai.fileSearchStores.get({ name: storeName });

    return {
      name: store.name || '',
      displayName: store.displayName || store.name || '',
      createTime: store.createTime,
      updateTime: store.updateTime,
    };
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to get store: ${error.message}`,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Delete a File Search Store
 *
 * WARNING: This permanently deletes the store and all its files.
 * Always uses force: true to delete even if files exist.
 *
 * @param {string} storeName - The store name to delete
 * @returns {Promise<void>}
 * @throws {GeminiApiError} If deletion fails
 */
export async function deleteStore(storeName: string): Promise<void> {
  try {
    const ai = getGeminiClient();

    await ai.fileSearchStores.delete({
      name: storeName,
      config: { force: true } // Always force delete
    });
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to delete store: ${error.message}`,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Get a store by name, or return null if it doesn't exist
 *
 * @param {string} storeName - The store name
 * @returns {Promise<Store | null>} The store or null if not found
 */
export async function getStoreOrNull(storeName: string): Promise<Store | null> {
  try {
    return await getStore(storeName);
  } catch (error: any) {
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
