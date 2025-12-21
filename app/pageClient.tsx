'use client'

import { useState, useEffect, useRef, use } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, Github, Linkedin, Mail, Code, Briefcase, User, ChevronDown } from 'lucide-react';
import { ReactTyped } from "react-typed";
import { Project } from '@/lib/getProjects';
import DarkVeil from '@/lib/bits/DarkVeil';
import EmblaCarousel from '@/lib/carousel/EmblaCarousel';
import Link from "next/link"

// For project MDX file parsing
interface PageClientProps {
  projects: Project[];
}

/**
 * Generates portfolio homepage using projects and experiences passed from server-processing component
 * @param projects List of projects to display on the portfolio page
 * @returns rendered portfolio homepage
 */
export default function PageClient({ projects }: PageClientProps) {


  const [activeSection, setActiveSection] = useState('About Me');
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Handle navbar background
          setScrolled(window.scrollY > 50);

          // Handle active section detection
          const sections = [
            { name: 'About Me', ref: aboutMeRef },
            { name: 'Projects', ref: projectsRef },
            { name: 'Experience', ref: experienceRef }
          ];

          const scrollPosition = window.scrollY + window.innerHeight / 3;

          for (const section of sections) {
            const element = section.ref.current;
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section.name);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Scrolling constants
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  // Hero parallax
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Smooth href
  const aboutMeRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);




  // Build and return webpage
  return (
    <div className="min-h-screen background">
      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 sm:px-6
        py-3 md:py-4 lg:py-4
        min-h-[56px] md:min-h-[72px]
        transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          willChange: 'transform',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
      >

        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.a
            className="text-xl tracking-wider"
            whileHover={{ scale: 1.05 }}
            href={''}
          >
            <span className="text-white font-semibold">
              Michael Danley
            </span>
          </motion.a>

          <motion.div
            className="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 px-6 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >



            {(['About Me', 'Projects', 'Experience'] as const).map((item, index) => {
              const refMap = {
                'About Me': aboutMeRef,
                'Projects': projectsRef,
                'Experience': experienceRef
              };

              // const [activeSection, setActiveSection] = useState('');
              const isActive = activeSection === item;

              return (
                <motion.button
                  key={item}
                  onClick={() => {
                    refMap[item]?.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className={`transition-colors relative group px-4 py-2  ${isActive
                      ? 'text-white font-bold underline underline-offset-6 decoration-2'
                      : 'text-gray-400 hover:text-white'
                    }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <span className="relative z-10">
                    {item}
                  </span>
                </motion.button>
              );
            })}



          </motion.div>

          <motion.button
            className="md:hidden text-gray-400"
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id='about me' ref={aboutMeRef}>
        {/* DarkVeil Background - Full Width Wrapper */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <DarkVeil />
          </div>
        </div>

        {/* Hero content with optimized parallax */}
        <motion.div
          className="container mx-auto px-6 relative z-10"
          style={{ y: heroY, opacity: heroOpacity, willChange: 'transform, opacity' }}
        >

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div className="flex flex-col items-start">
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20" />
                <motion.div
                  className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
                  style={{ willChange: 'transform' }}
                >
                  <img
                    src="/images/profile_picture.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              <motion.h1
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="block text-gray-400 mb-2">Hi, I'm</span>
                <span className="block text-white text-5xl font-bold">
                  Michael Danley
                </span>
              </motion.h1>

              <motion.div
                className="text-xl text-gray-300 mb-12 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span>
                  <ReactTyped
                    strings={[
                      "<strong>ECE</strong> &amp; <strong>CS </strong> @ Duke University"
                    ]}
                    typeSpeed={25}
                    startDelay={600}
                  />
                </span>
              </motion.div>

              <motion.div
                className="flex gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {[
                  { Icon: Github, href: 'https://github.com/mdanley1234' },
                  { Icon: Linkedin, href: 'https://linkedin.com/in/michael-danley' },
                  { Icon: Mail, href: 'mailto:danleymichael23@gmail.com' },
                ].map(({ Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    className="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: 'transform' }}
                  >
                    <Icon size={24} className="text-gray-300" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right Side - About Me Boxes */}
            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <User size={32} className="text-white" />
                  <h2 className="text-3xl font-bold text-white">About Me</h2>
                </div>
              </motion.div>

              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Code size={40} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">Background</h3>
                </div>
                <p className="text-gray-400">

                  I'm an undergraduate studying


                </p>
              </motion.div>

              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Code size={40} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">Skills</h3>
                </div>
                <p className="text-gray-400">
                  Building responsive and performant web applications using React,
                  TypeScript, and modern frameworks.
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        >
          <ChevronDown size={32} className="text-gray-400" />
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative bg-white/[0.02]" ref={projectsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >

            <div className="flex items-center justify-between px-4">
              <h2 className="text-4xl font-bold text-white text-left">
                Featured Projects
              </h2>

              <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
                See All
              </button>
            </div>


            {/* EmblaCarousel for MDX Projects */}
            <EmblaCarousel
              // Build project cards using front-matter from MDX projects in content/projects
              slides={projects.map((project, index) => (
  <div key={project.slug} style={{ perspective: "1500px" }}>
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/80 h-[600px] flex flex-col"
        style={{
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform"
        }}
        whileHover={{
          rotateY: -16,
          scale: 1.01
        }}
        whileTap={{ scale: 0.99 }}
        transition={{
          rotateY: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
          scale: { type: "spring", stiffness: 300, damping: 30 }
        }}
      >
        <div className="h-80 bg-white/5 relative overflow-hidden flex-shrink-0">
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {project.coverImage ? (
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <Code size={48} className="text-white/50" />
            )}
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 mb-4 flex-1">{project.summary}</p>
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="px-3 py-1 text-sm bg-white/10 text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  </div>
))}
              minCardWidth={400}
              options={{ loop: false }}
            />
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="contact" className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Let's Work Together</h2>
            <p className="text-xl text-gray-300 mb-12">
              Have a project in mind? Let's create something amazing together.
            </p>
            <motion.button
              className="px-12 py-5 bg-white text-black font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ willChange: 'transform' }}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 Michael Danley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}