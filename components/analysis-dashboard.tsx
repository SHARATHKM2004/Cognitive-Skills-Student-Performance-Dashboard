"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, TrendingUp, Award, Download, Github, Filter } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { jsPDF } from "jspdf"
import {
  Bar,
  BarChart,
  Scatter,
  ScatterChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import StudentTable from "@/components/student-table"
import InsightsSection from "@/components/insights-section"

interface AnalysisDashboardProps {
  data: any[]
  onBack: () => void
}

export default function AnalysisDashboard({ data, onBack }: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(data.map((student) => student.class))].filter(Boolean)
    return classes.sort()
  }, [data])

  const filteredData = useMemo(() => {
    if (classFilter === "all") return data
    return data.filter((student) => student.class === classFilter)
  }, [data, classFilter])

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null

    const avgScore =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.assessment_score || 0), 0) /
      filteredData.length
    const avgComprehension =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.comprehension || 0), 0) /
      filteredData.length
    const avgAttention =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.attention || 0), 0) / filteredData.length
    const avgFocus =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.focus || 0), 0) / filteredData.length
    const avgRetention =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.retention || 0), 0) / filteredData.length
    const avgEngagementTime =
      filteredData.reduce((sum, student) => sum + Number.parseFloat(student.engagement_time || 0), 0) /
      filteredData.length

    return {
      totalStudents: filteredData.length,
      avgScore: Math.round(avgScore * 10) / 10,
      avgComprehension: Math.round(avgComprehension * 10) / 10,
      avgAttention: Math.round(avgAttention * 10) / 10,
      avgFocus: Math.round(avgFocus * 10) / 10,
      avgRetention: Math.round(avgRetention * 10) / 10,
      avgEngagementTime: Math.round(avgEngagementTime * 10) / 10,
    }
  }, [filteredData])

  // Prepare chart data
  const skillScoreData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const skills = ["comprehension", "attention", "focus", "retention"]
    return skills.map((skill) => {
      const avgValue =
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student[skill] || 0), 0) / filteredData.length
      return {
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        score: Math.round(avgValue * 10) / 10,
      }
    })
  }, [filteredData])

  const attentionPerformanceData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    return filteredData.map((student) => ({
      attention: Number.parseFloat(student.attention || 0),
      performance: Number.parseFloat(student.assessment_score || 0),
      name: student.name,
    }))
  }, [filteredData])

  const studentProfileData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const avgProfile = {
      comprehension:
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student.comprehension || 0), 0) /
        filteredData.length,
      attention:
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student.attention || 0), 0) / filteredData.length,
      focus:
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student.focus || 0), 0) / filteredData.length,
      retention:
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student.retention || 0), 0) / filteredData.length,
      assessment:
        filteredData.reduce((sum, student) => sum + Number.parseFloat(student.assessment_score || 0), 0) /
        filteredData.length,
    }

    return [
      { skill: "Comprehension", value: Math.round(avgProfile.comprehension * 10) / 10, fullMark: 100 },
      { skill: "Attention", value: Math.round(avgProfile.attention * 10) / 10, fullMark: 100 },
      { skill: "Focus", value: Math.round(avgProfile.focus * 10) / 10, fullMark: 100 },
      { skill: "Retention", value: Math.round(avgProfile.retention * 10) / 10, fullMark: 100 },
      { skill: "Assessment", value: Math.round(avgProfile.assessment * 10) / 10, fullMark: 100 },
    ]
  }, [filteredData])

  const handleDownloadReport = async () => {
    setIsGeneratingPDF(true)

    setTimeout(() => {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      let yPosition = margin

      // Header
      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text("Student Performance Analysis Report", margin, yPosition)
      yPosition += 15

      // Date and filter info
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition)
      yPosition += 8
      pdf.text(`Filter: ${classFilter === "all" ? "All Classes" : `Class ${classFilter}`}`, margin, yPosition)
      yPosition += 15

      // Overview Statistics
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Overview Statistics", margin, yPosition)
      yPosition += 10

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      const stats = [
        `Total Students: ${overviewStats?.totalStudents}`,
        `Average Score: ${overviewStats?.avgScore}`,
        `Average Comprehension: ${overviewStats?.avgComprehension}`,
        `Average Attention: ${overviewStats?.avgAttention}`,
        `Average Focus: ${overviewStats?.avgFocus}`,
        `Average Retention: ${overviewStats?.avgRetention}`,
        `Average Engagement Time: ${overviewStats?.avgEngagementTime} minutes`,
      ]

      stats.forEach((stat) => {
        pdf.text(stat, margin, yPosition)
        yPosition += 6
      })

      yPosition += 10

      // Student Performance Table
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Student Performance Details", margin, yPosition)
      yPosition += 10

      // Table headers
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      const headers = ["Name", "Class", "Score", "Comprehension", "Attention", "Focus", "Retention"]
      let xPosition = margin
      const colWidth = (pageWidth - 2 * margin) / headers.length

      headers.forEach((header) => {
        pdf.text(header, xPosition, yPosition)
        xPosition += colWidth
      })
      yPosition += 8

      // Table data
      pdf.setFont("helvetica", "normal")
      filteredData.slice(0, 20).forEach((student) => {
        // Limit to first 20 students for PDF
        if (yPosition > 250) {
          // Add new page if needed
          pdf.addPage()
          yPosition = margin
        }

        xPosition = margin
        const rowData = [
          student.name || "N/A",
          student.class || "N/A",
          student.assessment_score || "N/A",
          student.comprehension || "N/A",
          student.attention || "N/A",
          student.focus || "N/A",
          student.retention || "N/A",
        ]

        rowData.forEach((data) => {
          pdf.text(String(data).substring(0, 12), xPosition, yPosition) // Truncate long text
          xPosition += colWidth
        })
        yPosition += 6
      })

      // Footer
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = margin
      } else {
        yPosition += 20
      }

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "italic")
      pdf.text("Report generated by Student Performance Dashboard", margin, yPosition)
      yPosition += 6
      pdf.text("Created by Sharath KM - REVA University", margin, yPosition)

      // Save the PDF
      pdf.save(`student-performance-report-${new Date().toISOString().split("T")[0]}.pdf`)
      setIsGeneratingPDF(false)
    }, 2000)
  }

  if (!overviewStats) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-green-50/30 to-blue-50/50 dark:from-blue-950/20 dark:via-green-950/10 dark:to-blue-950/20 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: "url(/images/classroom-bg.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-green-100/10 to-blue-100/20 dark:from-blue-900/10 dark:via-green-900/5 dark:to-blue-900/10" />

      <ThemeToggle />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in-50 slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-muted-foreground text-pretty">
              Comprehensive performance analysis of {overviewStats.totalStudents} students
              {classFilter !== "all" && ` in Class ${classFilter}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownloadReport} disabled={isGeneratingPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF Report"}
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Upload
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 animate-in fade-in-50 slide-in-from-top-4 duration-500 delay-100">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map((className) => (
                <SelectItem key={className} value={className}>
                  Class {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit animate-in fade-in-50 slide-in-from-top-4 duration-500 delay-200">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="transition-all duration-200"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "charts" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("charts")}
            className="transition-all duration-200"
          >
            Charts
          </Button>
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("students")}
            className="transition-all duration-200"
          >
            Students
          </Button>
          <Button
            variant={activeTab === "insights" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("insights")}
            className="transition-all duration-200"
          >
            Insights
          </Button>
        </div>

        {/* Overview Stats */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.totalStudents}</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.avgScore}</div>
                  <p className="text-xs text-muted-foreground">Assessment performance</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Comprehension</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.avgComprehension}</div>
                  <p className="text-xs text-muted-foreground">Understanding level</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Avg Engagement</CardTitle>
                  <CardDescription>Minutes per session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.avgEngagementTime}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>Average performance across key skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attention</span>
                    <span className="font-medium">{overviewStats.avgAttention}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Focus</span>
                    <span className="font-medium">{overviewStats.avgFocus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention</span>
                    <span className="font-medium">{overviewStats.avgRetention}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Highest Score</span>
                    <span className="font-medium">
                      {Math.max(...filteredData.map((s) => Number.parseFloat(s.assessment_score || 0)))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lowest Score</span>
                    <span className="font-medium">
                      {Math.min(...filteredData.map((s) => Number.parseFloat(s.assessment_score || 0)))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score Range</span>
                    <span className="font-medium">
                      {Math.max(...filteredData.map((s) => Number.parseFloat(s.assessment_score || 0))) -
                        Math.min(...filteredData.map((s) => Number.parseFloat(s.assessment_score || 0)))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <CardTitle>Skills vs Average Scores</CardTitle>
                <CardDescription>Comparison of performance across different skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Average Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillScoreData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="skill" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} animationDuration={200} />
                      <Bar
                        dataKey="score"
                        fill="var(--color-chart-1)"
                        radius={[4, 4, 0, 0]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <CardTitle>Attention vs Performance</CardTitle>
                <CardDescription>Correlation between attention levels and assessment scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    performance: {
                      label: "Performance",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={attentionPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="attention" name="Attention" />
                      <YAxis dataKey="performance" name="Performance" />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg animate-in fade-in-0 duration-200">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm">Attention: {data.attention}</p>
                                <p className="text-sm">Performance: {data.performance}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        animationDuration={200}
                      />
                      <Scatter
                        dataKey="performance"
                        fill="var(--color-chart-2)"
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <CardTitle>Average Student Profile</CardTitle>
                <CardDescription>Overall class performance across all measured skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Score",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={studentProfileData}>
                      <PolarGrid className="opacity-30" />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Average Score"
                        dataKey="value"
                        stroke="var(--color-chart-3)"
                        fill="var(--color-chart-3)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        className="hover:fill-opacity-50 transition-all duration-300"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && <StudentTable data={filteredData} />}

        {/* Insights Tab */}
        {activeTab === "insights" && <InsightsSection data={filteredData} overviewStats={overviewStats} />}

        <div className="mt-16 text-center">
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/reva-logo.png" alt="REVA University Logo" className="w-8 h-8 object-contain" />
              <span className="font-medium">REVA University</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Created by Sharath KM</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://github.com/SHARATHKM2004/Cognitive-Skills-Student-Performance-Dashboard",
                    "_blank",
                  )
                }
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
