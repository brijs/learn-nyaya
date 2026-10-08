import os
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True)
    for name,vp in (('d',{'width':1280,'height':900}),('m',{'width':390,'height':844})):
        pg=b.new_page(viewport=vp); pg.goto('file://'+R+'/dist/learn-nyaya.html'); pg.click('#enterSilent')
        pg.evaluate('EX.go(3)'); pg.wait_for_timeout(400); pg.screenshot(path=f'{R}/tests/shots/{name}_m1.png')
        pg.evaluate('EX.go(4)'); pg.wait_for_timeout(400); pg.locator('[role=tab]').nth(2).click(); pg.locator('#m2-r .ptile').nth(10).click(); pg.screenshot(path=f'{R}/tests/shots/{name}_m2roots.png')
        pg.evaluate('EX.go(1)'); pg.wait_for_timeout(400); pg.locator('.sut .wchip').first.click(); pg.locator('.sut').first.scroll_into_view_if_needed(); pg.screenshot(path=f'{R}/tests/shots/{name}_chip.png')
        pg.locator('.sut details.tbl summary').first.click(); pg.wait_for_timeout(200); pg.locator('.sut details.tbl').first.scroll_into_view_if_needed(); pg.screenshot(path=f'{R}/tests/shots/{name}_table.png')
        pg.click('#sutraBtn'); pg.click('#sbmR'); pg.wait_for_timeout(300); pg.screenshot(path=f'{R}/tests/shots/{name}_roots.png')
        ok=[pg.evaluate('document.documentElement.scrollWidth<=innerWidth')]; pg.click('#sbx')
        bad=[]
        for i in range(19):
            pg.evaluate(f'EX.go({i})'); pg.wait_for_timeout(250)
            if not pg.evaluate('document.documentElement.scrollWidth<=innerWidth'): bad.append(i+1)
        print(name,'overflow scenes',bad,'browser',ok)
    b.close()
