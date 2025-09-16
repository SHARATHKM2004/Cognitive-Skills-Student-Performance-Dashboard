"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as XLSX from "xlsx"

interface FileUploadProps {
  onFileUpload: (data: any[]) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")

  const validateData = (data: any[]) => {
    const requiredColumns = [
      "student_id",
      "name",
      "class",
      "comprehension",
      "attention",
      "focus",
      "retention",
      "assessment_score",
      "engagement_time",
    ]

    if (data.length === 0) {
      throw new Error("File is empty")
    }

    const columns = Object.keys(data[0])
    const missingColumns = requiredColumns.filter((col) => !columns.includes(col))

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(", ")}`)
    }

    return true
  }

  const processFile = async (file: File) => {
    setUploadStatus("processing")
    setErrorMessage("")
    setFileName(file.name)

    try {
      const buffer = await file.arrayBuffer()
      let data: any[] = []

      if (file.name.endsWith(".csv")) {
        const text = new TextDecoder().decode(buffer)
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim())

        data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim())
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ""
          })
          return row
        })
      } else {
        const workbook = XLSX.read(buffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        data = XLSX.utils.sheet_to_json(worksheet)
      }

      validateData(data)
      setUploadStatus("success")

      setTimeout(() => {
        onFileUpload(data)
      }, 1000)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to process file")
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  })

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`cursor-pointer transition-colors border-2 border-dashed ${
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input {...getInputProps()} />

          {uploadStatus === "processing" ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">Processing {fileName}...</p>
            </>
          ) : uploadStatus === "success" ? (
            <>
              <CheckCircle className="h-8 w-8 text-primary mb-4" />
              <p className="text-sm font-medium text-primary">File uploaded successfully!</p>
              <p className="text-xs text-muted-foreground">{fileName}</p>
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2 text-balance">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4 text-pretty">or click to browse files</p>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supports CSV and Excel files</p>
            </>
          )}
        </CardContent>
      </Card>

      {uploadStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
