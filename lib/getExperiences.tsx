import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';

export interface Experience {
  company: string;
  position: string;
  start: string;
  end: string;
  slug: string;
  content: React.ReactElement; // The compiled MDX content
}

/**
 * Used to parse and return front matter and compiled MDX from all experiences
 * @returns front matter and content from all MDX experiences
 */
export async function getExperiences(): Promise<Experience[]> {
  const EXPERIENCES_DIR = path.join(process.cwd(), 'content/experiences');
  const files = fs.readdirSync(EXPERIENCES_DIR);
  
  // Parse frontmatter and compile MDX from each file
  const experiences = await Promise.all(
    files.map(async (filename): Promise<Experience> => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(EXPERIENCES_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: mdxContent } = matter(fileContent);
      
      // Compile the MDX content
      const { content } = await compileMDX({
        source: mdxContent,
        options: {
          parseFrontmatter: false, // We already parsed it with gray-matter
        },
      });
      
      return {
        company: data.company ?? "",
        position: data.position ?? "",
        start: data.start ?? "",
        end: data.end ?? "",
        slug,
        content, // This is the compiled React component
      };
    })
  );
  
  return experiences;
}