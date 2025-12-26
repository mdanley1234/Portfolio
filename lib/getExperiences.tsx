import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Experience {
  company: string;
  position: string;
  start: string;
  end: string;
}

/**
 * Used to parse and return front matter from all MDX experiences
 * @returns front matter from all MDX experiences
 */
export function getExperiences(): Experience[] {
  const EXPERIENCES_DIR = path.join(process.cwd(), 'content/experiences');
  const files = fs.readdirSync(EXPERIENCES_DIR);
  
  // Parse frontmatter from each file
  const experiences = files
    .map((filename): Experience => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(EXPERIENCES_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      
      return {
        company: data.company ?? "",
        position: data.position ?? "",
        start: data.start ?? "",
        end: data.end ?? "",
      };
    });
  
  return experiences;
}