import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ThemeToggle';
import FloatingActionButton from '../components/FloatingActionButton';
import { Plus, LogOut, Heart, Sparkles, BookOpen } from 'lucide-react';

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

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/journal');
      setEntries(res.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await api.delete(`/journal/${id}`);
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2.5"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                HeartSpace
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Welcome, <span className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</span></span>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Journal
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">Reflect on your thoughts and feelings</p>
          </div>
          <Link to="/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
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
              Loading entries...
            </motion.p>
          </div>
        ) : entries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto"
              >
                <Card className="p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6"
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <BookOpen className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    No entries yet
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                    Start your mental health journey by creating your first journal entry.
                  </p>
                  <Link to="/new">
                    <Button size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Entry
                    </Button>
                  </Link>
                </Card>
              </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="h-full cursor-pointer group">
                  <Link to={`/entry/${entry._id}`} className="block h-full">
                    <Card.Header>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                        <Card.Title className="text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {entry.title}
                        </Card.Title>
                        <Card.Description className="text-xs font-medium">
                          {format(new Date(entry.date), 'MMM dd, yyyy • h:mm a')}
                        </Card.Description>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-3xl ml-3 flex-shrink-0"
                      >
                        {moodEmojis[entry.mood] || '😐'}
                      </motion.div>
                      </div>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 min-h-[60px] leading-relaxed">
                        {entry.content}
                      </p>
                      {entry.aiInsightsGenerated && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4 border border-indigo-200/50 dark:border-indigo-700/50">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI Insights
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          View Details →
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(entry._id);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Content>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;

