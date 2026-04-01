import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, TrendingUp } from 'lucide-react'

export default function Index() {
  const { user } = useAuth()
  const [dailyData, setDailyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase
        .from('dados_diarios')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false })

      if (error) throw error

      // Group by date to show aggregated cards per metric
      setDailyData(data || [])
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Diário</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acompanhe o desempenho de suas métricas diárias atualizadas em tempo real.
          </p>
        </div>
        <Button
          onClick={fetchData}
          disabled={loading}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-100">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : dailyData.length === 0 ? (
        <div className="text-center p-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <TrendingUp className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhum dado diário encontrado</h3>
          <p className="text-sm mt-2 max-w-md mx-auto">
            Adicione registros à tabela de dados diários para que eles apareçam aqui no seu
            dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dailyData.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm hover:shadow-md transition-shadow border-slate-200"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">
                  {Number(item.valor).toLocaleString('pt-BR')}
                </div>
                <p className="text-sm font-medium text-indigo-600 mt-1">{item.metrica_nome}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
