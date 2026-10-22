$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root 'public/assets'
$theme = Get-Content -LiteralPath (Join-Path $root 'public/theme.css') -Raw

function Get-ThemeColor([string]$name) {
    $match = [regex]::Match($theme, "--$name-rgb:\s*(\d+) (\d+) (\d+)")
    if (-not $match.Success) { throw "Missing theme color: $name" }
    return [System.Drawing.Color]::FromArgb([int]$match.Groups[1].Value, [int]$match.Groups[2].Value, [int]$match.Groups[3].Value)
}

Push-Location $root
try {
    $json = node --input-type=module -e "import { projectStories } from './src/i18n/projectStories.js'; import { projectPages } from './src/i18n/projectPages.js'; import { projectMedia } from './src/data/projectMedia.js'; console.log(JSON.stringify(Object.entries(projectStories).flatMap(([language, copy]) => copy.projects.map((project, index) => ({ language, index, intro: project.intro, label: projectPages[language].eyebrow, image: projectMedia(index, language).screens[0].src })))));"
    if ($LASTEXITCODE -ne 0) { throw 'Could not load project copy.' }
    $projects = $json | ConvertFrom-Json
} finally {
    Pop-Location
}

foreach ($project in $projects) {
    $slug = @('autoalex', 'nickolasgames')[$project.index]
    $name = @('AutoAlexDE', 'NickolasGames')[$project.index]
    $canvas = [System.Drawing.Bitmap]::new(1200, 630)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $imagePath = ($project.image -split '\?')[0] -replace '^\./', ''
    $screen = [System.Drawing.Image]::FromFile((Join-Path $root "public/$imagePath"))
    $logo = [System.Drawing.Image]::FromFile((Join-Path $assets 'logo-cyan.png'))
    $paper = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'paper'))
    $mist = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'mist'))
    $accent = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'accent'))
    $surface = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'ink2'))
    $rule = [System.Drawing.Pen]::new((Get-ThemeColor 'line'), 1)
    $brandFont = [System.Drawing.Font]::new('Arial', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $nameFont = [System.Drawing.Font]::new('Arial', 51, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $bodyFont = [System.Drawing.Font]::new('Arial', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $smallFont = [System.Drawing.Font]::new('Arial', 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    try {
        $graphics.Clear((Get-ThemeColor 'ink'))
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

        $graphics.DrawImage($logo, [System.Drawing.Rectangle]::new(52, 37, 60, 60))
        $graphics.DrawString('NickolasSpace', $brandFont, $paper, 124, 54)
        $graphics.DrawString($project.label, $smallFont, $accent, 60, 160)
        $graphics.DrawString($name, $nameFont, $paper, 56, 204)
        $graphics.DrawString($project.intro, $bodyFont, $mist, [System.Drawing.RectangleF]::new(60, 285, 448, 200))

        $graphics.FillRectangle($surface, 550, 160, 590, 350)
        $ratio = [Math]::Min(566 / $screen.Width, 326 / $screen.Height)
        $width = [int][Math]::Round($screen.Width * $ratio)
        $height = [int][Math]::Round($screen.Height * $ratio)
        $rectangle = [System.Drawing.Rectangle]::new([int](550 + (590 - $width) / 2), [int](160 + (350 - $height) / 2), $width, $height)
        $graphics.DrawImage($screen, $rectangle)
        $graphics.DrawLine($rule, 60, 548, 1140, 548)
        $graphics.DrawString('nickolasspace.com', $smallFont, $mist, 60, 574)
        $graphics.DrawString($project.language.ToUpperInvariant(), $smallFont, $accent, 1102, 574)
        $canvas.Save((Join-Path $assets "project-$slug-social-$($project.language)-v1.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        $graphics.Dispose()
        $canvas.Dispose()
        $screen.Dispose()
        $logo.Dispose()
        $paper.Dispose()
        $mist.Dispose()
        $accent.Dispose()
        $surface.Dispose()
        $rule.Dispose()
        $brandFont.Dispose()
        $nameFont.Dispose()
        $bodyFont.Dispose()
        $smallFont.Dispose()
    }
}
