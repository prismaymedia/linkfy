import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServiceIconInfo, detectMusicService } from '@/components/music-service-detector';
import { useTranslation } from 'react-i18next';

interface DynamicServiceIconProps {
  url: string;
  className?: string;
}

export default function DynamicServiceIcon({
  url,
  className = '',
}: DynamicServiceIconProps) {
  const { t } = useTranslation();
  
  // Optimized service detection
  const service = React.useMemo(() => detectMusicService(url), [url]);
  const iconInfo = React.useMemo(() => getServiceIconInfo(service), [service]);
  
  const { Icon, color, label } = iconInfo;

  // Translated accessible label
  const ariaLabel = t(`form.serviceIcon.${service}`, { 
    defaultValue: label 
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={service}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ 
          duration: 0.08,
          ease: [0.4, 0, 0.2, 1] // easeOut cubic bezier for smooth transition
        }}
        className="inline-flex items-center justify-center"
      >
        <Icon
          className={`${color} ${className}`}
          aria-label={ariaLabel}
          aria-hidden="false"
        />
      </motion.div>
    </AnimatePresence>
  );
}

