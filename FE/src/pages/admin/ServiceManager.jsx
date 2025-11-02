import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [images, setImages] = useState([]); // ảnh thêm mới
  const [serviceImages, setServiceImages] = useState([]); // ảnh khi chỉnh sửa

  // 🧩 Form thêm mới
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  // 🔹 Lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const res = await adminApi.getServices();
      setServices(res.data);
    } catch (err) {
      toast.error("❌ Lỗi tải danh sách dịch vụ");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🟢 Thêm dịch vụ
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.addService({
        type,
        name,
        provider,
        details,
        price,
      });

      const serviceId = res.data.id;

      // Upload ảnh kèm theo
      if (images.length > 0) {
        for (let img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadServiceImage(serviceId, formData);
        }
      }

      toast.success("✅ Thêm dịch vụ thành công!");
      setType("");
      setName("");
      setProvider("");
      setDetails("");
      setPrice("");
      setImages([]);
      fetchServices();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm dịch vụ"));
    }
  };

  // 🟢 Khi chọn ảnh trong form thêm mới
  const handleImageSelect = (e) => {
    setImages([...e.target.files]);
  };

  // 🟢 Upload ảnh khi chỉnh sửa
  const handleUploadEdit = async (e) => {
    const file = e.target.files[0];
    if (!file || !editItem) return;
    const formData = new FormData();
    formData.append("image", file);
    await adminApi.uploadServiceImage(editItem.id, formData);
    toast.success("✅ Upload ảnh thành công!");
    await loadServiceImages(editItem.id);
  };

  // 🟢 Lấy ảnh của 1 dịch vụ khi chỉnh sửa
  const loadServiceImages = async (serviceId) => {
    try {
      const res = await adminApi.getServiceImages(serviceId);
      setServiceImages(Array.isArray(res.data) ? res.data : []); // ✅ đảm bảo là mảng
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      setServiceImages([]); // tránh undefined
    }
  };


  // 🟢 Xóa ảnh
  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Xóa ảnh này?")) {
      await adminApi.deleteServiceImage(imageId);
      toast.success("🗑️ Đã xóa ảnh!");
      await loadServiceImages(editItem.id);
    }
  };

  // 🟢 Cập nhật dịch vụ
  const handleSave = async (id) => {
    try {
      await adminApi.updateService(id, editItem);
      toast.success("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchServices();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  // 🟢 Xóa dịch vụ
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      await adminApi.deleteService(id);
      toast.success("🗑️ Đã xóa dịch vụ!");
      fetchServices();
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>🛠️ Quản lý Dịch vụ</h2>

        {/* --- Form thêm mới --- */}
        <form
          onSubmit={handleAdd}
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: 600,
            background: "#fafafa",
          }}
        >
          <h3>➕ Thêm Dịch vụ mới</h3>

          <label>Loại dịch vụ:</label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Tên dịch vụ:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Nhà cung cấp:</label>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Chi tiết:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Giá (VND):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Ảnh dịch vụ:</label>
          <input
            type="file"
            multiple
            onChange={handleImageSelect}
            style={{ width: "100%", marginBottom: 10 }}
          />
          {images.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Array.from(images).map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt=""
                  style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: "10px 15px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Thêm Dịch vụ
          </button>
        </form>

        {/* --- Danh sách Dịch vụ --- */}
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%", background: "white" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Loại</th>
              <th>Tên dịch vụ</th>
              <th>Nhà cung cấp</th>
              <th>Giá</th>
              <th>Chi tiết</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) =>
              editItem?.id === s.id ? (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <input
                      value={editItem.type}
                      onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.provider}
                      onChange={(e) => setEditItem({ ...editItem, provider: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    />
                  </td>
                  <td>
                    <textarea
                      value={editItem.details || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, details: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <div>
                      <input type="file" onChange={handleUploadEdit} />
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {Array.isArray(serviceImages) && serviceImages.map((img) => (
                          <div key={img.id} style={{ position: "relative" }}>
                            <img
                              src={`http://localhost:8088/${img.img_url}`}
                              alt=""
                              style={{
                                width: 80,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 5,
                              }}
                            />
                            <button
                              onClick={() => handleDeleteImage(img.id)}
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: "rgba(255,0,0,0.7)",
                                border: "none",
                                color: "white",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleSave(s.id)}>💾</button>
                    <button onClick={() => setEditItem(null)}>❌</button>
                  </td>
                </tr>
              ) : (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.type}</td>
                  <td>{s.name}</td>
                  <td>{s.provider}</td>
                  <td>{s.price}</td>
                  <td>{s.details}</td>
                  <td>
                    {s.preview_image ? (
                      <img
                        src={`http://localhost:8088/${s.preview_image}`}
                        alt=""
                        style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }}
                      />
                    ) : (
                      <span style={{ color: "#888" }}>Chưa có ảnh</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={async () => {
                        setEditItem(s);
                        await loadServiceImages(s.id);
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(s.id)}>🗑️</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
