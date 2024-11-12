'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { app } from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const db = getFirestore(app)

  const checkAndCreateUser = async (dni: string) => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where("dni", "==", dni))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // User doesn't exist, create new user
      await addDoc(usersRef, { dni })
      toast({
        title: "Nuevo usuario creado",
        description: "Se ha creado una nueva cuenta con tu cédula.",
      })
    } else {
      toast({
        title: "Bienvenido de vuelta",
        description: "Has iniciado sesión exitosamente.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoading(true)
      try {
        await checkAndCreateUser(username)
        router.push(`/my-bible?dni=${encodeURIComponent(username)}`)
      } catch (error) {
        console.error("Error al procesar el inicio de sesión:", error)
        toast({
          title: "Error",
          description: "Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex justify-center items-center mx-auto min-h-screen container">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tu cédula para acceder al CRUD de recordatorios.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="items-center gap-4 grid w-full">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Cédula</Label>
                <Input
                  id="username"
                  placeholder="Ingresa tu cédula"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}