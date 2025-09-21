import React from 'react';
import { IconCode, IconKey, IconExternalLink } from '@tabler/icons-react';
import Modal from '@components/ui/modal';
import { MCP_PRESETS } from '../constants';

interface SetupInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: string;
}

export const SetupInstructionsModal: React.FC<SetupInstructionsModalProps> = ({
  isOpen,
  onClose,
  selectedPreset
}) => {
  if (!selectedPreset || !MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS]) {
    return null;
  }

  const preset = MCP_PRESETS[selectedPreset as keyof typeof MCP_PRESETS];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${preset.name} Setup`}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{preset.name}</h3>
          <p className="text-muted-foreground mb-4">{preset.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <IconCode size={16} />
              Setup Instructions
            </h4>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{preset.setupInstructions}</pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <IconKey size={16} />
              Authentication
            </h4>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm mb-2"><strong>Method:</strong> {preset.authMethod}</p>
              <p className="text-sm"><strong>Example:</strong> {preset.placeholder}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <IconExternalLink size={16} />
              Documentation
            </h4>
            <a
              href={preset.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              View Full Documentation <IconExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
