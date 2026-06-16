import { useState } from "react";

const BannerForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [video, setVideo] = useState(null);
  const [isActive, setIsActive] = useState(
    initialData.is_active ?? true
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (video) {
      formData.append("video", video);
    }

    formData.append(
      "is_active",
      isActive
    );

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          Banner Video
        </label>

        <input
          type="file"
          accept="video/*"
          className="form-control"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isActive}
          onChange={(e) =>
            setIsActive(e.target.checked)
          }
        />

        <label className="form-check-label">
          Active Banner
        </label>
      </div>

      <button
        className="btn btn-dark"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Banner"}
      </button>
    </form>
  );
};

export default BannerForm;