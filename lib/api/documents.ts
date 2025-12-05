/**
 * Document Operations
 *
 * Provides functions to manage Documents within File Search Stores in the Gemini API.
 * Documents represent individual files uploaded to a store.
 *
 * Available Operations:
 * - List all documents in a store
 * - Get individual document metadata
 * - Delete individual documents
 */

import { getGeminiClient } from './gemini-client';
import { Document, GeminiApiError } from '@/lib/types';

/**
 * List all documents in a File Search Store
 *
 * @param {string} storeName - The store name (e.g., "fileSearchStores/abc123")
 * @returns {Promise<Document[]>} Array of documents
 * @throws {GeminiApiError} If listing fails
 */
export async function listDocuments(storeName: string): Promise<Document[]> {
  try {
    const ai = getGeminiClient();
    const documents: Document[] = [];

    // The API returns an async iterator
    const documentIterator = await ai.fileSearchStores.documents.list({
      parent: storeName
    });

    for await (const doc of documentIterator) {
      // Map SDK state enum to our string literal type
      let state: 'PENDING' | 'ACTIVE' | 'FAILED' = 'PENDING';
      if (doc.state?.includes('ACTIVE')) {
        state = 'ACTIVE';
      } else if (doc.state?.includes('FAILED')) {
        state = 'FAILED';
      }

      documents.push({
        name: doc.name || '',
        displayName: doc.displayName || doc.name || '',
        state,
        sizeBytes: doc.sizeBytes ? Number(doc.sizeBytes) : undefined,
        mimeType: doc.mimeType,
        createTime: doc.createTime,
        updateTime: doc.updateTime,
        customMetadata: doc.customMetadata?.map(m => ({
          key: m.key || '',
          stringValue: m.stringValue,
          numericValue: m.numericValue,
        })),
      });
    }

    return documents;
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to list documents: ${error.message}`,
      500,
      error.response?.data
    );
  }
}

/**
 * Get details of a specific document
 *
 * @param {string} documentName - The document name (e.g., "fileSearchStores/abc/documents/xyz")
 * @returns {Promise<Document>} The document details
 * @throws {GeminiApiError} If retrieval fails or document not found
 */
export async function getDocument(documentName: string): Promise<Document> {
  try {
    const ai = getGeminiClient();

    const doc = await ai.fileSearchStores.documents.get({ name: documentName });

    // Map SDK state enum to our string literal type
    let state: 'PENDING' | 'ACTIVE' | 'FAILED' = 'PENDING';
    if (doc.state?.includes('ACTIVE')) {
      state = 'ACTIVE';
    } else if (doc.state?.includes('FAILED')) {
      state = 'FAILED';
    }

    return {
      name: doc.name || '',
      displayName: doc.displayName || doc.name || '',
      state,
      sizeBytes: doc.sizeBytes ? Number(doc.sizeBytes) : undefined,
      mimeType: doc.mimeType,
      createTime: doc.createTime,
      updateTime: doc.updateTime,
      customMetadata: doc.customMetadata?.map(m => ({
        key: m.key || '',
        stringValue: m.stringValue,
        numericValue: m.numericValue,
      })),
    };
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to get document: ${error.message}`,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Delete a document from a File Search Store
 *
 * WARNING: This permanently deletes the document from the store.
 *
 * @param {string} documentName - The document name to delete
 * @returns {Promise<void>}
 * @throws {GeminiApiError} If deletion fails
 */
export async function deleteDocument(documentName: string): Promise<void> {
  try {
    const ai = getGeminiClient();

    await ai.fileSearchStores.documents.delete({
      name: documentName
    });
  } catch (error: any) {
    throw new GeminiApiError(
      `Failed to delete document: ${error.message}`,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Get a document by name, or return null if it doesn't exist
 *
 * @param {string} documentName - The document name
 * @returns {Promise<Document | null>} The document or null if not found
 */
export async function getDocumentOrNull(documentName: string): Promise<Document | null> {
  try {
    return await getDocument(documentName);
  } catch (error: any) {
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
