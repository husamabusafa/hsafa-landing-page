import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconCode, IconChevronDown, IconTrash, IconMaximize, IconFileText, IconDeviceFloppy, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { TT } from '@functions/TranslateTerm';
import { getSystemNodeConfig } from '@/constants/icons';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import CodeEditor from '@components/ui/CodeEditor';
import Modal from '@components/ui/modal';

export interface ActionNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  title?: string;
  description?: string;
  zodSchema?: string;
  isConfigured?: boolean;
  isExpanded?: boolean;
  executeOnStream?: boolean;
}

export default function ActionNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, agentColor: contextAgentColor, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  // Type the data prop properly
  const nodeData = (data as ActionNodeData) || {};
  
  const nodeConfig = getSystemNodeConfig('action', lang);
  
  // Component theme colors
  const color = nodeData.color || nodeConfig.color;
  // Get agent color from FlowContext (current agent's color)
  const agentColor = contextAgentColor || '#3b82f6';
  // Visible label: prefer translation key 'action' with sensible RTL-aware fallback
  const translatedLabel = TT('action', lang);
  const label = translatedLabel || (isRTL ? 'إجراء' : 'Action');
  const NodeIcon = nodeConfig.icon;

  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [title, setTitle] = useState(nodeData.title || '');
  const [description, setDescription] = useState(nodeData.description || '');
  const [zodSchema, setZodSchema] = useState(nodeData.zodSchema || '');
  const [executeOnStream, setExecuteOnStream] = useState(nodeData.executeOnStream || false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync form state with node data when it changes externally (idempotent)
  useEffect(() => {
    const nextTitle = nodeData.title || '';
    const nextDescription = nodeData.description || '';
    const nextZodSchema = nodeData.zodSchema || '';
    const nextExpanded = !!nodeData.isExpanded;
    const nextExecuteOnStream = !!nodeData.executeOnStream;
    
    // Only update if values actually differ to prevent loops
    if (nextTitle !== title) setTitle(nextTitle);
    if (nextDescription !== description) setDescription(nextDescription);
    if (nextZodSchema !== zodSchema) setZodSchema(nextZodSchema);
    if (nextExpanded !== isExpanded) setIsExpanded(nextExpanded);
    if (nextExecuteOnStream !== executeOnStream) setExecuteOnStream(nextExecuteOnStream);
  }, [nodeData.title, nodeData.description, nodeData.zodSchema, nodeData.isExpanded, nodeData.executeOnStream]);


  // Debounced persistence for text input changes to avoid infinite loops
  useEffect(() => {
    if (!isFlowReady || !id) return;
    
    const timeoutId = setTimeout(() => {
      const isValidConfig = !!(title?.trim() || description?.trim() || zodSchema?.trim());
      
      const newData = {
        title,
        description,
        zodSchema,
        executeOnStream,
        isConfigured: isValidConfig,
        isExpanded
      };

      // Only save if data has actually changed
      if (newData.title !== nodeData.title ||
          newData.description !== nodeData.description ||
          newData.zodSchema !== nodeData.zodSchema ||
          newData.executeOnStream !== nodeData.executeOnStream ||
          newData.isConfigured !== nodeData.isConfigured ||
          newData.isExpanded !== nodeData.isExpanded) {
        updateNodeData(id, newData);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [title, description, zodSchema, executeOnStream, isFlowReady, id, nodeData.title, nodeData.description, nodeData.zodSchema, nodeData.executeOnStream, nodeData.isConfigured, isExpanded, updateNodeData]);


  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle node deletion
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }
  };

  // Open full-screen modal
  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Configuration logic
  const isConfigured = nodeData.isConfigured || !!(title?.trim() || description?.trim() || zodSchema?.trim());

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
        {/* Output Handle - Top */}
        <Handle
          type="source"
          position={Position.Top}
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
              title={TT('delete_node', lang)}
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
            
            {/* Title Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconFileText size={16} />
                {TT('title', lang)}
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder={TT('enter_title', lang)}
                className="w-full"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <IconFileText size={16} />
                  {TT('description', lang)}
                </label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
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
              <Textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder={TT('enter_description', lang)}
                className="w-full min-h-[80px]"
              />
            </div>

            {/* Zod Schema */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <IconCode size={16} />
                  {TT('zod_schema', lang)}
                </label>
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
              <CodeEditor
                value={zodSchema}
                onChange={setZodSchema}
                placeholder={TT('zod_schema_placeholder', lang)}
                language="typescript"
                height="120px"
                className="w-full"
                showValidation={true}
              />
            </div>

            {/* Execute on Stream Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconPlayerPlay size={16} />
                {TT('execution_timing', lang) || 'Execution Timing'}
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm bg-gradient-to-r from-zinc-50/50 to-white/50 dark:from-zinc-800/50 dark:to-zinc-700/50 border-zinc-200 dark:border-zinc-600">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {executeOnStream ? (
                      <IconPlayerPlay size={16} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <IconPlayerStop size={16} className="text-green-600 dark:text-green-400" />
                    )}
                    <span className="font-medium text-sm">
                      {executeOnStream 
                        ? (TT('execute_on_each_token', lang) || 'Execute on Each Token')
                        : (TT('execute_when_complete', lang) || 'Execute When Complete')
                      }
                    </span>
                  </div>
                  <p className="text-xs text-tertiary">
                    {executeOnStream 
                      ? (TT('execute_on_stream_description', lang) || 'Action will be triggered for each token as it streams')
                      : (TT('execute_when_complete_description', lang) || 'Action will be triggered only when streaming is finished')
                    }
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExecuteOnStream(!executeOnStream);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    executeOnStream 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
                  }`}
                  dir="ltr"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                      executeOnStream 
                        ? (isRTL ? 'translate-x-1' : 'translate-x-6')
                        : (isRTL ? 'translate-x-6' : 'translate-x-1')
                    }`}
                  />
                </button>
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
                  {/* Prefer action-specific key, fall back to generic */}
                  {TT('action_configured', lang) || TT('configured', lang) || (isRTL ? 'تم الإعداد' : 'Configured')}
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                  {TT('requires_configuration', lang)}
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
              {title && (
                <div className="flex items-center gap-3">
                  <IconFileText size={14} className="text-primary" />
                  <span className="text-xs font-medium text-tertiary">{TT('title', lang)}</span>
                  <span className="font-semibold text-sm truncate flex-1 text-primary">
                    {title}
                  </span>
                </div>
              )}
              {description && (
                <div className="flex items-center gap-3">
                  <IconFileText size={14} className="text-primary" />
                  <span className="text-xs font-medium text-tertiary">{TT('description', lang)}</span>
                  <span className="text-xs truncate flex-1 text-primary">
                    {description.substring(0, 50)}{description.length > 50 ? '...' : ''}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {executeOnStream ? (
                  <IconPlayerPlay size={14} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <IconPlayerStop size={14} className="text-green-600 dark:text-green-400" />
                )}
                <span className="text-xs font-medium text-tertiary">{TT('execution_timing', lang) || 'Timing'}</span>
                <span className="text-xs font-medium text-primary">
                  {executeOnStream 
                    ? (TT('on_stream', lang) || 'On Stream')
                    : (TT('when_complete', lang) || 'When Complete')
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={TT('action_editor', lang)}
        size="2xl"
        maxHeight={true}
      >
        <div className="space-y-6">
          {/* Description Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconFileText size={16} />
              {TT('description', lang)}
            </label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder={TT('enter_description', lang)}
              className="w-full min-h-[200px] font-mono text-base"
              rows={8}
            />
          </div>
          
          {/* Zod Schema Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconCode size={16} />
              {TT('zod_schema', lang)}
            </label>
            <CodeEditor
              value={zodSchema}
              onChange={setZodSchema}
              placeholder={TT('zod_schema_placeholder', lang)}
              language="typescript"
              height="400px"
              className="w-full"
              showValidation={true}
            />
          </div>
          
          {/* Modal Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' 
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {TT('close', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
