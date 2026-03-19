import { Link } from 'react-router-dom'

const merchItems = [
  {
    name: 'Gabagool Logo Tee',
    description: 'Classic logo on black. Simple. Bleak. Machine washable.',
    price: '$16',
    category: 'T-Shirts',
    image: '/merch_logo_tee.jpg',
  },
  {
    name: 'Gabagool Logo Enamel Pin',
    description: 'Hard enamel, black nickel plating, standard metal clasp back. Looks great on your jacket or your crumbling sense of self.',
    price: '$5',
    category: 'Enamel Pins',
    image: '/merch_enamel_pin.jpg',
  },
  {
    name: 'Gabagool Logo Large Sticker',
    description: '4" sticker',
    price: '$2',
    category: 'Stickers',
    image: '/merch_sticker.jpg',
  },
  {
    name: 'Gabagool Logo Small Sticker',
    description: '3" sticker',
    price: '$2',
    category: 'Stickers',
    image: '/merch_sticker.jpg',
  },
]

function Merch() {
  const categories = ['T-Shirts', 'Enamel Pins', 'Stickers']

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
                <div key={item.name} className="merch-card">
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
