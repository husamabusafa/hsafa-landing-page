import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import SystemPromptNode from '../SystemPromptNode';
import { FlowProvider } from '@contexts/FlowContext';
import { AppProvider } from '@contexts/AppContext';

// Mock the translation function
jest.mock('@functions/TranslateTerm', () => ({
  TT: (key: string) => key
}));

// Mock the icons
jest.mock('@/constants/icons', () => ({
  getSystemNodeConfig: () => ({
    name: 'System Prompt',
    color: '#3b82f6',
    icon: () => <div>Icon</div>
  })
}));

const mockUpdateNodeData = jest.fn();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    <ReactFlowProvider>
      <FlowProvider 
        updateNodeData={mockUpdateNodeData}
        isFlowReady={true}
        agentColor="#3b82f6"
      >
        {children}
      </FlowProvider>
    </ReactFlowProvider>
  </AppProvider>
);

describe('SystemPromptNode', () => {
  beforeEach(() => {
    mockUpdateNodeData.mockClear();
  });

  it('should not trigger infinite loops when opening and closing modal', async () => {
    const nodeData = {
      systemPrompt: 'Test prompt',
      isExpanded: false,
      variablesMode: false,
      isConfigured: true
    };

    render(
      <TestWrapper>
        <SystemPromptNode 
          data={nodeData}
          selected={false}
          id="test-node"
        />
      </TestWrapper>
    );

    // Expand the node first
    const nodeContainer = screen.getByText('System Prompt').closest('div[dir]');
    fireEvent.click(nodeContainer!);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
    });

    // Open modal
    const modalButton = screen.getByTitle('Open full-screen editor');
    fireEvent.click(modalButton);

    // Close modal immediately
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    // Verify updateNodeData was called a reasonable number of times (not infinitely)
    await waitFor(() => {
      expect(mockUpdateNodeData).toHaveBeenCalledTimes(1); // Only for expansion
    }, { timeout: 1000 });
  });

  it('should be idempotent when setting same values', async () => {
    const nodeData = {
      systemPrompt: 'Test prompt',
      isExpanded: true,
      variablesMode: false,
      isConfigured: true
    };

    const { rerender } = render(
      <TestWrapper>
        <SystemPromptNode 
          data={nodeData}
          selected={false}
          id="test-node"
        />
      </TestWrapper>
    );

    // Clear any initial calls
    mockUpdateNodeData.mockClear();

    // Re-render with same data
    rerender(
      <TestWrapper>
        <SystemPromptNode 
          data={nodeData}
          selected={false}
          id="test-node"
        />
      </TestWrapper>
    );

    // Should not trigger any updates since data is the same
    await waitFor(() => {
      expect(mockUpdateNodeData).not.toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('should handle expand/collapse transitions without oscillation', async () => {
    const nodeData = {
      systemPrompt: 'Test prompt',
      isExpanded: false,
      variablesMode: false,
      isConfigured: true
    };

    render(
      <TestWrapper>
        <SystemPromptNode 
          data={nodeData}
          selected={false}
          id="test-node"
        />
      </TestWrapper>
    );

    const nodeContainer = screen.getByText('System Prompt').closest('div[dir]');
    
    // Rapid expand/collapse
    fireEvent.click(nodeContainer!);
    fireEvent.click(nodeContainer!);
    fireEvent.click(nodeContainer!);

    // Should settle to final state without continuous toggling
    await waitFor(() => {
      expect(mockUpdateNodeData).toHaveBeenCalledTimes(3);
    }, { timeout: 1000 });

    // No additional calls should occur after settling
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(mockUpdateNodeData).toHaveBeenCalledTimes(3);
  });
});
