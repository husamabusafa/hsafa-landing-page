import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconChevronDown, IconTrash, IconMath, IconHash, IconMaximize } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { Input } from '@components/ui/input';
import Modal from '@components/ui/modal';
import { TT } from '@functions/TranslateTerm';
import { getSystemNodeConfig } from '@/constants/icons';

export interface MaxItemsNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  maxItems?: number | string;
  isConfigured?: boolean;
  isExpanded?: boolean;
  variablesMode?: boolean;
}

export default function MaxItemsNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  // Type the data prop properly
  const nodeData = (data as MaxItemsNodeData) || {};
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [maxItems, setMaxItems] = useState(nodeData.maxItems || '');
  const [variablesMode, setVariablesMode] = useState(nodeData.variablesMode || false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  // Get configuration from agentConfig.json
  const nodeConfig = getSystemNodeConfig('max_items', lang);
  
  // Component theme colors
  const color = nodeData.color || nodeConfig.color;
  // Get agent color from FlowContext (current agent's color)
  const { agentColor: contextAgentColor } = useFlowContext();
  const agentColor = contextAgentColor || '#3b82f6';
  // Get label from configuration
  const label = nodeConfig.name;
  const NodeIcon = nodeConfig.icon;

  // Sync form state with node data when it changes externally (idempotent)
  useEffect(() => {
    const nextMaxItems = nodeData.maxItems || '';
    const nextExpanded = !!nodeData.isExpanded;
    const nextVarsMode = !!nodeData.variablesMode;
    
    // Only update if values actually differ to prevent loops
    if (nextMaxItems !== maxItems) setMaxItems(nextMaxItems);
    if (nextExpanded !== isExpanded) setIsExpanded(nextExpanded);
    if (nextVarsMode !== variablesMode) setVariablesMode(nextVarsMode);
  }, [nodeData.maxItems, nodeData.isExpanded, nodeData.variablesMode]);

  // Debounced persistence for max items changes to avoid infinite loops
  useEffect(() => {
    if (!isFlowReady || !id) return;

    const timeoutId = setTimeout(() => {
      const isValidItems = variablesMode
        ? !!maxItems.toString().trim()  // In variables mode, just check if there's any content
        : maxItems.toString().trim() !== '' && !isNaN(Number(maxItems)) && Number(maxItems) >= 1 && Number(maxItems) <= 8192;  // In regular mode, validate the number

      const parsedMax = typeof maxItems === 'string' && maxItems.toString().trim() !== ''
        ? Number(maxItems)
        : (typeof maxItems === 'number' ? maxItems : undefined);

      const newData = {
        // In variables mode allow raw string; otherwise persist number or undefined (not empty string)
        maxItems: variablesMode ? maxItems : parsedMax,
        isConfigured: isValidItems,
        isExpanded,
        variablesMode,
      };

      // Only save if data has actually changed
      if (newData.maxItems !== nodeData.maxItems ||
          newData.isConfigured !== nodeData.isConfigured ||
          newData.isExpanded !== nodeData.isExpanded ||
          newData.variablesMode !== nodeData.variablesMode) {
        updateNodeData(id, newData);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [maxItems, isExpanded, variablesMode, isFlowReady, id, nodeData.maxItems, nodeData.isConfigured, nodeData.isExpanded, nodeData.variablesMode, updateNodeData]);

  // Handle max items input change
  const handleMaxItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (variablesMode) {
      setMaxItems(value);
    } else {
      // Only allow numbers and empty string
      if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 8192)) {
        setMaxItems(value);
      }
    }
  };

  // Handle key press for number input
  const handleMaxItemsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (variablesMode) return;
    
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) return;
    
    // Allow numbers and decimal point
    if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 190) return;
    
    e.preventDefault();
  };

  // Handle node deletion
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }
  };

  // Toggle variables mode
  const toggleVariablesMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariablesMode(!variablesMode);
  };

  // Open full-screen modal
  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Set preset values
  const setPresetValue = (value: number) => {
    setMaxItems(value);
  };

  // Configuration logic
  const isConfigured = nodeData.isConfigured || (
    variablesMode
      ? !!maxItems.toString().trim()  // In variables mode, just check if there's any content
      : maxItems.toString().trim() !== '' && !isNaN(Number(maxItems)) && Number(maxItems) >= 1 && Number(maxItems) <= 8192  // In regular mode, validate the number
  );

  // Common values (small numbers)
  const commonValues = [1, 5, 10, 25, 50];

  return (
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
        isExpanded ? 'min-h-[400px]' :''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Output Handle - Bottom */}
      <Handle
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
              backgroundColor: color ? `${color}20` : `${isDark ? '#374151' : '#f3f4f6'}`,
              color: color,
              borderColor: color ? `${color}40` : `${isDark ? '#6b7280' : '#d1d5db'}`,
              boxShadow: color ? `0 20px 40px ${color}20` : undefined,
            }}
          >
            <NodeIcon size={24} className="drop-shadow-lg transition-all duration-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{label}</h3>
            {isConfigured ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{TT('ready', lang)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{TT('setup_required', lang)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Delete Button */}
          <button
            onClick={handleDeleteNode}
            className={`opacity-0 group-hover:opacity-100 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
            }`}
            title={TT('delete_max_tokens_node', lang)}
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
          
          {/* Max Tokens Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconHash size={16} />
                {TT('max_items_value', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVariablesMode}
                  className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                    variablesMode
                      ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                      : isDark 
                      ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                      : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                  }`}
                  title={TT('toggle_variables_mode', lang)}
                >
                  <IconMath size={14} />
                </button>
                <button
                  onClick={openModal}
                  className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDark 
                      ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                      : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                  }`}
                  title={TT('open_full_screen_editor', lang)}
                >
                  <IconMaximize size={14} />
                </button>
              </div>
            </div>
            
            <Input
              type={variablesMode ? "text" : "number"}
              value={maxItems}
              onChange={handleMaxItemsChange}
              onKeyDown={handleMaxItemsKeyDown}
              placeholder={variablesMode 
                ? TT('max_items_variables_placeholder', lang)
                : TT('enter_max_tokens', lang)
              }
              className={`w-full font-mono text-sm ${!variablesMode ? 'no-spinners' : ''}`}
              min={1}
              max={8192}
            />
            
            {/* Range help */}
            {!variablesMode && (
              <div className="text-xs text-tertiary">
                {TT('tokens_range_help', lang)}
              </div>
            )}
          </div>

          {/* Common Values */}
          {!variablesMode && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary">
                {TT('common_token_values', lang)}
              </label>
              <div className="flex gap-2 flex-wrap">
                {commonValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setPresetValue(value)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      maxItems === value
                        ? 'bg-primary-500 text-white shadow-md'
                        : isDark 
                        ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                        : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Configuration Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
          }`}>
            {isConfigured ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                {TT('max_tokens_configured', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_max_tokens', lang)}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Collapsed View Summary */}
      {!isExpanded && isConfigured && (
        <div className="relative px-6 pb-6">
          <div className={`w-full h-px ${isDark ? 'bg-zinc-700/60' : 'bg-zinc-200/60'} mb-4`} />
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <IconHash size={14} className="text-primary" />
              <span className="text-xs font-medium text-tertiary">{TT('max_items', lang)}</span>
              <span className="font-mono font-semibold text-sm truncate flex-1 text-primary">
                {variablesMode ? maxItems.toString().slice(0, 20) + (maxItems.toString().length > 20 ? '...' : '') : maxItems}
              </span>
              {variablesMode && (
                <IconMath size={12} className="text-primary" title={TT('variables_mode', lang)} />
              )}
            </div>
            {!variablesMode && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-tertiary">{maxItems} {TT('items', lang)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={TT('max_items_value', lang)}
        size="xl"
        maxHeight={true}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconHash size={16} />
                {TT('max_items_value', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <button
                onClick={() => setVariablesMode(!variablesMode)}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-105 ${
                  variablesMode
                    ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                    : isDark 
                    ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                    : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <IconMath size={14} />
              </button>
            </div>
            
            <Input
              type={variablesMode ? "text" : "number"}
              value={maxItems}
              onChange={handleMaxItemsChange}
              onKeyDown={handleMaxItemsKeyDown}
              placeholder={variablesMode 
                ? "e.g., {{MAX_ITEMS}} or ${itemLimit}" 
                : TT('enter_max_tokens', lang)
              }
              className={`w-full font-mono text-base ${!variablesMode ? 'no-spinners' : ''}`}
              min={1}
              max={8192}
            />
            
            {/* Range help */}
            {!variablesMode && (
              <div className="text-sm text-tertiary">
                {TT('tokens_range_help', lang)}
              </div>
            )}
          </div>

          {/* Common Values */}
          {!variablesMode && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary">
                {TT('common_token_values', lang)}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {commonValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setPresetValue(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      maxItems === value
                        ? 'bg-primary-500 text-white shadow-md'
                        : isDark 
                        ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200' 
                        : 'bg-zinc-100/50 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Configuration Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
          }`}>
            {isConfigured ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                {TT('max_tokens_configured', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_max_tokens', lang)}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
