-- Drop existing restrictive policies
DROP POLICY IF EXISTS "usuarios_select_own" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_own" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_own" ON public.usuarios;

DROP POLICY IF EXISTS "dados_diarios_select_own" ON public.dados_diarios;
DROP POLICY IF EXISTS "dados_diarios_insert_own" ON public.dados_diarios;
DROP POLICY IF EXISTS "dados_diarios_update_own" ON public.dados_diarios;
DROP POLICY IF EXISTS "dados_diarios_delete_own" ON public.dados_diarios;

DROP POLICY IF EXISTS "dados_consolidados_select_own" ON public.dados_consolidados;
DROP POLICY IF EXISTS "dados_consolidados_insert_own" ON public.dados_consolidados;
DROP POLICY IF EXISTS "dados_consolidados_update_own" ON public.dados_consolidados;
DROP POLICY IF EXISTS "dados_consolidados_delete_own" ON public.dados_consolidados;

DROP POLICY IF EXISTS "base_dados_select_own" ON public.base_dados;
DROP POLICY IF EXISTS "base_dados_insert_own" ON public.base_dados;
DROP POLICY IF EXISTS "base_dados_update_own" ON public.base_dados;
DROP POLICY IF EXISTS "base_dados_delete_own" ON public.base_dados;

-- Create permissive policies for public access to allow viewing data without login
CREATE POLICY "usuarios_all" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dados_diarios_all" ON public.dados_diarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dados_consolidados_all" ON public.dados_consolidados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "base_dados_all" ON public.base_dados FOR ALL USING (true) WITH CHECK (true);
