import { useEffect, useState } from "react";
import { api } from "../services/Api";

const categoryMap = {
  "women's clothing": "Women",
  "men's clothing": "Men",
  electronics: "Electronics",
  jewelery: "Jewellery",
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products + categories ONLY on mount (empty dependency array)
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products...');

      // Fetch all products (no category filter)
      const productsData = await api.fetchProducts();
      console.log('Products fetched:', productsData.length);
      
      // If no products, use mock data
      if (!productsData || productsData.length === 0) {
        console.warn('No products returned, using mock data');
        throw new Error('No products available');
      }
      
      // Map mainCategory
      const withMainCategory = productsData.map((item) => ({
        ...item,
        mainCategory: categoryMap[item.category] || item.category,
      }));

      setProducts(withMainCategory);
      console.log('Products set successfully');
      
      // Fetch categories
      const categoriesData = await api.fetchCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      
      // Fallback: Set empty array so UI doesn't stay blank
      setProducts([]);
      setCategories([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      return await api.fetchProductById(id);
    } catch (err) {
      console.error("Error fetching product:", err);
      throw err;
    }
  };

  // Client-side search - searches title and category ONLY
  const searchProducts = (query) => {
    if (!query || query.trim() === "") {
      return products;
    }

    const queryLower = query.toLowerCase().trim();
    console.log('searchProducts called with query:', queryLower);
    console.log('Total products to search:', products.length);
    
    const results = products.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(queryLower);
      const categoryMatch = product.category.toLowerCase().includes(queryLower);
      
      return titleMatch || categoryMatch;
    });
    
    console.log('Search results count:', results.length);
    console.log('Search results:', results);
    return results;
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductById,
    searchProducts,
    refetch: fetchAllData,
  };
};
