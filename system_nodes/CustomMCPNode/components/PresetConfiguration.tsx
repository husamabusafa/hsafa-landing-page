import React from 'react';
import { IconLink, IconKey, IconTool } from '@tabler/icons-react';
import { Input } from '@components/ui/input';
import { TT } from '@functions/TranslateTerm';
import { MCP_PRESETS } from '../constants';

interface PresetConfigurationProps {
  selectedPreset: string;
  mcpUrl: string;
  mcpAuth: string;
  onUrlChange: (value: string) => void;
  onAuthChange: (value: string) => void;
  lang: string;
}

export const PresetConfiguration: React.FC<PresetConfigurationProps> = ({
  selectedPreset,
  mcpUrl,
  mcpAuth,
  onUrlChange,
  onAuthChange,
  lang
}) => {
  if (!selectedPreset) return null;

  const preset = MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS];
  if (!preset) return null;

  switch (selectedPreset) {
    case 'postgresql':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('database_url', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="postgresql://user:password@host:5432/database"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_mongodb_uri', lang).replace('MongoDB', 'PostgreSQL').replace('mongodb://user:pass@localhost:27017/mydb', 'postgresql://user:password@host:5432/database').replace('MongoDB connection URI', 'PostgreSQL connection string')}
            </p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconTool size={16} />
              {TT('access_mode', lang)}
            </label>
            <div className="text-xs text-muted-foreground">
              <strong>{TT('available_tools', lang)}:</strong> list_schemas, get_object_details, execute_sql, explain_query, get_top_queries, analyze_workload_indexes, analyze_query_indexes, analyze_db_health
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>{TT('features_capabilities', lang)}:</strong> {TT('crystal_dba_features', lang)}
            </div>
          </div>
        </div>
      );

    case 'mysql':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('mcp_host', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="localhost"
              className="w-full font-mono text-sm"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              {TT('username_and_password', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="username:password"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_username_password_colon', lang)}
            </p>
          </div>
        </div>
      );

    case 'mongodb':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('mongodb_uri', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="mongodb://localhost:27017/mydatabase"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_mongodb_uri', lang)}
            </p>
          </div>
        </div>
      );

    case 'redis':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('redis_url', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="redis://localhost:6379"
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_redis_url', lang)}
            </p>
          </div>
        </div>
      );

    case 'elasticsearch':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('elasticsearch_url', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="http://localhost:9200"
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_elasticsearch_url', lang)}
            </p>
          </div>
        </div>
      );

    case 'supabase':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              {TT('supabase_project_url', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full font-mono text-sm"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              {TT('service_role_key', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {TT('enter_supabase_service_role_key', lang)}
            </p>
          </div>
        </div>
      );

    case 'github':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              {TT('github_personal_access_token', lang)}
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="ghp_your_github_token_here"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              {TT('create_github_personal_access_token', lang)}
            </p>
          </div>
        </div>
      );

    case 'slack':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Slack Credentials
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="xoxp-your-user-token or xoxc-session-token,xoxd-cookie"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Provide either a user OAuth token (<code>xoxp-…</code>) or a pair of session tokens (<code>xoxc-…,xoxd-…</code>). Use <code>demo</code> to run in offline demo mode.
            </p>
          </div>
        </div>
      );

    case 'google-drive':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Google OAuth Credentials
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="client_id,client_secret"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter client ID and client secret separated by comma from Google Cloud Console
            </p>
          </div>
        </div>
      );

    case 'amazon-s3':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              AWS Credentials
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="AKIA...,wJalr...,us-east-1 (region optional)"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter Access Key, Secret Key, and optional region separated by commas
            </p>
          </div>
        </div>
      );

    case 'airtable':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Airtable Personal Access Token
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="pat_your_airtable_token_here"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Create a Personal Access Token at Airtable Account → Developer Hub
            </p>
          </div>
        </div>
      );

    case 'stripe':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Stripe Secret Key
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="sk_live_your_stripe_secret_key"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Stripe secret key from the Dashboard → Developers → API keys
            </p>
          </div>
        </div>
      );

    case 'microsoft-365':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Azure App Registration
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="client_id,client_secret,tenant_id"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter Client ID, Client Secret, and Tenant ID separated by commas from Azure Portal
            </p>
          </div>
        </div>
      );

    case 'markitdown':
      return (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            MarkItDown MCP runs locally and requires no credentials. Optionally provide comma-separated <code>KEY=VALUE</code> pairs to expose environment variables (for example, <code>OPENAI_API_KEY=...</code>).
          </p>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconKey size={16} />
              Environment Overrides (optional)
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="OPENAI_API_KEY=sk-...,AZURE_OPENAI_ENDPOINT=..."
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple variables with commas. Leave empty to run with defaults.
            </p>
          </div>
        </div>
      );

    case 'sqlite':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              Database Path
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="./data.db"
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter the path to your SQLite database file. Example: ./data.db or /path/to/database.db
            </p>
          </div>
        </div>
      );

    case 'mssql':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <IconLink size={16} />
              Connection String
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Input
              value={mcpAuth}
              onChange={(e) => onAuthChange(e.target.value)}
              placeholder="Server=localhost;Database=mydb;User Id=sa;Password=yourpassword;"
              className="w-full font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter your SQL Server connection string with all required parameters
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center text-muted-foreground py-4">
          Configuration for {preset.name} is being set up...
        </div>
      );
  }
};
