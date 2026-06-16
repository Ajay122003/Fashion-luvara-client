import { useNavigate } from "react-router-dom";
import BannerForm from "../../components/Admin/BannerForm";
import { createAdminBanner } from "../../api/admin";

const AddBanner = () => {
  const navigate = useNavigate();

  const handleCreate = async (
    formData
  ) => {
    try {
      await createAdminBanner(
        formData
      );

      alert(
        "Banner created successfully"
      );

      navigate(
        "/admin/manage-banners"
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add Banner</h3>

      <BannerForm
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default AddBanner;