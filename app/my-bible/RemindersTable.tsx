import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Reminder } from "./page";

type RemindersTableProps = {
  reminders: Reminder[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function RemindersTable({
  reminders,
  onEdit,
  onDelete,
}: RemindersTableProps) {
  const timeOptionsSpanish = {
    "in-moment": "Al momento",
    "in-5-min": "En 5 minutos",
    "in-10-min": "En 10 minutos",
    "in-30-min": "En 30 minutos",
    "in-60-min": "En 60 minutos",
  };

  const formatModuleSpanish = (module: string) => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Historia</TableHead>
          <TableHead>Fecha de aprendizaje</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reminders.map((reminder) => (
          <TableRow key={reminder.id}>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {reminder.module && (
                    <Badge
                      variant="outline"
                      className="text-[8px] md:text-[12px]"
                    >
                      {formatModuleSpanish(reminder.module)}
                    </Badge>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="text-[8px] md:text-[12px]">{timeOptionsSpanish[reminder.timeOption]}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tiempo de recordatorio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">{reminder.title}</div>
                <div className="text-muted-foreground text-sm">
                  {reminder.text}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {reminder.createdAt.toDate().toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onEdit(reminder.id)}
                >
                  Editar
                </Button>
                <DeleteConfirmationDialog
                  onDelete={() => onDelete(reminder.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
