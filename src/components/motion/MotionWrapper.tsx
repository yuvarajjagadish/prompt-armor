import { motion } from 'framer-motion';
import { staggerContainer } from '@/components/motion/variants';

// Wrapper that applies staggered entrance animation when scrolled into view
export const MotionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
