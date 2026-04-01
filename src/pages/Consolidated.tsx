import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, PieChart } from 'lucide-react'

export default function Consolidated() {
  const { user } = useAuth()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [periodoFilter, setPeriodoFilter] = useState<string>('todos')

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    try {
      let query = supabase
        .from('dados_consolidados')
        .select('*')
        .eq('usuario_id', user.id)
        .order('criado_em', { ascending: false })
      if (periodoFilter !== 'todos') {
        query = query.eq('periodo', periodoFilter)
      }
      const { data: res, error } = await query
      if (error) throw error
      setData(res || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, periodoFilter])

  const exportCSV = () => {
    const headers = ['Período', 'Métrica', 'Valor Total']
    const csvData = data.map((row) => [row.periodo, row.metrica_nome, row.valor_total])
    const csvContent = [headers, ...csvData].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'dados_consolidados.csv'
    link.click()
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-4 relative z-10 drop-shadow-sm">
            <PieChart className="w-8 h-8 text-blue-200" /> Relatórios Consolidados
          </h1>
          <p className="text-blue-100 font-medium relative z-10 text-sm md:text-base max-w-2xl drop-shadow-sm">
            Visão geral das métricas agregadas. Acompanhe a totalização dos dados em diferentes
            períodos de tempo.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Filtrar por:</span>
          <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-50">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os períodos</SelectItem>
              <SelectItem value="dia">Dia</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
              <SelectItem value="diario_agregado">Diário Agregado (Automático)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={exportCSV}
          variant="outline"
          className="gap-2 w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Período</TableHead>
              <TableHead className="font-semibold text-slate-700">Métrica</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-slate-500 bg-slate-50/50">
                  Nenhum dado consolidado encontrado para o filtro selecionado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium capitalize text-slate-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.periodo.replace('_', ' ')}
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
    </div>
  )
}
