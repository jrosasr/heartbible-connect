'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { app } from '@/lib/firebase'
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [documentId, setDocumentId] = useState('')
  const [country, setCountry] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const db = getFirestore(app)

  const countries = [
    { name: 'Venezuela', value: 've' },
    { name: 'Uruguay', value: 'uy' },
    { name: 'Colombia', value: 'co' },
    { name: 'Chile', value: 'cl' },
  ]

  const checkAndCreateUser = async (combinedId: string) => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where("combinedId", "==", combinedId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      await addDoc(usersRef, { combinedId, country, documentId })
      toast({
        title: "Nuevo usuario creado",
        description: "Se ha creado una nueva cuenta con tu documento de identidad.",
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
    if (documentId.trim() && country) {
      setIsLoading(true)
      const combinedId = `${country}${documentId}`
      try {
        await checkAndCreateUser(combinedId)
        router.push(`/my-bible?dni=${encodeURIComponent(combinedId)}`)
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
          <CardDescription>Ingresa tu país y documento de identidad para acceder al CRUD de recordatorios.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country">País</Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Selecciona tu país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="documentId">Documento de Identidad</Label>
                <Input
                  id="documentId"
                  placeholder="Ingresa tu documento de identidad"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value.replace(/\D/g, ''))}
                  required
                  disabled={isLoading}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}