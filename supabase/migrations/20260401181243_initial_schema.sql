CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dados_diarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    metrica_nome TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dados_consolidados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    periodo TEXT NOT NULL,
    metrica_nome TEXT NOT NULL,
    valor_total NUMERIC NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.base_dados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo_registro TEXT NOT NULL,
    descricao TEXT,
    dados_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_consolidados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.base_dados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios_select_own" ON public.usuarios;
CREATE POLICY "usuarios_select_own" ON public.usuarios FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "usuarios_insert_own" ON public.usuarios;
CREATE POLICY "usuarios_insert_own" ON public.usuarios FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "usuarios_update_own" ON public.usuarios;
CREATE POLICY "usuarios_update_own" ON public.usuarios FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "dados_diarios_select_own" ON public.dados_diarios;
CREATE POLICY "dados_diarios_select_own" ON public.dados_diarios FOR SELECT TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_diarios_insert_own" ON public.dados_diarios;
CREATE POLICY "dados_diarios_insert_own" ON public.dados_diarios FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_diarios_update_own" ON public.dados_diarios;
CREATE POLICY "dados_diarios_update_own" ON public.dados_diarios FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_diarios_delete_own" ON public.dados_diarios;
CREATE POLICY "dados_diarios_delete_own" ON public.dados_diarios FOR DELETE TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_consolidados_select_own" ON public.dados_consolidados;
CREATE POLICY "dados_consolidados_select_own" ON public.dados_consolidados FOR SELECT TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_consolidados_insert_own" ON public.dados_consolidados;
CREATE POLICY "dados_consolidados_insert_own" ON public.dados_consolidados FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_consolidados_update_own" ON public.dados_consolidados;
CREATE POLICY "dados_consolidados_update_own" ON public.dados_consolidados FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "dados_consolidados_delete_own" ON public.dados_consolidados;
CREATE POLICY "dados_consolidados_delete_own" ON public.dados_consolidados FOR DELETE TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "base_dados_select_own" ON public.base_dados;
CREATE POLICY "base_dados_select_own" ON public.base_dados FOR SELECT TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "base_dados_insert_own" ON public.base_dados;
CREATE POLICY "base_dados_insert_own" ON public.base_dados FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "base_dados_update_own" ON public.base_dados;
CREATE POLICY "base_dados_update_own" ON public.base_dados FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "base_dados_delete_own" ON public.base_dados;
CREATE POLICY "base_dados_delete_own" ON public.base_dados FOR DELETE TO authenticated USING (usuario_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alexis.facchina@glasart.com.br') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'alexis.facchina@glasart.com.br',
      crypt('securepassword123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Alexis Facchina"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $$;
