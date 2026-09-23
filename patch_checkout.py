import re

filepath = r'c:\Users\loutf\OneDrive\Desktop\thawela-hamza\SIMStore\frontend\app\checkout\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The old noon payments label block - using unique anchor strings
old_class = 'className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-4 border-2 cursor-pointer transition-all ${'
new_class = 'className={`flex items-start justify-between gap-3 rounded-2xl p-4 border-2 cursor-pointer transition-all ${'

if old_class in content:
    content = content.replace(old_class, new_class, 1)
    print("Replaced className OK")
else:
    print("ERROR: old_class not found")

# Replace inner flex div structure for noon label
old_inner = '''                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs">
                        noon
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-gray-900">الدفع الإلكتروني (noon payments)</p>
                          <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">
                            آمن وموصى به
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          مدى، فيزا، ماستركارد، Apple Pay
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mr-auto sm:mr-0">
                      {/* Payment Badges */}
                      <div className="flex items-center gap-1.5 opacity-80">
                        <span className="text-[11px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                          مدى
                        </span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                          Visa
                        </span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                          Mastercard
                        </span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                          Pay
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "noon_payments" ? "border-secondary" : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "noon_payments" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                    </div>'''

new_inner = '''                    {/* Icon + Text + Badges */}
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
                    </div>'''

if old_inner in content:
    content = content.replace(old_inner, new_inner, 1)
    print("Replaced inner structure OK")
else:
    print("ERROR: old_inner not found")
    # Debug: find where the text starts
    idx = content.find('flex items-center gap-3 mr-auto')
    print("mr-auto idx:", idx)
    if idx > 0:
        print("Context:", repr(content[idx-50:idx+100]))

with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("DONE")
