import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, TrendingUp, AlertCircle, Briefcase, Award } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ResultsDashboard({ result }) {
  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 p-4"
    >
      {/* Score Card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-shadow duration-300 ${result.atsScore >= 80 ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">ATS Match Score</h3>
        <div className="w-40 h-40 mb-4 relative">
          {/* Animated glow ring behind the circle */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <CircularProgressbar
            value={result.atsScore || 0}
            text={`${result.atsScore || 0}%`}
            styles={buildStyles({
              pathColor: result.atsScore > 75 ? '#10b981' : result.atsScore > 50 ? '#f59e0b' : '#ef4444',
              textColor: '#f8fafc',
              trailColor: 'rgba(255,255,255,0.05)',
            })}
          />
        </div>
        <p className="text-sm text-gray-400">
          Match Probability: {result.matchPercentage}%
        </p>
        <p className="text-sm font-semibold text-primary mt-2">
          Estimated Salary: {result.salaryEstimate || 'N/A'}
        </p>
      </motion.div>

      {/* Skills Analysis */}
      <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }} className="md:col-span-2 glass-card p-6 rounded-2xl flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle2 className="text-success" />
            Matching Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchingSkills?.map((skill, i) => (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.5 + (i * 0.05) }}
                key={i} 
                className="px-3 py-1 rounded-full bg-success/10 text-success text-sm border border-success/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <XCircle className="text-danger" />
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills?.map((skill, i) => (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.8 + (i * 0.05) }}
                key={i} 
                className="px-3 py-1 rounded-full bg-danger/10 text-danger text-sm border border-danger/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-primary" />
            Resume Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-1 text-primary shadow-[0_0_10px_rgba(139,92,246,0.5)] rounded-full">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-secondary" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-1 text-secondary shadow-[0_0_10px_rgba(236,72,153,0.5)] rounded-full">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Actionable Advice & Interview Prep */}
      <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }} className="md:col-span-3 glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-success" />
          Actionable Improvements
        </h3>
        <ul className="space-y-3 mb-8">
          {result.improvements?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <span className="mt-0.5 text-success font-bold">→</span>
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-t border-white/10 pt-6">
          <Briefcase className="text-primary" />
          Top Interview Questions to Prepare
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.interviewQuestions?.map((question, i) => (
            <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 text-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="font-bold text-primary mr-2 block mb-1">Question {i+1}:</span>
              <span className="text-gray-200">{question}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
