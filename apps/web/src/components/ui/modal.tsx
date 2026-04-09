'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-4xl',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, damping: 28, stiffness: 380 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.97,
    transition: { duration: 0.18 },
  },
};

export function Modal({ open, onClose, title, description, size = 'md', children, footer, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  className={cn(
                    'w-full bg-white rounded-2xl shadow-modal flex flex-col',
                    'max-h-[90vh] overflow-hidden',
                    sizeStyles[size],
                    className,
                  )}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  {(title || description) && (
                    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-brand-border">
                      <div className="min-w-0">
                        {title && (
                          <Dialog.Title className="text-lg font-semibold text-brand-text-primary leading-tight">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="mt-1 text-sm text-brand-text-secondary">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                      <Dialog.Close asChild>
                        <button
                          onClick={onClose}
                          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Dialog.Close>
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
                    {children}
                  </div>

                  {/* Footer */}
                  {footer && (
                    <div className="px-6 py-4 border-t border-brand-border bg-slate-50/80 flex items-center justify-end gap-3">
                      {footer}
                    </div>
                  )}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* Convenience sub-components */
export function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
