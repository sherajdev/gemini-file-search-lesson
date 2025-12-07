'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ChunkingConfig {
  maxTokensPerChunk: number;
  maxOverlapTokens: number;
}

interface ChunkingConfiguratorProps {
  config: ChunkingConfig;
  onChange: (config: ChunkingConfig) => void;
}

const PRESETS = {
  small: { maxTokensPerChunk: 200, maxOverlapTokens: 20, label: 'Small', description: 'Precise retrieval' },
  medium: { maxTokensPerChunk: 400, maxOverlapTokens: 30, label: 'Medium', description: 'Balanced' },
  large: { maxTokensPerChunk: 512, maxOverlapTokens: 50, label: 'Large', description: 'More context (max)' },
};

export function ChunkingConfigurator({ config, onChange }: ChunkingConfiguratorProps) {
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS | null>(
    config.maxTokensPerChunk === 400 && config.maxOverlapTokens === 30 ? 'medium' : null
  );

  const handlePresetClick = (preset: keyof typeof PRESETS) => {
    const presetConfig = PRESETS[preset];
    onChange({
      maxTokensPerChunk: presetConfig.maxTokensPerChunk,
      maxOverlapTokens: presetConfig.maxOverlapTokens,
    });
    setActivePreset(preset);
  };

  const handleSliderChange = (field: keyof ChunkingConfig, value: number) => {
    onChange({ ...config, [field]: value });
    setActivePreset(null); // Clear preset when manually adjusting
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Chunking Configuration</h3>
        <p className="text-xs text-gray-500 mt-1">
          Configure how documents are split into chunks for better retrieval
        </p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Quick Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              type="button"
              variant={activePreset === key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(key as keyof typeof PRESETS)}
              className="flex flex-col items-center py-3 h-auto"
            >
              <span className="font-medium">{preset.label}</span>
              <span className="text-xs opacity-80">{preset.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Max Tokens Per Chunk Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="maxTokensPerChunk" className="text-xs font-medium text-gray-700">
            Max Tokens Per Chunk
          </label>
          <span className="text-sm font-semibold text-blue-600">{config.maxTokensPerChunk}</span>
        </div>
        <input
          type="range"
          id="maxTokensPerChunk"
          min={200}
          max={512}
          step={50}
          value={config.maxTokensPerChunk}
          onChange={(e) => handleSliderChange('maxTokensPerChunk', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>200</span>
          <span>512 (max)</span>
        </div>
        <p className="text-xs text-gray-500">
          Smaller chunks = more precise retrieval. Larger chunks = more context per result.
        </p>
      </div>

      {/* Max Overlap Tokens Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="maxOverlapTokens" className="text-xs font-medium text-gray-700">
            Max Overlap Tokens
          </label>
          <span className="text-sm font-semibold text-blue-600">{config.maxOverlapTokens}</span>
        </div>
        <input
          type="range"
          id="maxOverlapTokens"
          min={20}
          max={50}
          step={5}
          value={config.maxOverlapTokens}
          onChange={(e) => handleSliderChange('maxOverlapTokens', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>20</span>
          <span>50</span>
        </div>
        <p className="text-xs text-gray-500">
          Overlap helps maintain context across chunk boundaries.
        </p>
      </div>

      {/* Visual Explanation */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-xs font-medium text-blue-900 mb-2">How Chunking Works</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          Your document is split into overlapping chunks. Each chunk contains up to{' '}
          <span className="font-semibold">{config.maxTokensPerChunk} tokens</span>, with{' '}
          <span className="font-semibold">{config.maxOverlapTokens} tokens</span> overlapping
          between consecutive chunks. This ensures important information isn&apos;t lost at chunk boundaries.
        </p>
      </div>
    </div>
  );
}
