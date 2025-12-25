import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/UseProducts';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import ProductCard from '../components/ProductCard/ProductCard';
import './Home.css';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  
  // Fetch all products
  const { products, categories, loading, error, searchProducts } = useProducts();

  // Debug: Log products when they load
  useEffect(() => {
    if (products.length > 0) {
      console.log('Products loaded:', products.length);
      console.log('Sample product:', products[0]);
    }
  }, [products]);

  // Read category and search from URL query params on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      console.log('Search query:', searchFromUrl);
    }
  }, [searchParams]);

  // Filter products: search first, then category
  let filteredProducts = products;
  
  if (searchQuery) {
    // Search by title/description/category
    filteredProducts = searchProducts(searchQuery);
    console.log('Search query:', searchQuery);
    console.log('Filtered products count:', filteredProducts.length);
    console.log('Filtered products:', filteredProducts);
  } else if (selectedCategory) {
    // Filter by exact category match
    filteredProducts = products.filter(
      p => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  
  const displayProducts = filteredProducts;

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
  };

  return (
    <div className="page products-page">
      <div className="container">
        <div className="section-header">
          <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Shop Products'}</h2>
          <div className="category-filters">
            <button className={`btn ${selectedCategory ? '' : 'primary'}`} onClick={() => handleCategorySelect(null)}>All</button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'primary' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-state">Error loading products: {error}</div>
        ) : displayProducts.length === 0 ? (
          <div className="error-state">
            <p>No products found for "{searchQuery}"</p>
            <p style={{fontSize: '0.9rem', color: '#999', marginTop: '12px'}}>
              Try searching for: "shirt", "men", "women", "watch", "dress", "gold", "silver"
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {displayProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
