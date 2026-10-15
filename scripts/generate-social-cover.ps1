Add-Type -AssemblyName System.Drawing

$assetDirectory = Join-Path $PSScriptRoot '../public/assets'
$canvas = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$logo = [System.Drawing.Image]::FromFile((Join-Path $assetDirectory 'logo1-transparent.png'))
$paper = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#EDF0EB'))
$mist = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#B5BEB8'))
$accent = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#B2D5C1'))
$rule = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#3D4843'), 1)
$brandFont = [System.Drawing.Font]::new('Arial', 62, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$headingFont = [System.Drawing.Font]::new('Arial', 44, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$detailFont = [System.Drawing.Font]::new('Arial', 23, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

try {
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#181B1C'))
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
    $canvas.Save((Join-Path $assetDirectory 'nickolasspace-social-v1.png'), [System.Drawing.Imaging.ImageFormat]::Png)
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
