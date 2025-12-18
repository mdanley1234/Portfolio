'use client'

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, Github, Linkedin, Mail, Code, Briefcase, User, ChevronDown } from 'lucide-react';
import { ReactTyped } from "react-typed";
import { getProjects } from '@/lib/getProjects';

import { Project } from '@/lib/getProjects';

interface PageClientProps {
  projects: Project[];
}

export default function PageClient({ projects }: PageClientProps) {

  // Scrolling constants
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  // Optimized parallax with reduced range
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Throttled scroll handler with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Build and return webpage
  return (
    <div className="min-h-screen background">
      {/* Optimized Sticky Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-white/5'
          : 'bg-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ willChange: 'transform' }}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="text-xl tracking-wider"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-white font-bold">
              MICHAEL DANLEY
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Work', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <motion.button
            className="md:hidden text-gray-400"
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </nav>
      </motion.header>

      {/* Hero Section - Optimized */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 gradient-background">
        {/* Optimized background gradients with longer, smoother animations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ willChange: 'transform' }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ willChange: 'transform' }}
          />
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
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse" />
                <motion.div
                  className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
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
                      "<strong>Electrical &amp; Computer Engineering </strong> and <strong> Computer Science </strong> Undergraduate at Duke University^500",
                      "<strong>ECE</strong> &amp; <strong>CS </strong> @ Duke University"
                    ]}
                    typeSpeed={40}
                    backSpeed={20}
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

              <motion.button
                className="px-8 py-4 bg-white text-black rounded-full hover:shadow-lg hover:shadow-white/20 transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                style={{ willChange: 'transform' }}
              >
                <span className="relative z-10 font-semibold">View My Work</span>
                <motion.div
                  className="absolute inset-0 bg-gray-200"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
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
                <Code size={40} className="text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Experience</h3>
                <p className="text-gray-400">
                  Building responsive and performant web applications using React,
                  TypeScript, and modern frameworks.
                </p>
              </motion.div>

              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{ willChange: 'transform' }}
              >
                <Briefcase size={40} className="text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Skills</h3>
                <p className="text-gray-400">
                  5+ years of experience creating innovative solutions for startups
                  and established companies.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Optimized scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        >
          <ChevronDown size={32} className="text-gray-400" />
        </motion.div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 relative bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-16 text-center">Featured Work</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.03, y: -10 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="aspect-video bg-white/5 relative overflow-hidden">
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.summary}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-3 py-1 text-sm bg-white/10 text-gray-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
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