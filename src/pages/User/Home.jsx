import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Later connect to API
  useEffect(() => {
    // setCategories(...)
    // setProducts(...)
  }, []);

  return (
    <div className="px-4">

      {/* HERO BANNER */}
      <div className="w-full h-56 md:h-72 bg-gray-300 rounded-xl mb-6 flex items-center justify-center text-3xl font-bold">
        Fashion Starts Here 
      </div>

      {/* CATEGORIES */}
      <h2 className="text-xl font-bold mb-4">Shop by Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map((cat) => (
          <Link
            to={`/categories/${cat.slug}`}
            key={cat.id}
            className="bg-white shadow rounded-xl p-4 text-center"
          >
            <img src={cat.image_url} alt="" className="h-20 mx-auto mb-2" />
            {cat.name}
          </Link>
        ))}
      </div>

      {/* TRENDING PRODUCTS */}
      <h2 className="text-xl font-bold mb-4">Trending Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link
            to={`/product/${p.id}`}
            key={p.id}
            className="bg-white shadow rounded-xl p-3"
          >
            <img src={p.image_url} className="h-40 w-full object-cover rounded" />
            <h3 className="font-medium mt-2">{p.name}</h3>
            <p className="font-bold">₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
