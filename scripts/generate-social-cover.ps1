Add-Type -AssemblyName System.Drawing

$assetDirectory = Join-Path $PSScriptRoot '../public/assets'
$canvas = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$logo = [System.Drawing.Image]::FromFile((Join-Path $assetDirectory 'logo-cyan.png'))
$theme = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../public/theme.css') -Raw

function Get-ThemeColor([string]$name) {
    $match = [regex]::Match($theme, "--$name-rgb:\s*(\d+) (\d+) (\d+)")
    if (-not $match.Success) { throw "Missing theme color: $name" }
    return [System.Drawing.Color]::FromArgb([int]$match.Groups[1].Value, [int]$match.Groups[2].Value, [int]$match.Groups[3].Value)
}

$paper = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'paper'))
$mist = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'mist'))
$accent = [System.Drawing.SolidBrush]::new((Get-ThemeColor 'accent'))
$rule = [System.Drawing.Pen]::new((Get-ThemeColor 'line'), 1)
$brandFont = [System.Drawing.Font]::new('Arial', 62, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$headingFont = [System.Drawing.Font]::new('Arial', 44, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$detailFont = [System.Drawing.Font]::new('Arial', 23, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

try {
    $graphics.Clear((Get-ThemeColor 'ink'))
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $graphics.DrawString('NickolasSpace', $brandFont, $paper, 64, 98)
    $graphics.DrawString('Websites & automation', $headingFont, $paper, 66, 244)
    $graphics.DrawString('for your business.', $headingFont, $paper, 66, 302)
    $graphics.DrawString('Web development  /  Bots  /  Integrations', $detailFont, $mist, 68, 402)
    $graphics.DrawLine($rule, 810, 100, 810, 460)
    $graphics.DrawImage($logo, [System.Drawing.Rectangle]::new(842, 160, 300, 300))
    $graphics.DrawLine($rule, 68, 510, 1132, 510)
    $graphics.DrawString('nickolasspace.com', $detailFont, $accent, 68, 538)
    $canvas.Save((Join-Path $assetDirectory 'nickolasspace-social-v2.png'), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $graphics.Dispose()
    $canvas.Dispose()
    $logo.Dispose()
    $paper.Dispose()
    $mist.Dispose()
    $accent.Dispose()
    $rule.Dispose()
    $brandFont.Dispose()
    $headingFont.Dispose()
    $detailFont.Dispose()
}
