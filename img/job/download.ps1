$url = "https://img.altema.jp/ffmobius/job/ico/"

for($i=0; $i -le 220; $i++){
    Invoke-WebRequest ($url + $i.toString() + ".jpg") -OutFile ($i.toString() + ".jpg")    
}

