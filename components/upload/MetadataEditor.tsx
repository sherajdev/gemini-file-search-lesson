'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MetadataRow {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number';
}

interface MetadataEditorProps {
  metadata: Record<string, string | number>;
  onChange: (metadata: Record<string, string | number>) => void;
}

export function MetadataEditor({ metadata, onChange }: MetadataEditorProps) {
  // Convert metadata object to rows
  const initialRows: MetadataRow[] = Object.entries(metadata).map(([key, value]) => ({
    id: Math.random().toString(36).substr(2, 9),
    key,
    value: String(value),
    type: typeof value === 'number' ? 'number' : 'string',
  }));

  const [rows, setRows] = useState<MetadataRow[]>(
    initialRows.length > 0 ? initialRows : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMetadata = (updatedRows: MetadataRow[]) => {
    setRows(updatedRows);

    // Convert rows back to metadata object
    const newMetadata: Record<string, string | number> = {};
    const newErrors: Record<string, string> = {};

    updatedRows.forEach((row) => {
      if (!row.key.trim()) return;

      // Check for duplicate keys
      const duplicates = updatedRows.filter((r) => r.key === row.key);
      if (duplicates.length > 1) {
        newErrors[row.id] = 'Duplicate key';
        return;
      }

      // Add to metadata
      if (row.type === 'number') {
        const numValue = parseFloat(row.value);
        if (isNaN(numValue)) {
          newErrors[row.id] = 'Invalid number';
        } else {
          newMetadata[row.key] = numValue;
        }
      } else {
        newMetadata[row.key] = row.value;
      }
    });

    setErrors(newErrors);
    onChange(newMetadata);
  };

  const addRow = () => {
    const newRow: MetadataRow = {
      id: Math.random().toString(36).substr(2, 9),
      key: '',
      value: '',
      type: 'string',
    };
    updateMetadata([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    updateMetadata(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, updates: Partial<MetadataRow>) => {
    updateMetadata(
      rows.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Custom Metadata</h3>
          <p className="text-xs text-gray-500 mt-1">
            Add key-value pairs to filter documents later
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500">
            No metadata added yet. Click &quot;Add Field&quot; to start.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Example: category = &quot;electronics&quot;, year = 2024
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col md:flex-row items-start gap-2">
              <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Key input */}
                <div>
                  <Input
                    type="text"
                    placeholder="Key (e.g., category)"
                    value={row.key}
                    onChange={(e) => updateRow(row.id, { key: e.target.value })}
                    className={errors[row.id] ? 'border-red-500' : ''}
                  />
                </div>

                {/* Value input */}
                <div>
                  <Input
                    type={row.type === 'number' ? 'number' : 'text'}
                    placeholder={row.type === 'number' ? 'Value (number)' : 'Value (text)'}
                    value={row.value}
                    onChange={(e) => updateRow(row.id, { value: e.target.value })}
                    className={errors[row.id] ? 'border-red-500' : ''}
                  />
                </div>

                {/* Type selector */}
                <div>
                  <select
                    value={row.type}
                    onChange={(e) =>
                      updateRow(row.id, { type: e.target.value as 'string' | 'number' })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>

              {/* Remove button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRow(row.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {/* Show errors */}
          {Object.keys(errors).length > 0 && (
            <div className="text-xs text-red-500">
              {Object.values(errors).map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
