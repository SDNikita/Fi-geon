from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
folder=Path(__file__).parent/'user-process-pages'
files=sorted((p for p in folder.glob('page-*.png') if int(p.stem.split('-')[-1]) <= 36),key=lambda p:int(p.stem.split('-')[-1]))
for start in range(0,len(files),4):
    sheet=Image.new('RGB',(1660,2400),'#d4d4d4')
    dr=ImageDraw.Draw(sheet)
    for n,f in enumerate(files[start:start+4]):
        with Image.open(f) as im:
            im.thumbnail((800,1140))
            x=20+(n%2)*830; y=35+(n//2)*1200
            sheet.paste(im,(x,y))
        dr.text((x,y-20),f.stem,fill='black')
    sheet.save(folder/f'contact-{start//4+1}.jpg',quality=88)
print(len(files),'pages', (len(files)+3)//4,'contact sheets')
