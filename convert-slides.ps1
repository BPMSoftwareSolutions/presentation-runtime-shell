param(
    [string]$PptxPath = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\RR Growth Roadmap Final 121317.pptx",
    [string]$OutputDir = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\html-export"
)

$extractDir = "$OutputDir\.extract-temp"

# Clean and create
Remove-Item $OutputDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

# Extract PPTX
Write-Host "Extracting PPTX..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($PptxPath, $extractDir)

# Get all slides
$slidesDir = Join-Path $extractDir "ppt\slides"
$slides = @(Get-ChildItem -Path $slidesDir -Filter "slide*.xml" | Sort-Object { [int]($_.BaseName -replace '\D+') })

Write-Host "Found $($slides.Count) slides"

# Extract text using Select-String (faster and more reliable)
function Extract-SlideTextContent {
    param([string]$XmlPath)
    
    # Use Select-String to extract all <a:t>...</a:t> content
    $matches = Select-String -Path $XmlPath -Pattern '<a:t>(.+?)</a:t>' -AllMatches | ForEach-Object { $_.Matches }
    
    $texts = @()
    foreach ($match in $matches) {
        $text = $match.Groups[1].Value.Trim()
        if ($text.Length -gt 0) {
            $texts += $text
        }
    }
    
    return $texts
}

# Process slides
$slideCount = 0
foreach ($slide in $slides) {
    $slideNum = [int]($slide.BaseName -replace '\D+')
    $htmlPath = Join-Path $OutputDir "slide-$slideNum.html"
    $slideCount++
    
    Write-Host "[$slideCount/$($slides.Count)] Slide $slideNum"
    
    # Extract text
    $slideTexts = @(Select-String -Path $slide.FullName -Pattern '<a:t>(.+?)</a:t>' -AllMatches | ForEach-Object { $_.Matches.Groups[1].Value.Trim() } | Where-Object { $_.Length -gt 0 })
    
    # Build HTML content
    $title = if ($slideTexts.Count -gt 0) { $slideTexts[0] } else { "(Slide $slideNum)" }
    
    $bodyHtml = "<h1>$([System.Web.HttpUtility]::HtmlEncode($title))</h1>`n"
    for ($i = 1; $i -lt $slideTexts.Count; $i++) {
        $t = [System.Web.HttpUtility]::HtmlEncode($slideTexts[$i])
        $bodyHtml += "<p>$t</p>`n"
    }
    
    # Create HTML file
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide $slideNum</title>
    <style>
        body { font-family: Calibri, Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%); min-height: 100vh; }
        .slide { max-width: 960px; margin: 0 auto; background: white; padding: 50px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; }
        .slide-number { position: absolute; top: 20px; right: 30px; color: #999; font-size: 13px; }
        h1 { color: #1a5490; margin: 0 0 20px 0; font-size: 28px; border-bottom: 3px solid #2e7bb4; padding-bottom: 15px; }
        p { color: #333; margin: 12px 0; font-size: 15px; line-height: 1.6; }
        .nav { margin-top: 40px; text-align: center; border-top: 2px solid #ddd; padding-top: 30px; }
        a { display: inline-block; margin: 0 10px; padding: 10px 20px; background: #2e7bb4; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; }
        a:hover { background: #1a5490; }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-number">Slide $slideNum / $($slides.Count)</div>
        $bodyHtml
        <div class="nav">
            <a href="index.html">← Index</a>
            $( if ($slideNum -gt 1) { "<a href='slide-$($slideNum-1).html'>← Prev</a>" } )
            $( if ($slideNum -lt $slides.Count) { "<a href='slide-$($slideNum+1).html'>Next →</a>" } )
        </div>
    </div>
</body>
</html>
"@
    
    Set-Content -Path $htmlPath -Value $html -Encoding UTF8
}

# Create index
$indexHtml = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RR Growth Roadmap</title>
    <style>
        body { font-family: Calibri, Arial, sans-serif; margin: 0; padding: 30px 20px; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 50px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #1a5490; text-align: center; font-size: 36px; margin: 0 0 10px 0; }
        .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
        a { background: linear-gradient(135deg, #2e7bb4 0%, #1a5490 100%); padding: 16px 10px; border-radius: 6px; text-align: center; color: white; text-decoration: none; font-weight: 500; transition: all 0.3s; }
        a:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
    </style>
</head>
<body>
    <div class="container">
        <h1>RR Growth Roadmap</h1>
        <div class="subtitle">PowerPoint slides converted to HTML • $($slides.Count) slides total</div>
        <div class="grid">
$( for ($i=1; $i -le $slides.Count; $i++) { "            <a href='slide-$i.html'>$i</a>`n" } )
        </div>
    </div>
</body>
</html>
"@

Set-Content -Path (Join-Path $OutputDir "index.html") -Value $indexHtml -Encoding UTF8

Write-Host "`n✓ Conversion complete!"
Write-Host "  Location: $OutputDir"
Write-Host "  Open: index.html"

# Cleanup
Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue
