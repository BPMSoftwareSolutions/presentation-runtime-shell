param(
    [string]$PptxPath = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\RR Growth Roadmap Final 121317.pptx",
    [string]$OutputDir = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\html-export"
)

$extractDir = "$OutputDir\.extract-temp"

# Create output directory
Remove-Item $OutputDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

# Extract PPTX as ZIP
Write-Host "Extracting PPTX file..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($PptxPath, $extractDir)

# Find all slide XML files
$slidesDir = Join-Path $extractDir "ppt\slides"
$slides = @(Get-ChildItem -Path $slidesDir -Filter "slide*.xml" | Sort-Object { [int]($_.BaseName -replace '\D+') })

Write-Host "Found $($slides.Count) slides"

# Simple text extraction using regex on raw file content
function Extract-TextFromSlide {
    param([string]$SlideXmlPath)
    
    try {
        $content = [System.IO.File]::ReadAllText($SlideXmlPath, [System.Text.Encoding]::UTF8)
        
        # Find all text between <a:t> tags
        $allMatches = [System.Text.RegularExpressions.Regex]::Matches($content, '<a:t>([^<]*)</a:t>')
        
        $texts = @()
        foreach ($match in $allMatches) {
            $text = $match.Groups[1].Value
            # Trim and only add if not empty
            if (-not [string]::IsNullOrWhiteSpace($text)) {
                $texts += $text.Trim()
            }
        }
        
        return $texts
    } catch {
        Write-Host "Error in slide: $_"
        return @()
    }
}

# Process each slide
$slideCount = 0
foreach ($slide in $slides) {
    $slideNum = [int]($slide.BaseName -replace '\D+')
    $htmlPath = Join-Path $OutputDir "slide-$slideNum.html"
    $slideCount++
    
    Write-Host "Processing slide $slideNum... ($slideCount/$($slides.Count))"
    
    # Extract text from the slide
    $slideTexts = Extract-TextFromSlide -SlideXmlPath $slide.FullName
    
    # Build content
    $title = if ($slideTexts.Count -gt 0) { $slideTexts[0] } else { "Slide $slideNum" }
    $bodyHtml = "<h1>$([System.Web.HttpUtility]::HtmlEncode($title))</h1>`n"
    
    # Add remaining text
    for ($i = 1; $i -lt $slideTexts.Count; $i++) {
        $text = [System.Web.HttpUtility]::HtmlEncode($slideTexts[$i])
        $bodyHtml += "<p>$text</p>`n"
    }
    
    # Create HTML
    $htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide $slideNum - RR Growth Roadmap</title>
    <style>
        body {
            font-family: Calibri, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            min-height: 100vh;
        }
        .slide {
            max-width: 960px;
            margin: 0 auto;
            background: white;
            padding: 50px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            line-height: 1.8;
            position: relative;
        }
        .slide-number { 
            position: absolute; 
            top: 20px; 
            right: 30px; 
            color: #999; 
            font-size: 14px;
        }
        h1 { 
            color: #1a5490; 
            margin: 0 0 20px 0;
            font-size: 32px;
            border-bottom: 3px solid #2e7bb4;
            padding-bottom: 15px;
        }
        p { 
            color: #333; 
            margin: 15px 0;
            font-size: 16px;
            line-height: 1.6;
        }
        .navigation {
            margin-top: 40px;
            text-align: center;
            border-top: 2px solid #ddd;
            padding-top: 30px;
        }
        .nav-link {
            display: inline-block;
            margin: 0 10px;
            padding: 12px 25px;
            background: #2e7bb4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.3s;
            font-weight: 500;
            font-size: 14px;
        }
        .nav-link:hover {
            background: #1a5490;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-number">Slide $slideNum / $($slides.Count)</div>
        <div class="slide-content">
            $bodyHtml
        </div>
        <div class="navigation">
            <a href="index.html" class="nav-link">← Back to Index</a>
$( if ($slideNum -gt 1) { "            <a href='slide-$($slideNum - 1).html' class='nav-link'>← Previous</a>" } )
$( if ($slideNum -lt $slides.Count) { "            <a href='slide-$($slideNum + 1).html' class='nav-link'>Next →</a>" } )
        </div>
    </div>
</body>
</html>
"@
    
    [System.IO.File]::WriteAllText($htmlPath, $htmlContent, [System.Text.Encoding]::UTF8)
}

# Create index page
$indexPath = Join-Path $OutputDir "index.html"
$indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RR Growth Roadmap - Slide Index</title>
    <style>
        body {
            font-family: Calibri, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 30px 20px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 50px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1a5490;
            text-align: center;
            font-size: 36px;
            margin: 0 0 10px 0;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
        }
        .slide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
        }
        .slide-card {
            background: linear-gradient(135deg, #2e7bb4 0%, #1a5490 100%);
            padding: 20px 15px;
            border-radius: 6px;
            text-align: center;
            text-decoration: none;
            color: white;
            font-weight: 500;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80px;
        }
        .slide-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>RR Growth Roadmap</h1>
        <div class="subtitle">Presentation slides converted from PowerPoint • $($slides.Count) slides</div>
        <div class="slide-grid">
"@
    
    for ($i = 1; $i -le $slides.Count; $i++) {
        $indexContent += "            <a href='slide-$i.html' class='slide-card'>$i</a>`n"
    }
    
    $indexContent += @"
        </div>
    </div>
</body>
</html>
"@
    
    [System.IO.File]::WriteAllText($indexPath, $indexContent, [System.Text.Encoding]::UTF8)

Write-Host "`nConversion complete!"
Write-Host "Created $($slides.Count) slides in: $OutputDir"

# Cleanup
Remove-Item "$extractDir" -Recurse -Force -ErrorAction SilentlyContinue
