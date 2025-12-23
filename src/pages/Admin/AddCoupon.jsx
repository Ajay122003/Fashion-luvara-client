import React, { useState } from "react";
import { createAdminCoupon } from "../../api/admin";
import { useNavigate } from "react-router-dom";

const AddCoupon = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "PERCENT",
    discount_value: "",
    min_purchase: "",
    expiry_date: "",
    is_active: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (form.code.trim().length < 4) {
      return "Coupon code must be at least 4 characters";
    }

    if (Number(form.discount_value) <= 0) {
      return "Discount value must be greater than 0";
    }

    if (
      form.discount_type === "PERCENT" &&
      Number(form.discount_value) > 100
    ) {
      return "Percentage discount cannot exceed 100";
    }

    if (Number(form.min_purchase) < 0) {
      return "Minimum purchase cannot be negative";
    }

    if (new Date(form.expiry_date) <= new Date()) {
      return "Expiry date must be in the future";
    }

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await createAdminCoupon({
        ...form,
        code: form.code.toUpperCase(),
      });

      alert("Coupon created successfully!");
      navigate("/admin/coupons");
    } catch (err) {
      setError(
        err.response?.data?.code ||
          err.response?.data?.discount_value ||
          "Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3 d-flex justify-content-center">
      <div
        className="w-100 p-3 shadow-sm bg-white rounded"
        style={{ maxWidth: "600px", marginBottom: "80px" }}
      >
        <h3 className="fw-bold mb-3 text-center">
          Add Coupon
        </h3>

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* CODE */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Coupon Code
            </label>
            <input
              type="text"
              className="form-control"
              required
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Description
            </label>
            <textarea
              className="form-control"
              rows="2"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* DISCOUNT TYPE */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Discount Type
            </label>
            <select
              className="form-select"
              value={form.discount_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_type: e.target.value,
                })
              }
            >
              <option value="PERCENT">
                Percentage
              </option>
              <option value="FLAT">
                Flat Amount
              </option>
            </select>
          </div>

          {/* DISCOUNT VALUE */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Discount Value
            </label>
            <input
              type="number"
              className="form-control"
              required
              value={form.discount_value}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_value: e.target.value,
                })
              }
            />
          </div>

          {/* MIN PURCHASE */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Minimum Purchase
            </label>
            <input
              type="number"
              className="form-control"
              value={form.min_purchase}
              onChange={(e) =>
                setForm({
                  ...form,
                  min_purchase: e.target.value,
                })
              }
            />
          </div>

          {/* EXPIRY DATE */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              className="form-control"
              required
              value={form.expiry_date}
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry_date: e.target.value,
                })
              }
            />
          </div>

          {/* ACTIVE */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.checked,
                })
              }
            />
            <label className="form-check-label fw-bold">
              Active Coupon
            </label>
          </div>

          <button
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
