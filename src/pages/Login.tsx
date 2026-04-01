import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { BarChart2 } from 'lucide-react'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      if (isRegistering) {
        const { error } = await signUp(email, password, { data: { name } })
        if (error) throw error
        navigate('/')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto bg-indigo-600/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Central de Campanhas</CardTitle>
          <CardDescription className="text-base mt-2">
            Acesse a base de dados em nuvem para colaboração em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-5">
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">
                {errorMsg}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-2 text-left">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 px-4 bg-white"
                  autoFocus={isRegistering}
                />
              </div>
            )}
            <div className="space-y-2 text-left">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 px-4 bg-white"
                autoFocus={!isRegistering}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 px-4 bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-indigo-600 hover:bg-indigo-700 mt-2"
              disabled={
                loading || !email.trim() || !password.trim() || (isRegistering && !name.trim())
              }
            >
              {loading
                ? 'Aguarde...'
                : isRegistering
                  ? 'Criar Conta Segura'
                  : 'Entrar na Plataforma'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setErrorMsg('')
                }}
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                {isRegistering
                  ? 'Já tem uma conta? Faça login'
                  : 'Ainda não tem conta? Cadastre-se'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
