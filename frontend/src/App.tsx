import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import Header from './components/Header';
import StoryGenerator from './components/StoryGenerator';
import StoryHistory, { Story } from './components/StoryHistory';
import TranslationView from './components/TranslationView';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [story, setStory] = useState('');
  const [translatedStory, setTranslatedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false); // New state for history loading
  const [error, setError] = useState('');
  const [storyHistory, setStoryHistory] = useState<Story[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  // Fetch story history from the database
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const fetchHistory = async () => {
        setIsHistoryLoading(true); // Set loading to true
        try {
          const response = await fetch('/api/story', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Hikaye geçmişi yüklenemedi.');
          }
          const data = await response.json();
          setStoryHistory(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        } finally {
          setIsHistoryLoading(false); // Set loading to false
        }
      };
      fetchHistory();
    }
  }, [user, navigate]);

  const handleGenerateAndTranslate = useCallback(async (topic: string) => {
    if (!user) {
      setError('Hikaye oluşturmak için giriş yapmalısınız.');
      return;
    }
    setIsLoading(true);
    setError('');
    setStory('');
    setTranslatedStory('');

    try {
      // Generate story
      const storyResponse = await fetch(`/api/story/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ topic }),
      });

      if (!storyResponse.ok) throw new Error('Hikaye oluşturulamadı.');
      const storyData = await storyResponse.json(); // { story: string, storyId: string }
      setStory(storyData.story);

      const newStoryForHistory: Story = {
        _id: storyData.storyId,
        topic: topic,
        originalStory: storyData.story,
        createdAt: new Date().toISOString(),
      };

      // Add new story to history
      setStoryHistory(prevHistory => [newStoryForHistory, ...prevHistory]);

      // Translate story
      const translateResponse = await fetch(`/api/story/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ storyId: storyData.storyId, story: storyData.story, language: 'english' }),
      });

      if (!translateResponse.ok) throw new Error('Hikaye çevrilemedi.');
      const translateData = await translateResponse.json();
      setTranslatedStory(translateData.translatedStory);

      // Update story in history with translation
        setStoryHistory(prevHistory => {
            const updatedHistory = prevHistory.map(s =>
                s._id === storyData.storyId
                    ? { ...s, translatedStory: translateData.translatedStory }
                    : s
            );
            return updatedHistory;
        });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Add user to dependency array

  const handleSelectStory = useCallback(async (id: string) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/story/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Hikaye yüklenemedi.');
      }
      const data = await response.json();
      setStory(data.originalStory);
      setTranslatedStory(data.translatedStory || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    }
  }, [user]); // Add user to dependency array

  const handleDeleteStory = useCallback(async (id: string) => {
    if (!user) {
      setError('Hikaye silmek için giriş yapmalısınız.');
      return;
    }
    try {
      const response = await fetch(`/api/story/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Hikaye silinemedi.');
      }

      setStoryHistory(prevHistory => prevHistory.filter(story => story._id !== id));
      // Eğer silinen hikaye şu an görüntüleniyorsa, temizle
      if (story === storyHistory.find(s => s._id === id)?.originalStory) {
        setStory('');
        setTranslatedStory('');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [user, story, storyHistory]); // Add user, story, storyHistory to dependency array

  if (!user) {
    return null;
  }

  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container">
        <section className="left-panel">
          <StoryGenerator
            story={story}
            isLoading={isLoading}
            onGenerate={handleGenerateAndTranslate}
          />
        </section>
        <section className="right-panel">
          <StoryHistory
            history={storyHistory}
            onSelectStory={handleSelectStory}
            onDeleteStory={handleDeleteStory}
            isHistoryLoading={isHistoryLoading}
          />
          {error ? <p style={{color: 'red'}}>{error}</p> : (
            <TranslationView
              translatedStory={translatedStory}
              isLoading={isLoading}
            />
          )}
        </section>
      </main>
    </>
  );
}

export default App;
