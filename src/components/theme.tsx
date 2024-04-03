import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function ModeToggle() {
    const [mounted, setMounted] = React.useState(false)
    const { setTheme, theme, resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

    const nextTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-lg"
            onClick={nextTheme}
        >
            {currentTheme === "light" ?
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> :
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            }
        </Button>
    )
}