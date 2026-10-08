import os, sys
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errs=[]; fails=[]
def chk(name,cond):
    print(('PASS ' if cond else 'FAIL ')+name)
    if not cond: fails.append(name)
def sorter(pg,scope):
    root=pg.locator(scope); n0=root.locator('.srt-pool .tile').count(); guard=0
    while root.locator('.srt-pool .tile').count()>0 and guard<200:
        guard+=1; c=root.locator('.srt-pool .tile').count(); root.locator('.srt-pool .tile').first.click()
        for k in range(root.locator('.bhead').count()):
            root.locator('.bhead').nth(k).click()
            if root.locator('.srt-pool .tile').count()<c: break
    return n0, root.locator('.srt-pool .tile').count()
def orderer(pg,scope):
    root=pg.locator(scope); guard=0
    while root.locator('.srt-pool .tile').count()>0 and guard<100:
        guard+=1; l=root.locator('.slotlist li').count(); tiles=root.locator('.srt-pool .tile')
        for k in range(tiles.count()):
            tiles.nth(k).click()
            if root.locator('.slotlist li').count()>l: break
    return root.locator('.slotlist li').count()
def quiz(pg,scope,ans):
    root=pg.locator(scope)
    for a in ans:
        root.locator('.opt').nth(a).click(); root.locator('#qn').click()
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True); pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' else None)
    pg.goto('file://'+R+'/dist/learn-nyaya.html'); pg.click('#enterSilent'); go=lambda i:(pg.evaluate(f'EX.go({i})'),pg.wait_for_timeout(300))
    # S1
    for i in range(10): pg.locator('.atile').nth(i).click()
    chk('S1 map all seen',pg.locator('.atile.seen').count()==10 and 'whole map' in pg.inner_text('#react'))
    pg.locator('[data-open]').click(); chk('S1 browser opens',pg.locator('#sb').is_visible()); chk('S1 browser lists sutras',pg.locator('.sbrow').count()>=10)
    pg.fill('#sbq','pratyakṣa'); pg.wait_for_timeout(200); chk('browser search',pg.locator('.sbrow').count()>=1); pg.click('#sbx')
    # S2
    go(1); pg.locator('.link[data-i="1"]').click(); chk('S2 wrong link grows back','grows back' in pg.inner_text('#n2-msg'))
    pg.locator('.link[data-i="4"]').click(); pg.wait_for_timeout(3600); chk('S2 chain collapses + release lit',pg.locator('.link.gone').count()==5 and pg.locator('#n2-end.lit').count()==1)
    pg.locator('.wchip').first.click(); chk('S2 chip detail','=' in pg.inner_text('.wdetail'))
    # chip detail with build + root, root link, roots index
    go(1); pg.locator('.sut .wchip').first.click(); d=pg.inner_text('.sut .wdetail'); chk('chip build shown','Build:' in d and 'dhātupāṭha' in d and 'measure' in d)
    chk('word table present',pg.locator('.sut details.tbl table.wt tr').count()>10)
    pg.locator('.sut .wdetail .rootlink').first.click(); pg.wait_for_timeout(200); chk('rootlink opens roots index',pg.locator('#sb').is_visible() and pg.locator('#sbmR[aria-pressed="true"]').count()==1 and pg.locator('.rootrow.hl').count()==1)
    chk('roots index lists roots',pg.locator('.rootrow').count()>=55); pg.fill('#sbq','jñā'); pg.wait_for_timeout(200); chk('roots search',pg.locator('.rootrow').count()>=1); pg.fill('#sbq',''); pg.click('#sbmS'); chk('back to sutras',pg.locator('.sbrow .vid').count()>10); pg.click('#sbx')
    # m1, m2
    go(3); a,bb=sorter(pg,'#m1-sort'); chk('m1 sorter',bb==0); quiz(pg,'#m1-quiz',[2,2,1]); chk('m1 quiz','3 / 3' in pg.inner_text('#m1-quiz'))
    go(4); n=orderer(pg,'#m2-o'); chk('m2 compound orderer',n==4); pg.select_option('#m2-c','2'); n=orderer(pg,'#m2-o'); chk('m2 compound 3',n==5)
    pg.locator('[role=tab]').nth(1).click(); a,bb=sorter(pg,'#m2-s'); chk('m2 suffix sorter %d->%d'%(a,bb),bb==0)
    pg.locator('[role=tab]').nth(2).click(); pg.locator('#m2-r .ptile').nth(5).click(); chk('m2 root card','dhātupāṭha' in pg.inner_text('#m2-rd'))
    pg.locator('[role=tab]').nth(3).click(); pg.select_option('#m2-n','kārya'); chk('m2 sama decoder','product' in pg.inner_text('#m2-nd'))
    # S3-5 sorters
    for i,sc in ((2,'#n3-sort'),(5,'#n4-sort'),(6,'#n5-sort')):
        go(i); a,bb=sorter(pg,sc); chk(f'S{i+1} sorter {a}->{bb}',bb==0)
    # S6
    go(7); 
    for i in range(12): pg.locator('.ptile').nth(i).click()
    chk('S6 tiles',pg.locator('.ptile.seen').count()==12); quiz(pg,'#n6-quiz',[1,0,2,1,2]); chk('S6 quiz score','5 / 5' in pg.inner_text('#n6-quiz'))
    # S7
    go(8); n=orderer(pg,'#n7-ord'); chk('S7 orderer 6',n==6); a,bb=sorter(pg,'#n7-sort'); chk('S7 sorter',bb==0)
    # S8
    go(9); n=orderer(pg,'#n8-ord'); chk('S8 orderer 5',n==5); pg.click('#n8-neg'); chk('S8 negative example','hradaḥ' in pg.inner_text('#n8-tab')); pg.click('#n8-pos'); chk('S8 positive','mahānasaḥ' in pg.inner_text('#n8-tab'))
    # S9
    go(10); chk('S9 default valid','every smoke place has fire' in pg.inner_text('#n9-ver'))
    pg.select_option('#n9-h','fire'); pg.select_option('#n9-p','smoke'); chk('S9 fire->smoke broken','red-hot iron ball' in pg.inner_text('#n9-ver'))
    pg.select_option('#n9-h','smoke'); pg.select_option('#n9-p','fire'); pg.click('#n9-add'); chk('S9 hypothetical breaks','hypothetical' in pg.inner_text('#n9-ver') and 'not pervaded' in pg.inner_text('#n9-ver'))
    pg.click('#n9-reset'); pg.uncheck('#n9-pk'); chk('S9 pakṣa unchecked no conclusion','No safe conclusion' in pg.inner_text('#n9-tri'))
    # S10-12
    for i,sc in ((11,'#n10-sort'),(12,'#n11-sort'),(13,'#n12-sort')):
        go(i); a,bb=sorter(pg,sc); chk(f'S{i+1} sorter {a}->{bb}',bb==0)
    # S13
    go(14); pg.locator('#n13-o0 .opt').nth(0).click(); chk('S13 wrong gives feedback','surrenders' in pg.inner_text('#react') or 'too soon' in pg.inner_text('#react'))
    pg.locator('#n13-o0 .opt').nth(1).click(); pg.locator('#n13-o1 .opt').nth(0).click(); chk('S13 complete','The pattern' in pg.inner_text('#n13-dlg'))
    # S14
    go(15); pg.locator('.sensebtn').nth(0).click(); pg.locator('.sensebtn').nth(1).click(); chk('S14 who enabled',pg.locator('#n14-who').is_enabled()); pg.click('#n14-who'); chk('S14 self shown',pg.locator('#n14-self').is_visible())
    pg.locator('[role=tab]').nth(1).click(); pg.click('#n14-go'); pg.wait_for_timeout(3200); chk('S14 mind sequence','one after the other' in pg.inner_text('#n14-m'))
    pg.locator('[role=tab]').nth(2).click(); pg.locator('#n14-r .ptile').last.click(); chk('S14 browser opens at 4.2',pg.locator('#sb').is_visible() and pg.locator('.sbrow').count()>10); pg.click('#sbx')
    # S15
    go(16); chk('S15 24 jatis',pg.locator('#n15-j .cw').count()==24); chk('S15 22 nigraha',pg.locator('#n15-n .cw').count()==22); pg.click('#n15-rj'); chk('S15 rejoinder',pg.locator('#n15-r').is_visible()); pg.locator('#n15-n .cw').nth(15).click(); chk('S15 gloss','no reply' in pg.inner_text('#n15-nd')); a,bb=sorter(pg,'#n15-sort'); chk('S15 sorter',bb==0)
    # S16
    go(17); pg.locator('#n16-t .ptile').nth(5).click(); chk('S16 timeline','Tattvacintāmaṇi' in pg.inner_text('#n16-td'))
    pg.locator('[role=tab]').nth(1).click(); pg.click('#n16-a'); chk('S16 aristotle visible',pg.locator('td.ar').first.is_visible())
    pg.locator('[role=tab]').nth(2).click(); pg.select_option('#n16-x','fire'); pg.select_option('#n16-y','the lake'); chk('S16 abhava builder','pratiyogin</b> is <b>fire' in pg.inner_html('#n16-ab')); a,bb=sorter(pg,'#n16-so'); chk('S16 absence sorter',bb==0)
    # S17
    go(18); chk('S17 workbench default sound','inference stands' in pg.inner_text('#n17-v'))
    pg.select_option('#n17-h','fire'); pg.select_option('#n17-p','smoke'); chk('S17 savyabhicara','savyabhic' in pg.inner_text('#n17-v').lower())
    pg.select_option('#n17-h','water'); pg.select_option('#n17-p','fire'); pg.select_option('#n17-k','5'); chk('S17 lake water->fire bad',pg.inner_text('#n17-v').lower().find('contradicted')>=0 or 'viruddha' in pg.inner_text('#n17-v').lower())
    pg.locator('[role=tab]').nth(2).click(); chk('S17 cheat locked',pg.locator('#n17-cs').is_disabled())
    pg.locator('[role=tab]').nth(1).click(); quiz(pg,'#n17-qz',[1,0,2,1,1,2,0,1,1,1]); chk('S17 quiz pass','you are a Naiyāyika' in pg.inner_text('#n17-res')); chk('S17 rank','logician' in pg.inner_text('#rank'))
    pg.locator('[role=tab]').nth(2).click(); chk('S17 cheat unlocked',pg.locator('#n17-cs').is_enabled() and 'CHEAT SHEET' in pg.inner_text('#n17-sheet'))
    pg.screenshot(path=R+'/tests/shots/end.png')
    print('ERRORS',errs); print('FAILS',fails); b.close()
sys.exit(1 if (errs or fails) else 0)
