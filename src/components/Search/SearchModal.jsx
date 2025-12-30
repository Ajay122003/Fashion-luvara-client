import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../api/auth";

const SearchModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

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

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start"
      style={{
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        paddingTop: "80px",
      }}
    >
      {/* MODAL CARD */}
      <div
        className="bg-white rounded-4 shadow w-100"
        style={{ maxWidth: "600px" }}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center gap-3 p-3 border-bottom">
          <input
            className="form-control rounded-pill px-4"
            placeholder="Search products..."
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <i
            className="bi bi-x-lg fs-5"
            role="button"
            onClick={handleClose}
          />
        </div>

        {/* RESULTS */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {loading && (
            <p className="text-center py-4 text-muted">
              Searching...
            </p>
          )}

          {!loading && searchText && results.length === 0 && (
            <p className="text-center py-4 text-muted">
              No products found
            </p>
          )}

          {!loading &&
            results.map((p) => (
              <div
                key={p.id}
                className="d-flex align-items-center gap-3 p-3 border-bottom search-item"
                role="button"
                onClick={() => {
                  handleClose();
                  navigate(`/product/${p.id}`);
                }}
              >
                <img
                  src={p.images?.[0]?.image_url}
                  alt={p.name}
                  width="60"
                  height="60"
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <div className="fw-semibold">{p.name}</div>
                  <div className="text-muted small">₹{p.price}</div>
                </div>

                <i className="bi bi-arrow-right text-muted" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
