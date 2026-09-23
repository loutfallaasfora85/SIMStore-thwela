filepath = r'c:\Users\loutf\OneDrive\Desktop\thawela-hamza\SIMStore\frontend\app\checkout\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact block using a unique anchor near the noon icon div
start_anchor = '                    <div className="flex items-center gap-3">\n                      <div className="w-10 h-10 rounded-xl bg-amber-500/10'
end_anchor = '                    </div>\n                  </label>\n\n                  {/* Cash on Delivery'

start_idx = content.find(start_anchor)
end_idx = content.find(end_anchor)

if start_idx == -1:
    print("ERROR: start_anchor not found")
    # Try to find it
    idx = content.find('w-10 h-10 rounded-xl bg-amber-500')
    print("amber idx:", idx)
    print("Context:", repr(content[idx-100:idx+200]))
elif end_idx == -1:
    print("ERROR: end_anchor not found")
else:
    old_block = content[start_idx:end_idx]
    print("Found block length:", len(old_block))
    print("Block preview:", repr(old_block[:200]))
    
    new_block = '''                    {/* Icon + Text + Badges */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs">
                        noon
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <p className="font-bold text-sm text-gray-900 leading-snug">الدفع الإلكتروني</p>
                          <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                            آمن وموصى به
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">مدى، فيزا، ماستركارد، Apple Pay</p>
                        {/* Payment Badges */}
                        <div className="flex flex-wrap items-center gap-1 opacity-80">
                          {["مدى", "Visa", "Mastercard", "Apple Pay"].map((badge) => (
                            <span
                              key={badge}
                              className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200 whitespace-nowrap"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Radio indicator */}
                    <div
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "noon_payments" ? "border-secondary" : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "noon_payments" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      )}
                    </div>\n'''
    
    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    
    print("DONE - file updated successfully")
