import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconBuilding, IconChevronDown, IconTrash, IconMaximize, IconFileText, IconCode, IconDeviceFloppy } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { TT } from '@functions/TranslateTerm';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import CodeEditor from '@components/ui/CodeEditor';
import Modal from '@components/ui/modal';

interface ResponseStructureNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  title?: string;
  description?: string;
  zodSchema?: string;
  isConfigured?: boolean;
  isExpanded?: boolean;
}

export default function ResponseStructureNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, agentColor: contextAgentColor, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  const nodeData = (data as ResponseStructureNodeData) || {};
  const color = nodeData.color || '#23fefc';
  // Get agent color from FlowContext (current agent's color)
  const agentColor = contextAgentColor || '#3b82f6';
  const label = TT('response_structure', lang);

  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [title, setTitle] = useState(nodeData.title || '');
  const [description, setDescription] = useState(nodeData.description || '');
  const [zodSchema, setZodSchema] = useState(nodeData.zodSchema || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NOTE: Debounce removed. We persist synchronously, guarded by hasChanges.

  // Sync form state with node data when it changes externally (guarded to avoid loops)
  useEffect(() => {
    const nextTitle = nodeData.title || '';
    if (nextTitle !== title) setTitle(nextTitle);

    const nextDesc = nodeData.description || '';
    if (nextDesc !== description) setDescription(nextDesc);

    const nextSchema = nodeData.zodSchema || '';
    if (nextSchema !== zodSchema) setZodSchema(nextSchema);

    // Do not drive UI-only isExpanded from persisted data to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeData.title, nodeData.description, nodeData.zodSchema]);

  // No timeout cleanup needed (debounce removed)


  // Debounced persistence for text input changes to avoid infinite loops
  useEffect(() => {
    if (!isFlowReady || !id) return;
    
    const timeoutId = setTimeout(() => {
      const isValidConfig = !!(title?.trim() || description?.trim() || zodSchema?.trim());
      
      const newData = {
        title,
        description,
        zodSchema,
        isConfigured: isValidConfig,
        isExpanded,
      };
      // Only save if data has actually changed
      updateNodeData(id, newData);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [title, description, zodSchema,isExpanded, isFlowReady, id, nodeData.title, nodeData.description, nodeData.zodSchema, nodeData.isConfigured, updateNodeData]);

  // Removed unsaved-changes tracking to simplify logic

  // Removed manual save; updates are immediate when fields change

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
              <IconBuilding size={24} className="drop-shadow-lg transition-all duration-300" />
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
                onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder={TT('enter_description', lang)}
                className="w-full min-h-[80px]"
              />
            </div>

            {/* Zod Schema Input */}
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

            {/* Save Button removed (changes persist immediately) */}

            {/* Configuration Status */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700'
            }`}>
              {isConfigured ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                  {TT('response_structure_configured', lang)}
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
            </div>
          </div>
        )}
      </div>
      
      {/* Full-screen Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={TT('response_structure_editor', lang)}
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
              onChange={(e) => setDescription(e.target.value)}
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
