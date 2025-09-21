import { MCPPreset, TransportOption } from './types';

// MCP Preset configurations - now pointing to local implementations
export const MCP_PRESETS: Record<string, MCPPreset> = {
  postgresql: {
    name: 'Crystal DBA Postgres MCP Pro',
    description: 'Advanced PostgreSQL MCP with health checks, index tuning, query plan analysis, and performance optimization',
    transport: 'stdio' as const,
    defaultCommand: 'postgres-mcp --access-mode=unrestricted',
    defaultUrl: '',
    workingDirectory: '',
    authMethod: 'Database URL',
    placeholder: 'postgresql://user:password@host:5432/database',
    setupInstructions: 'Crystal DBA Postgres MCP Pro is installed globally. Just provide your database connection URL.',
    docs: 'https://github.com/crystaldba/postgres-mcp',
    category: 'Database'
  },
  sqlite: {
    name: 'SQLite',
    description: 'Connect to SQLite databases for schema discovery and querying',
    transport: 'stdio' as const,
    defaultCommand: 'node src/filesystem/dist/index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mcp-servers',
    authMethod: 'Database Path',
    placeholder: './data.db',
    setupInstructions: 'Local MCP server is ready. Just provide your SQLite database path.',
    docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    category: 'Database'
  },
  mysql: {
    name: 'MySQL',
    description: 'Natural language querying of MySQL databases with multi-DB support',
    transport: 'stdio' as const,
    defaultCommand: 'node dist/index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mcp-server-mysql',
    authMethod: 'Environment Variables',
    placeholder: 'Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD',
    setupInstructions: 'Local MCP server is ready. Set your MySQL connection environment variables.',
    docs: 'https://github.com/benborla/mcp-server-mysql',
    category: 'Database'
  },
  mssql: {
    name: 'Microsoft SQL Server',
    description: 'Secure access to SQL Server with table listing and query execution',
    transport: 'stdio' as const,
    defaultCommand: 'python3 -m mssql_mcp_server',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mssql_mcp_server',
    authMethod: 'Connection String',
    placeholder: 'Server=localhost;Database=mydb;User Id=sa;Password=yourpassword;',
    setupInstructions: 'Local MCP server is ready. Just provide your SQL Server connection string.',
    docs: 'https://github.com/RichardHan/mssql_mcp_server',
    category: 'Database'
  },
  mongodb: {
    name: 'MongoDB',
    description: 'Connect to MongoDB/Atlas for querying and management',
    transport: 'stdio' as const,
    defaultCommand: 'node index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mongodb-mcp-server',
    authMethod: 'MongoDB URI',
    placeholder: 'mongodb://localhost:27017/mydatabase',
    setupInstructions: 'Local MCP server is ready. Just provide your MongoDB connection URI.',
    docs: 'https://www.mongodb.com/docs/mcp-server/',
    category: 'Database'
  },
  redis: {
    name: 'Redis',
    description: 'Work with Redis data structures and operations',
    transport: 'stdio' as const,
    defaultCommand: 'python3 src/main.py',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/REDIS-MCP-Server',
    authMethod: 'Redis URL',
    placeholder: 'redis://localhost:6379',
    setupInstructions: 'Local MCP server is ready. Just provide your Redis connection URL.',
    docs: 'https://redis.io/blog/introducing-model-context-protocol-mcp-for-redis/',
    category: 'Database'
  },
  elasticsearch: {
    name: 'Elasticsearch',
    description: 'Natural language access to Elasticsearch indices',
    transport: 'stdio' as const,
    defaultCommand: './target/debug/elasticsearch-core-mcp-server stdio',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mcp-server-elasticsearch',
    authMethod: 'Elasticsearch URL',
    placeholder: 'http://localhost:9200',
    setupInstructions: 'Local MCP server is ready. Just provide your Elasticsearch URL.',
    docs: 'https://github.com/elastic/mcp-server-elasticsearch',
    category: 'Search'
  },
  supabase: {
    name: 'Supabase',
    description: 'Connect to Supabase projects for database operations',
    transport: 'stdio' as const,
    defaultCommand: 'node index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/supabase-mcp-server',
    authMethod: 'Supabase Keys',
    placeholder: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    setupInstructions: 'Local MCP server is ready. Just provide your Supabase project URL and service key.',
    docs: 'https://supabase.com/blog/mcp-server',
    category: 'Database'
  },
  github: {
    name: 'GitHub',
    description: 'Read repositories, manage issues, and automate workflows',
    transport: 'stdio' as const,
    defaultCommand: '/Users/Husam/Dev/hsafa/server/mcps/github-mcp-server/github-mcp-server stdio',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/github-mcp-server',
    authMethod: 'GitHub Token',
    placeholder: 'ghp_your_github_token_here',
    setupInstructions: 'Local MCP server is ready. Just provide your GitHub personal access token.',
    docs: 'https://github.com/github/github-mcp-server',
    category: 'Developer Tools'
  },
  slack: {
    name: 'Slack',
    description: 'Interact with Slack workspaces, channels, and messages',
    transport: 'stdio' as const,
    defaultCommand: '/Users/Husam/Dev/hsafa/server/mcps/slack-mcp-server/slack-mcp-server stdio',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/slack-mcp-server',
    authMethod: 'Slack Tokens',
    placeholder: 'Set SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET',
    setupInstructions: 'Local MCP server is ready. Just provide your Slack bot token and signing secret.',
    docs: 'https://github.com/korotovsky/slack-mcp-server',
    category: 'Communication'
  },
  'google-drive': {
    name: 'Google Drive',
    description: 'List, search, and read Google Drive files including Sheets',
    transport: 'stdio' as const,
    defaultCommand: 'node index.ts',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/mcp-gdrive',
    authMethod: 'OAuth Credentials',
    placeholder: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
    setupInstructions: 'Local MCP server is ready. Just provide your Google OAuth credentials.',
    docs: 'https://github.com/isaacphi/mcp-gdrive',
    category: 'Cloud Storage'
  },
  'amazon-s3': {
    name: 'Amazon S3',
    description: 'Work with S3 buckets and objects',
    transport: 'stdio' as const,
    defaultCommand: 's3-mcp-server',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/sample-mcp-server-s3',
    authMethod: 'AWS Credentials',
    placeholder: 'Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY',
    setupInstructions: 'Local MCP server is ready. Just provide your AWS credentials.',
    docs: 'https://github.com/aws-samples/sample-mcp-server-s3',
    category: 'Cloud Storage'
  },
  airtable: {
    name: 'Airtable',
    description: 'Read and write Airtable bases with schema introspection',
    transport: 'stdio' as const,
    defaultCommand: 'node dist/index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/airtable-mcp-server',
    authMethod: 'Airtable API Key',
    placeholder: 'pat_your_airtable_token_here',
    setupInstructions: 'Local MCP server is ready. Just provide your Airtable personal access token.',
    docs: 'https://github.com/domdomegg/airtable-mcp-server',
    category: 'Productivity'
  },
  stripe: {
    name: 'Stripe',
    description: 'Call Stripe APIs and search knowledge base',
    transport: 'stdio' as const,
    defaultCommand: 'node index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/stripe-mcp-server',
    authMethod: 'Stripe API Key',
    placeholder: 'sk_live_your_stripe_secret_key',
    setupInstructions: 'Local MCP server is ready. Just provide your Stripe API key.',
    docs: 'https://docs.stripe.com/mcp',
    category: 'Payment'
  },
  'microsoft-365': {
    name: 'Microsoft 365',
    description: 'Access Microsoft Graph API for Office 365 services',
    transport: 'stdio' as const,
    defaultCommand: 'node dist/index.js',
    workingDirectory: '/Users/husam/Dev/hsafa/server/mcps/ms-365-mcp-server',
    authMethod: 'Azure App Registration',
    placeholder: 'Set AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID',
    setupInstructions: 'Local MCP server is ready. Just provide your Azure app registration credentials.',
    docs: 'https://github.com/Softeria/ms-365-mcp-server',
    category: 'Productivity'
  },
  markitdown: {
    name: 'MarkItDown Converter',
    description: 'Convert PDFs, Office documents, images, audio, and more into Markdown using Microsoft\'s MarkItDown.',
    transport: 'stdio' as const,
    defaultCommand: 'python3 -m markitdown_mcp',
    workingDirectory: '/Users/husam/Dev/hsafa',
    authMethod: 'Optional env variables',
    placeholder: 'OPENAI_API_KEY=sk-...,AZURE_OPENAI_KEY=...',
    setupInstructions: 'MarkItDown MCP is installed via pip. Optionally provide KEY=VALUE pairs (comma separated) to set env vars such as OPENAI_API_KEY for image descriptions.',
    docs: 'https://github.com/microsoft/markitdown',
    category: 'Documents'
  }
};

export const transportOptions: TransportOption[] = [
  { value: 'http', label: 'HTTP' },
  { value: 'sse', label: 'Server-Sent Events' },
  { value: 'stdio', label: 'Standard I/O' }
];
