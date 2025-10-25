"use client"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react" // 1. Import hook

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled />
  }

  return (
    <Button
      className="group"
      variant="outline"
      data-theme={theme}
      size="icon"
      onClick={() => {
        if (theme === "dark") {
          setTheme("system")
        } else if (theme === "light") {
          setTheme("dark")
        } else {
          setTheme("light")
        }
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all group-data-[theme=light]:scale-100 group-data-[theme=light]:rotate-0 text-primary" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all group-data-[theme=dark]:scale-100 group-data-[theme=dark]:rotate-0 text-primary" />
      <SunMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all group-data-[theme=system]:scale-100 group-data-[theme=system]:rotate-0 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}