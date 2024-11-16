'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { app } from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import StatisticsCards from './StatisticsCards'
import ReminderDrawer from './ReminderDrawer'
import RemindersTable from './RemindersTable'

export type Reminder = {
  id: string
  slug: string
  title: string
  text: string
  verseCount: number
  timeOption: 'in-moment' | 'in-5-min' | 'in-10-min' | 'in-30-min' | 'in-60-min'
  dni: string
  createdAt: Timestamp
  module?: string
  isPersonal: boolean
}

function Header() {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <header className="flex justify-between items-center bg-[#dbe1d1] px-6 py-4 text-primary-foreground">
      <div className="flex items-center">
        <Image src="/images/icons/icon-512x512.png" alt="Logo" width={40} height={40} />
        <h1 className="ml-4 font-bold text-2xl"></h1>
      </div>
      <Button onClick={handleLogout} variant="link">Salir</Button>
    </header>
  )
}

function ReminderContent() {
  const searchParams = useSearchParams()
  const dni = searchParams.get('dni') || ''
  const { toast } = useToast()

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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

  const handleAdd = async (newReminder: Omit<Reminder, 'id' | 'dni' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'my_histories'), { 
      dni: dni, 
      ...newReminder, 
      createdAt: serverTimestamp() 
    })
    setReminders([...reminders, { ...newReminder, id: docRef.id, dni: dni, createdAt: Timestamp.now() }])
    setIsDrawerOpen(false)
    toast({
      title: "Historia agregada",
      description: "La historia ha sido agregada exitosamente.",
    })
  }

  const handleUpdate = async (updatedReminder: Omit<Reminder, 'dni' | 'createdAt'>) => {
    await updateDoc(doc(db, 'my_histories', updatedReminder.id), { ...updatedReminder })
    setReminders(reminders.map(reminder => 
      reminder.id === updatedReminder.id ? { ...updatedReminder, dni: dni, createdAt: reminder.createdAt } : reminder
    ))
    setEditingId(null)
    setIsDrawerOpen(false)
    toast({
      title: "Historia actualizada",
      description: "La historia ha sido actualizada exitosamente.",
    })
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'my_histories', id))
    setReminders(reminders.filter(reminder => reminder.id !== id))
    toast({
      title: "Historia eliminada",
      description: "La historia ha sido eliminada exitosamente.",
      variant: "destructive",
    })
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsDrawerOpen(true)
  }

  return (
    <div className="mx-auto p-4 container">
      <h2 className="mb-4 font-semibold text-xl">Bienvenido, {dni}</h2>
      
      <StatisticsCards reminders={reminders} />
      
      <ReminderDrawer 
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingId={editingId}
        reminders={reminders}
      />

      <RemindersTable 
        reminders={reminders}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default function RemindersPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <ReminderContent />
      </Suspense>
    </>
  )
}