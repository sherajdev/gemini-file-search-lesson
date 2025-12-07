'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export type FilterOperator = '=' | '!=' | '>' | '<' | '>=' | '<=';
export type FilterLogic = 'AND' | 'OR';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  logic: FilterLogic;
}

interface MetadataFilterProps {
  onFilterChange: (filterString: string) => void;
  suggestedFields?: string[];
  className?: string;
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: '=', label: 'equals (=)' },
  { value: '!=', label: 'not equals (≠)' },
  { value: '>', label: 'greater than (>)' },
  { value: '<', label: 'less than (<)' },
  { value: '>=', label: 'greater or equal (≥)' },
  { value: '<=', label: 'less or equal (≤)' },
];

const LOGIC_OPTIONS: { value: FilterLogic; label: string }[] = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

export function MetadataFilter({
  onFilterChange,
  suggestedFields = ['category', 'year', 'author', 'type', 'status'],
  className = '',
}: MetadataFilterProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Generate filter string from conditions
  const filterString = useMemo(() => {
    if (conditions.length === 0) return '';

    return conditions
      .map((condition, index) => {
        const isNumeric = !isNaN(Number(condition.value)) && condition.value !== '';
        const value = isNumeric ? condition.value : `"${condition.value}"`;
        const filterPart = `${condition.field} ${condition.operator} ${value}`;

        // Add logic operator before this condition (except for the first one)
        if (index > 0) {
          return `${conditions[index - 1].logic} ${filterPart}`;
        }
        return filterPart;
      })
      .join(' ');
  }, [conditions]);

  // Add new condition
  const handleAddCondition = () => {
    const newCondition: FilterCondition = {
      id: `condition-${Date.now()}`,
      field: suggestedFields[0] || '',
      operator: '=',
      value: '',
      logic: 'AND',
    };
    setConditions([...conditions, newCondition]);
  };

  // Remove condition
  const handleRemoveCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);

    // Update filter string
    const newFilterString = newConditions.length === 0 ? '' : filterString;
    onFilterChange(newFilterString);
  };

  // Update condition field
  const handleUpdateField = (id: string, field: string) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, field } : c
    );
    setConditions(newConditions);
  };

  // Update condition operator
  const handleUpdateOperator = (id: string, operator: FilterOperator) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, operator } : c
    );
    setConditions(newConditions);
  };

  // Update condition value
  const handleUpdateValue = (id: string, value: string) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, value } : c
    );
    setConditions(newConditions);
  };

  // Update condition logic
  const handleUpdateLogic = (id: string, logic: FilterLogic) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, logic } : c
    );
    setConditions(newConditions);
  };

  // Apply filter
  const handleApplyFilter = () => {
    onFilterChange(filterString);
  };

  // Clear all filters
  const handleClearAll = () => {
    setConditions([]);
    onFilterChange('');
  };

  // Validate filter string
  const isValid = useMemo(() => {
    if (conditions.length === 0) return true;

    return conditions.every(c => c.field.trim() !== '' && c.value.trim() !== '');
  }, [conditions]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Metadata Filters
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          {conditions.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="space-y-2">
            {/* Logic operator (shown before all conditions except the first) */}
            {index > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />
                <select
                  value={conditions[index - 1].logic}
                  onChange={(e) => handleUpdateLogic(conditions[index - 1].id, e.target.value as FilterLogic)}
                  className="w-24 h-8 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {LOGIC_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600" />
              </div>
            )}

            {/* Condition Row */}
            <div className="flex gap-2 items-start">
              {/* Field Input */}
              <div className="flex-1">
                <Input
                  type="text"
                  list={`fields-${condition.id}`}
                  placeholder="Field name"
                  value={condition.field}
                  onChange={(e) => handleUpdateField(condition.id, e.target.value)}
                  className="w-full"
                />
                <datalist id={`fields-${condition.id}`}>
                  {suggestedFields.map(field => (
                    <option key={field} value={field} />
                  ))}
                </datalist>
              </div>

              {/* Operator Select */}
              <select
                value={condition.operator}
                onChange={(e) => handleUpdateOperator(condition.id, e.target.value as FilterOperator)}
                className="w-40 h-10 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {OPERATORS.map(op => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              {/* Value Input */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) => handleUpdateValue(condition.id, e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Remove Button */}
              <Button
                onClick={() => handleRemoveCondition(condition.id)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Condition Button */}
      <Button
        onClick={handleAddCondition}
        variant="outline"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Condition
      </Button>

      {/* Preview Section */}
      {showPreview && conditions.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter String Preview:
          </div>
          <code className="text-sm text-blue-600 dark:text-blue-400 break-all">
            {filterString || '(empty)'}
          </code>
          {!isValid && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              ⚠️ Please fill in all field names and values
            </div>
          )}
        </div>
      )}

      {/* Apply Button */}
      {conditions.length > 0 && (
        <Button
          onClick={handleApplyFilter}
          disabled={!isValid}
          className="w-full"
        >
          Apply Filter
        </Button>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-1">Examples:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>category = "electronics"</li>
          <li>year &gt; 2023</li>
          <li>category = "books" AND year = 2024</li>
          <li>status = "active" OR status = "pending"</li>
        </ul>
      </div>
    </div>
  );
}
