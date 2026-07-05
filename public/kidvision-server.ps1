# KidVision Local Server
# This script starts a tiny HTTP server so Edge can run JavaScript.
# Do NOT close this window while students are using KidVision.

$port = 8765
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$defaultAppRelativePath = "KidVision_Local_App_Windows_v13_vocab/index.html"
$defaultAppPath = Join-Path $dir $defaultAppRelativePath

if (-not (Test-Path $defaultAppPath)) {
    Write-Host "ERROR: $defaultAppRelativePath not found in $dir" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

try {
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "KidVision server running on http://localhost:$port/" -ForegroundColor Green
    Write-Host "Do not close this window." -ForegroundColor Yellow
    
    while ($true) {
        $ctx = $listener.GetContext()
        $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.LocalPath.TrimStart('/'))

        if (-not $path -or $path -eq 'kidvision.html') {
            $path = $defaultAppRelativePath
        } elseif ($path.EndsWith('/')) {
            $path = "$($path.TrimEnd('/'))/index.html"
        }

        $file = Join-Path $dir $path
        $fullPath = [System.IO.Path]::GetFullPath($file)
        $rootPath = [System.IO.Path]::GetFullPath($dir)

        if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $ctx.Response.StatusCode = 403
            $ctx.Response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Container) {
            $fullPath = Join-Path $fullPath 'index.html'
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = switch ($ext) {
                '.html'  { 'text/html; charset=utf-8' }
                '.css'   { 'text/css; charset=utf-8' }
                '.js'    { 'application/javascript; charset=utf-8' }
                '.json'  { 'application/json; charset=utf-8' }
                '.png'   { 'image/png' }
                '.jpg'   { 'image/jpeg' }
                '.jpeg'  { 'image/jpeg' }
                '.svg'   { 'image/svg+xml' }
                '.ico'   { 'image/x-icon' }
                '.gif'   { 'image/gif' }
                '.webp'  { 'image/webp' }
                '.mp4'   { 'video/mp4' }
                '.woff'  { 'font/woff' }
                '.woff2' { 'font/woff2' }
                default  { 'application/octet-stream' }
            }
            $ctx.Response.ContentType = $mime
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
        }
        $ctx.Response.Close()
    }
} catch {
    Write-Host "Server error: $_" -ForegroundColor Red
    Read-Host "Press Enter to close"
} finally {
    if ($listener) { $listener.Stop() }
}
