import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function TourManager() {
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]); // ảnh khi thêm tour
  const [tourImages, setTourImages] = useState([]); // ảnh khi sửa tour

  // 🧩 Form thêm mới
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(1);
  const [mainLocationId, setMainLocationId] = useState("");
  const [shortDesc, setShortDesc] = useState("");

 // --- fetchData: lấy tours + attach preview_image (nếu có) ---
const fetchData = async () => {
  try {
    const [tourRes, locRes] = await Promise.all([
      adminApi.getTours(),
      adminApi.getLocations(),
    ]);
    const toursData = tourRes.data || [];
    const locationsData = locRes.data || [];

    // Lấy ảnh preview (ảnh đầu tiên) cho mỗi tour song song
    const previewPromises = toursData.map(async (t) => {
      try {
        const imgsRes = await adminApi.getTourImages(t.id); // trả về mảng ảnh
        const imgs = imgsRes.data || [];
        // lấy ảnh đầu tiên nếu có
        const preview = imgs.length > 0 ? imgs[0].img_url : null;
        return { ...t, preview_image: preview };
      } catch (err) {
        // nếu lỗi lấy ảnh thì bỏ qua, preview=null
        return { ...t, preview_image: null };
      }
    });

    const toursWithPreview = await Promise.all(previewPromises);

    setTours(toursWithPreview);
    setLocations(locationsData);
  } catch (err) {
    console.error("❌ Lỗi tải dữ liệu tours/locations:", err);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Thêm tour mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.addTour({
        code,
        title,
        short_description: shortDesc,
        price,
        duration_days: duration,
        main_location_id: mainLocationId || null,
      });

      const tourId = res.data.id;

      // Nếu có ảnh kèm theo → upload
      if (images.length > 0) {
        for (let img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadTourImage(tourId, formData);
        }
      }

      toast.success("✅ Thêm tour thành công!");
      setCode("");
      setTitle("");
      setPrice("");
      setDuration(1);
      setShortDesc("");
      setImages([]);
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm tour"));
    }
  };

  // 🔹 Khi chọn ảnh trong form thêm mới
  const handleImageSelect = (e) => {
    setImages([...e.target.files]);
  };

  // 🔹 Cập nhật tour
  const handleSave = async (id) => {
    try {
      await adminApi.updateTour(id, editItem);
      toast.success("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  // 🔹 Xóa tour
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tour này?")) {
      await adminApi.deleteTour(id);
      toast.success("🗑️ Đã xóa tour!");
      fetchData();
    }
  };

  // 🔹 Lấy ảnh của tour khi chỉnh sửa
  const loadTourImages = async (tourId) => {
    const res = await adminApi.getTourImages(tourId);
    setTourImages(res.data);
  };

  // 🔹 Upload ảnh khi chỉnh sửa
  const handleUploadEdit = async (e) => {
    const file = e.target.files[0];
    if (!file || !editItem) return;
    const formData = new FormData();
    formData.append("image", file);
    await adminApi.uploadTourImage(editItem.id, formData);
    toast.success("✅ Upload ảnh thành công!");
    await loadTourImages(editItem.id);
  };

  // 🔹 Xóa ảnh khi chỉnh sửa
  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Xóa ảnh này?")) {
      await adminApi.deleteTourImage(imageId);
      toast.success("🗑️ Đã xóa ảnh!");
      await loadTourImages(editItem.id);
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>🌍 Quản lý Tour du lịch</h2>
        {message && <p>{message}</p>}

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
          <h3>➕ Thêm Tour mới</h3>

          <label>Mã tour:</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Tên tour:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Giá (VND):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Thời gian (ngày):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Địa điểm chính:</label>
          <select
            value={mainLocationId}
            onChange={(e) => setMainLocationId(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Chọn địa điểm --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          <label>Mô tả ngắn:</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Ảnh tour:</label>
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
            Thêm Tour
          </button>
        </form>

        {/* --- Danh sách Tour --- */}
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%", background: "white" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Mã</th>
              <th>Tên Tour</th>
              <th>Giá</th>
              <th>Thời gian</th>
              <th>Địa điểm chính</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          {/* --- tbody: hiển thị thumbnail luôn, chỉnh sửa ở cột hành động --- */}
            <tbody>
              {tours.map((t) =>
                editItem?.id === t.id ? (
                  // CHẾ ĐỘ CHỈNH SỬA
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>
                      <input
                        value={editItem.code}
                        onChange={(e) => setEditItem({ ...editItem, code: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editItem.title}
                        onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
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
                      <input
                        type="number"
                        value={editItem.duration_days}
                        onChange={(e) =>
                          setEditItem({ ...editItem, duration_days: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={editItem.main_location_id || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, main_location_id: e.target.value })
                        }
                      >
                        <option value="">-- Chọn địa điểm --</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        value={editItem.short_description || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, short_description: e.target.value })
                        }
                      />
                    </td>

                    {/* ẢNH - vẫn hiển thị upload + gallery khi đang chỉnh sửa */}
                    <td>
                      <div>
                        <input
                          type="file"
                          onChange={handleUploadEdit}
                          style={{ marginBottom: 8 }}
                        />
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {tourImages.map((img) => (
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
                      <button onClick={() => handleSave(t.id)}>💾</button>
                      <button onClick={() => setEditItem(null)}>❌</button>
                    </td>
                  </tr>
                ) : (
                  // CHẾ ĐỘ BÌNH THƯỜNG: hiện thumbnail trực tiếp trong ô Ảnh
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.code}</td>
                    <td>{t.title}</td>
                    <td>{t.price}</td>
                    <td>{t.duration_days}</td>
                    <td>{locations.find((l) => l.id === t.main_location_id)?.name || "—"}</td>
                    <td>{t.short_description}</td>

                    {/* THUMBNAIL luôn hiển thị */}
                    <td>
                      {t.preview_image ? (
                        <img
                          src={`http://localhost:8088/${t.preview_image}`}
                          alt=""
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 5,
                          }}
                        />
                      ) : (
                        <span style={{ color: "#888" }}>Chưa có ảnh</span>
                      )}
                    </td>

                    {/* HÀNH ĐỘNG: chỉnh sửa (mở full gallery) + xóa */}
                    <td>
                      <button
                        onClick={async () => {
                          setEditItem(t);
                          await loadTourImages(t.id); // load gallery để chỉnh sửa
                        }}
                        style={{ marginRight: 8 }}
                      >
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(t.id)}>🗑️</button>
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
