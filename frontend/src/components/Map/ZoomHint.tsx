import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect, useState } from 'react';

interface ZoomHintProps {
  onDismiss: () => void;
}

export function ZoomHint({ onDismiss }: ZoomHintProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 8000); // Auto dismiss after 8 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          {/* Academic Style Info Box - No rounded corners */}
          <div className="relative bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-2 border-gray-900 dark:border-white p-5 max-w-md flex items-start gap-4">
            {/* Corner accents - Bloomberg style */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
            
            {/* Icon - Minimal */}
            <div className="flex-shrink-0 w-8 h-8 border border-gray-900 dark:border-white flex items-center justify-center text-gray-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-1 pr-6">
              <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1 tracking-tight">
                {t('map.zoomHint.title')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('map.zoomHint.message')}
              </p>
            </div>
            
            {/* Close Button - Minimal */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Close hint"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
