import React, { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SecurityComplianceSection from '@/components/SecurityComplianceSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';

const ProjectsSection = React.lazy(() => import('@/components/ProjectsSection'));
const SkillsSection = React.lazy(() => import('@/components/SkillsSection'));
const ContactSection = React.lazy(() => import('@/components/ContactSection'));

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SecurityComplianceSection />
        <ExperienceSection />
        <Suspense fallback={<div>Loading…</div>}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<div>Loading…</div>}>
          <SkillsSection />
        </Suspense>
        <Suspense fallback={<div>Loading…</div>}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
