export interface CustomMCPNodeData {
  label?: string;
  color?: string;
  agentColor?: string;
  mcpUrl?: string;
  mcpAuth?: string;
  mcpTransport?: 'sse' | 'http' | 'stdio';
  mcpCommand?: string;
  mcpArgs?: string[];
  isConfigured?: boolean;
  isExpanded?: boolean;
  isConnected?: boolean;
  mcpTools?: Array<{
    name: string;
    description?: string;
    inputSchema?: any;
  }>;
  deactivatedTools?: string[]; // Array of tool names that are deactivated
  connectionStatus?: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastError?: string;
  variablesMode?: boolean;
  selectedPreset?: string;
}

export interface MCPPreset {
  name: string;
  description: string;
  transport: 'sse' | 'http' | 'stdio';
  defaultCommand: string;
  defaultUrl?: string;
  workingDirectory?: string;
  authMethod: string;
  placeholder: string;
  setupInstructions: string;
  docs: string;
  category: string;
}

export interface MCPLogoInfo {
  logoPath: string;
  color: string;
  bgColor: string;
  aspectRatio: 'square' | 'horizontal';
}

export interface TransportOption {
  value: 'http' | 'sse' | 'stdio';
  label: string;
}

export interface ToolToggleEvent extends React.MouseEvent {
  // Additional properties if needed
}
