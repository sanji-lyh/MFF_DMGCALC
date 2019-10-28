$url = "https://img.altema.jp/ffmobius/job/ico/"

for($i=200; $i -le 250; $i++){
    Invoke-WebRequest ($url + $i.toString() + ".jpg") -OutFile ($i.toString() + ".jpg")    
}

