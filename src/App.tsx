import React, { useState } from 'react';
import { NavigationPage, Fellowship } from './types';

// Global Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GivingModal } from './components/GivingModal';

// Homepage Sections
import { Hero } from './components/Hero';
import { QuickActions } from './components/QuickActions';
import { AboutSection } from './components/AboutSection';
import { FellowshipsSection } from './components/FellowshipsSection';
import { EventsSection } from './components/EventsSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ExecutivesSection } from './components/ExecutivesSection';
import { MediaSection } from './components/MediaSection';
import { HistorySection } from './components/HistorySection';
import { ResourcesSection } from './components/ResourcesSection';
import { GivingSection } from './components/GivingSection';
import { GetInvolvedSection } from './components/GetInvolvedSection';

// Dedicated Pages
import { AboutPage } from './pages/AboutPage';
import { FellowshipsPage } from './pages/FellowshipsPage';
import { ExecutivesPage } from './pages/ExecutivesPage';
import { EventsPage } from './pages/EventsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { MediaPage } from './pages/MediaPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { GivePage } from './pages/GivePage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [isGivingModalOpen, setIsGivingModalOpen] = useState(false);

  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard view, render the admin layout directly
  if (currentPage === 'admin') {
    return <AdminDashboard onNavigateHome={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#171717] font-sans antialiased selection:bg-[#B5121B] selection:text-white">
      
      {/* Universal Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenGiveModal={() => setIsGivingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <Hero
              onNavigate={handleNavigate}
              onOpenGiveModal={() => setIsGivingModalOpen(true)}
            />
            <QuickActions onNavigate={handleNavigate} />
            <AboutSection onReadMore={() => handleNavigate('about')} />
            <FellowshipsSection
              onViewAllFellowships={() => handleNavigate('fellowships')}
            />
            <EventsSection
              onViewAllEvents={() => handleNavigate('events')}
            />
            <AnnouncementsSection
              onViewAllAnnouncements={() => handleNavigate('announcements')}
            />
            <ExecutivesSection
              onViewAllExecutives={() => handleNavigate('executives')}
            />
            <MediaSection
              onViewAllMedia={() => handleNavigate('media')}
            />
            <HistorySection />
            <ResourcesSection
              onViewAllResources={() => handleNavigate('resources')}
            />
            <GivingSection
              onOpenGiveModal={() => setIsGivingModalOpen(true)}
            />
            <GetInvolvedSection
              onNavigate={handleNavigate}
              onOpenGiveModal={() => setIsGivingModalOpen(true)}
            />
          </>
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'fellowships' && (
          <FellowshipsPage />
        )}

        {currentPage === 'executives' && (
          <ExecutivesPage />
        )}

        {currentPage === 'events' && (
          <EventsPage />
        )}

        {currentPage === 'announcements' && (
          <AnnouncementsPage />
        )}

        {currentPage === 'media' && (
          <MediaPage />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage />
        )}

        {currentPage === 'give' && (
          <GivePage onOpenGiveModal={() => setIsGivingModalOpen(true)} />
        )}

        {currentPage === 'get-involved' && (
          <GetInvolvedPage
            onNavigate={handleNavigate}
            onOpenGiveModal={() => setIsGivingModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Interactive Giving Modal */}
      <GivingModal
        isOpen={isGivingModalOpen}
        onClose={() => setIsGivingModalOpen(false)}
      />

      {/* Universal Footer in Deep Crimson */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGiveModal={() => setIsGivingModalOpen(true)}
      />

    </div>
  );
}
