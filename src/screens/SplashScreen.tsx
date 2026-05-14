import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-[#051b39] overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.03) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center px-6"
      >
        <div className="mb-8 p-6 rounded-lg bg-white/5 backdrop-blur-sm shadow-2xl">
          <img 
            alt="Access Bank Logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQuIVLCF4yLwmFEXLI5AE8pxB46WDI-KlBv_2VT7z0TgFEt38UgSYKyyw5V1N1lPyiqeAqhQAWtEhfCARQ_AxI8SVG0bRdc68jj8wSuRlQbYThKUU5otIfgC3ATwzhSl-jIS3t0R4S3Q4-DhnBQAzsKgXTG3w0CTCQSB3TlEHRL5nw91GEu3Axow5t4oawsKo3n5KqBoD-xiBgzeiTFQieXtFHhe-Y1sUowj7RnRYluUMCGjN6_tAi-PLLNsYW1hjt7UaDDDHPWnI" 
          />
        </div>
        
        <div className="text-center">
          <h1 className="font-headline-lg text-white tracking-tight mb-2 text-4xl font-bold">
            Access More
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-1 bg-[#fe6500] mx-auto rounded-full"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-16 left-0 w-full flex flex-col items-center px-6">
        <p className="text-white/90 font-bold tracking-wide uppercase text-sm">
          More than Banking
        </p>
        <div className="mt-4 flex gap-2">
          <motion.div animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 rounded-full bg-[#fe6500]" />
          <motion.div animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[#fe6500]" />
          <motion.div animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[#fe6500]" />
        </div>
      </div>
      
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fe6500]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#6482cb]/10 rounded-full blur-[100px] pointer-events-none"></div>
    </main>
  );
};
