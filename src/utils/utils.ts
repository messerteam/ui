import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSecs(secs: number) {
    // Format seconds to HH:MM:SS.mmm

    const { hours, minutes, seconds, milliseconds } = dismantleSecs(secs)

    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`
}

export function dismantleSecs(secs: number) {
    // Dismantle seconds to {hours, minutes, seconds, milliseconds}

    const hours = Math.floor(secs / 3600)
    const minutes = Math.floor(secs / 60) % 60
    const seconds = Math.floor(secs % 60)
    const milliseconds = Math.round(secs * 1000) % 1000

    return { hours, minutes, seconds, milliseconds }
}

export function assembleToSeconds(hours: number, minutes: number, seconds: number, milliseconds: number) {
    // Assemble {hours, minutes, seconds, milliseconds} to seconds

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
}

export const generateWords = (count: number) => {
    return Array.from({ length: count }, () => {
        return Math.random().toString(36).substr(2, 9)
    }).join(' ')
}