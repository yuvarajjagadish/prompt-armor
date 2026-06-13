import { Variants } from 'framer-motion';

// Fade up variant for entrance animations
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Staggered container variant
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// Card hover lift and glow
export const cardHover: Variants = {
  rest: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', transition: { type: 'spring', stiffness: 120, damping: 20 } },
  hover: {
    y: -4,
    boxShadow: '0 0 8px rgba(0,212,255,0.4)',
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

// Button hover scale and glow pulse
export const buttonHover: Variants = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    scale: 1.03,
    boxShadow: '0 0 6px rgba(0,212,255,0.6)',
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

// Metric count animation – for numeric values
export const metricCount: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
