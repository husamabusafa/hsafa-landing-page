import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconChevronDown, IconKey, IconCheck, IconX, IconSparkles, IconTrash, IconMath, IconPlus, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { Input } from '@components/ui/input';
import Modal from '@components/ui/modal';
import { toast } from '@components/ui/use-toast';
import { TT } from '@functions/TranslateTerm';
import { graphqlClient, API_KEY_QUERIES, ApiKey, ApiProvider } from '@config/graphql';
import { getSystemNodeConfig } from '@/constants/icons';

export interface ModelNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  modelName?: string;
  apiKeyValue?: string;
  provider?: string;
  isConfigured?: boolean;
  isExpanded?: boolean;
  apiKeyVariablesMode?: boolean;
  modelVariablesMode?: boolean;
  providerVariablesMode?: boolean;
  // Add any additional model-specific data
  temperature?: number;
  maxTokens?: number;
}

export default function ModelNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  // Type the data prop properly
  const nodeData = (data as ModelNodeData) || {};
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [modelName, setModelName] = useState(nodeData.modelName || '');
  const [selectedApiKeyValue, setSelectedApiKeyValue] = useState(nodeData.apiKeyValue || '');
  const [provider, setProvider] = useState<string>(nodeData.provider || '');
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [apiKeyVariablesMode, setApiKeyVariablesMode] = useState(nodeData.apiKeyVariablesMode || false);
  const [modelVariablesMode, setModelVariablesMode] = useState(nodeData.modelVariablesMode || false);
  const [providerVariablesMode, setProviderVariablesMode] = useState(nodeData.providerVariablesMode || false);
  
  // Create API Key modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', keyValue: '' });
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  // debounce removed
  
  // Get configuration from agentConfig.json
  const nodeConfig = getSystemNodeConfig('model', lang);
  
  // Component theme colors
  const color = nodeData.color || nodeConfig.color;
  // Get agent color from FlowContext (current agent's color)
  const { agentColor: contextAgentColor } = useFlowContext();
  const agentColor = contextAgentColor || '#3b82f6';
  // Get label from configuration
  const label = nodeConfig.name;
  const NodeIcon = nodeConfig.icon;
  
  // NOTE: Debounce removed. We will persist synchronously, guarded by hasChanges.

  // Load API keys function
  const loadApiKeys = async () => {
    setApiKeysLoading(true);
    try {
      const result = await graphqlClient.query(API_KEY_QUERIES.GET_API_KEYS);
      setApiKeys(result.apiKeys?.filter((key: ApiKey) => key.isActive) || []);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      setApiKeys([]);
    } finally {
      setApiKeysLoading(false);
    }
  };

  // When in API key variables mode and user types a key-like value, auto-detect provider
  useEffect(() => {
    if (apiKeyVariablesMode && selectedApiKeyValue) {
      const detected = detectProvider(selectedApiKeyValue);
      if (detected && detected !== provider) setProvider(detected);
    }
  }, [apiKeyVariablesMode, selectedApiKeyValue]);

  // Lowercase model name in regular mode to standardize
  useEffect(() => {
    if (!modelVariablesMode && modelName) {
      const lower = modelName.toLowerCase();
      if (lower !== modelName) setModelName(lower);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelVariablesMode]);

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  // Sync form state with node data when it changes externally (guarded to avoid loops)
  useEffect(() => {
    const nextName = nodeData.modelName || '';
    if (nextName !== modelName) setModelName(nextName);

    const nextKey = nodeData.apiKeyValue || '';
    if (nextKey !== selectedApiKeyValue) setSelectedApiKeyValue(nextKey);

    const nextProvider = nodeData.provider || '';
    if (nextProvider !== provider) setProvider(nextProvider);

    // UI-only flags should not be driven by persisted data; keep local unless initial mount.
    // If nodeData.isExpanded changes externally, ignore to prevent loops.
    // Same for variables modes: keep local to component for UI.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeData.modelName, nodeData.apiKeyValue, nodeData.provider]);

  // No timeout cleanup needed (debounce removed)
  
  // Get selected API key details
  const selectedApiKey = apiKeys.find((key: ApiKey) => key.keyValue === selectedApiKeyValue);


  // Debounced persistence for input changes to avoid infinite loops
  useEffect(() => {
    if (!isFlowReady || !id) return;
    
    const timeoutId = setTimeout(() => {
      const newData = {
        modelName,
        apiKeyValue: selectedApiKeyValue,
        provider: provider,
        isConfigured: !!(modelName && (selectedApiKeyValue || apiKeyVariablesMode)),
        isExpanded,
        apiKeyVariablesMode,
        modelVariablesMode,
        providerVariablesMode,
      };

      // Only save if data has actually changed
      if (newData.modelName !== nodeData.modelName ||
          newData.apiKeyValue !== nodeData.apiKeyValue ||
          newData.provider !== nodeData.provider ||
          newData.isConfigured !== nodeData.isConfigured ||
          newData.isExpanded !== nodeData.isExpanded ||
          newData.apiKeyVariablesMode !== nodeData.apiKeyVariablesMode ||
          newData.modelVariablesMode !== nodeData.modelVariablesMode ||
          newData.providerVariablesMode !== nodeData.providerVariablesMode) {
        updateNodeData(id, newData);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [modelName, selectedApiKeyValue, provider,isExpanded, apiKeyVariablesMode, isFlowReady, id, nodeData.modelName, nodeData.apiKeyValue, nodeData.provider, nodeData.isConfigured, updateNodeData]);
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowApiKeyDropdown(false);
      }
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(target)) {
        setShowProviderDropdown(false);
      }
    };

    if (showApiKeyDropdown || showProviderDropdown) {
      document.addEventListener('mousedown', handleClickOutside as EventListener);
      document.addEventListener('touchstart', handleClickOutside as EventListener);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside as EventListener);
        document.removeEventListener('touchstart', handleClickOutside as EventListener);
      };
    }
  }, [showApiKeyDropdown, showProviderDropdown]);

  // Handle API key selection
  const handleApiKeySelect = (apiKey: ApiKey) => {
    setSelectedApiKeyValue(apiKey.keyValue);
    setShowApiKeyDropdown(false);
    // Clear model name to force user to select appropriate model for provider
    setModelName('');
    // Auto-select provider from key, but keep it user-changeable
    setProvider(apiKey.provider);
  };

  // Handle API key removal
  const handleApiKeyRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApiKeyValue('');
    setModelName(''); // Also clear model when removing API key
    setShowApiKeyDropdown(false);
    // Keep provider as-is for manual selection
  };

  // Handle model name selection from suggestions
  const handleModelSelect = (model: string) => {
    setModelName(model);
  };

  // Handle node deletion
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }
  };

  // Toggle variables mode for inputs
  const toggleModelVariablesMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModelVariablesMode(!modelVariablesMode);
  };

  const toggleApiKeyVariablesMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setApiKeyVariablesMode(!apiKeyVariablesMode);
    setShowApiKeyDropdown(false); // Close dropdown when switching modes
  };

  const toggleProviderVariablesMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProviderVariablesMode(!providerVariablesMode);
  };

  // Detect API provider from key format
  const detectProvider = (apiKey: string): string => {
    const key = apiKey.trim();
    const lower = key.toLowerCase();

    // Anthropic: sk-ant-...
    if (key.startsWith('sk-ant-')) return 'anthropic';

    // Groq: gsk_...
    if (key.startsWith('gsk_')) return 'groq';

    // Perplexity: pplx-...
    if (key.startsWith('pplx-')) return 'perplexity';

    // Google: AIza... (case-insensitive helper)
    if (key.startsWith('AIza') || lower.startsWith('aiza')) return 'google';

    // XAI/Grok: heuristic
    if (lower.startsWith('xai-') || lower.includes('xai') || lower.includes('grok')) return 'xai';

    // OpenAI style: sk- ... default many vendors mimic
    if (key.startsWith('sk-')) return 'openai';

    // Fallback to a valid enum to avoid GraphQL errors
    return 'openai';
  };

  // Handle create API key
  const handleCreateApiKey = async () => {
    if (!newApiKey.name.trim() || !newApiKey.keyValue.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setCreateLoading(true);
    try {
      const detectedProvider = detectProvider(newApiKey.keyValue);
      
      const result = await graphqlClient.mutate(API_KEY_QUERIES.CREATE_API_KEY, {
        input: {
          name: newApiKey.name.trim(),
          provider: detectedProvider,
          keyValue: newApiKey.keyValue.trim(),
        }
      });

      toast({
        title: "Success",
        description: `API key created successfully (${detectedProvider.replace('_', ' ')})`,
      });

      // Reset form and close modal
      setNewApiKey({ name: '', keyValue: '' });
      setShowKeyValue(false);
      setShowCreateModal(false);
      
      // Reload API keys
      await loadApiKeys();
      
      // Auto-select the newly created key
      if (result?.data?.createApiKey?.keyValue) {
        setSelectedApiKeyValue(result.data.createApiKey.keyValue);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle open create modal
  const handleOpenCreateModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowApiKeyDropdown(false);
    setShowCreateModal(true);
  };

  // Provider badge colors
  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      openai: '#10b981',
      anthropic: '#8b5cf6',
      google: '#3b82f6',
      groq: '#ec4899',
      perplexity: '#f59e0b',
      xai: '#ef4444',
    
    };
    return colors[provider] || '#64748b';
  };

  // Configuration logic - account for variables mode
  const isConfigured = nodeData.isConfigured || (
    modelName && (
      selectedApiKeyValue || // Regular mode: API key selected
      apiKeyVariablesMode // Variables mode: just need text input
    )
  );

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
            title={TT('delete_model_node', lang)}
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
          
          {/* Model Name Input - First */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconSparkles size={16} />
                {TT('model_name', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <button
                onClick={toggleModelVariablesMode}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                  modelVariablesMode
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
            <div className="space-y-3">
              <Input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(modelVariablesMode ? e.target.value : e.target.value.toLowerCase())}
                placeholder={modelVariablesMode 
                  ? "e.g., {{MODEL_NAME}} or ${model}" 
                  : "e.g., gpt-4o, claude-3-5-sonnet-20241022"
                }
                className="w-full font-mono text-sm"
              />
            </div>
          </div>

          {/* Provider Selection - New Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                {TT('provider', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <button
                onClick={toggleProviderVariablesMode}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                  providerVariablesMode
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

            {providerVariablesMode ? (
              <Input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., {{PROVIDER}} or ${provider}"
                className="w-full font-mono text-sm"
              />
            ) : (
              <div className="relative" ref={providerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    provider
                      ? 'border-primary/40 bg-primary/5' 
                      : isDark 
                      ? 'border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700' 
                      : 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-lg`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="dark:text-white text-zinc-800 font-medium">
                      {provider ? provider.replace('_', ' ').toLowerCase() : TT('select', lang)}
                    </span>
                  </div>
                  <IconChevronDown size={16} className={`transition-transform duration-200 ${showProviderDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showProviderDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-2 border-2 rounded-xl shadow-2xl z-50 backdrop-blur-xl ${
                    isDark ? 'border-zinc-600 bg-zinc-800/95' : 'border-zinc-300 bg-white/95'
                  }`}>
                    <div className=" overflow-y-scroll scrollbar-thin scrollbar-track-transparent py-2">
                      {[
                        { id: 'openai', label: 'OpenAI' },
                        { id: 'anthropic', label: 'Anthropic' },
                        { id: 'google', label: 'Google' },
                        { id: 'groq', label: 'GROQ' },
                        { id: 'perplexity', label: 'Perplexity' },
                        { id: 'xai', label: 'XAI Grok' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setProvider(p.id); setShowProviderDropdown(false); }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center justify-between group transition-all duration-200 ${
                            provider === p.id ? 'bg-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md"
                              style={{ backgroundColor: getProviderColor(p.id) }}
                            >
                              {p.label}
                            </span>
                            <span className="font-medium">{p.label}</span>
                          </div>
                          {provider === p.id && <IconCheck size={14} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* API Key Selection - Second */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <IconKey size={16} />
                {TT('api_key', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <button
                onClick={toggleApiKeyVariablesMode}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                  apiKeyVariablesMode
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
            
            {/* Variables Mode - Text Input */}
            {apiKeyVariablesMode ? (
              <Input
                type="text"
                value={selectedApiKeyValue}
                onChange={(e) => setSelectedApiKeyValue(e.target.value)}
                placeholder="e.g., {{API_KEY}} or ${apiKey}"
                className="w-full font-mono text-sm"
              />
            ) : (
              /* Regular Mode - Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowApiKeyDropdown(!showApiKeyDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    selectedApiKey
                      ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-900/20' 
                      : isDark 
                      ? 'border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700' 
                      : 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-lg`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <IconKey size={16} className={selectedApiKey ? 'text-emerald-600' : 'text-tertiary'} />
                    {selectedApiKey ? (
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-medium">{selectedApiKey.name}</span>
                        <span 
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md"
                          style={{ backgroundColor: getProviderColor(selectedApiKey.provider) }}
                        >
                          {selectedApiKey.provider.replace('_', ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-tertiary font-medium">{TT('select_api_key', lang)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedApiKey && (
                      <button
                        onClick={handleApiKeyRemove}
                        className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                          isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-500/20 text-red-500'
                        }`}
                        title="Remove API key"
                      >
                        <IconX size={14} />
                      </button>
                    )}
                    <IconChevronDown size={16} className={`transition-transform duration-200 ${showApiKeyDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {showApiKeyDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-2 border-2 rounded-xl shadow-2xl z-50 backdrop-blur-xl ${
                    isDark ? 'border-zinc-600 bg-zinc-800/95' : 'border-zinc-300 bg-white/95'
                  }`}>
                    {apiKeysLoading ? (
                      <div className="px-4 py-3 text-sm text-tertiary flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        {TT('loading', lang)}...
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <>
                        <div className="px-4 py-3 text-sm text-tertiary">{TT('no_api_keys_found', lang)}</div>
                        {/* Create API Key Option - Always visible when no keys */}
                        <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                          <button
                            onClick={handleOpenCreateModal}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center gap-3 text-primary transition-all duration-200 font-medium`}
                          >
                            <IconPlus size={14} className="flex-shrink-0" />
                            <span>{TT('create_api_key', lang)}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Scrollable API Keys List */}
                        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                          {selectedApiKey && (
                            <div className="sticky top-0 z-10">
                              <button
                                onClick={handleApiKeyRemove}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-red-500/10 flex items-center gap-3 text-red-600 dark:text-red-400 transition-all duration-200 border-b ${
                                  isDark 
                                    ? 'border-zinc-700 bg-zinc-800/95 backdrop-blur-sm' 
                                    : 'border-zinc-200 bg-white/95 backdrop-blur-sm'
                                }`}
                              >
                                <IconX size={14} />
                                <span className="font-medium">{TT('remove_api_key', lang)}</span>
                              </button>
                            </div>
                          )}
                          <div className="py-2">
                            {apiKeys.map((apiKey: ApiKey) => (
                              <button
                                key={apiKey.id}
                                onClick={() => handleApiKeySelect(apiKey)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center justify-between group transition-all duration-200 ${
                                  selectedApiKeyValue === apiKey.keyValue ? 'bg-primary/20' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <IconKey size={14} className="flex-shrink-0" />
                                  <span className="font-medium truncate">{apiKey.name}</span>
                                  <span 
                                    className="px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md flex-shrink-0"
                                    style={{ backgroundColor: getProviderColor(apiKey.provider) }}
                                  >
                                    {apiKey.provider.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                  {selectedApiKeyValue === apiKey.keyValue && (
                                    <IconCheck size={14} className="text-emerald-500" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Create API Key Option - Fixed at bottom */}
                        <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                          <button
                            onClick={handleOpenCreateModal}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center gap-3 text-primary transition-all duration-200 font-medium`}
                          >
                            <IconPlus size={14} className="flex-shrink-0" />
                            <span>{TT('create_api_key', lang)}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
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
                {TT('model_configured_ready', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_api_key_model', lang)}
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
              <IconSparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-tertiary">{TT('model', lang)}</span>
              <span className="font-mono font-semibold text-sm truncate flex-1 text-primary">{modelName}</span>
              {modelVariablesMode && (
                <IconMath size={12} className="text-primary" title="Variables mode" />
              )}
            </div>
            {(selectedApiKey && !apiKeyVariablesMode) || provider ? (
              <div className="flex items-center gap-3">
                <IconKey size={14} className="text-primary" />
                <span className="text-xs font-medium text-tertiary">{TT('provider', lang)}</span>
                {selectedApiKey && !apiKeyVariablesMode ? (
                  <span 
                    className="px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md"
                    style={{ backgroundColor: getProviderColor(selectedApiKey.provider) }}
                  >
                    {selectedApiKey.provider.replace('_', ' ')}
                  </span>
                ) : (
                  provider && (
                    <span 
                      className="px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md"
                      style={{ backgroundColor: getProviderColor(provider) }}
                    >
                      {provider.replace('_', ' ')}
                    </span>
                  )
                )}
              </div>
            ) : null}
            {apiKeyVariablesMode && selectedApiKeyValue && (
              <div className="flex items-center gap-3">
                <IconMath size={14} className="text-primary" />
                <span className="text-xs font-medium text-tertiary">Variable:</span>
                <span className="font-mono font-semibold text-sm truncate flex-1 text-primary">{selectedApiKeyValue}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewApiKey({ name: '', keyValue: '' });
          setShowKeyValue(false);
        }}
        title={TT('create_api_key', lang)}
        size="md"
      >
        <div className="space-y-4">
          {/* API Key Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {TT('api_key_name', lang)} <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={newApiKey.name}
              onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
              placeholder={TT('enter_api_key_name', lang)}
              className="w-full"
            />
          </div>

          {/* API Key Value */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {TT('api_key_value', lang)} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showKeyValue ? "text" : "password"}
                value={newApiKey.keyValue}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, keyValue: e.target.value }))}
                placeholder={TT('enter_api_key_value', lang)}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKeyValue(!showKeyValue)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-tertiary hover:text-primary transition-colors"
              >
                {showKeyValue ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            {newApiKey.keyValue && (
              <div className="mt-2 text-xs text-tertiary">
                {TT('detected_provider', lang)}: <span className="font-semibold text-primary">{detectProvider(newApiKey.keyValue).replace('_', ' ')}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setNewApiKey({ name: '', keyValue: '' });
                setShowKeyValue(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDark 
                  ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300' 
                  : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
              }`}
            >
              {TT('cancel', lang)}
            </button>
            <button
              type="button"
              onClick={handleCreateApiKey}
              disabled={createLoading || !newApiKey.name.trim() || !newApiKey.keyValue.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                createLoading || !newApiKey.name.trim() || !newApiKey.keyValue.trim()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {createLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {TT('create', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
