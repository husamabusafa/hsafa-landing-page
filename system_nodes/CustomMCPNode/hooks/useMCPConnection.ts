import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowContext } from '@contexts/FlowContext';
import { toast } from '@components/ui/use-toast';
import { TT } from '@functions/TranslateTerm';
import { MCP_PRESETS } from '../constants';
import { CustomMCPNodeData } from '../types';

interface UseMCPConnectionProps {
  id: string | undefined;
  selectedPreset: string;
  mcpUrl: string;
  mcpAuth: string;
  lang: string;
  createToolNodes: (tools: any[]) => void;
}

export const useMCPConnection = ({
  id,
  selectedPreset,
  mcpUrl,
  mcpAuth,
  lang,
  createToolNodes
}: UseMCPConnectionProps) => {
  const { isFlowReady, updateNodeData } = useFlowContext();
  const { getNodes, setNodes, setEdges } = useReactFlow();

  // Handle MCP connection test - now using local MCP servers
  const handleTestConnection = useCallback(async () => {
    if (!id || !isFlowReady || !selectedPreset) return;

    // Get current fresh node data
    const currentNodes = getNodes();
    const currentNode = currentNodes.find(n => n.id === id);
    const currentNodeData = (currentNode?.data || {}) as CustomMCPNodeData;

    const hydratedNodeData: CustomMCPNodeData = {
      ...currentNodeData,
      mcpUrl,
      mcpAuth,
    };

    // Only update connection status, preserve everything else
    updateNodeData(id, {
      ...hydratedNodeData,
      connectionStatus: 'connecting',
    });

    try {
      // Prepare environment variables based on the input
      const env: { [key: string]: string } = {};

      // Set environment variables based on the preset type
      if (selectedPreset === 'postgresql') {
        if (mcpUrl) env.DATABASE_URL = mcpUrl;
      } else if (selectedPreset === 'mysql') {
        if (mcpUrl) env.MYSQL_HOST = mcpUrl;
        if (mcpAuth) {
          const [user, password] = mcpAuth.split(':');
          if (user) env.MYSQL_USER = user;
          if (password) env.MYSQL_PASSWORD = password;
        }
      } else if (selectedPreset === 'mssql') {
        if (mcpAuth) {
          const parts = mcpAuth.split(';').map(part => part.trim()).filter(Boolean);
          const config: Record<string, string> = {};
          for (const part of parts) {
            const [key, ...rest] = part.split('=');
            if (!key || rest.length === 0) continue;
            config[key.trim().toLowerCase()] = rest.join('=').trim();
          }

          if (config['server']) env.MSSQL_SERVER = config['server'];
          if (config['data source']) env.MSSQL_SERVER = config['data source'];
          if (config['address']) env.MSSQL_SERVER = config['address'];
          if (config['host']) env.MSSQL_SERVER = config['host'];
          if (config['database']) env.MSSQL_DATABASE = config['database'];
          if (config['initial catalog']) env.MSSQL_DATABASE = config['initial catalog'];
          if (config['user id'] || config['uid']) env.MSSQL_USER = config['user id'] || config['uid'];
          if (config['password'] || config['pwd']) env.MSSQL_PASSWORD = config['password'] || config['pwd'];
          if (config['port']) env.MSSQL_PORT = config['port'];
          if (config['encrypt']) env.MSSQL_ENCRYPT = config['encrypt'];
          if (config['trustservercertificate']) env.MSSQL_TRUST_SERVER_CERTIFICATE = config['trustservercertificate'];
        }
      } else if (selectedPreset === 'mongodb') {
        if (mcpUrl) env.MONGODB_URI = mcpUrl;
      } else if (selectedPreset === 'redis') {
        if (mcpUrl) env.REDIS_URL = mcpUrl;
      } else if (selectedPreset === 'elasticsearch') {
        if (mcpUrl) env.ELASTICSEARCH_URL = mcpUrl;
      } else if (selectedPreset === 'supabase') {
        if (mcpUrl) env.SUPABASE_URL = mcpUrl;
        if (mcpAuth) env.SUPABASE_SERVICE_ROLE_KEY = mcpAuth;
      } else if (selectedPreset === 'github') {
        if (mcpAuth) env.GITHUB_TOKEN = mcpAuth;
      } else if (selectedPreset === 'slack') {
        if (mcpAuth) {
          const tokens = mcpAuth.split(',').map(part => part.trim()).filter(Boolean);

          if (tokens.length === 1 && tokens[0].toLowerCase() === 'demo') {
            env.SLACK_MCP_XOXP_TOKEN = 'demo';
          } else if (tokens.length === 1 && tokens[0].startsWith('xoxp-')) {
            env.SLACK_MCP_XOXP_TOKEN = tokens[0];
          } else if (tokens.length >= 2 && tokens[0].startsWith('xoxc-') && tokens[1].startsWith('xoxd-')) {
            env.SLACK_MCP_XOXC_TOKEN = tokens[0];
            env.SLACK_MCP_XOXD_TOKEN = tokens[1];
          } else {
            const [botToken, signingSecret] = tokens;
            if (botToken) env.SLACK_BOT_TOKEN = botToken;
            if (signingSecret) env.SLACK_SIGNING_SECRET = signingSecret;
          }
        }

        if (!env.SLACK_MCP_USERS_CACHE) {
          env.SLACK_MCP_USERS_CACHE = '.users_cache.json';
        }
        if (!env.SLACK_MCP_CHANNELS_CACHE) {
          env.SLACK_MCP_CHANNELS_CACHE = '.channels_cache.json';
        }
      } else if (selectedPreset === 'google-drive') {
        if (mcpAuth) {
          const [clientId, clientSecret] = mcpAuth.split(',');
          if (clientId) env.GOOGLE_CLIENT_ID = clientId.trim();
          if (clientSecret) env.GOOGLE_CLIENT_SECRET = clientSecret.trim();
        }
      } else if (selectedPreset === 'amazon-s3') {
        if (mcpAuth) {
          const [accessKey, secretKey, region] = mcpAuth.split(',');
          if (accessKey) env.AWS_ACCESS_KEY_ID = accessKey.trim();
          if (secretKey) env.AWS_SECRET_ACCESS_KEY = secretKey.trim();
          if (region) env.AWS_REGION = region.trim();
        }
        if (!env.AWS_REGION) env.AWS_REGION = 'us-east-1';
        if (!env.AWS_DEFAULT_REGION) env.AWS_DEFAULT_REGION = env.AWS_REGION;
      } else if (selectedPreset === 'airtable') {
        if (mcpAuth) env.AIRTABLE_API_KEY = mcpAuth;
      } else if (selectedPreset === 'stripe') {
        if (mcpAuth) env.STRIPE_API_KEY = mcpAuth;
      } else if (selectedPreset === 'microsoft-365') {
        if (mcpAuth) {
          const [clientId, clientSecret, tenantId] = mcpAuth.split(',');
          if (clientId) env.AZURE_CLIENT_ID = clientId.trim();
          if (clientSecret) env.AZURE_CLIENT_SECRET = clientSecret.trim();
          if (tenantId) env.AZURE_TENANT_ID = tenantId.trim();
        }
      } else if (selectedPreset === 'markitdown') {
        if (mcpAuth) {
          const pairs = mcpAuth.split(',');
          pairs.forEach(pair => {
            const [key, ...rest] = pair.split('=');
            if (!key || rest.length === 0) return;
            env[key.trim()] = rest.join('=').trim();
          });
        }
      }

      // Start the MCP server
      const startResponse = await fetch('/api/mcp/start-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverType: selectedPreset,
          config: { env }
        })
      });

      if (!startResponse.ok) {
        const startError = await startResponse.text();
        throw new Error(`Failed to start MCP server: ${startError}`);
      }

      const startResult = await startResponse.json();

      if (startResult.success) {
        // Now test the connection by calling the MCP server directly
        let testCommand: string;
        let testArgs: string[];
        if (selectedPreset === 'postgresql') {
          // For postgres MCP, use full path and pass database URL as positional argument
          testCommand = '/Users/husam/.local/bin/postgres-mcp';
          testArgs = ['--access-mode=unrestricted', mcpUrl];
        } else {
          // For other presets, use the default command and empty args
          const defaultCommand = MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS].defaultCommand || '';
          if (defaultCommand.includes(' ')) {
            const [cmd, ...cmdArgs] = defaultCommand.split(/\s+/);
            testCommand = cmd;
            testArgs = cmdArgs;
          } else {
            testCommand = defaultCommand;
            testArgs = [];
          }
        }

        const testResponse = await fetch('/api/mcp/test-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transport: MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS].transport,
            url: startResult.url || mcpUrl,
            command: testCommand,
            args: testArgs,
            auth: mcpAuth,
            serverType: selectedPreset,
            env: env
          })
        });

        if (!testResponse.ok) {
          const testError = await testResponse.text();
          throw new Error(`MCP server started but connection test failed: ${testError}`);
        }

        const testResult = await testResponse.json();

        if (testResult.success) {
          // Get fresh data and update with success
          const freshNodes = getNodes();
          const freshNode = freshNodes.find(n => n.id === id);
          const freshNodeData = (freshNode?.data || {}) as CustomMCPNodeData;

          const tools = testResult.tools || [];

          updateNodeData(id, {
            ...freshNodeData,
            mcpUrl,
            mcpAuth,
            connectionStatus: 'connected',
            isConnected: true,
            mcpTools: tools,
            lastError: undefined,
          });

          // Create tool nodes
          if (tools.length > 0) {
            createToolNodes(tools);
          }

          toast({
            title: TT('connection_successful', lang),
            description: `${MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS]?.name} MCP server started and ${testResult.tools?.length || 0} tools discovered`,
          });
        } else {
          throw new Error(testResult.error || 'MCP connection test failed');
        }
      } else {
        throw new Error(startResult.error || 'Failed to start MCP server');
      }
    } catch (error: any) {
      // Get fresh data and update with error
      const freshNodes = getNodes();
      const freshNode = freshNodes.find(n => n.id === id);
      const freshNodeData = (freshNode?.data || {}) as CustomMCPNodeData;

      // Clear discovered tools and remove tool nodes on connection failure
      const toolNodes = freshNodes.filter(n => n.id.startsWith(`${id}-tool-`) || n.id === `${id}-more-tools`);
      const toolNodeIds = toolNodes.map(n => n.id);

      // Remove tool nodes
      setNodes(nodes => nodes.filter(n => !toolNodeIds.includes(n.id)));

      // Remove edges connected to tool nodes
      setEdges(edges => edges.filter(edge => !toolNodeIds.includes(edge.source) && !toolNodeIds.includes(edge.target)));

      updateNodeData(id, {
        ...freshNodeData,
        mcpUrl,
        mcpAuth,
        connectionStatus: 'error',
        isConnected: false,
        mcpTools: [], // Clear tools on error
        lastError: error.message,
      });

      toast({
        title: TT('connection_failed', lang),
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [id, isFlowReady, selectedPreset, mcpUrl, mcpAuth, getNodes, updateNodeData, lang, createToolNodes, setNodes, setEdges]);

  return {
    handleTestConnection
  };
};
