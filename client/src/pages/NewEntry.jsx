import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeft, Heart, PenTool } from 'lucide-react';

const NewEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/journal', {
        title: title || 'Untitled Entry',
        content,
        mood,
      });
      navigate(`/entry/${res.data._id}`);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-4 mb-2">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
                >
                  <PenTool className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <Card.Title className="text-3xl">New Journal Entry</Card.Title>
                  <Card.Description className="text-base">Express your thoughts and feelings</Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Title (optional)
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mood" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    How are you feeling?
                  </label>
                  <Select
                    id="mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
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

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    What's on your mind? *
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Write about your day, your feelings, your thoughts... This is your safe space to express yourself."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={18}
                    className="min-h-[400px]"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link to="/">
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading || !content.trim()}>
                    {loading ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default NewEntry;

