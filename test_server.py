import urllib.request
import re

base = 'http://localhost:5173'
with urllib.request.urlopen(base) as res:
    html = res.read().decode('utf-8')

js_matches = re.findall(r'src=["\']([^"\']+)["\']', html)
css_matches = re.findall(r'href=["\']([^"\']+)["\']', html)

print('JS links:', js_matches)
print('CSS links:', css_matches)

for url in ['/assets/logo.png', '/assets/hero-car.png'] + js_matches + [c for c in css_matches if c.endswith('.css')]:
    full_url = base + url
    try:
        with urllib.request.urlopen(full_url) as r:
            data = r.read()
            print(f'Asset {url}: HTTP {r.status}, {len(data)} bytes')
    except Exception as e:
        print(f'Failed {url}: {e}')
