# Ejecutar desde la carpeta raíz: .\scripts\verificar.ps1
$ErrorActionPreference = 'Stop'
Write-Host 'Verificando el despliegue local de ForoHub...' -ForegroundColor Cyan
$urls = @(
  'http://localhost:8081/actuator/health',
  'http://localhost:8082/actuator/health',
  'http://localhost:8083/actuator/health',
  'http://localhost:8082/api/categorias',
  'http://localhost:8080'
)
foreach ($url in $urls) {
  try { $respuesta = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8
    Write-Host "OK $($respuesta.StatusCode)  $url" -ForegroundColor Green
  } catch { Write-Host "ERROR  $url  $($_.Exception.Message)" -ForegroundColor Red }
}
Write-Host 'Si falla un servicio, ejecuta: docker compose logs --tail=100' -ForegroundColor Yellow
