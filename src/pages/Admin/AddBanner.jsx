import { useNavigate } from "react-router-dom";
import BannerForm from "../../components/Admin/BannerForm";
import { createAdminBanner } from "../../api/admin";
import { toast } from "react-hot-toast";

const AddBanner = () => {
  const navigate = useNavigate();

  const handleCreate = async (
    formData
  ) => {
    try {
      await createAdminBanner(
        formData
      );

      toast.success("Banner created successfully!");

      navigate(
        "/admin/banners"
      );
    } catch (err) {
      toast.error("Error creating banner.");
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