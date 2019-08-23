$url = "https://img.altema.jp/ffmobius/buki/"

for($i=0; $i -le 1000; $i++){
    Invoke-WebRequest ($url + $i.toString() + ".jpg") -OutFile ($i.toString() + ".jpg")    
}

