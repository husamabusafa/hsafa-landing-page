import { MCPLogoInfo, CustomMCPNodeData } from './types';

// Get MCP service logo/icon
export const getMCPLogo = (serviceKey: string): MCPLogoInfo => {
  const logoPath = `/mcp_logos/${serviceKey}.svg`;

  switch (serviceKey) {
    case 'postgresql':
      return { logoPath, color: '#336791', bgColor: '#336791', aspectRatio: 'square' };
    case 'mysql':
      return { logoPath, color: '#4479A1', bgColor: '#4479A1', aspectRatio: 'horizontal' };
    case 'mongodb':
      return { logoPath, color: '#47A248', bgColor: '#47A248', aspectRatio: 'square' };
    case 'redis':
      return { logoPath, color: '#DC382D', bgColor: '#DC382D', aspectRatio: 'square' };
    case 'elasticsearch':
      return { logoPath, color: '#FEC514', bgColor: '#FEC514', aspectRatio: 'square' };
    case 'sqlite':
      return { logoPath: '/mcp_logos/postgresql.svg', color: '#003B57', bgColor: '#003B57', aspectRatio: 'square' }; // fallback to postgresql logo
    case 'mssql':
      return { logoPath: '/mcp_logos/microsoft-365.svg', color: '#CC2927', bgColor: '#CC2927', aspectRatio: 'square' }; // use microsoft logo as fallback
    case 'supabase':
      return { logoPath, color: '#3ECF8E', bgColor: '#3ECF8E', aspectRatio: 'square' };
    case 'github':
      return { logoPath, color: '#181717', bgColor: '#181717', aspectRatio: 'square' };
    case 'slack':
      return { logoPath, color: '#4A154B', bgColor: '#4A154B', aspectRatio: 'square' };
    case 'google-drive':
      return { logoPath, color: '#4285F4', bgColor: '#4285F4', aspectRatio: 'square' };
    case 'amazon-s3':
      return { logoPath, color: '#FF9900', bgColor: '#FF9900', aspectRatio: 'horizontal' };
    case 'airtable':
      return { logoPath, color: '#18BFFF', bgColor: '#18BFFF', aspectRatio: 'square' };
    case 'stripe':
      return { logoPath, color: '#635BFF', bgColor: '#635BFF', aspectRatio: 'horizontal' };
    case 'microsoft-365':
      return { logoPath, color: '#00BCF2', bgColor: '#00BCF2', aspectRatio: 'square' };
    case 'markitdown':
      return { logoPath, color: '#2563EB', bgColor: '#2563EB', aspectRatio: 'square' };
    default:
      return { logoPath: '/mcp_logos/postgresql.svg', color: '#6366f1', bgColor: '#6366f1', aspectRatio: 'square' }; // fallback to postgresql logo
  }
};

// Get configuration summary for collapsed view
export const getConfigurationSummary = (selectedPreset: string | undefined, mcpUrl: string, mcpAuth: string): string => {
  if (!selectedPreset) return 'custom';

  switch (selectedPreset) {
    case 'postgresql':
    case 'mongodb':
    case 'redis':
    case 'elasticsearch':
    case 'sqlite':
      return mcpUrl ? 'configured' : 'needs setup';

    case 'mysql':
      return (mcpUrl && mcpAuth) ? 'configured' : 'needs setup';

    case 'supabase':
      return (mcpUrl && mcpAuth) ? 'configured' : 'needs setup';

    case 'mssql':
      return mcpAuth ? 'configured' : 'needs setup';

    case 'markitdown':
      return 'configured';

    case 'github':
    case 'slack':
    case 'google-drive':
    case 'amazon-s3':
    case 'airtable':
    case 'stripe':
    case 'microsoft-365':
    case 'markitdown':
      return mcpAuth ? 'configured' : 'needs setup';

    default:
      return '';
  }
};

// Validate configuration based on selected preset
export const isConfigurationValid = (
  selectedPreset: string | undefined,
  mcpUrl: string | undefined,
  mcpAuth: string | undefined,
  mcpTransport: 'sse' | 'http' | 'stdio',
  mcpCommand: string | undefined
): boolean => {
  if (!selectedPreset) {
    // For custom MCP without preset, use original validation
    const url = (mcpUrl || '').trim();
    const cmd = (mcpCommand || '').trim();
    return (!!url && mcpTransport !== 'stdio') || (!!cmd && mcpTransport === 'stdio');
  }

  // Validate based on preset requirements
  switch (selectedPreset) {
    case 'postgresql':
    case 'mongodb':
    case 'redis':
    case 'elasticsearch':
    case 'sqlite':
      return (mcpUrl || '').trim().length > 0;

    case 'mysql':
      return (mcpUrl || '').trim().length > 0 && (mcpAuth || '').trim().length > 0;

    case 'supabase':
      return (mcpUrl || '').trim().length > 0 && (mcpAuth || '').trim().length > 0;

    case 'mssql':
      return (mcpAuth || '').trim().length > 0;

    case 'markitdown':
      return true;

    case 'github':
    case 'slack':
    case 'google-drive':
    case 'amazon-s3':
    case 'airtable':
    case 'stripe':
    case 'microsoft-365':
    case 'markitdown':
      return (mcpAuth || '').trim().length > 0;

    default:
      return false;
  }
};
