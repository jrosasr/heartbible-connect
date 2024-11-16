import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, BookOpen, } from "lucide-react"
import { Reminder } from './page'
import { useState, useEffect } from "react"

type StatisticsCardsProps = {
  reminders: Reminder[]
}

export default function StatisticsCards({ reminders }: StatisticsCardsProps) {
  const uniqueStories = reminders.filter((reminder, index, self) => self.findIndex((r) => r.slug === reminder.slug) === index)
  
  const totalStories = uniqueStories.length
  const totalVerses = uniqueStories.reduce((sum, reminder) => sum + reminder.verseCount, 0)

  const [progress1, setProgress1] = useState(0)
  const [progress2, setProgress2] = useState(0)
  const [progress3, setProgress3] = useState(0)

  const module1Stories = uniqueStories.filter(reminder => reminder.module === 'modulo-1').length
  const module2Stories = uniqueStories.filter(reminder => reminder.module === 'modulo-2').length
  const module3Stories = uniqueStories.filter(reminder => reminder.module === 'modulo-3').length

  const totalModule1Stories = 6 // Assuming there are 6 stories in Module 1
  const totalModule2Stories = 0 // Assuming there are 6 stories in Module 2
  const totalModule3Stories = 22 // Assuming there are 6 stories in Module 2

  useEffect(() => {
    setProgress1((module1Stories / totalModule1Stories) * 100)
    setProgress2((module2Stories / totalModule2Stories) * 100)
    setProgress3((module3Stories / totalModule3Stories) * 100)
  }, [module1Stories, module2Stories, module3Stories])


  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Historias en mi corazón</CardTitle>
          <Book className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{totalStories}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total de Versículos</CardTitle>
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{totalVerses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Módulo 1</CardTitle>
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <div className="font-bold text-2xl">{module1Stories}/{totalModule1Stories}</div>
            <p className="text-muted-foreground text-xs">Historias conocidas</p>
          </div>
          <CircularProgress progress={progress1} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Módulo 2</CardTitle>
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <div className="font-bold text-2xl">{module2Stories}/{totalModule2Stories}</div>
            <p className="text-muted-foreground text-xs">Historias conocidas</p>
          </div>
          <CircularProgress progress={progress2} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Módulo 3</CardTitle>
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <div className="font-bold text-2xl">{module3Stories}/{totalModule3Stories}</div>
            <p className="text-muted-foreground text-xs">Historias conocidas</p>
          </div>
          <CircularProgress progress={progress3} />
        </CardContent>
      </Card>
    </div>
  )
}

const CircularProgress = ({ progress }: { progress: number }) => (
  <svg className="w-12 h-12">
    <circle
      className="text-muted-foreground"
      strokeWidth="4"
      stroke="currentColor"
      fill="transparent"
      r="20"
      cx="24"
      cy="24"
    />
    <circle
      className="text-primary"
      strokeWidth="4"
      strokeDasharray={2 * Math.PI * 20}
      strokeDashoffset={2 * Math.PI * 20 * ((100 - progress) / 100)}
      strokeLinecap="round"
      stroke="currentColor"
      fill="transparent"
      r="20"
      cx="24"
      cy="24"
    />
  </svg>
)