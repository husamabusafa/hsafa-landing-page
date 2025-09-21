import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowContext } from '@contexts/FlowContext';
import { CustomMCPNodeData } from '../types';

interface UseMCPToolsProps {
  id: string | undefined;
  color: string;
  agentColor: string;
  nodeData: CustomMCPNodeData;
}

export const useMCPTools = ({ id, color, agentColor, nodeData }: UseMCPToolsProps) => {
  const { isFlowReady, updateNodeData, updateNodePositions } = useFlowContext();
  const { getNodes, setNodes, setEdges } = useReactFlow();

  // Create tool nodes connected to MCP node (max 6 nodes)
  const createToolNodes = useCallback((tools: any[], isExpanded?: boolean) => {
    if (!id) return;

    const nodes = getNodes();
    const mcpNode = nodes.find(n => n.id === id);
    if (!mcpNode) return;

    // Remove existing tool nodes
    const existingToolNodes = nodes.filter(n => n.id.startsWith(`${id}-tool-`) || n.id === `${id}-more-tools`);
    const toolNodeIds = existingToolNodes.map(n => n.id);

    setNodes(nodes => nodes.filter(n => !toolNodeIds.includes(n.id)));

    // Determine how many nodes to show (max 6)
    const maxVisibleTools = 6;
    const showMoreNode = tools.length > maxVisibleTools;
    const visibleTools = showMoreNode ? tools.slice(0, 5) : tools.slice(0, maxVisibleTools);
    const totalNodes = showMoreNode ? 6 : visibleTools.length;

    // Calculate positioning - center the nodes under the MCP node
    const toolWidth = 200;
    const spacing = 20;
    const totalWidth = (totalNodes * toolWidth) + ((totalNodes - 1) * spacing);
    const startX = mcpNode.position.x - (totalWidth / 2) + (toolWidth / 2);
    
    // Initial creation position: always 880px below the MCP node
    const yOffset = 880;

    // Create tool nodes
    const newNodes = visibleTools.map((tool, index) => {
      const isDeactivated = nodeData.deactivatedTools?.includes(tool.name);

      return {
        id: `${id}-tool-${tool.name}`,
        type: 'mcpTool',
        position: {
          x: startX + (index * (toolWidth + spacing)),
          y: mcpNode.position.y + yOffset // Initial placement
        },
        data: {
          label: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          mcpParent: id,
          isMcpTool: true,
          isDeactivated: isDeactivated,
          agentColor: agentColor,
          mcpColor: color
        },
        draggable: true,
        selectable: true,
        deletable: false,
        // Avoid transform transitions to keep dragging and repositioning snappy
        style: {}
      };
    });

    // Add "more" node if needed
    if (showMoreNode) {
      newNodes.push({
        id: `${id}-more-tools`,
        type: 'mcpTool', // Use the same type as regular tool nodes
        position: {
          x: startX + (5 * (toolWidth + spacing)), // 6th position
          y: mcpNode.position.y + yOffset
        },
        data: {
          label: `+${tools.length - 5} more`,
          tools: tools,
          description: `View all ${tools.length} tools`,
          mcpParent: id,
          isMoreToolsNode: true,
          totalToolsCount: tools.length,
          agentColor: agentColor,
          mcpColor: color,
        } as any, // Type assertion to allow additional properties
        draggable: true,
        selectable: true,
        deletable: false,
        // Avoid transform transitions to keep dragging and repositioning snappy
        style: {}
      });
    }

    // Auto-create edges from MCP (bottom) to each tool (top) so they are always connected
    const newEdges = newNodes.map((node) => ({
      id: `${id}-to-${node.id.split('-').pop()}`,
      source: id,
      sourceHandle: 'mcp-tools',
      target: node.id,
      targetHandle: 'tool-input',
      type: 'default',
      animated: true,
      style: { stroke: agentColor || '#3b82f6', strokeWidth: 2 },
      deletable: false,
      selectable: false,
      focusable: false,
      data: { isMcpConnection: true, allowDelete: false },
    }));

    setNodes(nodes => [...nodes, ...newNodes]);
    setEdges(edges => [
      // remove any previous edges from this MCP to its tools to avoid dups
      ...edges.filter(e => !(e.source === id && e.id?.startsWith(`${id}-to-`))),
      ...newEdges,
    ]);

    // Mark tools position state as expanded baseline since initial placement is 880
    updateNodeData(id, {
      ...(mcpNode.data as any),
      toolsPositionState: 'expanded'
    });
  }, [id, getNodes, setNodes, setEdges, color, agentColor, nodeData.deactivatedTools]);

  // Reposition existing tool nodes when MCP node expands/collapses
  const repositionToolNodes = useCallback((isExpanded: boolean) => {
    if (!id) return;

    const nodes = getNodes();
    const mcpNode = nodes.find(n => n.id === id);
    if (!mcpNode) return;

    // Find existing tool nodes
    const toolNodes = nodes.filter(n => n.id.startsWith(`${id}-tool-`) || n.id === `${id}-more-tools`);
    if (toolNodes.length === 0) return;

    // Determine current applied state (default to 'expanded' since initial placement is 880)
    const currentState: 'expanded' | 'collapsed' = ((mcpNode.data as any)?.toolsPositionState === 'collapsed') ? 'collapsed' : 'expanded';
    const desiredState: 'expanded' | 'collapsed' = isExpanded ? 'expanded' : 'collapsed';
    if (currentState === desiredState) return; // No movement needed

    // Compute relative delta: expand => +280, collapse => -280
    const dy = desiredState === 'expanded' ? 280 : -280;

    const updates = toolNodes.map(n => ({ id: n.id, dy }));

    if (typeof updateNodePositions === 'function') {

      updateNodePositions(updates);
    } else {
      // Fallback: directly adjust positions
      setNodes(currentNodes => 
        currentNodes.map(node => {
          if (toolNodes.some(toolNode => toolNode.id === node.id)) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y + dy
              }
            } as any;
          }
          return node as any;
        })
      );
    }

    // Record applied state to avoid repeated movement for same state
    updateNodeData(id, {
      ...(mcpNode.data as any),
      toolsPositionState: desiredState
    });
  }, [id, getNodes, setNodes, updateNodeData, updateNodePositions]);

  // Toggle tool activation
  const handleToggleTool = useCallback((toolName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!id || !isFlowReady) return;

    // Get fresh node data to avoid stale closure
    const currentNodes = getNodes();
    const currentNode = currentNodes.find(n => n.id === id);
    if (!currentNode) return;

    const currentNodeData = currentNode.data as CustomMCPNodeData;
    const currentDeactivated = currentNodeData.deactivatedTools || [];
    const isCurrentlyDeactivated = currentDeactivated.includes(toolName);

    const newDeactivated = isCurrentlyDeactivated
      ? currentDeactivated.filter(name => name !== toolName)
      : [...currentDeactivated, toolName];

    // Only update deactivated tools, preserve everything else
    updateNodeData(id, {
      ...currentNodeData,
      deactivatedTools: newDeactivated
    });
  }, [id, isFlowReady, getNodes, updateNodeData]);

  return {
    createToolNodes,
    repositionToolNodes,
    handleToggleTool
  };
};
