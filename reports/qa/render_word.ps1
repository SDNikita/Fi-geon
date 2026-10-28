$ErrorActionPreference = 'Stop'
$reportPath = (Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..') -Filter '*.docx' | Where-Object { -not $_.Name.StartsWith('~') } | Select-Object -First 1).FullName
$pdfPath = Join-Path $PSScriptRoot 'report.pdf'
$word = $null
$document = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $true
    $word.DisplayAlerts = 0
    $word.Options.SaveNormalPrompt = $false
    Write-Output 'Opening document'
    $document = $word.Documents.Open($reportPath, $false, $false)
    $document.Repaginate()
    $document.Fields.Update() | Out-Null
    foreach ($toc in $document.TablesOfContents) { $toc.Update() }
    $document.Repaginate()
    foreach ($toc in $document.TablesOfContents) { $toc.UpdatePageNumbers() }
    $document.Save()
    Write-Output ('Pages: ' + $document.ComputeStatistics(2))
    Write-Output 'Saving PDF'
    $document.ExportAsFixedFormat($pdfPath, 17, $false, 0, 0, 1, 1, 0, $false, $false, 0, $false, $false, $false)
    Write-Output $pdfPath
}
finally {
    if ($null -ne $document) { $document.Close(0) }
    if ($null -ne $word) { $word.Quit() }
}
