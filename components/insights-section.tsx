"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, AlertTriangle, CheckCircle, Users, Target, Lightbulb, BookOpen, Star, Award } from "lucide-react"

interface InsightsSectionProps {
  data: any[]
  overviewStats: {
    totalStudents: number
    avgScore: number
    avgComprehension: number
    avgAttention: number
    avgFocus: number
    avgRetention: number
    avgEngagementTime: number
  }
}

export default function InsightsSection({ data, overviewStats }: InsightsSectionProps) {
  const insights = useMemo(() => {
    if (!data || data.length === 0) return null

    // Calculate correlations and patterns
    const scores = data.map((s) => Number.parseFloat(s.assessment_score || 0))
    const attention = data.map((s) => Number.parseFloat(s.attention || 0))
    const focus = data.map((s) => Number.parseFloat(s.focus || 0))
    const comprehension = data.map((s) => Number.parseFloat(s.comprehension || 0))
    const retention = data.map((s) => Number.parseFloat(s.retention || 0))
    const engagement = data.map((s) => Number.parseFloat(s.engagement_time || 0))

    // Performance categories
    const excellent = data.filter((s) => Number.parseFloat(s.assessment_score || 0) >= 90).length
    const good = data.filter(
      (s) => Number.parseFloat(s.assessment_score || 0) >= 80 && Number.parseFloat(s.assessment_score || 0) < 90,
    ).length
    const average = data.filter(
      (s) => Number.parseFloat(s.assessment_score || 0) >= 70 && Number.parseFloat(s.assessment_score || 0) < 80,
    ).length
    const belowAverage = data.filter(
      (s) => Number.parseFloat(s.assessment_score || 0) >= 60 && Number.parseFloat(s.assessment_score || 0) < 70,
    ).length
    const needsImprovement = data.filter((s) => Number.parseFloat(s.assessment_score || 0) < 60).length

    // Find strongest and weakest skills
    const skillAverages = {
      comprehension: overviewStats.avgComprehension,
      attention: overviewStats.avgAttention,
      focus: overviewStats.avgFocus,
      retention: overviewStats.avgRetention,
    }

    const strongestSkill = Object.entries(skillAverages).reduce((a, b) =>
      skillAverages[a[0] as keyof typeof skillAverages] > skillAverages[b[0] as keyof typeof skillAverages] ? a : b,
    )

    const weakestSkill = Object.entries(skillAverages).reduce((a, b) =>
      skillAverages[a[0] as keyof typeof skillAverages] < skillAverages[b[0] as keyof typeof skillAverages] ? a : b,
    )

    // Calculate simple correlation between attention and performance
    const avgAttentionScore = attention.reduce((sum, val) => sum + val, 0) / attention.length
    const avgPerformanceScore = scores.reduce((sum, val) => sum + val, 0) / scores.length

    let correlationSum = 0
    for (let i = 0; i < data.length; i++) {
      correlationSum += (attention[i] - avgAttentionScore) * (scores[i] - avgPerformanceScore)
    }

    const attentionPerformanceCorrelation = correlationSum / data.length

    // Identify students needing attention
    const strugglingStudents = data.filter(
      (s) =>
        Number.parseFloat(s.assessment_score || 0) < 70 ||
        Number.parseFloat(s.attention || 0) < 60 ||
        Number.parseFloat(s.focus || 0) < 60,
    )

    // High performers
    const topPerformers = data.filter(
      (s) =>
        Number.parseFloat(s.assessment_score || 0) >= 85 &&
        Number.parseFloat(s.attention || 0) >= 80 &&
        Number.parseFloat(s.focus || 0) >= 80,
    )

    // Class distribution
    const classDistribution = data.reduce(
      (acc, student) => {
        const className = student.class || "Unknown"
        if (!acc[className]) {
          acc[className] = { count: 0, totalScore: 0 }
        }
        acc[className].count++
        acc[className].totalScore += Number.parseFloat(student.assessment_score || 0)
        return acc
      },
      {} as Record<string, { count: number; totalScore: number }>,
    )

    const classPerformance = Object.entries(classDistribution)
      .map(([className, data]) => ({
        class: className,
        avgScore: data.totalScore / data.count,
        studentCount: data.count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)

    return {
      performanceDistribution: {
        excellent,
        good,
        average,
        belowAverage,
        needsImprovement,
      },
      strongestSkill,
      weakestSkill,
      attentionPerformanceCorrelation,
      strugglingStudents,
      topPerformers,
      classPerformance,
    }
  }, [data, overviewStats])

  if (!insights) {
    return <div>No insights available</div>
  }

  const getCorrelationInsight = (correlation: number) => {
    if (correlation > 10) return { text: "Strong positive correlation", color: "text-green-600" }
    if (correlation > 5) return { text: "Moderate positive correlation", color: "text-blue-600" }
    if (correlation > -5) return { text: "Weak correlation", color: "text-yellow-600" }
    return { text: "Negative correlation", color: "text-red-600" }
  }

  const correlationInsight = getCorrelationInsight(insights.attentionPerformanceCorrelation)

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Key Findings */}
      <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            Key Findings
          </CardTitle>
          <CardDescription>Important insights from the performance analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50 hover:bg-green-100 transition-colors duration-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Strongest Skill:</strong>{" "}
              {insights.strongestSkill[0].charAt(0).toUpperCase() + insights.strongestSkill[0].slice(1)}
              with an average score of {insights.strongestSkill[1].toFixed(1)}
            </AlertDescription>
          </Alert>

          <Alert className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>Area for Improvement:</strong>{" "}
              {insights.weakestSkill[0].charAt(0).toUpperCase() + insights.weakestSkill[0].slice(1)}
              needs attention with an average score of {insights.weakestSkill[1].toFixed(1)}
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Attention-Performance Link:</strong> There is a{" "}
              <span className={correlationInsight.color}>{correlationInsight.text.toLowerCase()}</span> between
              attention levels and assessment scores
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Target className="h-5 w-5 text-secondary" />
            </div>
            Performance Distribution
          </CardTitle>
          <CardDescription>Breakdown of student performance levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-green-600 mb-2 group-hover:animate-pulse">
                {insights.performanceDistribution.excellent}
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
              >
                Excellent (90+)
              </Badge>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:animate-pulse">
                {insights.performanceDistribution.good}
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
              >
                Good (80-89)
              </Badge>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2 group-hover:animate-pulse">
                {insights.performanceDistribution.average}
              </div>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
              >
                Average (70-79)
              </Badge>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-orange-600 mb-2 group-hover:animate-pulse">
                {insights.performanceDistribution.belowAverage}
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200"
              >
                Below Avg (60-69)
              </Badge>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-red-600 mb-2 group-hover:animate-pulse">
                {insights.performanceDistribution.needsImprovement}
              </div>
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200"
              >
                Needs Help (&lt;60)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Performance */}
      {insights.classPerformance.length > 1 && (
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-chart-3/10 rounded-full">
                <Users className="h-5 w-5 text-chart-3" />
              </div>
              Class Performance Comparison
            </CardTitle>
            <CardDescription>Average performance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.classPerformance.map((classData, index) => (
                <div
                  key={classData.class}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200 hover:shadow-sm animate-in slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="flex items-center gap-1">
                      {index === 0 && <Star className="h-3 w-3" />}
                      {index === 0 ? "Top" : `#${index + 1}`}
                    </Badge>
                    <span className="font-medium">Class {classData.class}</span>
                    <span className="text-sm text-muted-foreground">({classData.studentCount} students)</span>
                  </div>
                  <div className="text-lg font-semibold">{classData.avgScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Needing Attention */}
      {insights.strugglingStudents.length > 0 && (
        <Card className="hover:shadow-lg transition-all duration-300 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              Students Needing Additional Support
            </CardTitle>
            <CardDescription>
              {insights.strugglingStudents.length} students may benefit from extra attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.strugglingStudents.slice(0, 6).map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 hover:shadow-sm transition-all duration-200 animate-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">Class {student.class}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-700">
                      {Number.parseFloat(student.assessment_score || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
            {insights.strugglingStudents.length > 6 && (
              <p className="text-sm text-muted-foreground mt-3">
                And {insights.strugglingStudents.length - 6} more students...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Performers */}
      {insights.topPerformers.length > 0 && (
        <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              Top Performers
            </CardTitle>
            <CardDescription>
              {insights.topPerformers.length} students showing excellent performance across all metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.topPerformers.slice(0, 6).map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:shadow-sm transition-all duration-200 animate-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">Class {student.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {Number.parseFloat(student.assessment_score || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
            {insights.topPerformers.length > 6 && (
              <p className="text-sm text-muted-foreground mt-3">
                And {insights.topPerformers.length - 6} more top performers...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            Recommendations
          </CardTitle>
          <CardDescription>Actionable insights based on the data analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus on {insights.weakestSkill[0].charAt(0).toUpperCase() + insights.weakestSkill[0].slice(1)}
            </h4>
            <p className="text-sm text-blue-700 text-pretty">
              This skill shows the lowest average performance. Consider implementing targeted exercises and additional
              practice sessions.
            </p>
          </div>

          {insights.attentionPerformanceCorrelation > 5 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Leverage Attention-Performance Connection
              </h4>
              <p className="text-sm text-green-700 text-pretty">
                Strong correlation between attention and performance suggests that attention-building activities could
                significantly improve overall scores.
              </p>
            </div>
          )}

          {insights.strugglingStudents.length > overviewStats.totalStudents * 0.2 && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Implement Support Programs
              </h4>
              <p className="text-sm text-orange-700 text-pretty">
                {Math.round((insights.strugglingStudents.length / overviewStats.totalStudents) * 100)}% of students need
                additional support. Consider peer tutoring or small group interventions.
              </p>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-200">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Celebrate Success
            </h4>
            <p className="text-sm text-purple-700 text-pretty">
              Recognize the {insights.topPerformers.length} top performers and use them as peer mentors to help
              struggling students.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
