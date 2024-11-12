'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { app } from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, BookOpen, Clock, Heart } from "lucide-react"

type Reminder = {
  id: string
  title: string
  text: string
  verseCount: number
  timeOption: 'in-moment' | 'in-5-min' | 'in-10-min' | 'in-30-min' | 'in-60-min'
  dni: string
  createdAt: Timestamp
}

function ReminderContent() {
  const searchParams = useSearchParams()
  const dni = searchParams.get('dni') || ''
  const { toast } = useToast()

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id' | 'dni' | 'createdAt'>>({
    title: '',
    text: '',
    verseCount: 1,
    timeOption: 'in-moment'
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const db = getFirestore(app)

  useEffect(() => {
    fetchReminders()
  }, [dni])

  const fetchReminders = async () => {
    if (!dni) return
    const q = query(collection(db, 'my_histories'), where('dni', '==', dni))
    const querySnapshot = await getDocs(q)
    const fetchedReminders: Reminder[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fetchedReminders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp
      } as Reminder)
    })
    setReminders(fetchedReminders)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewReminder({ ...newReminder, [name]: name === 'verseCount' ? parseInt(value) || 0 : value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleRadioChange = (value: Reminder['timeOption']) => {
    setNewReminder({ ...newReminder, timeOption: value })
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    if (!newReminder.title.trim()) newErrors.title = 'El título es requerido'
    if (!newReminder.text.trim()) newErrors.text = 'El texto es requerido'
    if (newReminder.verseCount < 1) newErrors.verseCount = 'La cantidad de versículos debe ser al menos 1'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = async () => {
    if (!validateForm()) return
    const docRef = await addDoc(collection(db, 'my_histories'), { 
      dni: dni, 
      ...newReminder, 
      createdAt: serverTimestamp() 
    })
    setReminders([...reminders, { ...newReminder, id: docRef.id, dni: dni, createdAt: Timestamp.now() }])
    setNewReminder({ title: '', text: '', verseCount: 1, timeOption: 'in-moment' })
    setIsDrawerOpen(false)
    toast({
      title: "Historia agregado",
      description: "La historia ha sido agregado exitosamente.",
    })
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    const reminderToEdit = reminders.find(reminder => reminder.id === id)
    if (reminderToEdit) {
      setNewReminder({ ...reminderToEdit })
    }
    setIsDrawerOpen(true)
  }

  const handleUpdate = async () => {
    if (editingId === null || !validateForm()) return
    await updateDoc(doc(db, 'my_histories', editingId), { ...newReminder })
    setReminders(reminders.map(reminder => 
      reminder.id === editingId ? { ...newReminder, id: editingId, dni: dni, createdAt: reminder.createdAt } : reminder
    ))
    setEditingId(null)
    setNewReminder({ title: '', text: '', verseCount: 1, timeOption: 'in-moment' })
    setIsDrawerOpen(false)
    toast({
      title: "Historia actualizado",
      description: "La historia ha sido actualizado exitosamente.",
    })
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'my_histories', id))
    setReminders(reminders.filter(reminder => reminder.id !== id))
    toast({
      title: "Historia eliminado",
      description: "La historia ha sido eliminado exitosamente.",
      variant: "destructive",
    })
  }

  const timeOptions: Reminder['timeOption'][] = ['in-moment', 'in-5-min', 'in-10-min', 'in-30-min', 'in-60-min']

  const totalStories = reminders.length
  const totalVerses = reminders.reduce((sum, reminder) => sum + reminder.verseCount, 0)
  const storiesInMoment = reminders.filter(reminder => reminder.timeOption === 'in-moment').length
  const averageVersesPerStory = totalStories > 0 ? totalVerses / totalStories : 0

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Bienvenido, {dni}</h1>
      <h2 className="mb-4 font-semibold text-xl">Mi Biblia de Corazón</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historias Conocidas</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Versículos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVerses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historias al Momento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storiesInMoment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Versículos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageVersesPerStory.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="mb-4">Agregar Historia</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col h-full max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>{editingId === null ? 'Agregar Historia' : 'Editar Historia'}</DrawerTitle>
              <DrawerDescription>Complete los detalles de la historia aquí.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 px-4 py-2 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newReminder.title}
                    onChange={handleInputChange}
                    placeholder="Título de la historia"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Texto bíblico</Label>
                  <Input
                    id="text"
                    name="text"
                    value={newReminder.text}
                    onChange={handleInputChange}
                    placeholder="Texto de la historia"
                  />
                  {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verseCount">Cantidad de versículos</Label>
                  <Input
                    id="verseCount"
                    name="verseCount"
                    type="number"
                    min="1"
                    value={newReminder.verseCount}
                    onChange={handleInputChange}
                  />
                  {errors.verseCount && <p className="text-red-500 text-sm">{errors.verseCount}</p>}
                </div>
                <RadioGroup
                  value={newReminder.timeOption}
                  onValueChange={handleRadioChange}
                  className="flex flex-col space-y-2"
                >
                  {timeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option.replace('-', ' ')}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DrawerFooter className="mt-auto">
              {editingId === null ? (
                <Button onClick={handleAdd}>Agregar</Button>
              ) : (
                <Button onClick={handleUpdate}>Actualizar</Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Texto bíblico</TableHead>
            <TableHead>Versículos</TableHead>
            <TableHead>Al momento</TableHead>
            <TableHead>En 5 minutos</TableHead>
            <TableHead>En 10 minutos</TableHead>
            <TableHead>En 30 minutos</TableHead>
            <TableHead>En 60 minutos</TableHead>
            <TableHead>Fecha de aprendizaje</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell>{reminder.title}</TableCell>
              <TableCell>{reminder.text}</TableCell>
              <TableCell>{reminder.verseCount}</TableCell>
              {timeOptions.map((option) => (
                <TableCell key={option} className={reminder.timeOption === option ? 'bg-green-200 text-center' : ''}>
                  {reminder.timeOption === option ? '✓' : ''}
                </TableCell>
              ))}
              <TableCell>{reminder.createdAt.toDate().toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(reminder.id)}>Editar</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la historia.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(reminder.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function RemindersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReminderContent />
    </Suspense>
  )
}