import os, sys
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('file://'+R+'/dist/learn-nyaya.html'); pg.click('#enterSound'); pg.wait_for_timeout(2500)
    st=pg.evaluate("(()=>{const a=document.querySelectorAll('audio');return {n:Object.keys(AUDIO).length,s:Object.keys(SAUDIO).length}})()")
    print('clips',st)
    lit=pg.evaluate("document.querySelectorAll('#cap span.on').length"); tot=pg.evaluate("document.querySelectorAll('#cap span').length")
    print('captions lit after 2.5s:',lit,'/',tot)
    ry=pg.evaluate("document.querySelector('#mouth').getAttribute('ry')"); print('mouth ry',ry)
    pg.evaluate('EX.go(3)'); pg.wait_for_timeout(500)
    pg.locator('[data-splay="1.1.4"]').click(); pg.wait_for_timeout(1500)
    print('sutra line playing:',pg.evaluate("document.querySelectorAll('.sline.playing').length"))
    pg.wait_for_timeout(9000)
    print('after 11s cap lit',pg.evaluate("document.querySelectorAll('#cap span.on').length"),'next pulse',pg.evaluate("document.querySelector('#nextBtn').classList.contains('pulse')"))
    print('ERRORS',errs); b.close()
