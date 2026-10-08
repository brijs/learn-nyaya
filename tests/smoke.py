import sys, os, asyncio
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True)
    pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' else None)
    pg.goto('file://'+R+'/dist/learn-nyaya.html'); pg.click('#enterSilent')
    n=pg.evaluate('SCENES.length'); print('scenes',n)
    for i in range(n):
        pg.evaluate(f'EX.go({i})'); pg.wait_for_timeout(250)
        t=pg.inner_text('#stt'); sw=pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
        print(i+1,t[:50],'| noHscroll',sw)
    print('ERRORS',errs)
    b.close()
