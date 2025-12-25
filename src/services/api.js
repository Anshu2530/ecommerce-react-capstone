const BASE_URL = "https://fakestoreapi.com";

// Mock clothing products to enhance Fake Store API
const mockProducts = [
  {
    id: 101,
    title: "Women's Black Casual Skirt",
    price: 45.99,
    description: "Elegant black casual skirt perfect for everyday wear. Made from breathable cotton fabric with comfortable fit.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    rating: { rate: 4.5, count: 128 }
  },
  {
    id: 102,
    title: "Women's Blue Denim Skirt",
    price: 52.99,
    description: "Stylish blue denim skirt with classic design. Perfect for casual outings and weekend wear.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    rating: { rate: 4.3, count: 95 }
  },
  {
    id: 103,
    title: "Women's Floral Midi Dress",
    price: 62.99,
    description: "Beautiful floral print midi dress perfect for summer. Comfortable and stylish for any occasion.",
    category: "women's clothing",
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSruXXrCxWZytMCl3JnXuND1wBNwtp6aK9g-S3Hd041EAtb5HrJFVvmLinYRUKO9uyI7M3NVm0qVOTvnp9zMaZ3VzSfFw1eUqM9nRtSDffqCw1w-pP6_8BoWg",
    rating: { rate: 4.7, count: 210 }
  },
  {
    id: 104,
    title: "Women's Red Evening Dress",
    price: 89.99,
    description: "Elegant red evening dress perfect for special occasions. Premium fabric with flattering silhouette.",
    category: "women's clothing",
    image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/f/b/fb5755bCD20241105574380LDRed_1.jpg?rnd=20200526195200&tr=w-1080",
    rating: { rate: 4.8, count: 156 }
  },
  {
    id: 105,
    title: "Men's Formal White Shirt",
    price: 49.99,
    description: "Classic white formal shirt for office and special occasions. High quality cotton fabric.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.4, count: 187 }
  },
  {
    id: 106,
    title: "Men's Blue Casual Shirt",
    price: 39.99,
    description: "Comfortable blue casual shirt for everyday wear. Perfect for casual office or weekend.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: { rate: 4.2, count: 143 }
  },
  {
    id: 107,
    title: "Women's Gold Pendant Necklace",
    price: 35.99,
    description: "Elegant gold pendant necklace with delicate chain. Perfect gift for any occasion.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.6, count: 98 }
  },
  {
    id: 108,
    title: "Women's Silver Ring",
    price: 28.99,
    description: "Beautiful silver ring with modern design. Adjustable fit for comfortable wear.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.5, count: 76 }
  },
  {
    id: 109,
    title: "Women's Gold Bracelet",
    price: 42.99,
    description: "Stylish gold bracelet with elegant design. Perfect for both casual and formal wear.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.7, count: 112 }
  }
];

export const api = {
  // =====================
  // Products
  // =====================
  async fetchProducts(limit = 20) {
    try {
      const res = await fetch(`${BASE_URL}/products?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      let products = await res.json();
      // Combine with mock products
      products = [...products, ...mockProducts];
      return products;
    } catch (err) {
      // If API fails, return mock products
      console.warn("API failed, using mock products only");
      return mockProducts;
    }
  },

  async fetchProductById(id) {
    // Check if it's a mock product (ID >= 101)
    const mockProduct = mockProducts.find(p => p.id === parseInt(id));
    if (mockProduct) {
      return mockProduct;
    }
    
    // Otherwise fetch from API
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  async fetchCategories() {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async fetchProductsByCategory(category) {
    const res = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!res.ok) throw new Error("Failed to fetch category products");
    return res.json();
  },

  // =====================
  // Fake Authentication
  // =====================
  async login(credentials) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      token: "fake-jwt-token",
      user: { email: credentials.email },
    };
  },

  async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      token: "fake-jwt-token",
      user: userData,
    };
  },
};
