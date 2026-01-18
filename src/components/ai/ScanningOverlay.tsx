import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ScanningOverlayProps {
  imageSrc: string;
}

const ScanningOverlay = ({ imageSrc }: ScanningOverlayProps) => {
  return (
    <div className="relative aspect-square max-h-[500px] rounded-2xl overflow-hidden">
      <img
        src={imageSrc}
        alt="Uploaded"
        className="w-full h-full object-contain"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-charcoal/60" />
      
      {/* Scanning laser line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ boxShadow: '0 0 30px 10px hsl(var(--primary) / 0.5)' }}
      />
      
      {/* Pulsing ring at center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1.5, 0.5],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
        >
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </motion.div>
      </div>
      
      {/* Scanning text */}
      <div className="absolute bottom-8 inset-x-0 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary-foreground text-lg font-semibold mb-2"
        >
          ה-AI מחפש עבורך את ההתאמה המושלמת...
        </motion.p>
        <motion.div
          className="flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
    </div>
  );
};

export default ScanningOverlay;
