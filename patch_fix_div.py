filepath = r'c:\Users\loutf\OneDrive\Desktop\thawela-hamza\SIMStore\frontend\app\checkout\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the extra closing div before </label>
old = '''                    </div>
                    </div>
                  </label>

                  {/* Cash on Delivery'''

new = '''                    </div>
                  </label>

                  {/* Cash on Delivery'''

if old in content:
    content = content.replace(old, new, 1)
    print("Fixed extra div OK")
else:
    print("Not found - checking context")
    idx = content.find('</label>\n\n                  {/* Cash on Delivery')
    print("Context:", repr(content[idx-100:idx+50]))

with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("DONE")
