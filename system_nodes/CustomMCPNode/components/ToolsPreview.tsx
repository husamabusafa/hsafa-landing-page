import React from 'react';
import { IconTool, IconExternalLink } from '@tabler/icons-react';
import { TT } from '@functions/TranslateTerm';
import { CustomMCPNodeData } from '../types';

interface ToolsPreviewProps {
  discoveredTools: any[];
  nodeData: CustomMCPNodeData;
  lang: string;
  isDark: boolean;
  onToggleTool: (toolName: string, e?: React.MouseEvent) => void;
  onOpenModal: () => void;
}

export const ToolsPreview: React.FC<ToolsPreviewProps> = ({
  discoveredTools,
  nodeData,
  lang,
  isDark,
  onToggleTool,
  onOpenModal
}) => {
  if (!discoveredTools?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-primary flex items-center gap-2">
          <IconTool size={16} />
          {TT('discovered_tools', lang)} ({discoveredTools.length})
        </label>
        <button
          onClick={onOpenModal}
          className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
            isDark
              ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200'
              : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
          }`}
          title="View all tools"
        >
          <IconExternalLink size={14} />
        </button>
      </div>
      <div className="space-y-2">
        {discoveredTools.slice(0, 4).map((tool) => {
          const isDeactivated = nodeData.deactivatedTools?.includes(tool.name);
          return (
            <div
              key={tool.name}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                isDeactivated
                  ? isDark ? 'bg-zinc-800/50 border-zinc-700 opacity-50' : 'bg-zinc-50 border-zinc-200 opacity-50'
                  : isDark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-100 border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${
                  isDeactivated
                    ? isDark ? 'text-zinc-500' : 'text-zinc-400'
                    : isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  {tool.name}
                </span>
                {isDeactivated && (
                  <span className="text-[10px] px-1 py-0.5 rounded text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30">
                    {TT('inactive', lang)}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => onToggleTool(tool.name, e)}
                className={`w-8 h-4 rounded-full transition-all duration-200 flex items-center ${
                  isDeactivated
                    ? 'bg-zinc-300 dark:bg-zinc-600'
                    : 'bg-emerald-500'
                }`}
                title={isDeactivated ? TT('activate_tool', lang) : TT('deactivate_tool', lang)}
              >
                <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isDeactivated ? 'translate-x-0.5' : 'translate-x-4'
                }`} />
              </button>
            </div>
          );
        })}
        {discoveredTools.length > 4 && (
          <div className="text-center">
            <span className={`text-xs ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              +{discoveredTools.length - 4} more tools...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
