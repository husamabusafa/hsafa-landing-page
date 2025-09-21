import React from 'react';
import { IconPlug, IconPlugOff, IconRefresh } from '@tabler/icons-react';
import { TT } from '@functions/TranslateTerm';
import { CustomMCPNodeData } from '../types';
import { isConfigurationValid } from '../utils';

interface ConnectionStatusProps {
  nodeData: CustomMCPNodeData;
  discoveredTools: any[];
  lang: string;
  isDark: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  nodeData,
  discoveredTools,
  lang,
  isDark
}) => {
  const getStatusDisplay = () => {
    if (nodeData.connectionStatus === 'connected') {
      return {
        icon: <IconPlug className="w-3 h-3 text-emerald-500 animate-pulse shadow-lg" />,
        bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700',
        text: `${TT('connected', lang)} - ${discoveredTools?.length || 0} tools discovered`
      };
    }

    if (nodeData.connectionStatus === 'error') {
      return {
        icon: <IconPlugOff className="w-3 h-3 text-red-500 shadow-lg" />,
        bgColor: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700',
        text: nodeData.lastError || TT('connection_failed', lang)
      };
    }

    const isConfigured = nodeData.isConfigured || isConfigurationValid(
      nodeData.selectedPreset, 
      nodeData.mcpUrl, 
      nodeData.mcpAuth, 
      nodeData.mcpTransport || 'http', 
      nodeData.mcpCommand
    );

    if (isConfigured) {
      return {
        icon: <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>,
        bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700',
        text: TT('mcp_configured', lang)
      };
    }

    return {
      icon: <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>,
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700',
      text: TT('requires_mcp_setup', lang)
    };
  };

  const { icon, bgColor, text } = getStatusDisplay();

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${bgColor}`}>
      {icon}
      {text}
    </div>
  );
};
