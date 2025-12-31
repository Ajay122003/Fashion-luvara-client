import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../api/auth";

const SearchModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  /* ================= ESC KEY CLOSE ================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, []);

  /* ================= SEARCH WITH DEBOUNCE ================= */
  useEffect(() => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(searchText);
        setResults(res.data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  const handleClose = () => {
    setSearchText("");
    setResults([]);
    onClose();
  };

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start"
      style={{
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        padding: "env(safe-area-inset-top)",
      }}
      onClick={handleClose}
    >
      {/* ================= SEARCH CARD ================= */}
      <div
        className="bg-white shadow-lg w-100 search-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="border-bottom px-3 px-md-4 py-3 d-flex align-items-center gap-2">
          <i className="bi bi-search fs-5 text-muted" />

          <input
            ref={inputRef}
            className="form-control border-0 shadow-none fs-6 fs-md-5"
            placeholder="Search products…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button
            className="btn btn-light rounded-circle"
            onClick={handleClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* ================= RESULTS ================= */}
        <div className="search-results-body">
          {/* LOADING */}
          {loading && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-dark"
                role="status"
              />
              <p className="mt-3 text-muted">
                Searching…
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && searchText && results.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted" />
              <p className="mt-2 text-muted">
                No products found
              </p>
            </div>
          )}

          {/* RESULTS LIST */}
          {!loading &&
            results.map((p) => (
              <div
                key={p.id}
                className="d-flex align-items-center gap-3 px-3 px-md-4 py-3 border-bottom search-result-item"
                role="button"
                onClick={() => {
                  handleClose();
                  navigate(`/product/${p.id}`);
                }}
              >
                <img
                  src={p.images?.[0]?.image_url}
                  alt={p.name}
                  className="rounded"
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                  }}
                />

                <div className="flex-grow-1">
                  <div className="fw-semibold text-truncate">
                    {p.name}
                  </div>

                  <div className="small">
                    <span className="fw-semibold">
                      ₹{p.sale_price || p.price}
                    </span>
                    {p.sale_price && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        ₹{p.price}
                      </span>
                    )}
                  </div>
                </div>

                <i className="bi bi-chevron-right text-muted" />
              </div>
            ))}
        </div>

        {/* ================= FOOTER (HIDDEN ON MOBILE) ================= */}
        <div className="px-4 py-2 small text-muted d-none d-md-flex justify-content-between">
          <span>Type to search</span>
          <span>ESC to close</span>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>
        {`
          .search-modal-card {
            max-width: 720px;
            margin-top: 80px;
            border-radius: 16px;
          }

          @media (max-width: 768px) {
            .search-modal-card {
              margin-top: 0;
              height: 100%;
              border-radius: 0;
            }
          }

          .search-results-body {
            max-height: 65vh;
            overflow-y: auto;
          }

          @media (max-width: 768px) {
            .search-results-body {
              max-height: calc(100vh - 64px);
            }
          }

          .search-result-item:hover {
            background: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};

export default SearchModal;

