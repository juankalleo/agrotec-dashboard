# 🚀 Script de Deploy Rápido - AGROTEC Dashboard

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AGROTEC Dashboard - Deploy Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ ERRO: Execute este script no diretório do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Diretório correto detectado" -ForegroundColor Green
Write-Host ""

# Passo 1: Verificar Git
Write-Host "📦 PASSO 1: Verificando Git..." -ForegroundColor Yellow
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    Write-Host "   Instale em: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Git instalado" -ForegroundColor Green
Write-Host ""

# Passo 2: Inicializar Git (se necessário)
Write-Host "📦 PASSO 2: Inicializando repositório Git..." -ForegroundColor Yellow
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Git já inicializado" -ForegroundColor Green
}
Write-Host ""

# Passo 3: Verificar .env
Write-Host "🔐 PASSO 3: Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  Arquivo .env.local não encontrado!" -ForegroundColor Yellow
    Write-Host "   Crie o arquivo com suas credenciais Supabase" -ForegroundColor Yellow
    Write-Host "   Use .env.example como referência" -ForegroundColor Yellow
} else {
    Write-Host "✅ Arquivo .env.local existe" -ForegroundColor Green
}
Write-Host ""

# Passo 4: Build de teste
Write-Host "🔨 PASSO 4: Testando build..." -ForegroundColor Yellow
Write-Host "   Executando: npm run build" -ForegroundColor Gray
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build executado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Build falhou! Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Passo 5: Preparar commit
Write-Host "📝 PASSO 5: Preparando commit..." -ForegroundColor Yellow
git add .
$commitMsg = "Initial commit - AGROTEC Dashboard $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMsg
Write-Host "✅ Commit criado" -ForegroundColor Green
Write-Host ""

# Passo 6: Instruções para GitHub
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Criar repositório no GitHub:" -ForegroundColor Yellow
Write-Host "   👉 Acesse: https://github.com/new" -ForegroundColor White
Write-Host "   📝 Nome: agrotec-dashboard" -ForegroundColor White
Write-Host "   🔒 Visibilidade: Private" -ForegroundColor White
Write-Host "   ❌ NÃO inicialize com README" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Conectar repositório:" -ForegroundColor Yellow
Write-Host "   Execute (substitua SEU-USUARIO):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/SEU-USUARIO/agrotec-dashboard.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""

Write-Host "3️⃣  Deploy na Vercel:" -ForegroundColor Yellow
Write-Host "   👉 Acesse: https://vercel.com/new" -ForegroundColor White
Write-Host "   📦 Importe o repositório agrotec-dashboard" -ForegroundColor White
Write-Host "   ⚙️  Configure as variáveis de ambiente:" -ForegroundColor White
Write-Host "       • VITE_SUPABASE_URL" -ForegroundColor Gray
Write-Host "       • VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "       • VITE_GEMINI_API_KEY (opcional)" -ForegroundColor Gray
Write-Host "   🚀 Clique em Deploy!" -ForegroundColor White
Write-Host ""

Write-Host "📖 Guia completo: DEPLOY_VERCEL.md" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup concluído!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
