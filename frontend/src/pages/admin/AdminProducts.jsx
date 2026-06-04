import React, { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    fetch("https://plant-management-app-0jp3.onrender.com/api/plants")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    fetch(`https://plant-management-app-0jp3.onrender.com/api/plants/admin/delete/${id}`, {
      method: "DELETE",
    }).then(() => fetchProducts());
  };

  const updateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch(`https://plant-management-app-0jp3.onrender.com/api/plants/admin/update/${editProduct.id}`, {
      method: "PUT",
      body: formData,
    })
      .then(() => {
        setEditProduct(null);
        fetchProducts();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-product-container">
      <h2>🌿 Manage Products</h2>

      <div className="product-list">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={`http://localhost:8080${p.imageUrl}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <span>₹{p.price}</span>

            <div className="actions">
              <button className="edit" onClick={() => setEditProduct(p)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteProduct(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <div className="edit-modal">
          <form onSubmit={updateProduct} className="edit-form">
            <h3>Edit {editProduct.name}</h3>

            <input name="name" defaultValue={editProduct.name} required />
            <textarea
              name="description"
              defaultValue={editProduct.description}
              required
            />
            <input
              name="price"
              type="number"
              defaultValue={editProduct.price}
              required
            />
            <input name="image" type="file" />

            <button className="save">Save Changes</button>
            <button className="cancel" onClick={() => setEditProduct(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}