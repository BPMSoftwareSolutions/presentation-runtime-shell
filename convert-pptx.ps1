param(
    [string]$PptxPath = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\RR Growth Roadmap Final 121317.pptx",
    [string]$OutputDir = "C:\source\repos\bpm\internal\presentation-runtime-shell\docs\strategy-slides\html-export"
)

$extractDir = "$OutputDir\.extract-temp"

# Create output directory
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

# Extract PPTX as ZIP using .NET
Write-Host "Extracting PPTX file..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($PptxPath, $extractDir)

# Find all slide XML files
$slidesDir = Join-Path $extractDir "ppt\slides"
$slides = Get-ChildItem -Path $slidesDir -Filter "slide*.xml" | Sort-Object { [int]($_.BaseName -replace '\D+') }

Write-Host "Found $($slides.Count) slides"

# Process each slide
foreach ($slide in $slides) {
    $slideNum = [int]($slide.BaseName -replace '\D+')
    $htmlPath = Join-Path $OutputDir "slide-$slideNum.html"
    
    # Read the XML content
    [xml]$xmlContent = Get-Content -Path $slide.FullName
    
    # Extract text from the slide
    $namespace = @{
        p = 'http://schemas.openxmlformats.org/presentationml/2006/main'
        a = 'http://schemas.openxmlformats.org/drawingml/2006/main'
        r = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    }
    
    $textElements = $xmlContent.SelectNodes('//a:t', $namespace) | ForEach-Object { $_.InnerText }
    
    # Create HTML
    $htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide $slideNum</title>
    <style>
        body {
            font-family: Calibri, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            min-height: 100vh;
        }
        .slide {
            max-width: 960px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            line-height: 1.6;
        }
        h1 { color: #1a5490; margin-bottom: 20px; }
        h2 { color: #2e7bb4; margin-top: 20px; margin-bottom: 15px; }
        p { color: #333; margin: 10px 0; }
        .slide-number { 
            position: absolute; 
            top: 20px; 
            right: 20px; 
            color: #999; 
            font-size: 12px; 
        }
        .navigation {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .nav-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 20px;
            background: #2e7bb4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.3s;
        }
        .nav-link:hover {
            background: #1a5490;
        }
    </style>
</head>
<body>
    <div class="slide-number">Slide $slideNum</div>
    <div class="slide">
        <h1>Slide $slideNum</h1>
"@
    
    foreach ($text in $textElements) {
        if (-not [string]::IsNullOrWhiteSpace($text)) {
            $htmlContent += "        <p>$([System.Web.HttpUtility]::HtmlEncode($text))</p>`r`n"
        }
    }
    
    $htmlContent += @"
        <div class="navigation">
            <a href="index.html" class="nav-link">← Back to Index</a>
"@
    
    if ($slideNum -gt 1) {
        $htmlContent += "            <a href='slide-$($slideNum - 1).html' class='nav-link'>← Previous</a>`r`n"
    }
    
    if ($slideNum -lt $slides.Count) {
        $htmlContent += "            <a href='slide-$($slideNum + 1).html' class='nav-link'>Next →</a>`r`n"
    }
    
    $htmlContent += @"
        </div>
    </div>
</body>
</html>
"@
    
    Set-Content -Path $htmlPath -Value $htmlContent -Encoding UTF8
    Write-Host "Created: slide-$slideNum.html"
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
            font-family: Calibri, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 960px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1a5490;
            text-align: center;
            margin-bottom: 30px;
        }
        .slide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
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
        }
        .slide-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .slide-card h3 {
            margin: 0;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>RR Growth Roadmap - Slide Presentation</h1>
        <p style="text-align: center; color: #666;">
            Presentation converted from PowerPoint to HTML<br>
            Total slides: $($slides.Count)
        </p>
        <div class="slide-grid">
"@
    
    for ($i = 1; $i -le $slides.Count; $i++) {
        $indexContent += "            <a href='slide-$i.html' class='slide-card'><h3>Slide $i</h3></a>`r`n"
    }
    
    $indexContent += @"
        </div>
    </div>
</body>
</html>
"@
    
    Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8
    Write-Host "Created: index.html"

Write-Host "`nConversion complete!"
Write-Host "Output directory: $OutputDir"
Write-Host "View index.html to browse all slides"
