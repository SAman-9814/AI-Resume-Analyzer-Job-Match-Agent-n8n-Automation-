import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader2, Play } from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import axios from 'axios';

// Using environment variable for URL flexibility
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "/webhook-test/analyze";

export default function UploadSection({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file || !jobDescription || !jobTitle || !email) {
      setError("Please fill in all fields and upload a resume.");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // 1. Extract text from PDF
      const resumeText = await extractTextFromPdf(file);
      
      // 2. Send payload to n8n Webhook
      const payload = {
        email,
        jobTitle,
        jobDescription,
        resumeText
      };

      const response = await axios.post(WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("RAW N8N RESPONSE:", response.data);

      // Smart unwrap: in case n8n or Gemini wrapped the data inside an 'analysis' key or array
      let finalData = response.data;
      if (finalData.analysis) {
        finalData = finalData.analysis;
      }
      if (Array.isArray(finalData) && finalData.length > 0) {
        finalData = finalData[0];
      }

      // 3. Pass result back to App
      onAnalysisComplete(finalData);
    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis. Make sure your n8n workflow is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Upload */}
        <div className="flex flex-col gap-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
            <input 
              type="text" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Senior React Developer"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF)</label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'border-primary bg-primary/10 scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
                  <FileText className="w-10 h-10 text-primary" />
                  <p className="text-sm text-gray-200 font-medium">{file.name}</p>
                  <p className="text-xs text-gray-400">Click or drag to replace</p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <UploadCloud className={`w-10 h-10 mb-2 transition-transform duration-300 ${isDragActive ? 'scale-125 text-primary' : ''}`} />
                  <p className="text-sm font-medium text-gray-200">Drag & drop your PDF here</p>
                  <p className="text-xs">or click to browse files</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Job Description */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="flex flex-col h-full">
          <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none min-h-[200px] focus:ring-2 focus:ring-primary/50"
            placeholder="Paste the full job description here..."
          ></textarea>
        </motion.div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-danger/20 border border-danger/50 text-danger rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <motion.button
          whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
          whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`relative group overflow-hidden rounded-full px-8 py-4 font-bold text-white transition-all ${
            isAnalyzing ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]'
          }`}
        >
          <div className="flex items-center gap-3 relative z-10">
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Run Analysis
              </>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}
