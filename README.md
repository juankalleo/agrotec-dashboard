<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AGROTEC Dashboard - Portal de Gestão 2025

<div align="center">
  
![AGROTEC 2025](https://img.shields.io/badge/AGROTEC-2025-059669?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)

</div>

Portal moderno e inteligente para gestão da Feira de Agronegócio e Tecnologia de Porto Velho (SEMAGRIC). Dashboard executivo com dados sincronizados em nuvem, análise IA e exportação de relatórios profissionais.

## ✨ Características Principais

- 📊 **Dashboard Executivo** - Gráficos e KPIs em tempo real
- 👥 **Gerenciamento de Expositores** - Cadastro completo com validação
- 🖼️ **Galeria de Fotos** - Upload e organização de imagens
- ☁️ **Banco de Dados Supabase** - Dados persistentes na nuvem
- 🔄 **Sincronização Automática** - Acesse de qualquer dispositivo
- 📄 **Relatórios PDF** - Exportação profissional formatada
- 🤖 **Análise IA** - Insights gerados por Google Gemini
- 📱 **Interface Responsiva** - Funciona em mobile e desktop
- 🎯 **Projeções 2026** - Previsões baseadas em dados

## 🚀 Deploy Rápido na Vercel

### Opção 1: Deploy Automático (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU-USUARIO/agrotec-dashboard)

### Opção 2: Deploy Manual

```powershell
# 1. Executar script de setup
.\deploy-setup.ps1

# 2. Seguir instruções exibidas
# 3. Criar repositório no GitHub
# 4. Conectar na Vercel
```

📖 **Guia Completo:** [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

## 🛠️ Tecnologias

- **Frontend:** React 19.2.1 + TypeScript 5.6
- **Build:** Vite 6.4.1
- **Estilo:** Tailwind CSS
- **Gráficos:** Recharts
- **Banco de Dados:** Supabase PostgreSQL
- **IA:** Google Gemini API
- **PDF:** html2pdf.js
- **Deploy:** Vercel

## 📋 Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- npm ou yarn
- Conta Supabase ([Criar grátis](https://supabase.com))
- (Opcional) Conta Google Cloud para IA

## � Instalação Local

### 1. Clonar Repositório

### 1. Clonar e Instalar
```bash
git clone <seu-repositorio>
cd agrotecdashboard
npm install
```

### 2. Configurar Supabase

**Opção A: Setup Automatizado (Recomendado)**
```bash
# Leia o guia completo
cat SUPABASE_SETUP.md
```

**Opção B: Manual**
1. Acesse https://supabase.com/dashboard
2. Crie um projeto novo
3. Copie Project URL e Public Key
4. Adicione no `.env.local`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```
5. Execute o SQL em `supabase/migrations/001_init.sql` no Supabase SQL Editor

### 3. Rodar o Projeto
```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

## 📁 Estrutura de Arquivos

```
agrotecdashboard/
├── components/           # Componentes React
├── services/
│   ├── supabaseClient.ts    # Configuração Supabase
│   ├── supabaseService.ts   # CRUD operations
│   └── geminiService.ts     # Geração de relatórios
├── supabase/
│   └── migrations/
│       └── 001_init.sql     # Schema do banco
├── .env.local              # Credenciais (NÃO COMMITAR)
└── vite.config.ts          # Configuração Vite
```

## 🗄️ Banco de Dados

O projeto usa **Supabase PostgreSQL**:

- **Tabela: exhibitors** - Dados dos expositores
- **Tabela: gallery_photos** - Fotos da galeria

Todos os dados são salvos automaticamente na nuvem e sincronizados entre dispositivos.

## 🔒 Segurança

- Variáveis de ambiente em `.env.local` (não sincronizado)
- `.env.local` está no `.gitignore`
- Public Key do Supabase é segura (somente para leitura/escrita de dados públicos)

**Para produção**, implementar autenticação com Supabase Auth.

## 📚 Documentação Completa

- [Guia de Setup Supabase](./SUPABASE_SETUP.md)
- [Resumo de Implementação](./SETUP_RESUMO.md)

## ⚙️ Build e Deploy

### Build para produção:
```bash
npm run build
```

Arquivos gerados em `dist/`

### Versão preview:
```bash
npm run preview
```

## 🐛 Troubleshooting

**Erro: "Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js
```

**Dados não aparecem após atualizar**
- Verifique conexão de internet
- Confirme `.env.local` com credenciais
- Abra DevTools (F12) → Console e veja erros

**Primeira vez não tem dados?**
- É normal! Crie alguns expositores no formulário
- Dados vão ser salvos no banco de dados Supabase

## 🔄 Como Funciona

```
Usuário na máquina A                Usuário na máquina B
        ↓                                   ↓
    Dashboard                          Dashboard
        ↓                                   ↓
  Salva dados ──→ Supabase Cloud ←── Carrega dados
                  (PostgreSQL)
        ↓                                   ↓
    Persiste                           Sincroniza
```

## 📞 Suporte

- Docs Supabase: https://supabase.com/docs
- Issues: Abra uma issue neste repositório

## 📄 Licença

Projeto desenvolvido para SEMAGRIC - Porto Velho

---

**Desenvolvido com ❤️ para AGROTEC 2025**
