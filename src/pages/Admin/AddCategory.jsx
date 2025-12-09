import React, { useState } from "react";
import { createAdminCategory } from "../../api/admin";
import CategoryForm from "../../components/Admin/CategoryForm";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    sort_order: 0,
    is_active: true,
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let form = new FormData();
    form.append("name", category.name);
    form.append("sort_order", category.sort_order);
    form.append("is_active", category.is_active);

    if (image) form.append("image", image);

    await createAdminCategory(form);

    alert("Category created successfully!");
    navigate("/admin/categories");
  };

  return (
    <div className="container py-3">
      <h3>Add Category</h3>
      <CategoryForm
        category={category}
        setCategory={setCategory}
        image={image}
        setImage={setImage}
        buttonText="Create Category"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddCategory;
