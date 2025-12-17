import React from "react";

const CollectionForm = ({
  collection,
  setCollection,
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
                Collection Management
              </h5>
              <small className="text-muted">
                Organize products into curated collections
              </small>
            </div>

            {/* BODY */}
            <div className="p-4">
              <form onSubmit={handleSubmit}>

                {/* COLLECTION NAME */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Eg: Summer Sale, New Arrivals"
                    value={collection.name}
                    required
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Short description about this collection"
                    value={collection.description}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        description: e.target.value,
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
                      value={collection.sort_order}
                      onChange={(e) =>
                        setCollection({
                          ...collection,
                          sort_order: e.target.value,
                        })
                      }
                    />
                    <small className="text-muted">
                      Lower number appears first
                    </small>
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={collection.is_active}
                        onChange={(e) =>
                          setCollection({
                            ...collection,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label fw-medium">
                        Active Collection
                      </label>
                    </div>
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Collection Banner Image
                  </label>

                  <div className="border rounded-3 p-3 bg-light">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                    {(collection.image_url || collection.image) && (
                      <div className="mt-3 text-center">
                        <img
                          src={collection.image_url || collection.image}
                          alt="Preview"
                          className="img-fluid rounded-3 border"
                          style={{
                            maxHeight: "200px",
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

export default CollectionForm;
