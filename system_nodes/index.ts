// Configuration Nodes (with top handles)
import ModelNode from './ModelNode';
import TemperatureNode from './TemperatureNode';
import SystemPromptNode from './SystemPromptNode';
import PromptNode from './PromptNode';

import MaxItemsNode from './MaxItemsNode';
import ResponseStructureNode from './ResponseStructureNode';
import CustomUIComponentNode from './CustomUIComponentNode';
import ActionNode from './ActionNode';

// Tool Nodes (with bottom handles)
import CustomMCPNode from './CustomMCPNode';
import MCPToolNode from './MCPToolNode';

// Export individual components
export {
  ModelNode,
  TemperatureNode,
  SystemPromptNode,
  PromptNode,

  MaxItemsNode,
  ResponseStructureNode,
  CustomUIComponentNode,
  ActionNode,
  CustomMCPNode,
  MCPToolNode
};

// Node type mapping for React Flow
export const nodeTypes = {
  model: ModelNode,
  temperature: TemperatureNode,
  system_prompt: SystemPromptNode,
  prompt: PromptNode,

  max_items: MaxItemsNode,
  response_structure: ResponseStructureNode,
  custom_ui_component: CustomUIComponentNode,
  // Backward compatibility: map legacy types to ActionNode
  action: ActionNode,
  custom_mcp: CustomMCPNode,
  mcpTool: MCPToolNode,
};
