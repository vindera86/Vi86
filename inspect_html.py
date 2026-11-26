with open('mirdvornikov.html', 'w', encoding='utf-8') as f:
    pass
import urllib.request
import re

url = 'https://www.mirdvornikov.ru/catalog/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('mirdvornikov.html', 'w', encoding='utf-8') as f:
            f.write(html)
        idx = html.find('catalog-mounts')
        if idx != -1:
            print('Found catalog-mounts at:', idx)
            print(html[idx:idx+2500])
        else:
            print('catalog-mounts not found in HTML, searching mounts...')
            for m in re.finditer(r'креплен', html, re.I):
                pos = m.start()
                print('Found креплен at:', pos)
                print(html[pos:pos+300])
                break
except Exception as e:
    print('Error:', e)
