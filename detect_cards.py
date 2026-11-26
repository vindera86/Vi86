from PIL import Image
p1 = r'C:/Users/Diana/.gemini/antigravity/brain/440a2f15-881f-4a44-8d90-5231f5dc3345/.user_uploaded/media_1795445920061_6bd6819a.png'
im = Image.open(p1).convert('RGB')
w, h = im.size

# Find cards by detecting non-background pixels or borders
# The background is (246, 248, 251) or close.
# Cards are rounded white/light rectangles.
# Let's inspect where cards start vertically and horizontally.

bg = im.getpixel((5, 5))
print('BG color:', bg)

# Horizontal projections
col_diffs = []
for x in range(w):
    diff = sum(abs(im.getpixel((x, y))[0] - bg[0]) for y in range(h))
    col_diffs.append(diff)

row_diffs = []
for y in range(h):
    diff = sum(abs(im.getpixel((x, y))[0] - bg[0]) for x in range(w))
    row_diffs.append(diff)

print('Row diffs summary: max', max(row_diffs), 'min', min(row_diffs))
