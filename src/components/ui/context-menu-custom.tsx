import React, { useState, useEffect, useRef } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onCopy, onRegenerate }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-card border border-border rounded-lg shadow-lg py-2 min-w-[140px]"
      style={{
        left: x,
        top: y,
      }}
    >
      <button
        onClick={() => {
          onCopy();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Copy
      </button>
      <button
        onClick={() => {
          onRegenerate();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Regenerate
      </button>
    </div>
  );
};

export default ContextMenu;