import { useState, useEffect } from 'react';
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
  const [error, setError] = useState('');
  const [storyHistory, setStoryHistory] = useState<Story[]>([]);

  // Fetch story history from the database
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const fetchHistory = async () => {
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
        }
      };
      fetchHistory();
    }
  }, [user, navigate]);

  const handleGenerateAndTranslate = async (topic: string) => {
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
  };

  const handleSelectStory = async (id: string) => {
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
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="container">
        <section className="left-panel">
          <StoryGenerator
            story={story}
            isLoading={isLoading}
            onGenerate={handleGenerateAndTranslate}
          />
        </section>
        <section className="right-panel">
          <StoryHistory history={storyHistory} onSelectStory={handleSelectStory} />
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
