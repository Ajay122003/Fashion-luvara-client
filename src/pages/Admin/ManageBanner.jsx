import {
  useEffect,
  useState,
} from "react";

import {Link,} from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { fetchAdminBanners, deleteAdminBanner,} from "../../api/admin";

const ManageBanner = () => {
  const [banners, setBanners] =
    useState([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners =
    async () => {
      const data =
        await fetchAdminBanners();

      setBanners(data);
    };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Banner?",
    text: "This banner will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteAdminBanner(id);

    toast.success(
      "Banner deleted successfully"
    );

    loadBanners();
  } catch (error) {
    toast.error(
      "Failed to delete banner"
    );
  }
};

  return (
  <div className="container py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="fw-bold mb-0">
        Manage Banners
      </h3>

      <Link
        to="/admin/banners/add"
        className="btn btn-dark"
      >
        <i className="bi bi-plus-circle me-2"></i>
        Add Banner
      </Link>
    </div>

    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Preview</th>
                <th>Status</th>
                <th>Created</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner.id}>
                    <td>
                      #{banner.id}
                    </td>

                    <td>
                      <video
                        src={banner.video}
                        width="180"
                        height="100"
                        muted
                        controls
                        className="rounded border"
                      />
                    </td>

                    <td>
                      {banner.is_active ? (
                        <span className="badge bg-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>
                      {new Date(
                        banner.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/admin/banners/${banner.id}/edit`}
                          className="btn btn-warning btn-sm"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(
                              banner.id
                            )
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4"
                  >
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default ManageBanner;