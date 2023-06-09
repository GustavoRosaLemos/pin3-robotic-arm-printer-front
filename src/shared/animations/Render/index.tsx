import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RenderProps {
  children: ReactNode;
}

function Render({ children }: RenderProps) {
  return (
    <motion.div
      initial={{ y: -1000 }}
      animate={{ y: 0 }}
      transition={{ duration: 5 }}
      style={{
        backgroundColor: 'gray',
        display: 'flex',
      }}
    >
      {children}
    </motion.div>
  );
}

export default Render;
