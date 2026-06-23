import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import { Sparkles } from 'lucide-react';

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      
      {/* Animated Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-6 ring-1 ring-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          AI <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Upload your resume and the job description. Our AI will instantly calculate your ATS match score, identify missing skills, and give you actionable feedback to land the interview.
        </p>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full"
          >
            <UploadSection onAnalysisComplete={setResult} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <button 
              onClick={() => setResult(null)}
              className="mb-8 px-6 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors"
            >
              ← Analyze Another Resume
            </button>
            <ResultsDashboard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
