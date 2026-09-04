'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, Blocks, User, ChevronDown, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ReactTyped } from "react-typed";
import { Project } from '@/lib/getProjects';

// Client-only: the calendar fetches its data in the browser.
const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((m) => m.GitHubCalendar),
  { ssr: false }
);
import DarkVeil from '@/lib/bits/DarkVeil';
import EmblaCarousel from '@/lib/carousel/EmblaCarousel';
import ProjectCard from '@/lib/ProjectCard';
import ExperienceTimeline from '@/lib/ExperienceTimeline';
import Tag from '@/lib/Tag';
import { Experience } from '@/lib/getExperiences';

/**
 * How far the hero drifts as it leaves, in pixels.
 *
 * This used to be '30%', which resolves against the hero's own height — 550px
 * on desktop but 1512px on mobile, so the drift tripled and the content nearly
 * pinned itself to the screen while you scrolled. A fixed distance behaves the
 * same at every size.
 */
const HERO_DRIFT_PX = 160;

/**
 * How far into the hero's exit the effect waits before starting, as a fraction
 * of the effect window (which is one viewport height of scrolling).
 *
 * From lg the hero fits the viewport: you have seen all of it at rest, so the
 * effect can begin immediately. Below lg it is a tall single column you scroll
 * *through*, and the window opens the moment the last card clears the fold —
 * seen, but not yet read. Holding off gives it reading room first.
 */
const HERO_EFFECT_DELAY = { compact: 0.32, roomy: 0 };
const HERO_EFFECT_SPAN = 0.6;

/**
 * matchMedia as an external store: no setState inside an effect, and the server
 * render has a defined answer.
 */
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

// For MDX file parsing (projects, experiences)
interface PageClientProps {
  projects: Project[];
  experiences: Experience[];
}

/**
 * Generates portfolio homepage using projects and experiences passed from server-processing component
 * @param projects List of projects to display on the portfolio page
 * @param experiences List of experiences to display on the portfolio page
 * @returns rendered portfolio homepage
 */
export default function PageClient({ projects, experiences }: PageClientProps) {

  // PRE-RENDER INITIALIZATION STAGE

  // Hero left section typing content 
  const typingIntro = [
    "Electrical &amp; Computer Engineer | Duke University"
  ]

  // Displayed tags (seperated by category)
  const tags = [
    "Java",
    "C++",
    "Python",

    "ESP-IDF",
    "FreeRTOS",
    "RS-485",
    "LoRa",

    "Circuit Analysis",
    "PCB Design",
    "CAD",
    "FEA",

    "KiCAD",
    "Fusion 360",
    "Github",

    "Linux",
    "Docker",

    "Soldering",
    "3D Printing"
  ]

  // Navbar scrolling function (Detecting current section)
  const [activeSection, setActiveSection] = useState('Home');
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Handle active section detection
          const sections = [
            { name: 'Home', ref: homeRef },
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

  // Smooth href constants
  const homeRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);

  // Hero parallax.
  //
  // Measured against the hero's own exit rather than progress through the whole
  // document. On mobile the hero stacks to roughly two viewports, so a
  // page-fraction range faded it to zero while the About and Skills cards were
  // still on screen. Anchoring to 'end end' means the fade cannot start until
  // the bottom of the hero has been seen, at any viewport size.
  const { scrollYProgress } = useScroll({
    target: homeRef,
    offset: ['end end', 'end start'],
  });
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 1023px)');

  const from = compact ? HERO_EFFECT_DELAY.compact : HERO_EFFECT_DELAY.roomy;
  const to = from + HERO_EFFECT_SPAN;

  const heroY = useTransform(
    scrollYProgress,
    [from, to],
    ['0px', reduceMotion ? '0px' : `${HERO_DRIFT_PX}px`]
  );
  const heroOpacity = useTransform(scrollYProgress, [from, to], [1, 0]);

  // WEBPAGE BUILDING STAGE
  return (
    <div className="min-h-screen background">

      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 sm:px-6
        py-2 md:py-3 lg:py-3
        min-h-[56px] md:min-h-[72px]
        transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          willChange: 'transform',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
      >

        {/* Navbar */}
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Navbar Left */}
          <motion.a
            className="text-xl tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
            href={''}
          >
            <span className="text-white font-semibold">
              Michael Danley
            </span>
          </motion.a>

          {/* Navbar Right */}
          <motion.div
            className="hidden md:flex items-center gap-4 bg-white/8 rounded-full px-6 py-2 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >

            {/* Generates and links navbar section buttons from list */}
            {(['Home', 'Projects', 'Experience'] as const).map((item) => {
              const refMap = {
                'Home': homeRef,
                'Projects': projectsRef,
                'Experience': experienceRef
              };
              const isActive = activeSection === item;

              // Build section buttons and define href behavior
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
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <span className="relative z-10">
                    {item}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </nav>
      </motion.header>

      {/* Hero Section
          Top padding tracks the header height (100px, then 136px from md) so
          the avatar never starts underneath it. From lg the hero grid is two
          columns, so the content is short enough to centre on its own and the
          original pt-20 applies. */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-36 lg:pt-20" id='home' ref={homeRef}>

        {/* DarkVeil Background - Full Width Wrapper */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <DarkVeil speed={1} warpAmount={2.5} />
          </div>
        </div>

        {/* Hero content section with optimized parallax */}
        <motion.div
          className="container mx-auto px-6 relative z-10"
          style={{ y: heroY, opacity: heroOpacity, willChange: 'transform, opacity' }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero Section Left Side */}
            <div className="flex flex-col items-start">

              {/* Profile Image */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20" />
                <motion.div
                  className="relative w-48 h-48 rounded-full overflow-hidden border-1 border-white/10"
                  style={{ willChange: 'transform' }}
                >
                  <Image
                    src="/images/profile_picture.webp"
                    alt="Profile"
                    fill
                    sizes="192px"
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Profile Name */}
              <motion.h1
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="block text-gray-400 mb-2">Hi, I&apos;m</span>
                <span className="block text-white text-5xl font-bold">
                  Michael Danley
                </span>
              </motion.h1>

              {/* Profile Blurb */}
              <motion.div
                className="text-xl text-gray-300 mb-10 max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span>
                  <ReactTyped
                    strings={typingIntro}
                    typeSpeed={25}
                    startDelay={600}
                  />
                </span>
              </motion.div>

              {/* Profile Links */}
              <motion.div
                className="flex gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {[
                  { Icon: Github, href: 'https://github.com/mdanley1234' },
                  { Icon: Linkedin, href: 'https://linkedin.com/in/michael-danley' },
                  { Icon: Mail, href: 'mailto:michael.danley@duke.edu' },
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

              {/* Resume Download */}
              <motion.a
                href="/Michael Danley Resume.pdf"          // put the PDF in /public or adjust path
                download                    // forces download
                className="px-8 py-4 bg-white text-black rounded-full transition-all relative overflow-hidden group inline-flex items-center gap-3 hover:bg-white/85"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                style={{ willChange: 'transform' }}
              >
                {/* Content */}
                <span className="relative z-10 font-semibold flex items-center gap-2">
                  <FileText size={20} />
                  Resume
                </span>
              </motion.a>

            </div>


            {/* Hero Section Right Side */}
            <div className="grid gap-6">

              {/* First Information Box */}
              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                // whileHover={{ scale: 1.1, y: -5 }}
                style={{ willChange: 'transform' }}
              >
                {/* First Information Box Header */}
                <div className="flex items-center gap-3 mb-3">
                  <User size={40} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">About Me</h3>
                </div>

                {/* First Information Box Content */}
                <p className="text-white">
                  I&apos;m Michael, an undergraduate at <strong> Duke University </strong> (B.S.E. expected May 2029) double majoring
                  in <strong> Electrical Computer Engineering</strong> & <strong>Computer Science</strong>.
                  I&apos;m primarily interested in <strong> embedded system design</strong>, especially in aerospace and robotics applications.
                  I also enjoy personal projects, particularly those involving complex engineering challenges.
                </p>
              </motion.div>

              {/* Second Information Box */}
              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                // whileHover={{ scale: 1.1, y: -5 }}
                style={{ willChange: 'transform' }}
              >
                {/* Second Information Box Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Blocks size={40} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">Skills</h3>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex} name={tag} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
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
      <section id="projects" className="py-28 relative" ref={projectsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >

            {/* EmblaCarousel for MDX Projects */}
            <EmblaCarousel

              // Build project cards using front-matter from MDX projects in content/projects
              slides={[...projects]
                .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
                .map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}

              // Other parameters
              cardWidth={411} // 379
              options={{ loop: false }}
              header={"Engineering Projects"}
            />
          </motion.div>
        </div>
      </section >

      {/* Experience Section */}
      <section id="experience" className="relative" ref={experienceRef}>
        <div className="container mx-auto px-10 -mt-32 py-18">
          <h2 className="text-4xl font-bold text-white text-left py-12">
            Relevant Experience
          </h2>
          <ExperienceTimeline experiences={experiences} />
        </div>
      </section>

      {/* Github Contribution Calendar */}
      <section className='relative'>
        <div className='container mx-auto px-10 flex justify-center py-32 -mt-10'>
          <GitHubCalendar
            username="mdanley1234"
            maxLevel={6}
            blockMargin={4}
            blockSize={10}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/20 -mt-24">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 Michael Danley. All rights reserved.</p>
        </div>
      </footer>
    </div >
  );
}