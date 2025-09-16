"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

const faqData = [
  {
    question: "What happens to my data?",
    answer:
      "Your data is processed entirely in your browser and is never sent to external servers. All analysis is performed locally, ensuring complete privacy and security of your student information.",
  },
  {
    question: "What if my CSV is missing values?",
    answer:
      "The system will automatically handle missing values by excluding them from calculations. However, for best results, ensure your dataset includes all required columns: student_id, name, class, comprehension, attention, focus, retention, assessment_score, and engagement_time.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "The dashboard supports both CSV (.csv) and Excel (.xlsx, .xls) file formats. Files should contain student performance data with the specified column structure.",
  },
  {
    question: "How accurate are the insights generated?",
    answer:
      "Insights are generated based on statistical analysis of your actual data. The accuracy depends on the quality and completeness of your dataset. Larger datasets typically provide more reliable insights.",
  },
  {
    question: "Can I filter data by specific criteria?",
    answer:
      "Yes! You can filter the analysis by class using the dropdown filter above the charts. This allows you to focus on specific groups of students and compare performance across different classes.",
  },
  {
    question: "How do I interpret the radar chart?",
    answer:
      "The radar chart shows the average performance across all measured skills. Values closer to the outer edge indicate higher performance in that skill area. This provides a quick visual overview of class strengths and areas for improvement.",
  },
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>Common questions about the Student Performance Dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium text-pretty">{faq.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
            {openItems.includes(index) && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
