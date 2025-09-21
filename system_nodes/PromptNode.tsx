import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconChevronDown, IconTrash, IconMath, IconMessageCircle, IconMaximize } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { Textarea } from '@components/ui/textarea';
import Modal from '@components/ui/modal';
import { TT } from '@functions/TranslateTerm';
import { getSystemNodeConfig } from '@/constants/icons';

export interface PromptNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  prompt?: string;
  isConfigured?: boolean;
  isExpanded?: boolean;
  variablesMode?: boolean;
}

export default function PromptNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  // Type the data prop properly
  const nodeData = (data as PromptNodeData) || {};
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [prompt, setPrompt] = useState(nodeData.prompt || '');
  const [variablesMode, setVariablesMode] = useState(nodeData.variablesMode || false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  // Get configuration from agentConfig.json
  const nodeConfig = getSystemNodeConfig('prompt', lang);
  
  // Component theme colors
  const color = nodeData.color || nodeConfig.color;
  // Get agent color from FlowContext (current agent's color)
  const { agentColor: contextAgentColor } = useFlowContext();
  const agentColor = contextAgentColor || '#3b82f6';
  // Get label from configuration
  const label = nodeConfig.name;
  const NodeIcon = nodeConfig.icon;
  
  // // Sync form state with node data when it changes externally (idempotent)
  useEffect(() => {
    const nextPrompt = nodeData.prompt || '';
    const nextExpanded = !!nodeData.isExpanded;
    const nextVarsMode = !!nodeData.variablesMode;
    
    // Only update if values actually differ to prevent loops
    if (nextPrompt !== prompt) setPrompt(nextPrompt);
    if (nextExpanded !== isExpanded) setIsExpanded(nextExpanded);
    if (nextVarsMode !== variablesMode) setVariablesMode(nextVarsMode);
  }, [nodeData.prompt, nodeData.isExpanded, nodeData.variablesMode]);


  useEffect(() => {
    if (!isFlowReady || !id) return;
    
    const timeoutId = setTimeout(() => {
      const isValidPrompt = variablesMode ? !!prompt.trim() : !!prompt.trim();
      
      const newData = {
        prompt,
        isConfigured: isValidPrompt,
        isExpanded,
        variablesMode,
      };

      // Only save if prompt has actually changed
      if (newData.prompt !== nodeData.prompt || newData.isConfigured !== nodeData.isConfigured || newData.isExpanded !== nodeData.isExpanded || newData.variablesMode !== nodeData.variablesMode) {
        updateNodeData(id, newData);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [prompt, isFlowReady, id, nodeData.prompt, nodeData.isConfigured, isExpanded, variablesMode, updateNodeData]);

  // Handle prompt input change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
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

  // Configuration logic
  const isConfigured = nodeData.isConfigured || (
    variablesMode ? !!prompt.trim() : !!prompt.trim()
  );

  // Character count
  const characterCount = prompt.length;

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
        isExpanded ? 'min-h-[380px]' : ""
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
            title={TT('delete_prompt_node', lang)}
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
          
          {/* Prompt Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconMessageCircle size={16} />
                {TT('prompt_value', lang)}
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
                  title="Toggle variables mode"
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
                  title="Open full-screen editor"
                >
                  <IconMaximize size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <Textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder={variablesMode 
                  ? "e.g., {{USER_PROMPT}} or ${userInput}" 
                  : TT('enter_prompt', lang)
                }
                className="w-full font-mono text-sm min-h-[100px] resize-none"
                rows={4}
              />
              
              {/* Character count */}
              <div className="flex items-center justify-between text-xs text-tertiary">
                <span>{TT('character_count', lang)}: {characterCount}</span>
                {!variablesMode && (
                  <span className={characterCount > 1000 ? 'text-amber-600 dark:text-amber-400' : ''}>
                    {characterCount > 1000 ? '⚠️ Long prompt' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
          }`}>
            {isConfigured ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                {TT('prompt_configured', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_prompt', lang)}
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
              <IconMessageCircle size={14} className="text-primary" />
              <span className="text-xs font-medium text-tertiary">{TT('prompt', lang)}</span>
              <span className="font-mono font-semibold text-sm truncate flex-1 text-primary">
                {variablesMode ? prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '') : `${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`}
              </span>
              {variablesMode && (
                <IconMath size={12} className="text-primary" title="Variables mode" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-tertiary">{characterCount} {TT('character_count', lang)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={TT('prompt_value', lang)}
        size="full"
        maxHeight={true}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconMessageCircle size={16} />
                {TT('prompt_value', lang)}
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
                <IconMath size={14}/>
              </button>
            </div>
            
            <Textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder={variablesMode 
                ? "e.g., {{USER_PROMPT}} or ${userInput}" 
                : TT('enter_prompt', lang)
              }
              className="w-full font-mono text-base min-h-[350px] resize-none"
              rows={18}
            />
            
            {/* Character count */}
            <div className="flex items-center justify-between text-sm text-tertiary">
              <span>{TT('character_count', lang)}: {characterCount}</span>
              {!variablesMode && (
                <span className={characterCount > 1000 ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                  {characterCount > 1000 ? '⚠️ Long prompt - consider breaking into smaller parts' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Configuration Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
          }`}>
            {isConfigured ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                {TT('prompt_configured', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_prompt', lang)}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
