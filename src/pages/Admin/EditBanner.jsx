import {useEffect,useState,} from "react";
import { useParams, useNavigate,} from "react-router-dom";
import BannerForm from "../../components/Admin/BannerForm";
import {
  fetchSingleAdminBanner,
  updateAdminBanner,
} from "../../api/admin";

import { toast } from "react-hot-toast";

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

  const handleUpdate = async (formData) => {
  try {
    await updateAdminBanner(
      id,
      formData
    );

    toast.success(
      "Banner updated successfully"
    );

    navigate(
      "/admin/banners"
    );
  } catch (error) {
    toast.error(
      "Failed to update banner"
    );
  }
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