import React, { useEffect, useState } from "react";
import { createAdminProduct, fetchAdminCategories } from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    sizes: "",
    colors: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchAdminCategories();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);

    // sale_price optional
    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    form.append("stock", product.stock);
    form.append("category", product.category);

    // FIX: Convert string → JSON array
    const sizesArray = product.sizes.split(",").map((s) => s.trim());
    const colorsArray = product.colors.split(",").map((c) => c.trim());

    form.append("sizes", JSON.stringify(sizesArray));
    form.append("colors", JSON.stringify(colorsArray));

    // Images
    for (let img of images) {
      form.append("images", img);
    }

    try {
      await createAdminProduct(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Add Product</h3>

      <ProductForm
        handleSubmit={handleSubmit}
        product={product}
        setProduct={setProduct}
        images={images}
        setImages={setImages}
        categories={categories}
        buttonText="Add Product"
      />
    </div>
  );
};

export default AddProduct;
