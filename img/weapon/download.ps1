$url = "https://img.altema.jp/ffmobius/buki/"

for($i=700; $i -le 800; $i++){
   Write-host $i
   Invoke-WebRequest ($url + $i.toString() + ".jpg") -OutFile ($i.toString() + ".jpg")    
}

