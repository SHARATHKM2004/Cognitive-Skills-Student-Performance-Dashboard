"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, BarChart3, TrendingUp, Github, CheckCircle, ArrowRight, Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import DateTimeDisplay from "@/components/date-time-display"
import FAQSection from "@/components/faq-section"
import FileUpload from "@/components/file-upload"
import AnalysisDashboard from "@/components/analysis-dashboard"

export default function HomePage() {
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [fullDataset, setFullDataset] = useState<any[]>([])

  const handleFileUpload = async (data: any[]) => {
    setFullDataset(data)
    setPreviewData(data.slice(0, 5))
    setShowPreview(true)
  }

  const handleConfirmAnalysis = () => {
    setShowPreview(false)
    setIsAnalyzing(true)
    setUploadedData(fullDataset)

    // Simulate 10-second analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 10000)
  }

  const handleBackToUpload = () => {
    setShowResults(false)
    setUploadedData([])
    setPreviewData([])
    setShowPreview(false)
    setIsAnalyzing(false)
    setFullDataset([])
  }

  const handleDownloadSample = async (format: "csv" | "excel") => {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/synthetic_student_dataset_5000-763xClDuVTA5vjMj5jEzYwF72q8DbP.csv",
      )
      const csvData = await response.text()

      if (format === "csv") {
        const blob = new Blob([csvData], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "sample_student_dataset.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        // Convert CSV to Excel format (simplified - in production use a proper library)
        const blob = new Blob([csvData], { type: "application/vnd.ms-excel" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "sample_student_dataset.xls"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error downloading sample dataset:", error)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/images/classroom-bg.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

        <Card className="w-full max-w-md relative z-10 animate-in fade-in-50 duration-500">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-transparent border-t-secondary/50"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-balance animate-pulse">Analyzing Performance Data</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Processing cognitive skills and generating comprehensive insights...
                </p>
              </div>
              <div className="w-full space-y-2">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full animate-pulse transition-all duration-1000"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing...</span>
                  <span>85%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ThemeToggle />
      </div>
    )
  }

  if (showResults) {
    return <AnalysisDashboard data={uploadedData} onBack={handleBackToUpload} />
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
        <div className="flex justify-center mb-6 animate-in fade-in-50 duration-500">
          <DateTimeDisplay />
        </div>

        <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            📊 Cognitive Skills & Student Performance Analysis
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Performance Dashboard
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Upload your dataset (CSV/XLSX) to generate insights and dashboards.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
          <Card className="border-2 border-dashed border-primary/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-balance">Simple Steps to Get Started</CardTitle>
              <CardDescription className="text-lg text-pretty">
                Follow these easy steps to analyze your student performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">1. Choose File</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Select your CSV or Excel file with student data
                  </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold">2. Auto-Generate</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Dashboard automatically generates insights
                  </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-chart-3" />
                  </div>
                  <h3 className="font-semibold">3. Explore Results</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Explore results via interactive tabs and download reports
                  </p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-3 text-center">Need sample data to test?</h4>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSample("csv")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSample("excel")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Excel Sample
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <FileSpreadsheet className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="text-lg">Smart Data Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pretty">
                Drag & drop CSV or Excel files with instant validation and preview
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <BarChart3 className="h-10 w-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="text-lg">Interactive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pretty">
                Dynamic charts with filters, animations, and real-time insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <TrendingUp className="h-10 w-10 text-chart-3 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="text-lg">Actionable Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pretty">
                AI-powered recommendations with downloadable PDF reports
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {showPreview && (
          <div className="max-w-4xl mx-auto mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Data Preview - First 5 Rows
                </CardTitle>
                <CardDescription>Review your data before proceeding with analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <th key={key} className="text-left p-2 font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="p-2">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleConfirmAnalysis} className="flex items-center gap-2">
                    Proceed with Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Upload Different File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!showPreview && (
          <div className="max-w-2xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-400">
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl text-balance">Upload Student Data</CardTitle>
                <CardDescription className="text-pretty">
                  Select a CSV or Excel file containing student performance data to begin analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-600">
          <FAQSection />
        </div>

        <div className="mt-16 text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/reva-logo.png" alt="REVA University Logo" className="w-10 h-10 object-contain" />
              <span className="font-medium text-lg">REVA University</span>
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
