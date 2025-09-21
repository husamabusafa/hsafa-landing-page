import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import {
  IconChevronDown,
  IconTrash,
  IconMath,
  IconPuzzle,
  IconCheck,
  IconRefresh,
  IconPlug,
  IconPlugOff,
  IconLink,
  IconAlertCircle,
  IconTool,
  IconKey,
  IconCode
} from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { TT } from '@functions/TranslateTerm';
import { getSystemNodeConfig } from '@/constants/icons';

// Import extracted components, hooks, and utilities
import {
  CustomMCPNodeData,
  MCP_PRESETS,
  transportOptions,
  getMCPLogo,
  getConfigurationSummary,
  isConfigurationValid,
  useMCPConnection,
  useMCPTools,
  ConnectionStatus,
  ToolsPreview,
  PresetConfiguration,
  ToolsModal,
  SetupInstructionsModal,
  MCPSelectorModal
} from './CustomMCPNode/index';


export default function CustomMCPNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const { setNodes, getNodes, setEdges, getEdges } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  // Type the data prop properly
  const nodeData = (data as CustomMCPNodeData) || {};
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [mcpUrl, setMcpUrl] = useState(nodeData.mcpUrl || '');
  const [mcpAuth, setMcpAuth] = useState(nodeData.mcpAuth || '');
  const [mcpTransport, setMcpTransport] = useState<'sse' | 'http' | 'stdio'>(nodeData.mcpTransport || 'http');
  const [mcpCommand, setMcpCommand] = useState(nodeData.mcpCommand || '');
  const [mcpArgs, setMcpArgs] = useState(nodeData.mcpArgs?.join(' ') || '');
  const [variablesMode, setVariablesMode] = useState(nodeData.variablesMode || false);
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(nodeData.selectedPreset || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMCPSelector, setShowMCPSelector] = useState(false);
  const [discoveredTools, setDiscoveredTools] = useState<any[]>(nodeData.mcpTools || []);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get component theme colors first (needed by hooks)
  const nodeConfig = getSystemNodeConfig('custom_mcp', lang);
  const color = nodeData.color || nodeConfig.color;
  const { agentColor: contextAgentColor } = useFlowContext();
  const agentColor = contextAgentColor || '#3b82f6';

  // Custom hooks for MCP functionality
  const mcpToolsHook = useMCPTools({
    id,
    color,
    agentColor,
    nodeData
  });

  const { createToolNodes, repositionToolNodes, handleToggleTool } = mcpToolsHook;

  const { handleTestConnection } = useMCPConnection({
    id,
    selectedPreset,
    mcpUrl,
    mcpAuth,
    lang,
    createToolNodes: createToolNodes
  });

  const onConnectClick = useCallback(async () => {
    setIsConnecting(true);
    try {
      await handleTestConnection();
    } finally {
      setIsConnecting(false);
    }
  }, [handleTestConnection]);

  // Get label from configuration
  const label = nodeConfig.name;
  const NodeIcon = nodeConfig.icon;

  // Keep discovered tools in sync when node data updates
  useEffect(() => {
    setDiscoveredTools(nodeData.mcpTools || []);
  }, [nodeData.mcpTools]);

  // Stop loading when connection completes or fails
  useEffect(() => {
    if (nodeData.connectionStatus === 'connected' || nodeData.connectionStatus === 'error') {
      setIsConnecting(false);
    }
  }, [nodeData.connectionStatus]);

  // Stop loading when tools are added
  useEffect(() => {
    if (isConnecting && (discoveredTools?.length || 0) > 0) {
      setIsConnecting(false);
    }
  }, [isConnecting, discoveredTools]);

  // Refresh tool nodes when deactivated tools change so UI reflects toggles
  useEffect(() => {
    if ((discoveredTools?.length || 0) > 0) {
      createToolNodes(discoveredTools);
    }
  }, [nodeData.deactivatedTools, discoveredTools, createToolNodes]);

  // Reposition tool nodes when MCP node expands/collapses (relative movement)
  useEffect(() => {
    // if ((discoveredTools?.length || 0) > 0) {
      repositionToolNodes(isExpanded);
    // }
  }, [isExpanded, repositionToolNodes, discoveredTools]);

  // Handle preset selection and auto-fill form
  const handlePresetSelect = useCallback((presetKey: string) => {
    // Support selecting Custom MCP (empty key)
    if (!presetKey) {
      setSelectedPreset('');

      // Clear fields for custom setup, keep current transport as-is
      setMcpUrl('');
      setMcpAuth('');
      setMcpCommand('');
      setMcpArgs('');

      // Clear discovered tools and remove tool nodes
      setDiscoveredTools([]);
      if (id) {
        const nodes = getNodes();
        const toolNodes = nodes.filter(n => n.id.startsWith(`${id}-tool-`) || n.id === `${id}-more-tools`);
        const toolNodeIds = toolNodes.map(n => n.id);
        setNodes(nodes => nodes.filter(n => !toolNodeIds.includes(n.id)));
        setEdges(edges => edges.filter(edge => !toolNodeIds.includes(edge.source) && !toolNodeIds.includes(edge.target)));
      }
      return;
    }

    const preset = MCP_PRESETS[presetKey as keyof typeof MCP_PRESETS];
    if (!preset) return;

    setSelectedPreset(presetKey);
    // Modal selection handled by modal close

    // Clear all fields when switching presets
    setMcpUrl('');
    setMcpAuth('');
    setMcpCommand('');
    setMcpArgs('');
    setMcpTransport(preset.transport);

    // Clear discovered tools and remove tool nodes when switching presets
    setDiscoveredTools([]);
    if (id) {
      const nodes = getNodes();
      const toolNodes = nodes.filter(n => n.id.startsWith(`${id}-tool-`) || n.id === `${id}-more-tools`);
      const toolNodeIds = toolNodes.map(n => n.id);

      // Remove tool nodes
      setNodes(nodes => nodes.filter(n => !toolNodeIds.includes(n.id)));

      // Remove edges connected to tool nodes
      setEdges(edges => edges.filter(edge => !toolNodeIds.includes(edge.source) && !toolNodeIds.includes(edge.target)));
    }

    // Auto-fill transport-specific fields based on preset
    if (preset.transport === 'stdio') {
      setMcpCommand(preset.defaultCommand || '');
    } else {
      setMcpUrl((preset as any).defaultUrl || '');
    }
  }, [id, getNodes, setNodes, setEdges]);

  // Sync form state with node data when it changes externally (idempotent)
  useEffect(() => {
    // Only sync if we're not actively connecting to prevent input clearing
    if (isConnecting) return;
    
    const nextUrl = nodeData.mcpUrl || '';
    const nextAuth = nodeData.mcpAuth || '';
    const nextTransport = nodeData.mcpTransport || 'http';
    const nextCommand = nodeData.mcpCommand || '';
    const nextArgs = nodeData.mcpArgs?.join(' ') || '';
    const nextExpanded = !!nodeData.isExpanded;
    const nextVarsMode = !!nodeData.variablesMode;
    const nextPreset = nodeData.selectedPreset || '';
    
    // Only update if values actually differ to prevent loops
    if (nextUrl !== mcpUrl) setMcpUrl(nextUrl);
    if (nextAuth !== mcpAuth) setMcpAuth(nextAuth);
    if (nextTransport !== mcpTransport) setMcpTransport(nextTransport);
    if (nextCommand !== mcpCommand) setMcpCommand(nextCommand);
    if (nextArgs !== mcpArgs) setMcpArgs(nextArgs);
    if (nextExpanded !== isExpanded) setIsExpanded(nextExpanded);
    if (nextVarsMode !== variablesMode) setVariablesMode(nextVarsMode);
    if (nextPreset !== selectedPreset) setSelectedPreset(nextPreset);
  }, [nodeData.mcpUrl, nodeData.mcpAuth, nodeData.mcpTransport, nodeData.mcpCommand, nodeData.mcpArgs, nodeData.isExpanded, nodeData.variablesMode, nodeData.selectedPreset, isConnecting]);

  // Configuration persistence - only save when not connecting and values actually change
  const lastSavedConfig = useRef({ mcpUrl: '', mcpAuth: '', mcpTransport: 'http', mcpCommand: '', mcpArgs: '', isExpanded: false, variablesMode: false, selectedPreset: '' });
  
  useEffect(() => {
    if (!isFlowReady || !id || isConnecting) return;
    
    const isValidConfig = isConfigurationValid(selectedPreset, mcpUrl, mcpAuth, mcpTransport, mcpCommand);
    const argsString = mcpArgs.trim();
    
    // Check if anything actually changed from last save
    const currentConfig = { mcpUrl, mcpAuth, mcpTransport, mcpCommand, mcpArgs: argsString, isExpanded, variablesMode, selectedPreset };
    const configChanged = JSON.stringify(currentConfig) !== JSON.stringify(lastSavedConfig.current);
    
    if (configChanged) {
      const timeoutId = setTimeout(() => {
        lastSavedConfig.current = currentConfig;
        
        // Get fresh node data and preserve everything except config fields
        const nodes = getNodes();
        const currentNode = nodes.find(n => n.id === id);
        if (currentNode) {
          updateNodeData(id, {
            ...currentNode.data,
            mcpUrl,
            mcpAuth,
            mcpTransport,
            mcpCommand,
            mcpArgs: argsString ? argsString.split(/\s+/) : [],
            isConfigured: isValidConfig,
            isExpanded,
            variablesMode,
            selectedPreset,
          });
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [mcpUrl, mcpAuth, mcpTransport, mcpCommand, mcpArgs, isExpanded, variablesMode, selectedPreset, isFlowReady, id, isConnecting, getNodes, updateNodeData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTransportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle node deletion
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      // Get all nodes to find MCP tool nodes
      const allNodes = getNodes();
      const allEdges = getEdges();
      
      // Find all tool nodes that belong to this MCP node
      const toolNodes = allNodes.filter(node => 
        node.data?.mcpParent === id || 
        node.id.startsWith(`${id}-tool-`)
      );
      const toolNodeIds = toolNodes.map(node => node.id);
      
      // Find all edges connected to this MCP node (not tool nodes since they don't have edges)
      const edgesToRemove = allEdges.filter(edge => 
        edge.source === id || 
        edge.target === id
      );
      const edgeIdsToRemove = edgesToRemove.map(edge => edge.id);
      
      // Remove MCP node, tool nodes, and MCP edges
      setNodes(nodes => nodes.filter(node => 
        node.id !== id && !toolNodeIds.includes(node.id)
      ));
      setEdges(edges => edges.filter(edge => 
        !edgeIdsToRemove.includes(edge.id)
      ));
    }
  };

  // Toggle variables mode
  const handleToggleVariables = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariablesMode(!variablesMode);
  };

  // (Removed local createToolNodes and handleToggleTool in favor of hook versions)



  const getConnectionStatusIcon = () => {
    switch (nodeData.connectionStatus) {
      case 'connecting':
        return <IconRefresh className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <IconPlug className="w-4 h-4 text-green-500" />;
      case 'error':
        return <IconPlugOff className="w-4 h-4 text-red-500" />;
      default:
        return <IconPlugOff className="w-4 h-4 text-gray-400" />;
    }
  };

  // Configuration logic
  const isConfigured = nodeData.isConfigured || isConfigurationValid(selectedPreset, mcpUrl, mcpAuth, mcpTransport, mcpCommand);
  return (
    <>
      <div 
        className={`group relative flex flex-col rounded-3xl border-2 transition-all duration-300 ease-out cursor-pointer w-[360px] backdrop-blur-xl ${
      selected
            ? `border-primary shadow-2xl ring-2 ring-primary/30 scale-105 z-20`
            : `border-zinc-300 hover:border-zinc-400 shadow-xl hover:shadow-2xl hover:scale-102 ${isDark ? 'border-zinc-600 hover:border-zinc-500' : ''}`
        } ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900/60 via-zinc-800/40 to-zinc-900/60 text-zinc-200' 
            : 'bg-gradient-to-br from-white/80 via-white/60 to-white/80 text-zinc-800'
        } ${
          isExpanded ? 'min-h-[400px]' : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Output Handle - Top (connects to agent features) */}
      <Handle
          id="mcp-agent"
        type="source"
        position={Position.Top}
          className={`backdrop-blur-sm shadow-lg transition-all duration-300 w-3 h-3 rounded-full border-3 z-50`}
          style={{ 
            backgroundColor: agentColor ? `${agentColor}99` : '#3b82f699',
            borderColor: agentColor ? agentColor : '#3b82f6'
          }}
        />

        {/* Output Handle - Bottom (links to MCP tools) */}
        <Handle
          id="mcp-tools"
          type="source"
          position={Position.Bottom}
          className={`backdrop-blur-sm shadow-lg transition-all duration-300 w-3 h-3 rounded-full border-3 z-50`}
        style={{ 
            backgroundColor: agentColor ? `${agentColor}99` : '#3b82f699',
            borderColor: agentColor ? agentColor : '#3b82f6'
          }}
        />
        
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50`}>
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-3xl"
            style={{
              background: color 
                ? `linear-gradient(135deg, ${color}15 0%, transparent 50%, ${color}10 100%)`
                : undefined
            }}
          />
        </div>

        {/* Header */}
        <div className={`relative flex items-center justify-between p-6 gap-4 ${!isExpanded && !isConfigured ? 'pb-6' : 'pb-4'}`}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 min-w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3"
              style={{
                backgroundColor: selectedPreset && MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS]
                  ? '#ffffff'
                  : (color ? `${color}20` : `${isDark ? '#374151' : '#f3f4f6'}`),
                color: color,
                borderColor: color ? `${color}40` : `${isDark ? '#6b7280' : '#d1d5db'}`,
                boxShadow: color ? `0 20px 40px ${color}20` : undefined,
              }}
            >
              {selectedPreset && MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] ? (
                (() => {
                  const { logoPath, aspectRatio } = getMCPLogo(selectedPreset);
                  return (
                    <img
                      src={logoPath}
                      alt={`${selectedPreset} logo`}
                      className={`${
                        aspectRatio === 'horizontal'
                          ? 'w-8 h-6 object-contain'
                          : 'w-8 h-8 object-contain'
                      }`}
                    />
                  );
                })()
              ) : (
                <NodeIcon size={24} className="drop-shadow-lg transition-all duration-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{label}</h3>
              {/* Connection Status */}
              <ConnectionStatus
                nodeData={nodeData}
                discoveredTools={discoveredTools}
                lang={lang}
                isDark={isDark}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Delete Button */}
            <button
              onClick={handleDeleteNode}
              className={`opacity-0 group-hover:opacity-100 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
              }`}
              title={TT('delete_mcp_node', lang)}
            >
              <IconTrash size={16} />
            </button>
            
            {/* Expand/Collapse Button */}
            <div className={`transition-all duration-300 transform ${isExpanded ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`}>
              <div className={`p-2 rounded-full ${isDark ? 'bg-zinc-700/50' : 'bg-white/50'} backdrop-blur-sm`}>
                <IconChevronDown size={16} className="text-tertiary" />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        {isExpanded && (
          <div className="relative px-6 pb-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            {/* Divider */}
            <div className={`w-full h-px ${isDark ? 'bg-zinc-700/60' : 'bg-zinc-200/60'}`} />
            
            {/* MCP Preset Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <IconPuzzle size={16} />
                  {TT('mcp_preset', lang)}
                </label>
                {selectedPreset && MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] && (
                  <button
                    onClick={() => setShowHelpModal(true)}
                    className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                      isDark
                        ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200'
                        : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                    }`}
                    title="Setup instructions"
                  >
                    <IconAlertCircle size={14} />
                  </button>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMCPSelector(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    selectedPreset
                      ? 'border-primary/40 bg-primary/5'
                      : isDark
                      ? 'border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700'
                      : 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-lg`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {selectedPreset && MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] ? (
                      <>
                        {(() => {
                          const { logoPath, color, aspectRatio } = getMCPLogo(selectedPreset);
                          return (
                            <div
                              className={`rounded-lg flex items-center justify-center bg-white ${
                                aspectRatio === 'horizontal' ? 'w-8 h-6 p-1' : 'w-6 h-6 p-0.5'
                              }`}
                            >
                              <img
                                src={logoPath}
                                alt={`${selectedPreset} logo`}
                                className={`${
                                  aspectRatio === 'horizontal'
                                    ? 'w-full h-full object-contain'
                                    : 'w-4 h-4 object-contain'
                                }`}
                              />
                            </div>
                          );
                        })()}
                        <span className="dark:text-white text-zinc-800 font-medium">
                          {MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-zinc-700' : 'bg-zinc-200'
                        }`}>
                          <IconPuzzle size={14} className="text-muted-foreground" />
                        </div>
                        <span className="dark:text-white text-zinc-800 font-medium">
                          {TT('custom_mcp', lang)}
                        </span>
                      </>
                    )}
                  </div>
                  <IconChevronDown size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Preset-Specific Configuration */}
            {selectedPreset ? (
              <PresetConfiguration
                selectedPreset={selectedPreset}
                mcpUrl={mcpUrl}
                mcpAuth={mcpAuth}
                onUrlChange={setMcpUrl}
                onAuthChange={setMcpAuth}
                lang={lang}
              />
            ) : (
              <>
                {/* Transport Selection - Only show when no preset selected */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <IconPlug size={16} />
                  {TT('transport', lang)}
                  <span className="text-red-500 text-sm">*</span>
                </label>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTransportDropdown(!showTransportDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    mcpTransport
                      ? 'border-primary/40 bg-primary/5' 
                      : isDark 
                      ? 'border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700' 
                      : 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-lg`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="dark:text-white text-zinc-800 font-medium">
                      {transportOptions.find(opt => opt.value === mcpTransport)?.label || TT('select', lang)}
                    </span>
                  </div>
                  <IconChevronDown size={16} className={`transition-transform duration-200 ${showTransportDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showTransportDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-2 border-2 rounded-xl shadow-2xl z-50 backdrop-blur-xl ${
                    isDark ? 'border-zinc-600 bg-zinc-800/95' : 'border-zinc-300 bg-white/95'
                  }`}>
                    <div className="overflow-y-scroll scrollbar-thin scrollbar-track-transparent py-2">
                      {transportOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setMcpTransport(option.value as any);
                            setShowTransportDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center justify-between group transition-all duration-200 ${
                            mcpTransport === option.value ? 'bg-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{option.label}</span>
                          </div>
                          {mcpTransport === option.value && (
                            <IconCheck size={16} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

                {/* Generic MCP Configuration - Only show when no preset selected */}
            {mcpTransport === 'stdio' ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-primary flex items-center gap-2">
                      <IconCode size={16} />
                      {TT('command', lang)}
                      <span className="text-red-500 text-sm">*</span>
                    </label>
                    <button
                      onClick={handleToggleVariables}
                      className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                        variablesMode
                          ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                          : isDark 
                          ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                          : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                      }`}
                      title="Toggle variables mode"
                    >
                      <IconMath size={14} />
                    </button>
                  </div>
                  <Input
                    value={mcpCommand}
                    onChange={(e) => setMcpCommand(e.target.value)}
                        placeholder={
                        variablesMode
                          ? "{{command}}"
                          : selectedPreset && (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any)?.defaultCommand
                          ? (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any).defaultCommand
                          : "node mcp-server.js"
                      }
                    className="w-full font-mono text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <IconTool size={16} />
                    {TT('arguments', lang)}
                  </label>
                  <Input
                    value={mcpArgs}
                    onChange={(e) => setMcpArgs(e.target.value)}
                    placeholder={variablesMode ? "{{args}}" : "--port 3000"}
                    className="w-full font-mono text-sm"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <IconLink size={16} />
                    {TT('mcp_server_url', lang)}
                    <span className="text-red-500 text-sm">*</span>
                  </label>
                  <button
                    onClick={handleToggleVariables}
                    className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                      variablesMode
                        ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                        : isDark 
                        ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                        : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                    }`}
                    title="Toggle variables mode"
                  >
                    <IconMath size={14} />
                  </button>
                </div>
                <Input
                  value={mcpUrl}
                  onChange={(e) => setMcpUrl(e.target.value)}
                      placeholder={
                        variablesMode
                          ? "{{mcpUrl}}"
                          : selectedPreset && (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any)?.defaultUrl
                          ? (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any).defaultUrl
                          : "https://api.example.com/mcp"
                      }
                  className="w-full font-mono text-sm"
                />
              </div>
            )}

            {/* Authentication */}
            {mcpTransport !== 'stdio' && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <IconKey size={16} />
                  {TT('authentication', lang)}
                </label>
                <Input
                  value={mcpAuth}
                  onChange={(e) => setMcpAuth(e.target.value)}
                      placeholder={
                        variablesMode
                          ? "{{mcpAuth}}"
                          : selectedPreset && (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any)?.placeholder
                          ? (MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS] as any).placeholder
                          : "Bearer your-token"
                      }
                  className="w-full font-mono text-sm"
                  type="password"
                />
              </div>
                )}
              </>
            )}

            {/* Test Connection Button */}
            <button
              onClick={onConnectClick}
              disabled={isConnecting || !isConfigurationValid(selectedPreset, mcpUrl, mcpAuth, mcpTransport, mcpCommand)}
              className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                nodeData.connectionStatus === 'connected'
                  ? 'bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : isConnecting || !isConfigurationValid(selectedPreset, mcpUrl, mcpAuth, mcpTransport, mcpCommand)
                  ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400'
                  : 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isConnecting ? (
                <>
                  <IconRefresh className="w-4 h-4 animate-spin" />
                  {TT('connecting', lang)}
                </>
              ) : nodeData.connectionStatus === 'connected' ? (
                <>
                  <IconCheck className="w-4 h-4" />
                  {TT('connected', lang)}
                </>
              ) : (
                <>
                  <IconPlug className="w-4 h-4" />
                  {TT('connect', lang)}
                </>
              )}
            </button>

            {/* Connection Status */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
              nodeData.connectionStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                : nodeData.connectionStatus === 'error'
                ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
                : isConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
            }`}>
              {nodeData.connectionStatus === 'connected' ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                  {TT('connected', lang)} - {discoveredTools?.length || 0} tools discovered
                </>
              ) : nodeData.connectionStatus === 'error' ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
                  {nodeData.lastError || TT('connection_failed', lang)}
                </>
              ) : isConfigured ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                  {TT('mcp_configured', lang)}
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                  {TT('requires_mcp_setup', lang)}
                </>
              )}
            </div>

            {/* Tools Preview */}
            <ToolsPreview
              discoveredTools={discoveredTools}
              nodeData={nodeData}
              lang={lang}
              isDark={isDark}
              onToggleTool={handleToggleTool}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </div>
        )}
        
        {/* Collapsed View Summary */}
        {!isExpanded && isConfigured && (
          <div className="px-6 pb-6">
            <div className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs ${
              isDark ? 'bg-zinc-800/40 text-zinc-400' : 'bg-zinc-100/60 text-zinc-600'
            }`}>
              <span className="font-mono">
                {selectedPreset
                  ? `${MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS]?.name} ${getConfigurationSummary(selectedPreset, mcpUrl, mcpAuth)}`
                  : (mcpTransport === 'stdio' ? mcpCommand : mcpUrl)
                }
              </span>
              {discoveredTools?.length ? (
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                  isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {discoveredTools.length} tools
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Tools Modal */}
      <ToolsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        discoveredTools={discoveredTools}
        nodeData={nodeData}
        lang={lang}
        onToggleTool={handleToggleTool}
      />
      {/* Setup Instructions Modal */}
      <SetupInstructionsModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        selectedPreset={selectedPreset}
      />
      {/* MCP Service Selector Modal */}
      <MCPSelectorModal
        isOpen={showMCPSelector}
        onClose={() => setShowMCPSelector(false)}
        selectedPreset={selectedPreset}
        onSelectPreset={handlePresetSelect}
        lang={lang}
        isDark={isDark}
      />
    </>
  );
}
