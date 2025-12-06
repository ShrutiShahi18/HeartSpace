import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeft, Sparkles, Loader2, Trash2, Brain, Heart, Lightbulb, CheckCircle2, Edit2, Save, X } from 'lucide-react';

const moodEmojis = {
  excited: '😄',
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  angry: '😠',
  tired: '😴',
};

const JournalEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState('neutral');

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const res = await api.get(`/journal/${id}`);
      setEntry(res.data);
      setEditTitle(res.data.title);
      setEditContent(res.data.content);
      setEditMood(res.data.mood);
    } catch (error) {
      console.error('Error fetching entry:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/insights/generate/${id}`);
      setEntry({ 
        ...entry, 
        aiInsights: res.data.insights, 
        detectedStates: res.data.detectedStates,
        recommendations: res.data.recommendations,
        aiInsightsGenerated: true 
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      
      let errorMessage = 'Failed to generate insights. Please try again.';
      
      // Try to get the actual error message from the server
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show a more user-friendly alert with the actual error
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Your server console for detailed error logs\n2. That GEMINI_API_KEY is set in server/.env\n3. That Generative Language API is enabled in Google Cloud Console\n4. Restart your server after adding the API key`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/journal/${id}`, {
        title: editTitle,
        content: editContent,
        mood: editMood,
      });
      setEntry(res.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await api.delete(`/journal/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Journal</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Journal Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <Card.Header>
              {editing ? (
                <div className="space-y-4">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Entry title"
                    className="text-2xl font-bold"
                  />
                  <Select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                  >
                    <option value="excited">😄 Excited</option>
                    <option value="happy">😊 Happy</option>
                    <option value="calm">😌 Calm</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                    <option value="anxious">😰 Anxious</option>
                    <option value="angry">😠 Angry</option>
                    <option value="tired">😴 Tired</option>
                  </Select>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Card.Title className="text-3xl mb-2">{entry.title}</Card.Title>
                    <Card.Description className="text-base">
                      {format(new Date(entry.date), 'MMMM dd, yyyy • h:mm a')}
                    </Card.Description>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-4xl">{moodEmojis[entry.mood] || '😐'}</span>
                  </div>
                </div>
              )}
            </Card.Header>
            <Card.Content>
              {editing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={18}
                    className="min-h-[400px]"
                  />
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                      {entry.content}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        {/* AI Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <Card.Title>AI Insights</Card.Title>
                    <Card.Description>Powered by Google Gemini</Card.Description>
                  </div>
                </div>
                {!entry.aiInsightsGenerated && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleGenerateInsights}
                      disabled={generating}
                      variant="outline"
                      className="relative overflow-hidden"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"
                            style={{ backgroundPosition: '200% 0' }}
                          />
                          <Sparkles className="h-4 w-4 mr-2 relative z-10" />
                          <span className="relative z-10">Generate Insights</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card.Header>
            <Card.Content>
              {entry.aiInsightsGenerated && entry.aiInsights ? (
                <div className="space-y-6">
                  {/* Detected Mental Health States */}
                  {entry.detectedStates && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-blue-900/20 p-8 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-lg overflow-hidden"
                    >
                      {/* Decorative gradient overlay */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-6 flex items-center text-gray-900 dark:text-gray-100">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3">
                            <Brain className="h-5 w-5 text-white" />
                          </div>
                          Detected Mental Health States
                        </h3>
                        <div className="grid grid-cols-2 gap-5">
                        {entry.detectedStates.anxiety !== undefined && (
                          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm border border-orange-200/50 dark:border-orange-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Anxiety</span>
                              <span className="text-lg font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                {entry.detectedStates.anxiety}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${entry.detectedStates.anxiety}%` }}
                                transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
                                className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-500 dark:via-orange-600 dark:to-orange-700 h-3 rounded-full shadow-lg"
                              />
                            </div>
                          </div>
                        )}
                        {entry.detectedStates.burnout !== undefined && (
                          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm border border-red-200/50 dark:border-red-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Burnout</span>
                              <span className="text-lg font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                                {entry.detectedStates.burnout}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${entry.detectedStates.burnout}%` }}
                                transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
                                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700 h-3 rounded-full shadow-lg"
                              />
                            </div>
                          </div>
                        )}
                        {entry.detectedStates.sadness !== undefined && (
                          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Sadness</span>
                              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                {entry.detectedStates.sadness}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${entry.detectedStates.sadness}%` }}
                                transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
                                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700 h-3 rounded-full shadow-lg"
                              />
                            </div>
                          </div>
                        )}
                        {entry.detectedStates.confidence !== undefined && (
                          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm border border-green-200/50 dark:border-green-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Confidence</span>
                              <span className="text-lg font-extrabold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                                {entry.detectedStates.confidence}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${entry.detectedStates.confidence}%` }}
                                transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
                                className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:from-green-500 dark:via-green-600 dark:to-green-700 h-3 rounded-full shadow-lg"
                              />
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Main Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-lg overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-4 flex items-center text-gray-900 dark:text-gray-100">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        AI Insights
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                        {entry.aiInsights}
                      </p>
                    </div>
                  </motion.div>

                  {/* Positivity Recommendation */}
                  {entry.recommendations?.positivity && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                      className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/30 dark:via-orange-900/20 dark:to-amber-900/20 p-8 rounded-2xl border-2 border-yellow-200/50 dark:border-yellow-700/50 shadow-lg overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-4 flex items-center text-gray-900 dark:text-gray-100">
                          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mr-3">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                          Positivity Recommendation
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                          {entry.recommendations.positivity}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Meditation Suggestion */}
                  {entry.recommendations?.meditation && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                      className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/20 p-8 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-4 flex items-center text-gray-900 dark:text-gray-100">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg mr-3">
                            <Brain className="h-5 w-5 text-white" />
                          </div>
                          Meditation Suggestion
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                          {entry.recommendations.meditation}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested Tasks */}
                  {entry.recommendations?.tasks && entry.recommendations.tasks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
                      className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 shadow-lg overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-5 flex items-center text-gray-900 dark:text-gray-100">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mr-3">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          Suggested Tasks
                        </h3>
                        <ul className="space-y-4">
                          {entry.recommendations.tasks.map((task, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                              className="flex items-start bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm border border-green-200/50 dark:border-green-700/50"
                            >
                              <CheckCircle2 className="h-5 w-5 mr-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{task}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6"
                  >
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                      <Sparkles className="h-20 w-20 text-purple-600 dark:text-purple-400" />
                    </div>
                  </motion.div>
                  <p className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No insights generated yet.</p>
                  <p className="text-base max-w-md mx-auto">Click "Generate Insights" to get AI-powered feedback on your entry. Our AI will analyze your thoughts and provide personalized recommendations.</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default JournalEntry;

