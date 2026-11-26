import urllib.request
import re

url = 'https://www.mirdvornikov.ru/catalog/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Fetched HTML, length:', len(html))
        # Find mount cards or catalog-mounts section
        matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\']', html)
        print(f'Total img tags: {len(matches)}')
        for src, alt in matches:
            if any(k in alt.lower() or k in src.lower() for k in ['крючок', 'hook', 'push', 'vatl', 'pin', 'bayonet', 'tab', 'mount']):
                print(f'Alt: {alt} -> Src: {src}')
except Exception as e:
    print('Error fetching:', e)
