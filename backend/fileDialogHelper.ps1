Add-Type -AssemblyName System.Windows.Forms
$f = New-Object System.Windows.Forms.OpenFileDialog
$f.Filter = "Executables (*.exe)|*.exe|All Files (*.*)|*.*"
$f.Title = "Select Application"
$f.InitialDirectory = "C:\Program Files"
if ($f.ShowDialog() -eq "OK") { Write-Host $f.FileName }