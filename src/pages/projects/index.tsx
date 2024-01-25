import { Download, Pencil } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { useQuery } from 'react-query';
import type { Project } from '~/types';
import { getServerSideProps } from '~/utils/serverProps';
import type { InferGetServerSidePropsType } from 'next/types';
import { getAPI } from '~/utils/api';
import Button from '~/components/ui/button';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

dayjs.extend(relativeTime);
export { getServerSideProps };

const ProjectsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const PROJECTS_PER_PAGE = 6;
    const [page, setPage] = React.useState(1);
    const projectsApi = useQuery<Project[]>('projects', async () => {
        return getAPI(props.apiURL).getProjects().then((res) => {
            const projects = [...res]
            projects.sort((a, b) => dayjs(b.ctime).unix() - dayjs(a.ctime).unix());
            return projects;
        });
    }, { refetchOnWindowFocus: false, onError: () => toast.error("Failed to load projects") });

    const currentProjects = projectsApi.data?.slice((page - 1) * PROJECTS_PER_PAGE, page * PROJECTS_PER_PAGE);

    return (
        <>
            <Head>
                <title>
                    Projects
                </title>
            </Head>
            <div className="flex flex-col items-center text-center justify-between gap-4 m-auto w-full max-w-[90%] p-10 h-fit">
                <h1 className="text-4xl font-bold">Projects</h1>
                <div className='w-full rounded-xl border overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-secondary'>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Additional Info</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                if (projectsApi.isLoading) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4} className='text-center'>Loading...</TableCell>
                                        </TableRow>
                                    );
                                } else if (projectsApi.isError) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4} className='text-center text-red-500'>Failed to load projects</TableCell>
                                        </TableRow>
                                    );
                                } else if (projectsApi.data?.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4} className='text-center text-gray-500'>No projects found</TableCell>
                                        </TableRow>
                                    );
                                }

                                return currentProjects?.map((project) => (
                                    <TableRow key={project.id} className='text-left'>
                                        <TableCell>{project.title}</TableCell>
                                        <TableCell className='truncate max-w-[200px] w-fit'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        {project.description}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {project.description}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className='truncate max-w-[200px]'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        {project.additionalInfo}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {project.additionalInfo}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className='text-gray-500'>
                                                        {dayjs(project.ctime).fromNow()}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {dayjs(project.ctime).format('YYYY-MM-DD HH:mm:ss')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className='text-gray-500'>
                                                        {dayjs(project.mtime).fromNow()}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {dayjs(project.mtime).format('YYYY-MM-DD HH:mm:ss')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                <Link
                                                    href={{ pathname: `${props.apiURL}/video/download/${project.id}` }}
                                                    target='_blank'
                                                    className='bg-green-500 rounded p-2'
                                                >
                                                    <Download width={20} height={20} className='stroke-white' />
                                                </Link>
                                                <Link
                                                    href={{
                                                        pathname: "/generate",
                                                        query: { id: project.id },
                                                    }}
                                                    className='bg-primary rounded p-2'
                                                >
                                                    <Pencil width={20} height={20} className='stroke-white' />
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ));
                            })()}
                        </TableBody>
                    </Table>
                    {projectsApi.data && projectsApi.data.length > 0 &&
                        <p className='w-full text-sm py-2 border-t-2 text-center text-gray-500'>
                            Page {page} of {Math.ceil(projectsApi.data?.length / PROJECTS_PER_PAGE)}
                        </p>
                    }
                </div>
                <div className="flex gap-2 justify-end w-full items-center">
                    <Button variant='secondary' onClick={() => setPage(page - 1)} disabled={!projectsApi.data || projectsApi.data.length === 0 || page === 1}>Previous</Button>
                    <Button variant='secondary' onClick={() => setPage(page + 1)} disabled={!projectsApi.data || projectsApi.data.length === 0 || page === Math.ceil(projectsApi.data?.length / PROJECTS_PER_PAGE)}>Next</Button>
                </div>
            </div >
        </>
    );
};

export default ProjectsPage;
