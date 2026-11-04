$gpu = Get-CimInstance -ClassName Win32_VideoController
Write-Host "=== Video controllers ==="
$gpu | Select-Object Name, DriverVersion, DriverDate, AdapterRAM, PnpDeviceID
Write-Host ""
Write-Host "=== GPU class registry ==="
Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}" -ErrorAction SilentlyContinue |
  Select-Object -First 10 | ForEach-Object {
    $d = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
    [PSCustomObject]@{Key=$_.PSChildName; Desc=$d.DriverDesc; Ver=$d.DriverVersion; Date=$d.DriverDate}
  }
Write-Host ""
Write-Host "=== AMD/ATI driver present in class? ==="
$amd = Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}" -ErrorAction SilentlyContinue |
  Where-Object { (Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue).DriverDesc -match "AMD|Radeon|ATI" }
if ($amd) { $amd | Select-Object PSChildName } else { Write-Host "No AMD entry in GPU class key" }
Write-Host ""
Write-Host "=== DxDiag GPU ==="
dxdiag /t %temp%\dxdiag.txt 2>$null | Out-Null
if (Test-Path %temp%\dxdiag.txt) {
  Select-String -Path %temp%\dxdiag.txt -Pattern "Card name|Driver Model|Driver Version|Display Memory|Current Refresh Rate" |
    Select-Object -First 15 | ForEach-Object { $_.Line }
  Remove-Item %temp%\dxdiag.txt -ErrorAction SilentlyContinue
}