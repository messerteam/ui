import { AlertTriangle, ListRestart, MoveRight, RefreshCw, RotateCcw, TimerOff, Trash2, Unlink } from 'lucide-react';
import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { InferGetServerSidePropsType } from 'next/types';
import { useEffect, useRef, useState, type FC } from 'react';
import { useMutation, useQuery } from 'react-query';
import Button from '~/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import type { Subtitle } from '~/types';
import { getAPI } from '~/utils/api';
import { getServerSideProps } from '~/utils/serverProps';
import { assembleToSeconds, dismantleSecs } from '~/utils/utils';



export { getServerSideProps };

const Edit = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { query, isReady: isRouterReady } = useRouter();
    const [originalSubs, setOriginalSubs] = useState<Subtitle[]>([]);
    const [fetchedSubs, setFetchedSubs] = useState<Subtitle[]>([]);
    const [updatingOriginalSubs, setUpdatingOriginalSubs] = useState<Subtitle[]>([]);
    const totalSubtitles = fetchedSubs.length;
    const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
    const [exportOptions, setExportOptions] = useState<string>("translated_subtitles");
    const currentSubtitle = fetchedSubs[currentSubtitleIndex];
    const videoRef = useRef<HTMLVideoElement>(null);
    const subtitlesQuery = useQuery('subtitles', () => getAPI(props.apiURL).getSubtitles(query.id).then((res) => {
        setFetchedSubs(res.subtitles.map((sub) => {
            return {
                ...sub,
                translatedText: ""
            }
        }) as Subtitle[]);
        setOriginalSubs(res.subtitles.map((sub) => {
            return {
                ...sub,
                translatedText: ""
            }
        }) as Subtitle[]);
        setUpdatingOriginalSubs(res.subtitles.map((sub) => {
            return {
                ...sub,
                translatedText: ""
            }
        }) as Subtitle[]);
    }
    ), {
        enabled: isRouterReady,
        refetchOnWindowFocus: false,
    });
    const exportVideoMutation = useMutation({
        mutationFn: async (params: any) => {
            setOpen(false);
            await getAPI(props.apiURL).exportVideo(query.id as string, exportOptions, params);
            setExported(true);
        }
    });
    const projectData = useQuery("project", () => getAPI(props.apiURL).getProject(query.id as string), {
        refetchOnWindowFocus: false,
        enabled: isRouterReady,
    });
    const [open, setOpen] = useState(false);
    const [exported, setExported] = useState(false);
    const subsInvalidRange = fetchedSubs.map((sub) => {
        return sub.start < sub.end;
    }).map((sub, i) => {
        return sub ? false : i;
    }).filter((sub) => {
        return sub !== false;
    });

    // Find overlapping subtitles
    // If a subtitle ends after another subtitle starts, it is overlapping
    const subsOverlapping = fetchedSubs.map((sub, i) => {
        if (i === fetchedSubs.length) return false;
        return sub.end > fetchedSubs[i + 1]?.start;
    }).map((sub, i) => {
        return sub ? i : false;
    }).filter((sub) => {
        return sub !== false;
    }) as number[];


    const changeCurrentSubtitle = (newSubtitle: number) => {
        if (newSubtitle < 0 || newSubtitle >= totalSubtitles) {
            return;
        }
        else if (newSubtitle === totalSubtitles) {
        }
        setCurrentSubtitleIndex(newSubtitle);
    }

    const changeCurrentTranslatedSubtitle = (newSubtitleText: string) => {
        const newSubs = [...fetchedSubs];
        if (newSubs[currentSubtitleIndex]) {
            const newSubtitle = newSubs[currentSubtitleIndex] as Subtitle;
            newSubs[currentSubtitleIndex] = {
                ...newSubtitle,
                translatedText: newSubtitleText
            };
        }

        setFetchedSubs(newSubs);
    }
    const changeCurrentOriginalSubtitle = (newSubtitleText: string) => {
        const newSubs = [...fetchedSubs];
        if (newSubs[currentSubtitleIndex]) {
            const newSubtitle = newSubs[currentSubtitleIndex] as Subtitle;
            newSubs[currentSubtitleIndex] = {
                ...newSubtitle,
                text: newSubtitleText
            };
        }

        setFetchedSubs(newSubs);
    }

    const deleteCurrentSubtitle = () => {
        if (totalSubtitles === 0) {
            // setSubs([]);
            // setTranslatedSubs([]);
            // setTotalSubtitles(0);
            // setCurrentSubtitle(0);
            return;
        }
        const newSubs = [...fetchedSubs];
        newSubs.splice(currentSubtitleIndex, 1);
        setFetchedSubs(newSubs);
        changeCurrentSubtitle(currentSubtitleIndex - 1);

        const newOriginalSubs = [...updatingOriginalSubs];
        newOriginalSubs.splice(currentSubtitleIndex, 1);
        setUpdatingOriginalSubs(newOriginalSubs);
    }

    const resetVideo = () => {
        if (document.fullscreenElement !== null) {
            return;
        }
        if (videoRef.current && currentSubtitle) {
            videoRef.current.pause();
            videoRef.current.currentTime = currentSubtitle.start ?? 0;
        }
    }
    const checkVideo = () => {
        if (document.fullscreenElement !== null) {
            return;
        }
        if (videoRef.current && currentSubtitle) {
            if (videoRef.current.currentTime < currentSubtitle.start || videoRef.current.currentTime > currentSubtitle.end) {
                videoRef.current.pause();
                videoRef.current.currentTime = currentSubtitle.start;

                // TODO: Maybe add this?
                // videoRef.current.play();
            }
        }
    }

    const updateCurrentSubtitle = (partSubtitle: Partial<Subtitle>) => {
        const newSubs = [...fetchedSubs];
        if (newSubs[currentSubtitleIndex]) {
            const newSubtitle = newSubs[currentSubtitleIndex] as Subtitle;
            newSubs[currentSubtitleIndex] = {
                ...newSubtitle,
                ...partSubtitle
            };
        }

        setFetchedSubs(newSubs);
    }

    const resetAllSubtitles = () => {
        setFetchedSubs([...originalSubs]);
    }

    const resetCurrentSubtitle = () => {
        const newSubs = [...fetchedSubs];
        newSubs[currentSubtitleIndex] = updatingOriginalSubs[currentSubtitleIndex];

        setFetchedSubs(newSubs);
    }

    useEffect(() => {
        resetVideo();
    }, [currentSubtitleIndex]);

    if (!isRouterReady || subtitlesQuery.isLoading) {
        return <div className="flex flex-col items-center text-center justify-center gap-4 m-auto w-1/2 text-xl">
            Loading...
        </div>;
    }

    return (
        <>
            <Head>
                <title>Edit</title>
            </Head>
            {(exportVideoMutation.isLoading || exported) && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40">
                <div className="bg-white rounded-xl p-10">
                    {
                        exported ?
                            <>
                                <h1 className="text-2xl font-bold mx-auto w-fit">Video Exported!</h1>
                                <Button variant={"link"} asChild>
                                    <Link href={{ pathname: `${props.apiURL}/video/download/${query.id}` }} target='_blank'>
                                        <span className="m-auto">
                                            Download Genereated Video
                                        </span>
                                    </Link>
                                </Button>
                            </> :
                            <>
                                <h1 className="text-2xl font-bold">Exporting Video...</h1>
                                <p className="text-lg">This can take several minutes</p>
                                <RefreshCw className='animate-spin mx-auto mt-3' />
                            </>
                    }

                </div>
            </div>
            }
            <div className="flex flex-col items-center text-center justify-center gap-2 m-auto w-[50%]">
                <ScrollArea className="w-full rounded-md border">
                    <div className='flex justify-between w-full'>
                        {fetchedSubs.map((sub, i) => {
                            const isInvalid = subsOverlapping.includes(i) || subsInvalidRange.includes(i);
                            const isCurrent = i === currentSubtitleIndex;
                            return <HoverCard key={i}>
                                <HoverCardTrigger asChild>
                                    <Button
                                        variant={isInvalid ? "destructive" : "ghost"}
                                        className={`flex gap-3 text-sm font-bold transition border-4 border-transparent ${isCurrent && "text-white bg-primary hover:bg-primary hover:text-white"} ${isInvalid && "border-b-red-500 rounded-none"}`}
                                        onClick={() => changeCurrentSubtitle(i)}
                                    >
                                        <span>
                                            {i + 1}
                                        </span>
                                    </Button>
                                </HoverCardTrigger>
                                {isInvalid &&
                                    <HoverCardContent className='flex flex-col text-sm text-red-500 bg-red-200 py-2 px-4 rounded-xl'>
                                        {subsOverlapping.includes(i) && <span>Overlapping</span>}
                                        {subsInvalidRange.includes(i) && <span>Invalid Range</span>}
                                    </HoverCardContent>
                                }
                            </HoverCard>
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className='flex gap-3 w-full select-none'>
                    <video
                        controls
                        className='transition z-30 w-1/2 m-auto grow rounded-md'
                        src={`${props.apiURL}/video?projectId=${query.id}`}
                        onTimeUpdate={() => {
                            checkVideo();
                        }}
                        ref={videoRef}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className='flex gap-3 items-center'>
                    <DurationEditor duration={currentSubtitle?.start ?? 0} onChange={(newDuration) => {
                        updateCurrentSubtitle({
                            start: newDuration
                        });
                    }}
                        otherDuration={{ duration: currentSubtitle?.end ?? 0, supposedToBe: "After" }}
                    />

                    <MoveRight className={`${subsInvalidRange.includes(currentSubtitleIndex) && "stroke-red-500"} transition`} />
                    <DurationEditor duration={currentSubtitle?.end ?? 0} onChange={(newDuration) => {
                        updateCurrentSubtitle({
                            end: newDuration
                        });
                    }}
                        otherDuration={{ duration: currentSubtitle?.start ?? 0, supposedToBe: "Before" }}
                    />
                    {subsOverlapping.includes(currentSubtitleIndex) &&
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className='bg-red-500 rounded-xl p-2 shrink-0'>
                                    <Unlink className='text-red-100' width={20} height={20} />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className='flex flex-col text-sm text-red-500 bg-red-200 py-2 px-4 rounded-xl'>
                                <span>
                                    This subtitle is overlapping with the next subtitle. The end time of this subtitle should be before the start time of the next subtitle.
                                </span>
                            </HoverCardContent>
                        </HoverCard>
                    }
                    {subsInvalidRange.includes(currentSubtitleIndex) &&
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className='bg-red-500 rounded-xl p-2 shrink-0'>
                                    <TimerOff className='text-red-100' width={20} height={20} />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className='flex flex-col text-sm text-red-500 bg-red-200 py-2 px-4 rounded-xl'>
                                <span>
                                    This subtitle has an invalid range. The start time should be before the end time.
                                </span>
                            </HoverCardContent>
                        </HoverCard>
                    }
                </div>
                <div className="grid w-full max-w-1/2 items-center gap-1.5">
                    <Label htmlFor="Original Subtitle" className='mr-auto'>
                        Original Subtitle
                    </Label>
                    <Input
                        id="Original Subtitle"
                        placeholder='Original Subtitle'
                        className='bg-[#dcdcdc] text-[#4f4f4f] placeholder:text-gray rounded-lg p-6 outline-none'
                        value={currentSubtitle?.text}
                        onChange={(e) => {
                            changeCurrentOriginalSubtitle(e.target.value)
                        }}
                    />
                </div>
                <div className="relative grid w-full max-w-1/2 items-center gap-1.5">
                    <Label htmlFor="Translated Subtitle" className='mr-auto'>
                        Translated Subtitle
                    </Label>
                    <Input
                        id="Translated Subtitle"
                        placeholder='Translated Subtitle'
                        value={currentSubtitle?.translatedText}
                        className='bg-slate-500 text-white placeholder:text-slate rounded-lg p-6 outline-none'
                        onChange={(e) => {
                            changeCurrentTranslatedSubtitle(e.target.value)
                        }}
                    />
                    <div className={`absolute right-1 top-2 flex items-center justify-center px-1 py-1 bg-orange-300 rounded-full transition ${currentSubtitle?.translatedText === "" ? "opacity-100" : "opacity-0"}`}>
                        <AlertTriangle className='stroke-orange-500' width={18} height={18} />
                    </div>

                </div>
                <div className='flex gap-3 items-center'>
                    <Button
                        variant="destructive"
                        className='flex gap-3 text-sm font-bold rounded-lg'
                        onClick={() => deleteCurrentSubtitle()}
                    >
                        <Trash2 width={20} height={20} />
                        <span>
                            Delete Subtitle
                        </span>
                    </Button>
                    <Button variant="ghost" className='flex gap-3 text-sm font-bold rounded-lg' onClick={() => resetCurrentSubtitle()}>
                        <RotateCcw width={20} height={20} />
                        <span>
                            Reset Subtitle
                        </span>
                    </Button>
                    <Button variant="ghost" className='flex gap-3 text-sm font-bold rounded-lg' onClick={() => resetAllSubtitles()}>
                        <ListRestart width={20} height={20} />
                        <span>
                            Reset All Subtitles
                        </span>
                    </Button>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                className='flex gap-2 my-auto text-lg font-bold text-white bg-green-500 hover:bg-green-500 hover:text-white hover:opacity-90 px-6'
                                variant="ghost"
                                disabled={subsInvalidRange.length > 0 || subsOverlapping.length > 0}
                            >
                                {/* <Check /> */}
                                <span>
                                    Finish
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 flex flex-col gap-4">
                            <Label htmlFor="Subtitles" className='mr-auto'>
                                Subtitles
                            </Label>
                            <RadioGroup
                                value={exportOptions}
                                onValueChange={(value) => {
                                    setExportOptions(value);
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="original_subs" id="r1" />
                                    <Label htmlFor="r1">original</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="translated_subtitles" id="r2" />
                                    <Label htmlFor="r2">translated</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="original_and_translated_subtitles" id="r3" />
                                    <Label htmlFor="r3">original + translated</Label>
                                </div>
                            </RadioGroup>
                            <Button
                                className='flex gap-2 my-auto text-xl font-bold text-white bg-green-500 hover:bg-green-500 hover:text-white hover:opacity-90'
                                variant="ghost"
                                disabled={subsInvalidRange.length > 0}
                                onClick={() => {
                                    console.log("fetchedSubs", fetchedSubs);

                                    const formData = new FormData();
                                    const times = fetchedSubs.map((sub) => {
                                        return [sub.start, sub.end]
                                    });
                                    const originalSubs = fetchedSubs.map((sub) => {
                                        return sub.text
                                    });
                                    const translatedSubs = fetchedSubs.map((sub) => {
                                        return sub.translatedText
                                    });
                                    formData.append('time', JSON.stringify(times));
                                    formData.append('original_text', JSON.stringify(originalSubs));
                                    formData.append('trans_text', JSON.stringify(translatedSubs));

                                    console.debug("formData", formData);

                                    exportVideoMutation.mutate(formData);
                                }}
                            >
                                <span>
                                    Export
                                </span>
                            </Button>
                            {projectData.data?.exported &&
                                <Link href={{ pathname: `${props.apiURL}/video/download/${query.id}` }} target='_blank'>
                                    <Button variant={"link"} asChild>
                                        <span className="m-auto">
                                            Download Already Genereated Video
                                        </span>
                                    </Button>
                                </Link>
                            }
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </>
    );
};

const DurationEditor: FC<{ duration: number, onChange: (newDuration: number) => void, otherDuration?: { duration: number; supposedToBe: "Before" | "After" } }> = ({ duration, onChange, otherDuration }) => {
    const { hours, minutes, seconds, milliseconds } = dismantleSecs(duration);
    const { hours: otherHours, minutes: otherMinutes, seconds: otherSeconds, milliseconds: otherMilliseconds } = dismantleSecs(otherDuration?.duration ?? 0);
    let hoursAreBad = false
    let minutesAreBad = false
    let secondsAreBad = false
    let millisecondsAreBad = false
    let isSame = duration === otherDuration?.duration;
    if (otherDuration) {
        if (otherDuration.supposedToBe === "After") {
            hoursAreBad = hours > otherHours;
            minutesAreBad = minutes > otherMinutes && hours === otherHours;
            secondsAreBad = seconds > otherSeconds && minutes === otherMinutes && hours === otherHours;
            millisecondsAreBad = milliseconds > otherMilliseconds && seconds === otherSeconds && minutes === otherMinutes && hours === otherHours;
        }
        else {
            hoursAreBad = hours < otherHours;
            minutesAreBad = minutes < otherMinutes && hours === otherHours;
            secondsAreBad = seconds < otherSeconds && minutes === otherMinutes && hours === otherHours;
            millisecondsAreBad = milliseconds < otherMilliseconds && seconds === otherSeconds && minutes === otherMinutes && hours === otherHours;
        }
    }

    const formatUnit = (unit: number, length: number) => {
        return unit.toString().padStart(length, "0");
    }

    return (
        <div className="flex items-center">
            <Input type="number" min="0" max="23" value={formatUnit(hours, 2)} className={`text-base text-black bg-transparent ${hoursAreBad || isSame ? "border-b-red-500" : "border-transparent"} border-b-2 w-[calc((2*16px)+(3*4px))] rounded-none transition`} onChange={(e) => {
                console.log(e.target.value);

                const newHours = e.target.value === "" ? 0 : parseInt(e.target.value);
                console.log("newHours", newHours);

                if (newHours > 23 || newHours < 0) return;

                onChange(assembleToSeconds(newHours, minutes, seconds, milliseconds));
                e.target.value = newHours.toString()
            }} />
            <span className='font-bold text-gray-400'>
                :
            </span>
            <Input type="number" min="0" max="59" value={formatUnit(minutes, 2)} className={`text-base text-black bg-transparent ${minutesAreBad || isSame ? "border-b-red-500" : "border-transparent"} border-b-2 w-[calc((2*16px)+(3*4px))] rounded-none transition`} onChange={(e) => {
                const newMinutes = e.target.value === "" ? 0 : parseInt(e.target.value);
                if (newMinutes > 59 || newMinutes < 0) return;
                onChange(assembleToSeconds(hours, newMinutes, seconds, milliseconds));
                e.target.value = newMinutes.toString()
            }} />
            <span className='font-bold text-gray-400'>
                :
            </span>
            <Input type="number" min="0" max="59" value={formatUnit(seconds, 2)} className={`text-base text-black bg-transparent ${secondsAreBad || isSame ? "border-b-red-500" : "border-transparent"} border-b-2 w-[calc((2*16px)+(3*4px))] rounded-none transition`} onChange={(e) => {
                const newSeconds = e.target.value === "" ? 0 : parseInt(e.target.value);
                if (newSeconds > 59 || newSeconds < 0) return;
                onChange(assembleToSeconds(hours, minutes, newSeconds, milliseconds));
                e.target.value = newSeconds.toString()
            }} />
            <span className='font-bold text-gray-400'>
                ,
            </span>
            <Input type="number" min="0" max="999" value={formatUnit(milliseconds, 3)} className={`text-base text-black bg-transparent ${millisecondsAreBad || isSame ? "border-b-red-500" : "border-transparent"} border-b-2 w-[calc((3*16px)+(3*4px))] rounded-none transition`} onChange={(e) => {
                const newMilliseconds = e.target.value === "" ? 0 : parseInt(e.target.value);
                if (newMilliseconds > 999 || newMilliseconds < 0) return;
                onChange(assembleToSeconds(hours, minutes, seconds, newMilliseconds));
                e.target.value = newMilliseconds.toString()
            }} />
        </div>
    );
}

export default Edit;
