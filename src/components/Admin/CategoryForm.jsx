import React from "react";

const CategoryForm = ({
  category,
  setCategory,
  image,
  setImage,
  handleSubmit,
  buttonText,
}) => {
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">

          {/* MAIN CARD */}
          <div className="bg-white rounded-4 shadow-sm border">

            {/* HEADER */}
            <div className="px-4 py-3 border-bottom">
              <h5 className="mb-1 fw-semibold">
                Category Management
              </h5>
              <small className="text-muted">
                Create and manage product categories
              </small>
            </div>

            {/* BODY */}
            <div className="p-4">
              <form onSubmit={handleSubmit}>

                {/* SECTION */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Eg: Men, Women, Accessories"
                    value={category.name}
                    required
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* GRID */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={category.sort_order}
                      onChange={(e) =>
                        setCategory({
                          ...category,
                          sort_order: e.target.value,
                        })
                      }
                    />
                    <small className="text-muted">
                      Lower number shows first
                    </small>
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={category.is_active}
                        onChange={(e) =>
                          setCategory({
                            ...category,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label fw-medium">
                        Active Category
                      </label>
                    </div>
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Category Image
                  </label>

                  <div className="border rounded-3 p-3 bg-light">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                    {category.image_url && (
                      <div className="mt-3 text-center">
                        <img
                          src={category.image_url}
                          alt="Preview"
                          className="img-fluid rounded-3 border"
                          style={{
                            maxHeight: "180px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg fw-semibold rounded-3"
                  >
                    {buttonText}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
