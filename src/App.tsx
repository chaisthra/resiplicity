import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, History, BookText, Heart } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CommunityRecipes } from './components/CommunityRecipes';
import { RecipeWizard } from './components/RecipeWizard';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { SavedRecipes } from './components/SavedRecipes';
import { SimmeringStories } from './components/SimmeringStories';
import { HeritageHeals } from './components/HeritageHeals';
import { Footer } from './components/Footer';
import { supabase } from './services/supabase';

function App() {
  const [session, setSession] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'wizard' | 'community' | 'saved' | 'stories' | 'heritage'>('community');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
      </div>
    );
  }

  if (!session) {
    if (showRegister) {
      return (
        <RegisterScreen
          onRegister={() => setSession(true)}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={() => setSession(true)}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-texture bg-cream/95 bg-blend-overlay">
      <div className="culinary-pattern"></div>
      <div className="content-wrapper max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-5xl md:text-6xl mb-4 text-brown-800">
              Resiplicity
            </h1>
            <p className="text-brown-600 font-light tracking-wide">DISCOVER & SHARE RECIPES</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-brown-600 text-cream rounded-lg hover:bg-brown-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'wizard'
                ? 'bg-brown-600 text-cream'
                : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            Fusion Recipe Wizard
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'community'
                ? 'bg-brown-600 text-cream'
                : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
            }`}
          >
            <BookOpen className="w-4 h-4 inline-block mr-2" />
            Community Recipes
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'saved'
                ? 'bg-brown-600 text-cream'
                : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
            }`}
          >
            <History className="w-4 h-4 inline-block mr-2" />
            Saved Recipes
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'stories'
                ? 'bg-brown-600 text-cream'
                : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
            }`}
          >
            <BookText className="w-4 h-4 inline-block mr-2" />
            Simmering Stories
          </button>
          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'heritage'
                ? 'bg-brown-600 text-cream'
                : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
            }`}
          >
            <Heart className="w-4 h-4 inline-block mr-2" />
            Heritage Heals
          </button>
        </div>

        <ErrorBoundary>
          {activeTab === 'wizard' ? (
            <RecipeWizard />
          ) : activeTab === 'saved' ? (
            <SavedRecipes />
          ) : activeTab === 'stories' ? (
            <SimmeringStories />
          ) : activeTab === 'heritage' ? (
            <HeritageHeals />
          ) : (
            <CommunityRecipes />
          )}
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}

export default App;