import React, { useEffect, useState } from "react";
import CategoryForm from "../../components/Admin/CategoryForm";
import { fetchAdminCategories, updateAdminCategory } from "../../api/admin";
import api from "../../api/client";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState({
    name: "",
    sort_order: 0,
    is_active: true,
    image_url: null,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    const res = await api.get(`/api/admin-panel/categories/${id}/`);
    setCategory(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let form = new FormData();
    form.append("name", category.name);
    form.append("sort_order", category.sort_order);
    form.append("is_active", category.is_active);

    if (image) form.append("image", image);

    await updateAdminCategory(id, form);

    alert("Category updated successfully!");
    navigate("/admin/categories");
  };

  return (
    <div className="container py-3">
      <h3>Edit Category</h3>
      <CategoryForm
        category={category}
        setCategory={setCategory}
        image={image}
        setImage={setImage}
        buttonText="Update Category"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditCategory;
