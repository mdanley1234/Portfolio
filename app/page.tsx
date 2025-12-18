// app/page.tsx (Server Component - remove 'use client')
import { getProjects } from '@/lib/getProjects';
import PageClient from './pageClient';

export default function Page() {
  const projects = getProjects();
  
  return <PageClient projects={projects} />;
}