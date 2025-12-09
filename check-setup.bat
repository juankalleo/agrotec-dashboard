@echo off
REM Script de verificação - AGROTEC Dashboard + Supabase (Windows)

echo.
echo 🔍 Verificando Configuracao do AGROTEC Dashboard...
echo.

REM 1. Verificar Node.js
echo 1️⃣  Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo    ✅ Node.js instalado: %NODE_VERSION%
) else (
    echo    ❌ Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b 1
)

REM 2. Verificar npm
echo.
echo 2️⃣  Verificando npm...
npm -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo    ✅ npm instalado: %NPM_VERSION%
) else (
    echo    ❌ npm nao encontrado
    pause
    exit /b 1
)

REM 3. Verificar arquivo .env.local
echo.
echo 3️⃣  Verificando arquivo .env.local...
if exist ".env.local" (
    echo    ✅ Arquivo .env.local existe
    
    findstr /m "VITE_SUPABASE_URL" .env.local >nul
    if %errorlevel% equ 0 (
        echo    ✅ VITE_SUPABASE_URL encontrado
    ) else (
        echo    ⚠️  VITE_SUPABASE_URL nao encontrado
    )
    
    findstr /m "VITE_SUPABASE_ANON_KEY" .env.local >nul
    if %errorlevel% equ 0 (
        echo    ✅ VITE_SUPABASE_ANON_KEY encontrado
    ) else (
        echo    ⚠️  VITE_SUPABASE_ANON_KEY nao encontrado
    )
) else (
    echo    ❌ Arquivo .env.local nao encontrado
    echo    💡 Copie .env.local.example para .env.local
)

REM 4. Verificar node_modules
echo.
echo 4️⃣  Verificando dependencias...
if exist "node_modules" (
    echo    ✅ node_modules encontrado
    
    if exist "node_modules\@supabase\supabase-js" (
        echo    ✅ @supabase/supabase-js instalado
    ) else (
        echo    ⚠️  @supabase/supabase-js nao instalado
        echo    💡 Execute: npm install
    )
) else (
    echo    ❌ node_modules nao encontrado
    echo    💡 Execute: npm install
)

REM 5. Verificar arquivos de serviço
echo.
echo 5️⃣  Verificando arquivos de integracao...
if exist "services\supabaseClient.ts" (
    echo    ✅ services\supabaseClient.ts
) else (
    echo    ❌ services\supabaseClient.ts nao encontrado
)

if exist "services\supabaseService.ts" (
    echo    ✅ services\supabaseService.ts
) else (
    echo    ❌ services\supabaseService.ts nao encontrado
)

if exist "env.d.ts" (
    echo    ✅ env.d.ts
) else (
    echo    ❌ env.d.ts nao encontrado
)

if exist "supabase\migrations\001_init.sql" (
    echo    ✅ supabase\migrations\001_init.sql
) else (
    echo    ❌ supabase\migrations\001_init.sql nao encontrado
)

REM 6. Verificar documentação
echo.
echo 6️⃣  Verificando documentacao...
if exist "SUPABASE_SETUP.md" (
    echo    ✅ SUPABASE_SETUP.md
) else (
    echo    ⚠️  SUPABASE_SETUP.md nao encontrado
)

if exist "TESTING.md" (
    echo    ✅ TESTING.md
) else (
    echo    ⚠️  TESTING.md nao encontrado
)

if exist "FAQ.md" (
    echo    ✅ FAQ.md
) else (
    echo    ⚠️  FAQ.md nao encontrado
)

if exist "INTEGRACAO_COMPLETA.md" (
    echo    ✅ INTEGRACAO_COMPLETA.md
) else (
    echo    ⚠️  INTEGRACAO_COMPLETA.md nao encontrado
)

REM Resumo final
echo.
echo ================================================
echo ✨ RESUMO DA VERIFICACAO
echo ================================================
echo.
echo Se todos os itens estao ✅, voce pode:
echo.
echo 1️⃣  Adicionar credenciais em .env.local
echo 2️⃣  Executar SQL em supabase\migrations\001_init.sql
echo 3️⃣  Rodar: npm run dev
echo.
echo Para mais informacoes, leia: SUPABASE_SETUP.md
echo.
pause
