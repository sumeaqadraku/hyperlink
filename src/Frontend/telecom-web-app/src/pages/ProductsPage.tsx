import { useQuery } from '@tanstack/react-query'
import { catalogService } from '../services/catalogService'

function ProductsPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: catalogService.getProducts,
  })

  if (isLoading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error">Error loading products: {(error as Error).message}</div>

  return (
    <div>
      <h1 className="page-title">Products & Services</h1>
      {products && products.length > 0 ? (
        <div>
          {products.map((product) => (
            <div key={product.id} className="card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Code:</strong> {product.productCode}</p>
              <p><strong>Status:</strong> {product.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No products available. Connect to the Catalog API to see products.</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
