import React, { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (image) fd.append("image", image);

      const res = await fetch("https://plant-management-app-0jp3.onrender.com/api/plants/add", {
        method: "POST",
        body: fd
      });

      if (!res.ok) throw new Error("Upload failed!");

      setMsg("Product added successfully!");
      setForm({ name: "", description: "", price: "" });
      setImage(null);

    } catch (err) {
      setMsg("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="add-product-container">
      <h2>Add New Plant</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Plant Name"
               value={form.name} onChange={handleChange} required />

        <textarea name="description" placeholder="Description"
                  value={form.description} onChange={handleChange} />

        <input type="text" name="price" placeholder="Price"
               value={form.price} onChange={handleChange} required />

        <label className="file-upload-box">
          {image ? image.name : "Choose Plant Image"}
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>

        <button type="submit" className="add-product-btn">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {msg && <p className={msg.startsWith("Error") ? "error" : "success"}>{msg}</p>}
    </div>
  );
}