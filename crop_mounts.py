from PIL import Image
import os

img_path = r'C:/Users/Diana/.gemini/antigravity/brain/440a2f15-881f-4a44-8d90-5231f5dc3345/.user_uploaded/media_1795446235802_6f10189c.jpg'
im = Image.open(img_path)
width, height = im.size

# Let's see the title area: title is at the top left "Подбор дворников по креплению"
# Then 5 columns x 4-5 rows of boxes.
# Each row has 5 cards.
# Let's calculate the bounding boxes of each card and its image icon inside!

# Card coordinates:
# Margins approximately: left ~ 45px, top ~ 120px, right ~ 980px, bottom ~ 770px
# Box width ~ 170px, Box height ~ 85px, gap x ~ 18px, gap y ~ 18px

out_dir = r'C:\Users\Diana\.gemini\antigravity\scratch\nv86-automix\public\assets\mounts'
os.makedirs(out_dir, exist_ok=True)

# Grid layout: 5 cols, 5 rows
# Row 0: hook, hook-truck, side-pin-22, side-pin-17, push-button-19
# Row 1: push-button-16, pinch-tab, bayonet, top-lock, pin-lock
# Row 2: claw, aeroclip, dntl, side-mounting, dytl
# Row 3: mbtl, vatl-5-1, mg, pinch-tab-aqua, push-button-aqua
# Row 4: pj

# Let's write a script to inspect and crop test
mounts_grid = [
    [('hook', 'Крючок'), ('hook-truck', 'Грузовой 12x4'), ('side-pin-22', 'Side Pin 22 мм'), ('side-pin-17', 'Side Pin 17 мм'), ('push-button-19', 'Push Button 19 мм')],
    [('push-button-16', 'Push Button 16 мм'), ('pinch-tab', 'Pinch Tab'), ('bayonet', 'Bayonet arm'), ('top-lock', 'Top lock'), ('pin-lock', 'Pin Lock')],
    [('claw', 'Claw'), ('aeroclip', 'AeroClip'), ('dntl', 'DNTL 1.1'), ('side-mounting', 'Side Mounting'), ('dytl', 'DYTL 1.1')],
    [('mbtl', 'MBTL 1.1'), ('vatl-5-1', 'VATL 5.1'), ('mg', 'MG'), ('pinch-tab-aqua', 'Pinch Tab Aquablade'), ('push-button-aqua', 'Push button Aquablade')],
    [('pj', 'PJ')]
]

# Let's find exact card boxes by analyzing horizontal and vertical pixel colors (background is light grey/white #f4f5f7 or similar, card is white/light rounded)
print('Image size:', width, height)
