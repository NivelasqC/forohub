# Uso: desde la raíz, .\scripts\publicar-git.ps1 -Url "https://github.com/USUARIO/REPO.git"
param([Parameter(Mandatory=$true)][string]$Url)
$ErrorActionPreference='Stop'
if (-not (Test-Path '.git')) { throw 'Falta el repositorio Git local (.git). Revisa el ZIP o ejecuta git init.' }
if ((git remote) -contains 'origin') { git remote set-url origin $Url } else { git remote add origin $Url }
git push -u origin main
git push origin develop
Write-Host 'Copia el enlace del repositorio en la entrega AVA.' -ForegroundColor Green
