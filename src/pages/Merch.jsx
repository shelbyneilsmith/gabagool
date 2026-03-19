import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_ITEMS = [
  { id: '1', name: 'Gabagool Logo Tee', description: 'Classic logo on black. Simple. Bleak. Machine washable.', price: '$16', category: 'T-Shirts', image: '/merch_logo_tee.jpg' },
  { id: '2', name: 'Gabagool Logo Enamel Pin', description: 'Hard enamel, black nickel plating, standard metal clasp back. Looks great on your jacket or your crumbling sense of self.', price: '$5', category: 'Enamel Pins', image: '/merch_enamel_pin.jpg' },
  { id: '3', name: 'Gabagool Logo Large Sticker', description: '4" sticker', price: '$2', category: 'Stickers', image: '/merch_sticker.jpg' },
  { id: '4', name: 'Gabagool Logo Small Sticker', description: '3" sticker', price: '$2', category: 'Stickers', image: '/merch_sticker.jpg' },
]

function Merch() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    fetch('/api/merch')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems(FALLBACK_ITEMS))
  }, [])

  const merchItems = items || FALLBACK_ITEMS
  const categories = [...new Set(merchItems.map((m) => m.category))]

  return (
    <div>
      <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-2">Merch</h1>
      <p className="text-text-dim text-[1.1rem] italic mb-12">Stuff you can buy to prove you were here.</p>

      {categories.map((category) => (
        <section key={category}>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.15em] text-accent mb-6 pb-3 border-b-2 border-border">{category}</h2>
          <div className="grid grid-cols-2 gap-6 mb-12 max-sm:grid-cols-1">
            {merchItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.id || item.name} className="bg-bg-card rounded-md border border-border overflow-hidden transition-colors duration-200 hover:border-[#333]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full aspect-square object-cover block" />
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center text-text-dim text-sm italic">
                      <span>Image Coming Soon</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading text-[1.1rem] font-bold text-accent-bright mb-2">{item.name}</h3>
                    <p className="text-sm text-text leading-relaxed mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[1.2rem] font-bold text-accent">{item.price}</span>
                      <Link to="/contact" className="inline-block font-heading text-xs font-bold tracking-[0.1em] uppercase no-underline py-2 px-5 rounded-sm bg-accent text-bg transition-opacity duration-200 hover:opacity-85">Inquire</Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Merch
