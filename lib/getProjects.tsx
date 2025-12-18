import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Project {
  slug: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  coverImage: string | null;
  tags: string[];
}

/**
 * Used to parse and return front matter from all MDX projects
 * @returns front matter from all MDX projects
 */
export function getProjects(): Project[] {
  const PROJECTS_DIR = path.join(process.cwd(), 'content/projects');
  const files = fs.readdirSync(PROJECTS_DIR);
  
  // Parse frontmatter from each file
  const projects = files
    .map((filename): Project => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(PROJECTS_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      
      return {
        slug,
        title: data.title ?? slug,
        start: data.start ?? "",
        end: data.end ?? "",
        summary: data.summary ?? "",
        coverImage: data.coverImage ?? null,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    });
  
  // .sort((a, b) => {
  //     if (!a.date || !b.date) return 0
  //     return new Date(b.date).getTime() - new Date(a.date).getTime()
  // });
  
  return projects;
}