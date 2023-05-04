import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RenderProps {
  children: ReactNode;
}

function Render({ children }: RenderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5 }}
      style={{ display: 'flex', backgroundColor: 'gray' }}
    >
      {children}
    </motion.div>
  );
}

export default Render;
