import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { useState } from 'react';
import Tag from './Tag.jsx'
import "./lib.css";

// ProjectCard component for individual project
export default function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (

    // Perspective container for project card
    <div
      style={{ perspective: "2200px" }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Animated outline behind card */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-white pointer-events-none"
        style={{
          transformOrigin: "center",
          zIndex: 0,
          scaleX: 0.97,
          scaleY: 0.97
        }}
        animate={isHovered ? {
          x: 20
        } : {
          x: 0
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      />

      {/* Build project card */}
      <motion.div
        className="project-card-bg group relative overflow-hidden rounded-2xl border border-white/20 hover:border-white h-[580px] flex flex-col card-background"
        style={{
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform"
        }}
        // Define hover swing animation
        whileHover={{
          rotateY: -15,
        }}
        whileTap={{ scale: 0.99 }}
        transition={{
          rotateY: { type: "spring", stiffness: 260, damping: 20, },
        }}
      >

        {/* Link to project details page */}
        <a href={`/projects/${project.slug}`} className="block h-full relative z-10">

          {/* Project Cover Image */}
          <div className="h-80 relative overflow-hidden flex-shrink-0">
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

          {/* Project Blurb */}
          <div className="p-6 flex-1 flex flex-col">

            {/* Project Title */}
            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>

            {/* Project Summary */}
            <p className="text-gray-400 flex-1">{project.summary}</p>

            {/* Project Tags */}
            <div className="flex gap-2 flex-wrap absolute bottom-6 left-6 w-full">
              {project.tags.map((tag, tagIndex) => (
                <Tag key={tagIndex} name={tag} />
              ))}
            </div>
          </div>
        </a>
      </motion.div>
    </div>
  );
}