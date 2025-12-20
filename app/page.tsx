import { getProjects } from '@/lib/getProjects';
import PageClient from './pageClient';

/**
 * Combines server and client homepage components
 * @returns website homepage
 */
export default function Page() {
    // Fetch projects using server function
    const projects = getProjects();

    // Pass projects to client and return homepage
    return <PageClient projects={projects} />;
}