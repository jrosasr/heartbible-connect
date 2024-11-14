import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { Reminder } from './page'
import { format } from "path"

type RemindersTableProps = {
  reminders: Reminder[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function RemindersTable({ reminders, onEdit, onDelete }: RemindersTableProps) {
  const timeOptions: Reminder['timeOption'][] = ['in-moment', 'in-5-min', 'in-10-min', 'in-30-min', 'in-60-min']

  const timeOptionsSpanish = {
    "in-moment": "Al momento",
    "in-5-min": "En 5 minutos",
    "in-10-min": "En 10 minutos",
    "in-30-min": "En 30 minutos",
    "in-60-min": "En 60 minutos"
  }

  const formatModuleSpanish = (module: string) => {
    return module
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Historia</TableHead>
          <TableHead>Versículos</TableHead>
          <TableHead>Tiempo de recordatorio</TableHead>
          <TableHead>Fecha de aprendizaje</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reminders.map((reminder) => (
          <TableRow key={reminder.id}>
            <TableCell>
              <div className="space-y-1">
                {reminder.module && (
                  <Badge variant="outline">{formatModuleSpanish(reminder.module)}</Badge>
                )}
                <div className="font-medium">{reminder.title}</div>
                <div className="text-muted-foreground text-sm">{reminder.text}</div>
              </div>
            </TableCell>
            <TableCell>{reminder.verseCount}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge>{timeOptionsSpanish[reminder.timeOption]}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tiempo de recordatorio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{reminder.createdAt.toDate().toLocaleString()}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(reminder.id)}>Editar</Button>
                <DeleteConfirmationDialog onDelete={() => onDelete(reminder.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}