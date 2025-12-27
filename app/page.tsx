import { getProjects } from '@/lib/getProjects';
import PageClient from './pageClient';
import { getExperiences } from '@/lib/getExperiences';

/**
 * Combines server and client homepage components
 * @returns website homepage
 */
export default async function Page() {
    // Fetch projects using server function
    const projects = await getProjects();
    const experiences = await getExperiences();

    // Pass projects to client and return homepage
    return <PageClient projects={projects} experiences={experiences}/>;
}