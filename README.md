<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AGROTEC Dashboard - Portal de Gestão 2025

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Portal moderno para gestão da Feira de Agronegócio e Tecnologia de Porto Velho (SEMAGRIC). Dashboard inteligente com dados sincronizados em nuvem.

## 🚀 Características

- ✅ Dashboard executivo com gráficos
- ✅ Gerenciamento de expositores
- ✅ Galeria de fotos
- ✅ **Dados salvos em banco de dados Supabase (nuvem)**
- ✅ Sincronização em múltiplos dispositivos
- ✅ Relatórios em PDF
- ✅ Interface responsiva (mobile e desktop)

## 🛠️ Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita em https://supabase.com)

## 📋 Quick Start

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
