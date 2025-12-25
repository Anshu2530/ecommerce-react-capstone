import ProductCard from "../ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { useParams } from "react-router-dom";

const ProductList = () => {
  const { category } = useParams();
  const { products, loading } = useProducts();

  if (loading) return <p>Loading...</p>;

  const filteredProducts = category
    ? products.filter((p) => p.mainCategory === category)
    : products;

  return (
    <div className="grid">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
