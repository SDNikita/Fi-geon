$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$report = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..') -Filter '*.docx' | Where-Object { -not $_.Name.StartsWith('~') } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$outputDir = Join-Path $PSScriptRoot 'user-process-pages'
[System.IO.Directory]::CreateDirectory($outputDir) | Out-Null
$word = $null
$document = $null
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  $word.Options.SaveNormalPrompt = $false
  $document = $word.Documents.Open($report.FullName, $false, $false)
  $document.Activate()
  $word.ActiveWindow.View.Type = 3
  $document.Repaginate()
  $document.Fields.Update() | Out-Null
  foreach ($toc in $document.TablesOfContents) { $toc.Update() }
  $document.Repaginate()
  foreach ($toc in $document.TablesOfContents) { $toc.UpdatePageNumbers() }
  $document.Save()
  Write-Output ('Saved document; pages=' + $document.ComputeStatistics(2))
  $pages = $word.ActiveWindow.Panes.Item(1).Pages
  Write-Output ('Render pages=' + $pages.Count)
  for ($i = 1; $i -le $pages.Count; $i++) {
    [byte[]]$bits = $pages.Item($i).EnhMetaFileBits
    $stream = New-Object System.IO.MemoryStream(,$bits)
    $metafile = [System.Drawing.Image]::FromStream($stream)
    $bitmap = New-Object System.Drawing.Bitmap(1654, 2339)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.DrawImage($metafile, 0, 0, 1654, 2339)
    $bitmap.Save((Join-Path $outputDir ('page-' + $i + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    $metafile.Dispose()
    $stream.Dispose()
  }
  Write-Output 'Rendering complete'
} finally {
  if ($null -ne $document) { $document.Close(0) }
  if ($null -ne $word) { $word.Quit() }
}
