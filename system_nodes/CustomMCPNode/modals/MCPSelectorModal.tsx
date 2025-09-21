import React from 'react';
import { IconCheck, IconPuzzle, IconKey } from '@tabler/icons-react';
import Modal from '@components/ui/modal';
import { TT } from '@functions/TranslateTerm';
import { MCP_PRESETS } from '../constants';
import { getMCPLogo } from '../utils';

interface MCPSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: string;
  onSelectPreset: (presetKey: string) => void;
  lang: string;
  isDark: boolean;
}

export const MCPSelectorModal: React.FC<MCPSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedPreset,
  onSelectPreset,
  lang,
  isDark
}) => {
  // Group presets by category
  const categorizedPresets = Object.entries(MCP_PRESETS).reduce((acc, [key, preset]) => {
    const category = preset.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, preset });
    return acc;
  }, {} as Record<string, Array<{ key: string; preset: any }>>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TT('select_mcp_service', lang)}
      size="2xl"
      maxHeight={true}
      footer={(
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-zinc-400 text-sm' : 'text-zinc-600 text-sm'}>
            {Object.keys(MCP_PRESETS).length} services available
          </span>
          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isDark
                ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            {TT('cancel', lang)}
          </button>
        </div>
      )}
    >
      <div className="space-y-6">
        {/* Custom MCP option */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white': 'bg-zinc-700' }`} />
            <h3 className="text-lg font-semibold text-primary">Custom</h3>
            <div className={`flex-1 h-px ${
              isDark ? 'bg-zinc-700' : 'bg-zinc-300'
            }`} />
          </div>

          <button
            onClick={() => { onSelectPreset(''); onClose(); }}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left w-full ${
              !selectedPreset 
                ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                : isDark 
                ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isDark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                <IconPuzzle size={20} className={isDark ? 'text-zinc-300' : 'text-zinc-700'} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm mb-1 group-hover:text-primary transition-colors ${!selectedPreset ? 'text-primary' : ''}`}>
                  Custom MCP
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Manually configure transport and either URL/auth or command for your MCP server.
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium mt-2 ${
                  isDark ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  Manual setup
                </div>
              </div>
            </div>
          </button>
        </div>
        {/* Categories */}
        {Object.entries(categorizedPresets).map(([category, services]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white': 'bg-zinc-700' }`} />
              <h3 className="text-lg font-semibold text-primary">{category}</h3>
              <div className={`flex-1 h-px ${
                isDark ? 'bg-zinc-700' : 'bg-zinc-300'
              }`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map(({ key, preset }) => {
                const { logoPath, color, aspectRatio } = getMCPLogo(key);
                const isSelected = selectedPreset === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectPreset(key);
                      onClose();
                    }}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                        : isDark
                        ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-5 h-5 rounded-full bg-primary flex items-center justify-center`}>
                          <IconCheck size={12} className="text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Logo */}
                      <div
                        className={`rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-white ${
                          isSelected ? 'ring-2 ring-primary/30' : ''
                        } ${
                          aspectRatio === 'horizontal'
                            ? 'w-16 h-10 p-2'
                            : 'w-12 h-12 p-2'
                        }`}
                      >
                        <img
                          src={logoPath}
                          alt={`${key} logo`}
                          className={`${
                            aspectRatio === 'horizontal'
                              ? 'w-full h-full object-contain'
                              : 'w-8 h-8 object-contain'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm mb-1 group-hover:text-primary transition-colors ${
                          isSelected ? 'text-primary' : ''
                        }`}>
                          {preset.name}
                        </h4>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${
                          isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>
                          {preset.description}
                        </p>

                        {/* Auth method badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium mt-2 ${
                          isDark ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          <IconKey size={10} />
                          {preset.authMethod}
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                      style={{
                        background: `linear-gradient(135deg, ${color}05 0%, transparent 50%, ${color}03 100%)`
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </Modal>
  );
};
