#!/bin/bash
# Script de verificação - AGROTEC Dashboard + Supabase

echo "🔍 Verificando Configuração do AGROTEC Dashboard..."
echo ""

# 1. Verificar Node.js
echo "1️⃣  Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js instalado: $NODE_VERSION"
else
    echo "   ❌ Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
fi

# 2. Verificar npm
echo ""
echo "2️⃣  Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   ✅ npm instalado: $NPM_VERSION"
else
    echo "   ❌ npm não encontrado"
    exit 1
fi

# 3. Verificar arquivo .env.local
echo ""
echo "3️⃣  Verificando arquivo .env.local..."
if [ -f ".env.local" ]; then
    echo "   ✅ Arquivo .env.local existe"
    
    # Verificar se tem VITE_SUPABASE_URL
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo "   ✅ VITE_SUPABASE_URL encontrado"
    else
        echo "   ⚠️  VITE_SUPABASE_URL não encontrado"
    fi
    
    # Verificar se tem VITE_SUPABASE_ANON_KEY
    if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo "   ✅ VITE_SUPABASE_ANON_KEY encontrado"
    else
        echo "   ⚠️  VITE_SUPABASE_ANON_KEY não encontrado"
    fi
else
    echo "   ❌ Arquivo .env.local não encontrado"
    echo "   💡 Copie .env.local.example para .env.local e adicione suas credenciais"
fi

# 4. Verificar node_modules
echo ""
echo "4️⃣  Verificando dependências..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules encontrado"
    
    # Verificar se Supabase está instalado
    if [ -d "node_modules/@supabase/supabase-js" ]; then
        echo "   ✅ @supabase/supabase-js instalado"
    else
        echo "   ⚠️  @supabase/supabase-js não instalado"
        echo "   💡 Execute: npm install"
    fi
else
    echo "   ❌ node_modules não encontrado"
    echo "   💡 Execute: npm install"
fi

# 5. Verificar arquivos de serviço
echo ""
echo "5️⃣  Verificando arquivos de integração..."
FILES=(
    "services/supabaseClient.ts"
    "services/supabaseService.ts"
    "env.d.ts"
    "supabase/migrations/001_init.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file não encontrado"
    fi
done

# 6. Verificar Git ignore
echo ""
echo "6️⃣  Verificando .gitignore..."
if grep -q "\.env\.local" .gitignore; then
    echo "   ✅ .env.local está no .gitignore (seguro!)"
else
    echo "   ⚠️  .env.local pode não estar protegido"
fi

# 7. Verificar documentação
echo ""
echo "7️⃣  Verificando documentação..."
DOCS=(
    "SUPABASE_SETUP.md"
    "TESTING.md"
    "FAQ.md"
    "INTEGRACAO_COMPLETA.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "   ✅ $doc"
    else
        echo "   ⚠️  $doc não encontrado"
    fi
done

# Resumo final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ RESUMO DA VERIFICAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Se todos os itens estão ✅, você pode:"
echo ""
echo "1️⃣  Adicionar credenciais em .env.local"
echo "2️⃣  Executar SQL em supabase/migrations/001_init.sql"
echo "3️⃣  Rodar: npm run dev"
echo ""
echo "Para mais informações, leia: SUPABASE_SETUP.md"
echo ""
