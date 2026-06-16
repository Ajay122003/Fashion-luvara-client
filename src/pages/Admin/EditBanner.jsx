import {useEffect,useState,} from "react";
import { useParams, useNavigate,} from "react-router-dom";
import BannerForm from "../../components/Admin/BannerForm";
import {
  fetchSingleAdminBanner,
  updateAdminBanner,
} from "../../api/admin";

const EditBanner = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [banner, setBanner] =
    useState(null);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner =
    async () => {
      const data =
        await fetchSingleAdminBanner(
          id
        );

      setBanner(data);
    };

  const handleUpdate =
    async (formData) => {
      await updateAdminBanner(
        id,
        formData
      );

      alert(
        "Banner updated successfully"
      );

      navigate(
        "/admin/manage-banners"
      );
    };

  if (!banner) return null;

  return (
    <div className="container py-4">
      <h3>Edit Banner</h3>

      <BannerForm
        initialData={banner}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditBanner;