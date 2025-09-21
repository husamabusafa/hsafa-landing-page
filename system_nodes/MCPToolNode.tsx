import React, { useCallback, useMemo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconTool, IconAlertCircle, IconDots, IconExternalLink } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { TT } from '@functions/TranslateTerm';
import { ToolsModal } from './CustomMCPNode/modals/ToolsModal';

interface MCPToolNodeData {
  label?: string;
  description?: string;
  inputSchema?: any;
  mcpParent?: string;
  isMcpTool?: boolean;
  isDeactivated?: boolean;
  isMoreToolsNode?: boolean;
  totalToolsCount?: number;
  tools?: any[];
  agentColor?: string;
  mcpColor?: string;
}

export default function MCPToolNode({ data, selected }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { getNodes } = useReactFlow();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';

  const nodeData = (data as unknown as MCPToolNodeData) || {} as MCPToolNodeData;
  const { label = 'Unknown Tool', description, isDeactivated, isMoreToolsNode, totalToolsCount, tools, agentColor, mcpColor } = nodeData;

  const primaryColor = agentColor || '#3b82f6';
  const secondaryColor = mcpColor || '#ec4899';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parentNodeData = useMemo(() => {
    if (!nodeData.mcpParent) return undefined;
    const nodes = getNodes();
    const parent = nodes.find(n => n.id === nodeData.mcpParent);
    return parent?.data as any | undefined;
  }, [getNodes, nodeData.mcpParent]);

  const handleToggleToolFromModal = useCallback((toolName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isFlowReady || !nodeData.mcpParent) return;

    const nodes = getNodes();
    const parent = nodes.find(n => n.id === nodeData.mcpParent);
    if (!parent) return;

    const parentData = parent.data as any;
    const currentDeactivated: string[] = Array.isArray(parentData.deactivatedTools) ? parentData.deactivatedTools : [];
    const isCurrentlyDeactivated = currentDeactivated.includes(toolName);
    const newDeactivated = isCurrentlyDeactivated
      ? currentDeactivated.filter(name => name !== toolName)
      : [...currentDeactivated, toolName];

    updateNodeData(nodeData.mcpParent, {
      ...parentData,
      deactivatedTools: newDeactivated
    });
  }, [getNodes, isFlowReady, nodeData.mcpParent, updateNodeData]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();   

    if (isMoreToolsNode && tools) {
            setIsModalOpen(true);
    }
  };

  // If this is a "more tools" node, render differently
  if (isMoreToolsNode) {
    return (
      <div
        className={`group relative flex flex-col rounded-2xl border-2 transition-all duration-300 ease-out w-[200px] backdrop-blur-xl cursor-pointer ${
          selected
            ? `border-primary shadow-2xl ring-2 ring-primary/30 scale-105 z-20`
            : `border-zinc-300 hover:border-zinc-400 shadow-lg hover:shadow-xl hover:scale-102 ${isDark ? 'border-zinc-600 hover:border-zinc-500' : ''}`
        } ${
          isDark
            ? 'bg-gradient-to-br from-zinc-900/70 via-zinc-800/50 to-zinc-900/70 text-zinc-200'
            : 'bg-gradient-to-br from-white/90 via-white/70 to-white/90 text-zinc-800'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={handleClick}
      >
        {/* Input Handle - Top (connects from MCP bottom handle) */}
        <Handle
          id="tool-input"
          type="target"
          position={Position.Top}
          className={`backdrop-blur-sm shadow-lg transition-all duration-300 w-3 h-3 rounded-full border-3 z-50`}
          style={{
            backgroundColor: primaryColor ? `${primaryColor}99` : '#3b82f699',
            borderColor: primaryColor || '#3b82f6'
          }}
        />

        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-30`}>
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 50%, ${secondaryColor}10 100%)`
            }}
          />
        </div>

        {/* Header */}
        <div className="relative p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 transform group-hover:scale-110"
              style={{
                backgroundColor: secondaryColor ? `${secondaryColor}15` : '#6366f115',
                color: secondaryColor || '#6366f1',
                borderColor: secondaryColor ? `${secondaryColor}30` : '#6366f130',
              }}
            >
              <IconDots size={18} className="drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{label}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {TT('click_to_view', lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="mt-3">
              <p className={`text-xs ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              } line-clamp-2`}>
                {description}
              </p>
            </div>
          )}

          {/* Tools Count Indicator */}
          {totalToolsCount && (
            <div className="mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${
                isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                <IconExternalLink size={10} />
                {totalToolsCount} {TT('total_tools', lang)}
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            MORE
          </div>
        </div>
        <ToolsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          discoveredTools={tools || []}
          nodeData={{ deactivatedTools: parentNodeData?.deactivatedTools || [] } as any}
          lang={lang}
          onToggleTool={handleToggleToolFromModal}
        />
      </div>
    );
  }

  return (
    <div 
      className={`group relative flex flex-col rounded-2xl border-2 w-[200px] backdrop-blur-xl ${
        selected
          ? `border-primary shadow-2xl ring-2 ring-primary/30 scale-105 z-20`
          : `border-zinc-300 hover:border-zinc-400 shadow-lg hover:shadow-xl hover:scale-102 ${isDark ? 'border-zinc-600 hover:border-zinc-500' : ''}`
      } ${
        isDark 
          ? 'bg-gradient-to-br from-zinc-900/70 via-zinc-800/50 to-zinc-900/70 text-zinc-200' 
          : 'bg-gradient-to-br from-white/90 via-white/70 to-white/90 text-zinc-800'
      } ${
        isDeactivated ? 'opacity-60 grayscale' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Input Handle - Top (connects from MCP bottom handle) */}
      <Handle
        id="tool-input"
        type="target"
        position={Position.Top}
        className={`backdrop-blur-sm shadow-lg transition-all duration-300 w-3 h-3 rounded-full border-3 z-50`}
        style={{ 
          backgroundColor: primaryColor ? `${primaryColor}99` : '#3b82f699',
          borderColor: primaryColor || '#3b82f6'
        }}
      />
      
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-30`}>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 50%, ${secondaryColor}10 100%)`
          }}
        />
      </div>

      {/* Header */}
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 transform group-hover:scale-110"
            style={{
              backgroundColor: secondaryColor ? `${secondaryColor}15` : '#ec489915',
              color: secondaryColor || '#ec4899',
              borderColor: secondaryColor ? `${secondaryColor}30` : '#ec489930',
            }}
          >
            <IconTool size={18} className="drop-shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{label}</h3>
            <div className="flex items-center gap-1 mt-1">
              {isDeactivated ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {TT('inactive', lang)}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {TT('active', lang)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <div className="mt-3">
            <p className={`text-xs ${
              isDeactivated 
                ? isDark ? 'text-zinc-500' : 'text-zinc-400'
                : isDark ? 'text-zinc-400' : 'text-zinc-600'
            } line-clamp-2`}>
              {description}
            </p>
          </div>
        )}
        
        {/* Schema Indicator */}
        {nodeData.inputSchema && (
          <div className="mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${
              isDeactivated
                ? isDark ? 'bg-zinc-800/50 text-zinc-500' : 'bg-zinc-100 text-zinc-400'
                : isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              <IconAlertCircle size={10} />
              {TT('has_schema', lang)}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${
          isDeactivated
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        }`}>
          MCP
        </div>
      </div>
    </div>
  );
}
