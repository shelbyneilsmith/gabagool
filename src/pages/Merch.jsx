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
    <div className="merch-page">
      <h1>Merch</h1>
      <p className="merch-subtitle">Stuff you can buy to prove you were here.</p>

      {categories.map((category) => (
        <section key={category} className="merch-category">
          <h2>{category}</h2>
          <div className="merch-grid">
            {merchItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.id || item.name} className="merch-card">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="merch-image" />
                  ) : (
                    <div className="merch-image-placeholder">
                      <span>Image Coming Soon</span>
                    </div>
                  )}
                  <div className="merch-details">
                    <h3>{item.name}</h3>
                    <p className="merch-description">{item.description}</p>
                    <div className="merch-footer">
                      <span className="merch-price">{item.price}</span>
                      <Link to="/contact" className="merch-cta">Inquire</Link>
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
