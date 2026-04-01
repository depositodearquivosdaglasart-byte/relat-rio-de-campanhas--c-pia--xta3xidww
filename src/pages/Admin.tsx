import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Database as DbIcon, Download, TrendingUp, ShieldAlert } from 'lucide-react'

export default function Admin() {
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || '')
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('adminName'))
  const [stats, setStats] = useState({ users: 0, daily: 0, consolidated: 0 })
  const [consolidatedData, setConsolidatedData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLogged) {
      fetchAdminData()
    }
  }, [isLogged])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const { count: usersCount } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
      const { count: dailyCount } = await supabase
        .from('dados_diarios')
        .select('*', { count: 'exact', head: true })
      const { count: consCount } = await supabase
        .from('dados_consolidados')
        .select('*', { count: 'exact', head: true })

      setStats({ users: usersCount || 0, daily: dailyCount || 0, consolidated: consCount || 0 })

      const { data } = await supabase
        .from('dados_consolidados')
        .select('*, usuarios(nome)')
        .order('criado_em', { ascending: false })
        .limit(50)
      setConsolidatedData(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminName.trim()) {
      localStorage.setItem('adminName', adminName)
      setIsLogged(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminName')
    setAdminName('')
    setIsLogged(false)
  }

  const exportPDF = () => {
    window.print()
  }

  if (!isLogged) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50">
        <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-slate-200">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <CardTitle className="text-xl">Área Restrita Administrativa</CardTitle>
            <CardDescription>Acesso exclusivo para visualização global de dados.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-slate-700">
                  Nome de Identificação (Admin)
                </label>
                <Input
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Seu nome para auditoria"
                  required
                  className="bg-white h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                Liberar Acesso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="space-y-6 max-w-[1400px] mx-auto p-4 animate-fade-in print:p-0 print:m-0"
      id="admin-report"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard Geral Administrativo
          </h1>
          <p className="text-slate-500 mt-1">
            Bem-vindo(a), <span className="font-semibold text-slate-700">{adminName}</span>. Visão
            global de todas as campanhas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={exportPDF}
            className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Download className="w-4 h-4" /> Exportar PDF do Relatório
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            Encerrar Sessão
          </Button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Relatório Oficial de Sistema</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerado por: {adminName} em {new Date().toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Contas Registradas</CardTitle>
            <Users className="w-5 h-5 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.users}</div>
            <p className="text-xs text-blue-200 mt-1">Usuários ativos na plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">
              Registros Diários Inseridos
            </CardTitle>
            <DbIcon className="w-5 h-5 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.daily}</div>
            <p className="text-xs text-emerald-200 mt-1">Pontos de dados rastreados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">
              Dados Consolidados
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.consolidated}</div>
            <p className="text-xs text-purple-200 mt-1">Agregações processadas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 print:shadow-none print:border-0">
        <CardHeader>
          <CardTitle className="text-xl">
            Auditoria Recente: Campanhas Consolidadas (Global)
          </CardTitle>
          <CardDescription>
            Mostrando os 50 registros mais recentes em toda a base de dados central.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Proprietário (Usuário)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">Recorte de Período</TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Identificador da Métrica
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Soma Total Verificada
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Sincronizando com o Supabase...
                    </TableCell>
                  </TableRow>
                ) : consolidatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      O sistema global não possui dados consolidados ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  consolidatedData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-slate-800">
                        {row.usuarios?.nome || 'Desconhecido'}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-mono">
                          {row.periodo}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{row.metrica_nome}</TableCell>
                      <TableCell className="text-right font-mono text-slate-900 font-semibold">
                        {Number(row.valor_total).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
