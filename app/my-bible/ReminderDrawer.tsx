import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reminder } from './page'
import { Loader2 } from 'lucide-react'
import { Module, MODULES_AVAILABLE, ModuleStory, STORIES_AVAILABLE_FROM_MODULE } from './modules.data'

type ReminderDrawerProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAdd: (reminder: Omit<Reminder, 'id' | 'dni' | 'createdAt'>) => void
  onUpdate: (reminder: Omit<Reminder, 'dni' | 'createdAt'>) => void
  editingId: string | null
  reminders: Reminder[]
}

const modules: Module[] = MODULES_AVAILABLE
const moduleStories: Record<string, ModuleStory[]> = STORIES_AVAILABLE_FROM_MODULE

export default function ReminderDrawer({ isOpen, setIsOpen, onAdd, onUpdate, editingId, reminders }: ReminderDrawerProps) {
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id' | 'dni' | 'createdAt'>>({
    title: '',
    text: '',
    verseCount: 1,
    timeOption: 'in-moment',
    module: '',
    isPersonal: true,
    slug: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModule, setSelectedModule] = useState('')

  useEffect(() => {
    if (editingId) {
      const reminderToEdit = reminders.find(reminder => reminder.id === editingId)
      if (reminderToEdit) {
        setNewReminder({ ...reminderToEdit })
      }
    } else {
      setNewReminder({ title: '', text: '', verseCount: 1, timeOption: 'in-moment', module: '', isPersonal: true, slug: '' })
    }
  }, [editingId, reminders])

  const generateSlug = (title: string, text: string) => {
    const combinedText = `${title} ${text}`
    return combinedText
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .slice(0, 100) // Limit slug length to 100 characters
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewReminder(prev => {
      const updatedReminder = {
        ...prev,
        [name]: name === 'verseCount' ? parseInt(value) || 0 : value
      }
      
      // Generate slug when title or text changes
      if (name === 'title' || name === 'text') {
        updatedReminder.slug = generateSlug(
          name === 'title' ? value : prev.title,
          name === 'text' ? value : prev.text
        )
      }
      
      return updatedReminder
    })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewReminder({ ...newReminder, [name]: value })
    setErrors({ ...errors, [name]: '' })

    if (name === 'module') {
      setSelectedModule(value)
      setNewReminder(prev => ({ ...prev, title: '', text: '', verseCount: 1, slug: '' }))
    }
  }

  const handleStorySelect = (story: ModuleStory) => {
    setNewReminder(prev => ({
      ...prev,
      title: story.title,
      text: story.text,
      verseCount: story.verseCount,
      slug: generateSlug(story.title, story.text)
    }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    if (newReminder.isPersonal) {
      if (!newReminder.title.trim()) newErrors.title = 'El título es requerido'
      if (!newReminder.text.trim()) newErrors.text = 'El texto es requerido'
      if (newReminder.verseCount < 1) newErrors.verseCount = 'La cantidad de versículos debe ser al menos 1'
      if (!newReminder.slug.trim()) newErrors.slug = 'El slug es requerido'
      if (reminders.some(r => r.slug === newReminder.slug && r.id !== editingId)) newErrors.slug = 'Este slug ya está en uso'
    } else {
      if (!newReminder.module) newErrors.module = 'Debe seleccionar un módulo'
      if (!newReminder.title) newErrors.story = 'Debe seleccionar una historia'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsLoading(true)
    try {
      if (editingId === null) {
        await onAdd(newReminder)
      } else {
        await onUpdate({ ...newReminder, id: editingId })
      }
      setNewReminder({ title: '', text: '', verseCount: 1, timeOption: 'in-moment', module: '', isPersonal: true, slug: '' })
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting reminder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeOptions: Reminder['timeOption'][] = ['in-moment', 'in-5-min', 'in-10-min', 'in-30-min', 'in-60-min']

  const timeOptionsSpanish = {
    "in-moment": "Al momento",
    "in-5-min": "En 5 minutos",
    "in-10-min": "En 10 minutos",
    "in-30-min": "En 30 minutos",
    "in-60-min": "En 60 minutos"
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className='flex justify-end my-4'>
          <Button className="mb-4">Agregar Historia</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col h-full max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{editingId === null ? 'Agregar Historia' : 'Editar Historia'}</DrawerTitle>
            <DrawerDescription>Complete los detalles de la historia aquí.</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 px-4 py-2 overflow-y-auto">
            {editingId === null ? (
              <Tabs defaultValue="personal" onValueChange={(value) => setNewReminder(prev => ({ ...prev, isPersonal: value === 'personal' }))}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="module">Por Módulo</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
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
                  </div>
                </TabsContent>
                <TabsContent value="module">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="module">Módulo</Label>
                      <Select value={selectedModule} onValueChange={(value) => handleSelectChange('module', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem key={module.value} value={module.value}>
                              {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.module && <p className="text-red-500 text-sm">{errors.module}</p>}
                    </div>
                    {selectedModule && (
                      <div className="space-y-2">
                        <Label htmlFor="story">Historia</Label>
                        <Select value={newReminder.title} onValueChange={(value) => {
                          const story = moduleStories[selectedModule].find(s => s.title === value)
                          if (story) handleStorySelect(story)
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una historia" />
                          </SelectTrigger>
                          <SelectContent>
                            {moduleStories[selectedModule].map((story) => (
                              <SelectItem key={story.title} value={story.title}>
                                {story.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.story && <p className="text-red-500 text-sm">{errors.story}</p>}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newReminder.title}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Texto bíblico</Label>
                  <Input
                    id="text"
                    name="text"
                    value={newReminder.text}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verseCount">Cantidad de versículos</Label>
                  <Input
                    id="verseCount"
                    name="verseCount"
                    type="number"
                    value={newReminder.verseCount}
                    disabled
                  />
                </div>
              </div>
            )}
            <div className="space-y-2 mt-4">
              <Label htmlFor="timeOption">Tiempo de recordatorio</Label>
              <Select value={newReminder.timeOption} onValueChange={(value) => handleSelectChange('timeOption', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tiempo" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {timeOptionsSpanish[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter className="mt-auto">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  {editingId === null ? "Agregando..." : "Actualizando..."}
                </>
              ) : (
                editingId === null ? "Agregar" : "Actualizar"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}