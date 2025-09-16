"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface StudentTableProps {
  data: any[]
}

type SortField =
  | "name"
  | "class"
  | "assessment_score"
  | "comprehension"
  | "attention"
  | "focus"
  | "retention"
  | "engagement_time"
type SortDirection = "asc" | "desc"

export default function StudentTable({ data }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [classFilter, setClassFilter] = useState<string>("all")

  // Get unique classes for filter
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(data.map((student) => student.class))].filter(Boolean)
    return classes.sort()
  }, [data])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((student) => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toString().includes(searchTerm)

      const matchesClass = classFilter === "all" || student.class === classFilter

      return matchesSearch && matchesClass
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle numeric fields
      if (
        ["assessment_score", "comprehension", "attention", "focus", "retention", "engagement_time"].includes(sortField)
      ) {
        aValue = Number.parseFloat(aValue) || 0
        bValue = Number.parseFloat(bValue) || 0
      }

      // Handle string fields
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [data, searchTerm, sortField, sortDirection, classFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90)
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200">
          Excellent
        </Badge>
      )
    if (score >= 80)
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200">Good</Badge>
    if (score >= 70)
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200">
          Average
        </Badge>
      )
    if (score >= 60)
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200">
          Below Average
        </Badge>
      )
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200">
        Needs Improvement
      </Badge>
    )
  }

  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Student Performance Table</CardTitle>
          <CardDescription>
            Detailed view of individual student performance data ({filteredAndSortedData.length} of {data.length}{" "}
            students)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-48 transition-all duration-200 hover:border-primary/50">
                <SelectValue placeholder="Filter by class" />
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

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 transition-colors duration-200">
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Name {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("class")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Class {getSortIcon("class")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("assessment_score")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Score {getSortIcon("assessment_score")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("comprehension")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Comprehension {getSortIcon("comprehension")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("attention")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Attention {getSortIcon("attention")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("focus")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Focus {getSortIcon("focus")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("retention")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Retention {getSortIcon("retention")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("engagement_time")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors duration-200"
                    >
                      Engagement {getSortIcon("engagement_time")}
                    </Button>
                  </TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((student, index) => (
                  <TableRow
                    key={student.student_id || index}
                    className="hover:bg-muted/50 transition-all duration-200 hover:shadow-sm animate-in fade-in-0 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell className="font-semibold">
                      {Number.parseFloat(student.assessment_score || 0).toFixed(1)}
                    </TableCell>
                    <TableCell>{Number.parseFloat(student.comprehension || 0).toFixed(1)}</TableCell>
                    <TableCell>{Number.parseFloat(student.attention || 0).toFixed(1)}</TableCell>
                    <TableCell>{Number.parseFloat(student.focus || 0).toFixed(1)}</TableCell>
                    <TableCell>{Number.parseFloat(student.retention || 0).toFixed(1)}</TableCell>
                    <TableCell>{Number.parseFloat(student.engagement_time || 0).toFixed(1)}m</TableCell>
                    <TableCell>{getPerformanceBadge(Number.parseFloat(student.assessment_score || 0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground animate-in fade-in-50 duration-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No students found</p>
              <p className="text-sm">Try adjusting your search criteria or filters.</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-200">
                  {filteredAndSortedData.length > 0
                    ? (
                        filteredAndSortedData.reduce(
                          (sum, student) => sum + Number.parseFloat(student.assessment_score || 0),
                          0,
                        ) / filteredAndSortedData.length
                      ).toFixed(1)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Average Score (Filtered)</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-200">
                  {filteredAndSortedData.length > 0
                    ? Math.max(...filteredAndSortedData.map((s) => Number.parseFloat(s.assessment_score || 0)))
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Highest Score (Filtered)</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-orange-600 group-hover:scale-105 transition-transform duration-200">
                  {filteredAndSortedData.length > 0
                    ? Math.min(...filteredAndSortedData.map((s) => Number.parseFloat(s.assessment_score || 0)))
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Lowest Score (Filtered)</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
