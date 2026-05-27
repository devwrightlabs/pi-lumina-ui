'use client';

import type { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PiBottomSheetProps } from '../types/lumina';

/**
 * Native-feeling swipeable bottom sheet for checkout and details flows.
 */
export const PiBottomSheet: FC<PiBottomSheetProps> = ({
  isOpen,
  title,
  children,
  className,
  closeOnBackdrop = true,
  onClose
}) => (
  <AnimatePresence>
    {isOpen ? (
      <>
        <motion.button
          type="button"
          aria-label="Close sheet"
          onClick={() => (closeOnBackdrop ? onClose() : undefined)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            border: 0,
            margin: 0,
            padding: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1200
          }}
        />
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label={title}
          drag="y"
          dragConstraints={{ top: 0, bottom: 240 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 110 || info.velocity.y > 560) {
              onClose();
            }
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={className}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1201,
            background: '#14141C',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 -8px 28px rgba(0,0,0,0.35)',
            padding: 16,
            maxHeight: '85dvh',
            overflow: 'auto',
            transform: 'translateZ(0)'
          }}
        >
          <div
            style={{
              width: 42,
              height: 4,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.35)',
              margin: '0 auto 12px auto'
            }}
          />
          <h2 style={{ margin: '0 0 12px', color: '#F5F5F7', fontSize: '1rem' }}>{title}</h2>
          <div style={{ color: '#D4D6E0' }}>{children}</div>
        </motion.section>
      </>
    ) : null}
  </AnimatePresence>
);
