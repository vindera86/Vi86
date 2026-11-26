from PIL import Image
import os

p1 = r'C:/Users/Diana/.gemini/antigravity/brain/440a2f15-881f-4a44-8d90-5231f5dc3345/.user_uploaded/media_1795445920061_6bd6819a.png'
im = Image.open(p1).convert('RGBA')
w, h = im.size

out_dir = r'C:\Users\Diana\.gemini\antigravity\scratch\nv86-automix\public\assets\mounts'
os.makedirs(out_dir, exist_ok=True)

# Grid parameters for 1024x441
# Let's inspect coordinates of card boxes
# 5 columns across width 1024
# Margins: left ~ 47, col width ~ 177, col gap ~ 11 => 47 + 5*177 + 4*11 = 47 + 885 + 44 = 976
# 5 rows across height 441:
# Top margin: row 0 starts around y ~ 65 (below header 'Подбор дворников по креплению' which is at y ~ 35)
# Row height ~ 60, row gap ~ 12 => 65 + 5*60 + 4*12 = 65 + 300 + 48 = 413

col_starts = [47 + i * (177 + 11) for i in range(5)]
row_starts = [62 + i * (62 + 11) for i in range(5)]

print('Cols:', col_starts)
print('Rows:', row_starts)

mount_names = [
    [('hook', 'Крючок'), ('hook-truck', 'Грузовой 12x4'), ('side-pin-22', 'Side Pin 22 мм'), ('side-pin-17', 'Side Pin 17 мм'), ('push-button-19', 'Push Button 19 мм')],
    [('push-button-16', 'Push Button 16 мм'), ('pinch-tab', 'Pinch Tab'), ('bayonet', 'Bayonet arm'), ('top-lock', 'Top lock'), ('pin-lock', 'Pin Lock')],
    [('claw', 'Claw'), ('aeroclip', 'AeroClip'), ('dntl', 'DNTL 1.1'), ('side-mounting', 'Side Mounting'), ('dytl', 'DYTL 1.1')],
    [('mbtl', 'MBTL 1.1'), ('vatl-5-1', 'VATL 5.1'), ('mg', 'MG'), ('pinch-tab-aqua', 'Pinch Tab Aquablade'), ('push-button-aqua', 'Push button Aquablade')],
    [('pj', 'PJ')]
]

for r_idx, row in enumerate(mount_names):
    y0 = row_starts[r_idx]
    y1 = y0 + 62
    for c_idx, (m_id, m_title) in enumerate(row):
        x0 = col_starts[c_idx]
        x1 = x0 + 177
        
        # Full card
        card_crop = im.crop((x0, y0, x1, y1))
        card_crop.save(os.path.join(out_dir, f'{m_id}_card.png'))
        
        # Icon crop (the drawing on the left side of the card, approx first 75px)
        icon_crop = im.crop((x0 + 4, y0 + 4, x0 + 80, y1 - 4))
        icon_crop.save(os.path.join(out_dir, f'{m_id}_icon.png'))
        print(f'Cropped {m_id} at ({x0},{y0},{x1},{y1})')

print('Done cropping mounts.')
