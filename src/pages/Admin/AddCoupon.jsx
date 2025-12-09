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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminCoupon(form);
      alert("Coupon created successfully!");
      navigate("/admin/coupons");
    } catch (error) {
      alert("Failed to create coupon");
    }
  };

  return (
    <div className="container py-3 d-flex justify-content-center">
      <div
        className="w-100 p-3 shadow-sm bg-white rounded"
        style={{
          maxWidth: "600px",
          marginBottom: "80px", // navbar thandi pogama fix
        }}
      >
        <h3 className="fw-bold mb-3 text-center">Add Coupon</h3>

        <form onSubmit={handleSubmit}>

          {/* CODE */}
          <div className="mb-3">
            <label className="form-label fw-bold">Coupon Code</label>
            <input
              type="text"
              className="form-control"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              rows="2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* DISCOUNT TYPE */}
          <div className="mb-3">
            <label className="form-label fw-bold">Discount Type</label>
            <select
              className="form-select"
              value={form.discount_type}
              onChange={(e) =>
                setForm({ ...form, discount_type: e.target.value })
              }
            >
              <option value="PERCENT">Percentage</option>
              <option value="FLAT">Flat Amount</option>
            </select>
          </div>

          {/* DISCOUNT VALUE */}
          <div className="mb-3">
            <label className="form-label fw-bold">Discount Value</label>
            <input
              type="number"
              className="form-control"
              required
              value={form.discount_value}
              onChange={(e) =>
                setForm({ ...form, discount_value: e.target.value })
              }
            />
          </div>

          {/* MIN PURCHASE */}
          <div className="mb-3">
            <label className="form-label fw-bold">Minimum Purchase</label>
            <input
              type="number"
              className="form-control"
              value={form.min_purchase}
              onChange={(e) =>
                setForm({ ...form, min_purchase: e.target.value })
              }
            />
          </div>

          {/* EXPIRY DATE */}
          <div className="mb-3">
            <label className="form-label fw-bold">Expiry Date</label>
            <input
              type="datetime-local"
              className="form-control"
              required
              value={form.expiry_date}
              onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
              }
            />
          </div>

          {/* ACTIVE STATUS */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            <label className="form-check-label fw-bold">
              Active Coupon
            </label>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold">
            Create Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
