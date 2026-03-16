import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/productsService.js'
import { formatCurrency } from '../utils/format.js'

function Hero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center bg-neutral-light/30 overflow-hidden">
      {/* Placeholder para imagem de alta qualidade — trocar por <img> ou background-image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea964002?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-secondary/40" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-background tracking-tight mb-4 animate-fade-in">
          Ateliê da Cássia
        </h1>
        <p className="font-sans text-lg sm:text-xl text-background/95 max-w-2xl mx-auto mb-8">
          Moda autoral, feita com cuidado. Descubra peças únicas para o seu guarda-roupa.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3.5 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover transition-colors duration-200"
        >
          Ver coleção
        </Link>
      </div>
    </section>
  )
}

function CollectionsSection() {
  const collections = [
    { title: 'Novidades', to: '/products', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
    { title: 'Essenciais', to: '/products', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
    { title: 'Edição limitada', to: '/products', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80' },
  ]

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-secondary text-center mb-12 sm:mb-16">
          Coleções
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.title}
              to={col.to}
              className="group block relative aspect-[4/5] overflow-hidden bg-neutral-light"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${col.image})` }}
              />
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/30 transition-colors duration-300" />
              <span className="absolute bottom-0 left-0 right-0 p-6 font-serif text-xl sm:text-2xl text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-secondary/80 to-transparent">
                {col.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* eslint-disable react/prop-types */
function ProductsSection({ products = [] }) {
  if (!products.length) return null

  return (
    <section className="py-16 sm:py-24 bg-neutral-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-secondary">
            Destaques
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.slice(0, 6).map((p) => (
            <article
              key={p.id}
              className="group bg-background overflow-hidden"
            >
              <Link to={`/product/${p.id}`} className="block">
                <div className="aspect-[3/4] bg-neutral-light overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80)',
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-secondary mb-1 group-hover:text-accent transition-colors">
                    {p.description}
                  </h3>
                  <p className="text-sm text-neutral mb-2">SKU: {p.sku}</p>
                  <p className="text-primary font-medium">{formatCurrency(p.salePrice)}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function InstitutionalSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-secondary mb-6">
          Nosso ateliê
        </h2>
        <p className="text-secondary/90 leading-relaxed mb-4">
          Cada peça é pensada e confeccionada com atenção aos detalhes. Trabalhamos com tecidos selecionados e acabamentos que fazem a diferença no dia a dia.
        </p>
        <p className="text-secondary/90 leading-relaxed">
          O Ateliê da Cássia nasceu do desejo de oferecer moda autoral, acessível e atemporal — para quem valoriza qualidade e identidade.
        </p>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProducts({ page: 1, limit: 6 })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <CollectionsSection />
      <ProductsSection products={loading ? [] : products} />
      <InstitutionalSection />
    </div>
  )
}
