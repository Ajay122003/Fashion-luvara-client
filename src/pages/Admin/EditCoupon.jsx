import React, { useEffect, useState } from "react";
import {
  fetchSingleCoupon,
  updateAdminCoupon,
} from "../../api/admin";
import { useParams, useNavigate } from "react-router-dom";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    loadCoupon();
  }, []);

  const loadCoupon = async () => {
    const data = await fetchSingleCoupon(id);
    setForm(data);
  };

  if (!form) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminCoupon(id, form);
      alert("Coupon updated successfully!");
      navigate("/admin/coupons");
    } catch (err) {
      alert("Failed to update coupon");
    }
  };

  return (
    <div className="container py-3">
      <h3>Edit Coupon</h3>

      <form className="card p-4 shadow-sm mt-3" onSubmit={handleSubmit}>
        {/* CODE */}
        <div className="mb-3">
          <label className="form-label">Coupon Code</label>
          <input
            type="text"
            className="form-control"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>

        {/* TYPE */}
        <div className="mb-3">
          <label className="form-label">Discount Type</label>
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

        {/* VALUE */}
        <div className="mb-3">
          <label className="form-label">Discount Value</label>
          <input
            type="number"
            className="form-control"
            value={form.discount_value}
            onChange={(e) =>
              setForm({ ...form, discount_value: e.target.value })
            }
          />
        </div>

        {/* MIN PURCHASE */}
        <div className="mb-3">
          <label className="form-label">Min Purchase Amount</label>
          <input
            type="number"
            className="form-control"
            value={form.min_purchase}
            onChange={(e) =>
              setForm({ ...form, min_purchase: e.target.value })
            }
          />
        </div>

        {/* EXPIRY */}
        <div className="mb-3">
          <label className="form-label">Expiry Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={form.expiry_date}
            onChange={(e) =>
              setForm({ ...form, expiry_date: e.target.value })
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
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          <label className="form-check-label">Active</label>
        </div>

        <button className="btn btn-primary">Update Coupon</button>
      </form>
    </div>
  );
};

export default EditCoupon;
