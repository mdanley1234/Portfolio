import { motion } from 'framer-motion';
import Image from 'next/image';
import { Code } from 'lucide-react';
import { useState } from 'react';
import Tag from './Tag.jsx'
import "./lib.css";

/**
 * ProjectCard component for individual project.
 *
 * One design, drawn at whatever size the carousel has room for. `--card-w` is
 * the width the track allotted; it sets the card's own font size, and every
 * measurement below — padding, type, tags, the cover — is expressed against
 * that rather than in pixels. So the card is a true scale of itself at one per
 * view or at four, instead of a fixed-width card that has to be cropped or
 * pushed off-centre to fit.
 *
 * The scale is anchored to the card as it was before it could scale: at 379px
 * wide it draws 16px type over a 320px cover, which is why the divisor and the
 * cover ratio are the numbers they are. A laptop lands on exactly that card;
 * everything else is that same card larger or smaller.
 *
 * The font size is clamped at both ends: below ~13.5px the summary stops being
 * comfortable to read, and past 17px the card reads as a poster rather than an
 * index entry. Between those the scale is linear.
 *
 * Height is the one thing not set here. The card stretches to its slide, and
 * the slides are a flex row, so every card in the carousel is as tall as the
 * one with the most to say and no taller — which is why a wide card with a
 * short summary no longer opens a hole above its tags.
 */
export default function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (

    // Perspective container for project card
    <div
      style={{
        perspective: "2200px",
        width: "var(--card-w, 379px)",
        maxWidth: "100%",
        marginInline: "auto",
        fontSize: "clamp(13.5px, calc(var(--card-w, 379px) / 23.7), 17px)"
      }}
      className="relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Animated outline behind card */}
      <motion.div
        className="absolute inset-0 rounded-[1em] border-2 border-white pointer-events-none"
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
        className="project-card-bg group relative overflow-hidden rounded-[1em] border border-white/20 hover:border-white flex flex-1 flex-col card-background"
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
        <a href={`/projects/${project.slug}`} className="relative z-10 flex min-h-0 flex-1 flex-col">

          {/* Project Cover Image */}
          {/* The cover is a constant share of the card's width, so its aspect —
              and therefore how much of the photograph `object-cover` keeps — is
              the same on a phone as on a desktop. A narrower card gets a
              proportionally shorter cover, never a tighter crop of the same
              box. The em ceiling stops it running away on the one width where a
              single card has the whole track to itself. */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{ height: "min(calc(var(--card-w, 379px) * 0.845), 22em)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 767px) 92vw, 440px"
                  className="object-cover"
                />
              ) : (
                <Code size="3em" className="text-white/50" />
              )}
            </div>
          </div>

          {/* Project Blurb */}
          <div className="p-[1.5em] flex-1 flex flex-col min-h-0">

            {/* Project Title */}
            <h3 className="text-[1.25em] font-semibold text-white mb-[0.4em] leading-snug">{project.title}</h3>

            {/* Project Summary */}
            <div className="min-h-0 flex-1 overflow-hidden">
              <p className="text-gray-400 leading-[1.5em] line-clamp-5">{project.summary}</p>
            </div>

            {/* Project Tags */}
            <div className="shrink-0 pt-[1em] flex gap-[0.5em] flex-wrap">
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
