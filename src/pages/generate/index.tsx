/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect } from 'react';
import Head from "next/head";
import { Plus, RefreshCw } from 'lucide-react';
import { Input } from '~/components/ui/input';
import Button from '~/components/ui/button';
import Image from 'next/image';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import { getServerSideProps } from '~/utils/serverProps';
import type { InferGetServerSidePropsType } from 'next/types';
import { getAPI } from '~/utils/api';

const formSchema = z.object({
    title: z.string().min(1, { message: "Please enter a title" }),
    description: z.string().min(1, { message: "Please enter a description" }),
    additionalInfo: z.string().min(1, { message: "Please enter additional info" }),
    file: z.custom<FileList>()
        .refine(
            (files) => {
                if (!files) {
                    return true;
                }
                return files.length === 1;
            },
            {
                // If the refinement fails, throw an error with this message
                message: 'Expected one file',
            },
        )
        .refine(
            (files) => {
                if (!files) {
                    return true;
                }
                // Check if all items in the array are instances of the File object
                return Array.from(files).every((file) => file instanceof File)
            },
            {
                // If the refinement fails, throw an error with this message
                message: 'Expected a file',
            },
        ),
})

export { getServerSideProps };

const Generate = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);
    const [generating, setGenerating] = React.useState(false);
    const { id } = router.query;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            additionalInfo: "",
            description: "",
            title: "",
            file: undefined,
        },
    })
    const projectData = useQuery("project", () => getAPI(props.apiURL).getProject(id as string), {
        enabled: !!id,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            form.setValue("title", data.title);
            form.setValue("description", data.description);
            form.setValue("additionalInfo", data.additionalInfo);
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('additionalInfo', values.additionalInfo);
        if (!!id) {
            formData.append('id', id as string);
            await getAPI(props.apiURL).updateProject(id as string, formData)
            toast.success("Project information updated!")
            return router.push({ query: { id: id }, pathname: '/edit' })
        }


        formData.append('file', values.file[0]);

        setGenerating(true);
        getAPI(props.apiURL).createSubtitles(formData)
            .then(data => {
                console.log(data);
                const { project_id } = data;
                toast.success("Subtitles generated!")
                router.push({ query: { id: project_id }, pathname: '/edit' })
            })
            .catch(error => {
                console.error(error)
                toast.error("Error occured while generating subtitles...")
            }).finally(() => {
                setGenerating(false);
            })
    }

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!router.isReady || form.formState.isLoading || projectData.isLoading || !mounted) {
        return <div className="flex flex-col items-center text-center justify-center gap-4 m-auto w-1/2 text-xl">
            Loading...
        </div>;
    }

    return (
        <>
            <Head>
                <title>Generate</title>
            </Head>
            <div id="div1" className="flex flex-col items-center text-center justify-center gap-2 h-full">
                {generating && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-10">
                        <h1 className="text-2xl font-bold">Generating Subtitles</h1>
                        <p className="text-lg">This may take a while</p>
                        <RefreshCw className='animate-spin mx-auto mt-3' />
                    </div>
                </div>
                }
                <div id="div2" className='flex flex-col gap-3 mb-7'>
                    <Image src="/favicon.ico" alt="Logo" width={150} height={150} />
                    <h1 className="text-4xl font-bold">Messer</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter Title" {...field} className='border' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter Description" {...field} className='border' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additionalInfo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter additional info" {...field} className='border' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="file"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            id="file"
                                            type="file"
                                            placeholder="Enter Video"
                                            multiple={false}
                                            accept='video/*'
                                            disabled={id !== undefined}
                                            {...form.register('file')}
                                            className='border'
                                        />
                                        {/* <div {...getRootProps({ className: 'dropzone' })} className='border p-5 py-8 text-xl w-full'>
                                            <input {...getInputProps()} />
                                            <p>Drop video clips here</p>
                                            {acceptedFiles.length > 0 && <p>({acceptedFiles[0]?.name})</p>}
                                        </div> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="flex gap-4 rounded-xl justify-between px-7 py-3 text-lg h-fit w-full" type="submit" disabled={generating}>
                            {!id && <div className="bg-white rounded-full p-1">
                                <Plus className="stroke-primary" width={16} height={16} />
                            </div>}
                            <span className="m-auto">
                                {id ? "Next" : "Generate Subtitles"}
                            </span>
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default Generate;
