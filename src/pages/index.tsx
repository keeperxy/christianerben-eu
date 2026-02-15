import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SecurityComplianceSection from '@/components/SecurityComplianceSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'), {
  loading: () => <div>Loading…</div>,
});
const SkillsSection = dynamic(() => import('@/components/SkillsSection'), {
  loading: () => <div>Loading…</div>,
});
const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => <div>Loading…</div>,
});
const CertificatesSection = dynamic(() => import('@/components/CertificatesSection'), {
  loading: () => <div>Loading…</div>,
});

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SecurityComplianceSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
