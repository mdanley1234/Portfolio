'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Replaces the placeholder hamburger. Each item may carry an href (sub-pages)
 * or an onSelect callback (homepage, which scrolls to a section ref).
 *
 * @param {{
 *   items: Array<{ label: string, href?: string, onSelect?: () => void }>,
 *   active?: string
 * }} props
 */
export default function MobileNav({ items, active }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Escape closes, and the page behind stays put while the panel is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector('a,button')?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <motion.button
        ref={toggleRef}
        type="button"
        className="md:hidden text-gray-400 hover:text-white transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={panelRef}
            className="md:hidden absolute top-full left-0 right-0 border-t border-white/10"
            style={{
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <nav aria-label="Sections" className="px-6 py-2">
              <ul className="flex flex-col">
                {items.map(({ label, href, onSelect }) => {
                  const isActive = active === label;
                  const className = `block w-full text-left py-4 border-b border-white/10 last:border-b-0 transition-colors ${
                    isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`;
                  const close = () => setOpen(false);

                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} className={className} onClick={close}>
                          {label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={className}
                          onClick={() => {
                            close();
                            onSelect?.();
                          }}
                        >
                          {label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
