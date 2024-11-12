'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function Home() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/my-bible?dni=${encodeURIComponent(username)}`)
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
                <Label htmlFor="username">cédula</Label>
                <Input
                  id="username"
                  placeholder="Ingresa tu cédula"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Ingresar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}