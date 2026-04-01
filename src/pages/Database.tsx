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
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Trash2, Edit2, Plus, Database as DbIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Database() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ tipo_registro: '', descricao: '', dados_json: '{}' })

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    const { data: res, error } = await supabase
      .from('base_dados')
      .select('*')
      .eq('usuario_id', user.id)
      .order('criado_em', { ascending: false })
    if (!error) setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleSave = async () => {
    try {
      JSON.parse(formData.dados_json)
      if (!formData.tipo_registro) throw new Error('O campo "Tipo de Registro" é obrigatório.')

      const payload = {
        usuario_id: user!.id,
        tipo_registro: formData.tipo_registro,
        descricao: formData.descricao,
        dados_json: JSON.parse(formData.dados_json),
      }

      if (editingId) {
        const { error } = await supabase.from('base_dados').update(payload).eq('id', editingId)
        if (error) throw error
        toast({
          title: 'Sucesso',
          description: 'Registro atualizado com sucesso no banco central.',
        })
      } else {
        const { error } = await supabase.from('base_dados').insert(payload)
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Novo registro adicionado à base de dados.' })
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err: any) {
      toast({ title: 'Atenção', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Aviso: Esta ação é permanente. Tem certeza que deseja excluir o registro?')) {
      const { error } = await supabase.from('base_dados').delete().eq('id', id)
      if (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao remover o registro.',
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Removido', description: 'Registro excluído do banco central.' })
        fetchData()
      }
    }
  }

  const openModal = (record?: any) => {
    if (record) {
      setEditingId(record.id)
      setFormData({
        tipo_registro: record.tipo_registro,
        descricao: record.descricao || '',
        dados_json: JSON.stringify(record.dados_json, null, 2),
      })
    } else {
      setEditingId(null)
      setFormData({ tipo_registro: '', descricao: '', dados_json: '{\n  \n}' })
    }
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
            <DbIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Base de Dados Central
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie os registros brutos armazenados de forma segura na nuvem.
            </p>
          </div>
        </div>
        <Button onClick={() => openModal()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Adicionar Registro
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[200px]">Tipo de Registro</TableHead>
              <TableHead className="w-[300px]">Descrição</TableHead>
              <TableHead>Dados Estruturados (JSON)</TableHead>
              <TableHead className="text-right w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                  Buscando dados seguros no servidor...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500 bg-slate-50/50">
                  Base de dados vazia. Clique em "Adicionar Registro" para começar.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-700">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-mono">
                      {row.tipo_registro}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-slate-600 truncate max-w-[300px]"
                    title={row.descricao}
                  >
                    {row.descricao || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 max-h-16 overflow-y-auto max-w-[400px]">
                      {JSON.stringify(row.dados_json)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(row)}
                        title="Editar"
                        className="hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.id)}
                        title="Excluir"
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modificar Registro' : 'Criar Novo Registro'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">
                Tipo de Registro <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: campanha_ads, configuracao, webhook"
                value={formData.tipo_registro}
                onChange={(e) => setFormData({ ...formData, tipo_registro: e.target.value })}
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Descrição</Label>
              <Input
                placeholder="Breve descrição do conteúdo..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Carga de Dados (JSON Válido)</Label>
              <textarea
                className="w-full h-48 p-3 border rounded-md font-mono text-sm bg-slate-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.dados_json}
                onChange={(e) => setFormData({ ...formData, dados_json: e.target.value })}
                spellCheck="false"
              />
              <p className="text-xs text-slate-500">
                O conteúdo deve ser um JSON válido. Chaves e valores de strings devem estar entre
                aspas duplas.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar Operação
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
              Confirmar e Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
