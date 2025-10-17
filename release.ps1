# 前端
Set-Location "C:\zzk\code\vscode\l4d2"
pnpm build
Write-Host "frontend build success"
Copy-Item -Path "dist" -Destination "C:\Users\zzk\GolandProjects\l4d2serverquery-go\resources" -Recurse -Force