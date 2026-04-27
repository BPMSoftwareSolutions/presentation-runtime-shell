param(
    [string]$PptxPath = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\RR Growth Roadmap Final 121317.pptx",
    [string]$OutputDir = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\html-export"
)

$extractDir = "$OutputDir\.extract-temp"

# Create output directory
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

# Extract PPTX as ZIP
Write-Host "Extracting PPTX file..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($PptxPath, $extractDir)

# Find all slide XML files
$slidesDir = Join-Path $extractDir "ppt\slides"
$slides = Get-ChildItem -Path $slidesDir -Filter "slide*.xml" | Sort-Object { [int]($_.BaseName -replace '\D+') }

Write-Host "Found $($slides.Count) slides"

function Extract-TextFromSlide {
    param([string]$SlideXmlPath)
    
    $texts = @()
    
    # Read raw content to extract text runs
    try {
        $content = Get-Content -Path $SlideXmlPath -Raw -Encoding UTF8
        
        # Extract all <a:t> elements
        $pattern = '<a:t>([^<]*)</a:t>'
        $matches = [regex]::Matches($content, $pattern)
        
        foreach ($match in $matches) {
            $text = $match.Groups[1].Value.Trim()
            # Only add non-empty text
            if ([string]::IsNullOrWhiteSpace($text) -eq $false) {
                $texts += $text
            }
        }
        
        # Group consecutive text runs that belong to same paragraph
        if ($texts.Count -gt 0) {
            # Combine certain text fragments that should be together
            $combined = @()
            $currentLine = ""
            
            foreach ($t in $texts) {
                # If text ends with punctuation or is a single word/number, it might be standalone
                if ($t -match '[\.\?,!:]$' -or $currentLine -eq "") {
                    $currentLine += $t
                    $combined += $currentLine
                    $currentLine = ""
                } else {
                    # Otherwise, try to build a line
                    if ($currentLine) {
                        $currentLine += " "
                    }
                    $currentLine += $t
                    
                    # If accumulation is long enough, it's probably a complete item
                    if ($currentLine.Length -gt 30 -or $t.Length -gt 40) {
                        $combined += $currentLine
                        $currentLine = ""
                    }
                }
            }
            
            if ($currentLine) {
                $combined += $currentLine
            }
            
            return $combined
        }
    } catch {
        Write-Host "Error processing slide: $($_.Exception.Message)"
    }
    
    return $texts
}

# Process each slide
foreach ($slide in $slides) {
    $slideNum = [int]($slide.BaseName -replace '\D+')
    $htmlPath = Join-Path $OutputDir "slide-$slideNum.html"
    
    Write-Host "Processing slide $slideNum..."
    
    # Extract text from the slide
    $slideTexts = Extract-TextFromSlide -SlideXmlPath $slide.FullName
    
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
            font-weight: 500;
        }
        h1 { 
            color: #1a5490; 
            margin: 0 0 20px 0;
            font-size: 32px;
            border-bottom: 3px solid #2e7bb4;
            padding-bottom: 15px;
        }
        h2 { 
            color: #2e7bb4; 
            margin: 25px 0 15px 0;
            font-size: 20px;
        }
        h3 {
            color: #3d8bc4;
            margin: 20px 0 10px 0;
        }
        p, li { 
            color: #333; 
            margin: 12px 0;
            font-size: 16px;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        .slide-content {
            min-height: 300px;
        }
        .empty-slide {
            text-align: center;
            color: #999;
            padding: 60px 20px;
            font-size: 16px;
        }
        .navigation {
            margin-top: 40px;
            text-align: center;
            border-top: 2px solid #ddd;
            padding-top: 30px;
        }
        .nav-link {
            display: inline-block;
            margin: 0 15px;
            padding: 12px 25px;
            background: #2e7bb4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.3s, transform 0.2s;
            font-weight: 500;
            font-size: 14px;
        }
        .nav-link:hover {
            background: #1a5490;
            transform: translateY(-2px);
        }
        .nav-link:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-number">Slide $slideNum of $($slides.Count)</div>
        <div class="slide-content">
"@
    
    if ($slideTexts.Count -gt 0) {
        # First text is usually the title
        $htmlContent += "            <h1>$([System.Web.HttpUtility]::HtmlEncode($slideTexts[0]))</h1>`r`n"
        
        # Rest of the text
        for ($i = 1; $i -lt $slideTexts.Count; $i++) {
            $text = $slideTexts[$i]
            # Check if it looks like a heading (short text)
            if ($text.Length -lt 60 -and $i -lt 5) {
                $htmlContent += "            <h2>$([System.Web.HttpUtility]::HtmlEncode($text))</h2>`r`n"
            } else {
                $htmlContent += "            <p>$([System.Web.HttpUtility]::HtmlEncode($text))</p>`r`n"
            }
        }
    } else {
        $htmlContent += "            <div class='empty-slide'><p>(Slide content - text not extracted)</p></div>`r`n"
    }
    
    $htmlContent += @"
        </div>
        <div class="navigation">
            <a href="index.html" class="nav-link">← Back to Index</a>
"@
    
    if ($slideNum -gt 1) {
        $htmlContent += "            <a href='slide-$($slideNum - 1).html' class='nav-link'>← Previous Slide</a>`r`n"
    }
    
    if ($slideNum -lt $slides.Count) {
        $htmlContent += "            <a href='slide-$($slideNum + 1).html' class='nav-link'>Next Slide →</a>`r`n"
    }
    
    $htmlContent += @"
        </div>
    </div>
</body>
</html>
"@
    
    Set-Content -Path $htmlPath -Value $htmlContent -Encoding UTF8
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
            margin: 0 0 15px 0;
            font-size: 36px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 16px;
        }
        .slide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .slide-card {
            background: linear-gradient(135deg, #2e7bb4 0%, #1a5490 100%);
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            text-decoration: none;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80px;
        }
        .slide-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .slide-card h3 {
            margin: 0;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>RR Growth Roadmap</h1>
        <div class="subtitle">
            Presentation converted from PowerPoint to HTML<br>
            <strong>Total slides: $($slides.Count)</strong>
        </div>
        <div class="slide-grid">
"@
    
    for ($i = 1; $i -le $slides.Count; $i++) {
        $indexContent += "            <a href='slide-$i.html' class='slide-card'><h3>$i</h3></a>`r`n"
    }
    
    $indexContent += @"
        </div>
    </div>
</body>
</html>
"@
    
    Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8

Write-Host "`nConversion complete!"
Write-Host "Output directory: $OutputDir"
Write-Host "View index.html to browse all slides"
