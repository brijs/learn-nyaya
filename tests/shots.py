import os
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True)
    for name,vp in (('d',{'width':1280,'height':800}),('m',{'width':390,'height':800})):
        pg=b.new_page(viewport=vp); pg.goto('file://'+R+'/dist/learn-nyaya.html'); 
        if name=='d': pg.screenshot(path=R+'/tests/shots/intro.png')
        pg.click('#enterSilent'); bad=[]
        for i in range(19):
            pg.evaluate(f'EX.go({i})'); pg.wait_for_timeout(350)
            if not pg.evaluate('document.documentElement.scrollWidth<=innerWidth'): bad.append(i+1)
            if i+1 in (1,3,4,5,11,13,16,19) : pg.screenshot(path=f'{R}/tests/shots/{name}{i+1:02d}.png')
        print(name,'hscroll overflow scenes:',bad)
    b.close()
