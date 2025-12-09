# 🚀 Deploy AGROTEC Dashboard na Vercel

## 📋 Pré-requisitos

- ✅ Conta no GitHub (https://github.com)
- ✅ Conta na Vercel (https://vercel.com - pode usar login do GitHub)
- ✅ Projeto Supabase configurado
- ✅ (Opcional) Chave API do Google Gemini

---

## 🔧 PASSO 1: Preparar o Repositório Git

### 1.1 Inicializar Git (se ainda não tiver)

```powershell
# No diretório do projeto
cd C:\Users\combo\Documents\projetos\agrotecdashboard

# Verificar se já tem git
git status

# Se não tiver, inicializar:
git init
```

### 1.2 Adicionar arquivos ao Git

```powershell
# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - AGROTEC Dashboard"
```

### 1.3 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `agrotec-dashboard`
3. Descrição: `Portal Administrativo AGROTEC 2025 - SEMAGRIC`
4. **Deixe PRIVADO** (contém credenciais)
5. **NÃO inicialize** com README (já temos arquivos)
6. Clique em **"Create repository"**

### 1.4 Conectar e enviar para GitHub

```powershell
# Adicionar repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/agrotec-dashboard.git

# Enviar código
git branch -M main
git push -u origin main
```

**PRONTO!** Código está no GitHub 🎉

---

## 🌐 PASSO 2: Deploy na Vercel

### 2.1 Acessar Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Na lista de repositórios, encontre `agrotec-dashboard`
4. Clique em **"Import"**

### 2.3 Configurar Projeto

**Framework Preset:** Vite (detecta automaticamente)

**Root Directory:** `./` (deixe padrão)

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### 2.4 Configurar Variáveis de Ambiente

**IMPORTANTE:** Clique em **"Environment Variables"** e adicione:

#### Variáveis OBRIGATÓRIAS:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://egirxxupsiwarrquejoz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sua-chave-anonima-aqui` |

**Como pegar as chaves do Supabase:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

#### Variável OPCIONAL (Análise IA):

| Name | Value |
|------|-------|
| `VITE_GEMINI_API_KEY` | `sua-chave-gemini-aqui` |

**Como pegar chave Gemini:**
1. Acesse: https://aistudio.google.com/apikey
2. Clique em **"Create API Key"**
3. Copie a chave gerada

### 2.5 Deploy!

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos ⏳
3. Vercel irá:
   - ✅ Instalar dependências
   - ✅ Executar build
   - ✅ Fazer deploy
   - ✅ Gerar URL automática

**PRONTO!** Site no ar! 🚀

---

## 🎉 PASSO 3: Acessar o Site

### 3.1 URL Gerada

Sua aplicação estará disponível em:
```
https://agrotec-dashboard-SEU-USUARIO.vercel.app
```

A Vercel gera automaticamente uma URL única!

### 3.2 Personalizar Domínio (Opcional)

**Domínio Personalizado (ex: agrotec.semagric.gov.br):**

1. No dashboard da Vercel, vá em **"Settings"**
2. Clique em **"Domains"**
3. Adicione seu domínio customizado
4. Siga instruções para configurar DNS

---

## 🔒 PASSO 4: Configurar Supabase para Produção

### 4.1 Atualizar Políticas RLS

No Supabase SQL Editor, execute:

```sql
-- Permitir acesso do domínio Vercel
-- (Se necessário, ajuste as políticas)
```

### 4.2 Executar Migrations (se ainda não fez)

1. Acesse: Supabase Dashboard → SQL Editor
2. Abra o arquivo: `supabase/migrations/001_init.sql`
3. Copie e cole todo o conteúdo
4. Clique em **"Run"**

---

## 🧪 PASSO 5: Testar Aplicação

### Checklist de Testes:

1. ✅ **Homepage carrega?**
   - Acesse a URL da Vercel
   - Dashboard deve aparecer

2. ✅ **Cadastrar expositor funciona?**
   - Teste adicionar um expositor
   - Verifique se salva no Supabase

3. ✅ **Galeria funciona?**
   - Teste upload de foto
   - Verifique se aparece na galeria

4. ✅ **Exportar PDF funciona?**
   - Clique em "Exportar Relatório"
   - PDF deve baixar corretamente

5. ✅ **Dados persistem?**
   - Feche navegador
   - Abra novamente
   - Dados devem continuar lá

---

## 🔄 PASSO 6: Atualizações Futuras

### Como atualizar o site:

```powershell
# 1. Fazer mudanças no código
# (edite os arquivos localmente)

# 2. Commit das mudanças
git add .
git commit -m "Descrição da atualização"

# 3. Enviar para GitHub
git push

# 4. Vercel faz deploy automático! 🎉
```

**A Vercel detecta automaticamente** mudanças no GitHub e faz deploy!

---

## 📊 Monitoramento

### Dashboard Vercel

Acesse: https://vercel.com/dashboard

**Você pode ver:**
- 📈 Analytics (visitantes)
- 🚀 Deployments (histórico)
- 🐛 Logs (erros)
- ⚡ Performance

### Logs em Tempo Real

```bash
# Instalar Vercel CLI (opcional)
npm install -g vercel

# Ver logs
vercel logs
```

---

## 🐛 Troubleshooting

### Problema 1: Build Falhou

**Erro:** `Build failed`

**Solução:**
```powershell
# Testar build local primeiro
npm run build

# Se funcionar local, verificar:
# 1. Variáveis de ambiente na Vercel
# 2. Versão do Node (usar 18.x ou superior)
```

### Problema 2: Página em Branco

**Erro:** Site carrega mas fica em branco

**Solução:**
1. Abrir Console do navegador (F12)
2. Ver erros
3. Geralmente falta variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Problema 3: 404 Errors Supabase

**Erro:** `404 Not Found` ao acessar dados

**Solução:**
1. Executar migrations no Supabase
2. Verificar se tabelas existem
3. Ver guia: `COMECE_AQUI.md`

### Problema 4: CORS Error

**Erro:** `CORS policy blocked`

**Solução:**
No Supabase:
1. Settings → API
2. API Settings
3. Adicionar domínio Vercel na whitelist

---

## 🔐 Segurança

### ✅ Boas Práticas Implementadas:

- ✅ `.env` no `.gitignore` (não sobe credenciais)
- ✅ Variáveis de ambiente na Vercel (seguras)
- ✅ RLS ativado no Supabase
- ✅ HTTPS automático (Vercel)
- ✅ Repositório privado no GitHub

### ⚠️ NÃO FAZER:

- ❌ Commitar arquivo `.env` ou `.env.local`
- ❌ Compartilhar chaves API publicamente
- ❌ Deixar repositório público com credenciais
- ❌ Usar mesma chave em dev e produção

---

## 📝 Comandos Úteis

### Git

```powershell
# Ver status
git status

# Ver histórico
git log --oneline

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Voltar para main
git checkout main
```

### Vercel CLI (Opcional)

```powershell
# Instalar
npm install -g vercel

# Login
vercel login

# Deploy manual
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains ls
```

---

## 🎯 Próximos Passos Recomendados

### 1. **Domínio Personalizado**
- Configurar: `agrotec.semagric.gov.br`
- Melhor para usuários finais

### 2. **Analytics**
- Ativar Vercel Analytics
- Monitorar acessos e performance

### 3. **Backup Automático**
- Configurar backup do Supabase
- Exportar dados regularmente

### 4. **CI/CD Completo**
- Preview deployments (branches)
- Testes automatizados

### 5. **Monitoramento**
- Sentry para erros
- Uptime monitoring

---

## 📞 Suporte

### Links Úteis:

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev

### Comunidades:

- **Vercel Discord:** https://vercel.com/discord
- **Supabase Discord:** https://discord.supabase.com

---

## ✅ Checklist Final

Antes de considerar completo, verifique:

- [ ] Código no GitHub
- [ ] Deploy na Vercel funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas no Supabase
- [ ] Site acessível via URL
- [ ] Cadastro de expositor funciona
- [ ] Galeria funciona
- [ ] Exportar PDF funciona
- [ ] Dados persistem no Supabase
- [ ] Site responsivo (testar no celular)

**Se TODOS ✅ = DEPLOY COMPLETO!** 🎉🚀

---

## 🎊 Parabéns!

Seu **AGROTEC Dashboard** está:
- ✅ No ar 24/7
- ✅ Acessível de qualquer lugar
- ✅ Com banco de dados na nuvem
- ✅ Deploy automático
- ✅ HTTPS seguro
- ✅ Performance otimizada

**Desenvolvido para AGROTEC 2025 - SEMAGRIC** 🌱

---

*Última atualização: 09/12/2025*
*Versão: 1.0*
