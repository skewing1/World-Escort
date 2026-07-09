# Windows-safe Prisma generate — handles EBUSY file-lock errors.
param(
  [int]$MaxRetries = 5,
  [int]$RetryDelaySeconds = 2
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$clientDir = Join-Path $root "node_modules\.prisma\client"
$engineFile = Join-Path $clientDir "query_engine-windows.dll.node"

Set-Location $root

function Remove-StaleTmpEngines {
  if (-not (Test-Path $clientDir)) { return }
  Get-ChildItem -Path $clientDir -Filter "query_engine-windows.dll.node.tmp*" -ErrorAction SilentlyContinue |
    ForEach-Object {
      try {
        Remove-Item $_.FullName -Force
        Write-Host "Removed stale temp engine: $($_.Name)"
      } catch {
        Write-Warning "Could not remove $($_.Name): $_"
      }
    }
}

function Copy-LatestTmpEngine {
  $tmpFiles = Get-ChildItem -Path $clientDir -Filter "query_engine-windows.dll.node.tmp*" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending

  if (-not $tmpFiles) { return $false }

  $latest = $tmpFiles[0]
  try {
    Copy-Item -Path $latest.FullName -Destination $engineFile -Force
    Write-Host "Copied $($latest.Name) -> query_engine-windows.dll.node"
    Remove-StaleTmpEngines
    return $true
  } catch {
    Write-Warning "Manual copy failed: $_"
    return $false
  }
}

Write-Host "Prisma generate (Windows-safe)..."

for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
  Remove-StaleTmpEngines

  Write-Host "Attempt $attempt of $MaxRetries..."
  $output = npx prisma generate 2>&1
  $exitCode = $LASTEXITCODE

  if ($exitCode -eq 0) {
    Remove-StaleTmpEngines
    Write-Host "Prisma client generated successfully."
    exit 0
  }

  $outputText = $output | Out-String
  Write-Host $outputText

  if ($outputText -match "EBUSY") {
    Write-Warning "Engine file locked (EBUSY). Retrying in ${RetryDelaySeconds}s..."
    Write-Warning "Tip: stop 'npm run dev', Prisma Studio, and close other terminals using this project."
    Start-Sleep -Seconds $RetryDelaySeconds

    if ($attempt -eq $MaxRetries) {
      Write-Host "Trying manual .tmp -> .node copy workaround..."
      if (Copy-LatestTmpEngine) {
        Write-Host "Prisma engine restored via workaround. Client JS/TS was already updated."
        exit 0
      }
    }
    continue
  }

  exit $exitCode
}

Write-Host ""
Write-Host "Prisma generate failed after $MaxRetries attempts."
Write-Host "1. Stop all dev servers: Ctrl+C in terminals running 'npm run dev'"
Write-Host "2. Close Prisma Studio if open"
Write-Host "3. Run: npm run db:generate"
Write-Host "4. If still failing, restart Cursor/VS Code and retry"
exit 1
