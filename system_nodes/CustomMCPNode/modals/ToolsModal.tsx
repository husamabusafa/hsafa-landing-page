import React from 'react';
import { IconTool, IconExternalLink } from '@tabler/icons-react';
import Modal from '@components/ui/modal';
import { TT } from '@functions/TranslateTerm';
import { CustomMCPNodeData } from '../types';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredTools: any[];
  nodeData: CustomMCPNodeData;
  lang: string;
  onToggleTool: (toolName: string, e?: React.MouseEvent) => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  discoveredTools,
  nodeData,
  lang,
  onToggleTool
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TT('mcp_tools', lang)}
      size="2xl"
      maxHeight={true}
      footer={(
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200"
          >
            {TT('cancel', lang)}
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        {discoveredTools?.map((tool) => {
          const isDeactivated = nodeData?.deactivatedTools?.includes(tool.name);
          return (
            <div
              key={tool.name}
              className={`p-4 border rounded-lg transition-all ${
                isDeactivated
                  ? 'border-border-light-secondary dark:border-border-dark-secondary opacity-50 bg-zinc-50 dark:bg-zinc-800/50'
                  : 'border-border-light-secondary dark:border-border-dark-secondary'
              }`}
            >
              <div className="flex items-start gap-3">
                <IconTool className={`w-5 h-5 mt-0.5 ${isDeactivated ? 'text-zinc-400' : 'text-primary'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${isDeactivated ? 'text-zinc-400' : 'text-primary'}`}>
                      {tool.name}
                      {isDeactivated && (
                        <span className="ml-2 text-[10px] px-2 py-1 rounded text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30">
                          {TT('inactive', lang)}
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={(e) => onToggleTool(tool.name, e)}
                      className={`w-10 h-5 rounded-full transition-all duration-200 flex items-center ${
                        isDeactivated
                          ? 'bg-zinc-300 dark:bg-zinc-600'
                          : 'bg-emerald-500'
                      }`}
                      title={isDeactivated ? TT('activate_tool', lang) : TT('deactivate_tool', lang)}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isDeactivated ? 'translate-x-0.5' : 'translate-x-5'
                      }`} />
                    </button>
                  </div>
                  {tool.description && (
                    <p className={`text-sm mt-1 ${isDeactivated ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                      {tool.description}
                    </p>
                  )}
                  {tool.inputSchema && (
                    <details className="mt-2">
                      <summary className={`text-xs font-medium cursor-pointer ${
                        isDeactivated ? 'text-zinc-400' : 'hover:text-primary'
                      }`}>
                        {TT('input_schema', lang)}
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!discoveredTools?.length && (
          <div className="text-center text-muted-foreground py-8">
            <IconTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{TT('no_tools_discovered', lang)}</p>
            <p className="text-sm mt-1">{TT('test_connection_first', lang)}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
