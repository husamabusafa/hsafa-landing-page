import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { IconThermometer, IconChevronDown, IconTrash, IconMath, IconFlame, IconSnowflake, IconTarget } from '@tabler/icons-react';
import { useAppContext } from '@contexts/AppContext';
import { useFlowContext } from '@contexts/FlowContext';
import { Input } from '@components/ui/input';
import { TT } from '@functions/TranslateTerm';
import { getSystemNodeConfig } from '@/constants/icons';

export interface TemperatureNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  temperature?: number;
  isConfigured?: boolean;
  isExpanded?: boolean;
  variablesMode?: boolean;
}

export default function TemperatureNode({ data, selected, id }: NodeProps) {
  const { theme, lang } = useAppContext();
  const { updateNodeData, isFlowReady } = useFlowContext();
  const { setNodes } = useReactFlow();
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  
  // Type the data prop properly
  const nodeData = (data as TemperatureNodeData) || {};
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(nodeData.isExpanded || false);
  const [temperature, setTemperature] = useState(nodeData.temperature?.toString() || '');
  const [variablesMode, setVariablesMode] = useState(nodeData.variablesMode || false);
  
  
  // Get configuration from agentConfig.json
  const nodeConfig = getSystemNodeConfig('temperature', lang);
  
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
    const nextTemperature = nodeData.temperature?.toString() || '';
    const nextExpanded = !!nodeData.isExpanded;
    const nextVarsMode = !!nodeData.variablesMode;
    
    // Only update if values actually differ to prevent loops
    if (nextTemperature !== temperature) setTemperature(nextTemperature);
    if (nextExpanded !== isExpanded) setIsExpanded(nextExpanded);
    if (nextVarsMode !== variablesMode) setVariablesMode(nextVarsMode);
  }, [nodeData.temperature, nodeData.isExpanded, nodeData.variablesMode]);

  // Debounced persistence for temperature changes to avoid infinite loops
  useEffect(() => {
    if (!isFlowReady || !id) return;

    const timeoutId = setTimeout(() => {
      const isValidTemp = variablesMode
        ? !!temperature.trim()  // In variables mode, just check if there's any content
        : temperature.trim() !== '' && !isNaN(Number(temperature)) && Number(temperature) >= 0 && Number(temperature) <= 2;  // In regular mode, validate the number

      const parsedTemp = typeof temperature === 'string' && temperature.trim() !== ''
        ? Number(temperature)
        : (typeof temperature === 'number' ? temperature : undefined);

      const newData = {
        // In variables mode allow raw string; otherwise persist number or undefined (not empty string)
        temperature: variablesMode ? temperature : parsedTemp,
        isConfigured: isValidTemp,
        isExpanded,
        variablesMode,
      };

      // Only save if data has actually changed
      if (newData.temperature !== nodeData.temperature ||
          newData.isConfigured !== nodeData.isConfigured ||
          newData.isExpanded !== nodeData.isExpanded ||
          newData.variablesMode !== nodeData.variablesMode) {
        updateNodeData(id, newData);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [temperature, isExpanded, variablesMode, isFlowReady, id, nodeData.temperature, nodeData.isConfigured, nodeData.isExpanded, nodeData.variablesMode, updateNodeData]);

  // Handle temperature input change
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // In variables mode, allow any text input
    if (variablesMode) {
      setTemperature(value);
      return;
    }
    
    // For regular mode, only allow valid float patterns
    // Allow empty string, digits, and one decimal point
    const floatPattern = /^$|^\d*\.?\d*$/;
    
    // Check if the input matches the float pattern
    if (floatPattern.test(value)) {
      // Additional validation: ensure only one decimal point
      const decimalCount = (value.match(/\./g) || []).length;
      
      if (decimalCount <= 1) {
        // Validate range (0.0 - 2.0) if it's a complete number
        const numValue = parseFloat(value);
        if (value === '' || (numValue >= 0 && numValue <= 2) || value.endsWith('.')) {
          setTemperature(value);
        }
      }
    }
  };

  // Handle key down events for temperature input
  const handleTemperatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // In variables mode, allow all keys
    if (variablesMode) return;
    
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right arrows
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'Home', 'End', 'ArrowLeft', 'ArrowRight'
    ];
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey || e.metaKey) {
      const ctrlKeys = ['a', 'c', 'v', 'x', 'z'];
      if (ctrlKeys.includes(e.key.toLowerCase())) return;
    }
    
    // Allow numbers and decimal point
    const isNumber = /^[0-9]$/.test(e.key);
    const isDecimal = e.key === '.';
    
    // Check if decimal point already exists
    const currentValue = (e.target as HTMLInputElement).value;
    const hasDecimal = currentValue.includes('.');
    
    // Prevent multiple decimal points
    if (isDecimal && hasDecimal) {
      e.preventDefault();
      return;
    }
    
    // Allow only numbers, decimal point, and allowed keys
    if (!allowedKeys.includes(e.key) && !isNumber && !isDecimal) {
      e.preventDefault();
    }
  };

  // Handle temperature preset selection
  const handlePresetSelect = (preset: number) => {
    setTemperature(preset.toString());
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

  // Temperature presets
  const temperaturePresets = [
    { label: TT('conservative', lang), value: 0.1, icon: IconSnowflake, color: '#3b82f6' },
    { label: TT('balanced', lang), value: 0.7, icon: IconTarget, color: '#8b5cf6' },
    { label: TT('creative', lang), value: 1.0, icon: IconFlame, color: '#ef4444' },
  ];

  // Configuration logic
  const isConfigured = nodeData.isConfigured || (
    variablesMode
      ? !!temperature.trim()  // In variables mode, just check if there's any content
      : temperature.trim() !== '' && !isNaN(Number(temperature)) && Number(temperature) >= 0 && Number(temperature) <= 2  // In regular mode, validate the number
  );

  // Validation for display
  const tempValue = parseFloat(temperature);
  const showValidation = !variablesMode && temperature.trim() !== '' && (isNaN(tempValue) || tempValue < 0 || tempValue > 2);

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
        isExpanded ? 'min-h-[300px]' : ""
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
            title={TT('delete_temperature_node', lang)}
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
          
          {/* Temperature Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <NodeIcon size={16} />
                {TT('temperature_value', lang)}
                <span className="text-red-500 text-sm">*</span>
              </label>
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
            </div>
            <div className="space-y-3">
              <Input
                type={variablesMode ? "text" : "number"}
                value={temperature}
                onChange={handleTemperatureChange}
                onKeyDown={handleTemperatureKeyDown}
                placeholder={variablesMode 
                  ? "e.g., {{TEMPERATURE}} or ${temp}" 
                  : "Enter value (0.0 - 2.0)"
                }
                className={`w-full font-mono text-sm ${showValidation ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''} ${!variablesMode ? 'no-spinners' : ''}`}
                min={variablesMode ? undefined : "0"}
                max={variablesMode ? undefined : "2"}
                step={variablesMode ? undefined : "0.1"}
              />
              
              {/* Validation message */}
              {showValidation && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <NodeIcon size={12} />
                  {TT('set_temperature', lang)}
                </p>
              )}
              
              {/* Temperature help */}
              {!variablesMode && (
                <p className="text-xs text-tertiary">
                  {TT('temperature_range_help', lang)}
                </p>
              )}
              
              {/* Temperature presets - only show in regular mode */}
              {!variablesMode && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-tertiary">{TT('common_values', lang)}</span>
                  <div className="flex gap-2 flex-wrap">
                    {temperaturePresets.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.value}
                          onClick={() => handlePresetSelect(preset.value)}
                          className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border-2 transition-all duration-300 font-medium transform hover:scale-105 ${
                            parseFloat(temperature) === preset.value
                              ? 'bg-primary border-primary text-white shadow-lg'
                              : isDark 
                              ? 'border-zinc-600 bg-zinc-700/50 hover:border-primary/50 hover:bg-zinc-600 text-zinc-300' 
                              : 'border-zinc-300 bg-zinc-50/50 hover:border-primary/50 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <Icon size={12} style={{ color: parseFloat(temperature) === preset.value ? 'white' : preset.color }} />
                          {preset.label}
                          <span className="font-mono">{preset.value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
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
                {TT('temperature_configured', lang)}
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                {TT('requires_temperature', lang)}
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
              <NodeIcon size={14} className="text-primary" />
              <span className="text-xs font-medium text-tertiary">{TT('temperature', lang)}</span>
              <span className="font-mono font-semibold text-sm truncate flex-1 text-primary">
                {variablesMode ? temperature : `${temperature} / 2.0`}
              </span>
              {variablesMode && (
                <IconMath size={12} className="text-primary" title="Variables mode" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
