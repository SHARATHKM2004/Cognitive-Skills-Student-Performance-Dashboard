"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

export default function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground bg-background/50 backdrop-blur-sm rounded-lg px-4 py-2 border">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(currentTime)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>
    </div>
  )
}
