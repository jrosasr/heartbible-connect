import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, BookOpen, Clock } from "lucide-react"
import { Reminder } from './page'

type StatisticsCardsProps = {
  reminders: Reminder[]
}

export default function StatisticsCards({ reminders }: StatisticsCardsProps) {
  const totalStories = reminders.length
  const totalVerses = reminders.reduce((sum, reminder) => sum + reminder.verseCount, 0)
  const storiesInMoment = reminders.filter(reminder => reminder.timeOption === 'in-moment').length

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
          <CardTitle className="font-medium text-sm">Historias al Momento</CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{storiesInMoment}</div>
        </CardContent>
      </Card>
    </div>
  )
}