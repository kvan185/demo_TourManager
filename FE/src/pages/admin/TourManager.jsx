import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function TourManager() {
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]); // 💡 hướng dẫn viên
  const [services, setServices] = useState([]); // 💡 danh sách dịch vụ
  const [editItem, setEditItem] = useState(null);
  const [images, setImages] = useState([]);
  const [tourImages, setTourImages] = useState([]);

  // --- Form thêm mới ---
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(1);
  const [mainLocationId, setMainLocationId] = useState("");
  const [shortDesc, setShortDesc] = useState("");

  // 💡 Các dữ liệu phụ để thêm (Schedules, Guides, Services)
  const [schedules, setSchedules] = useState([
    { start_date: "", end_date: "", seats_total: "", price_per_person: "" },
  ]);
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // --- Fetch dữ liệu ---
  const fetchData = async () => {
    try {
      const [tourRes, locRes, empRes, svRes] = await Promise.all([
        adminApi.getTours(),
        adminApi.getLocations(),
        adminApi.getEmployees(),
        adminApi.getServices(),
      ]);

      const toursData = tourRes.data || [];
      const locationsData = locRes.data || [];
      const employeesData = empRes.data || [];
      const servicesData = svRes.data || [];

      // Gắn ảnh preview
      const previewPromises = toursData.map(async (t) => {
        try {
          const imgsRes = await adminApi.getTourImages(t.id);
          const imgs = imgsRes.data || [];
          const preview = imgs.length > 0 ? imgs[0].img_url : null;
          return { ...t, preview_image: preview };
        } catch {
          return { ...t, preview_image: null };
        }
      });

      const toursWithPreview = await Promise.all(previewPromises);
      setTours(toursWithPreview);
      setLocations(locationsData);
      setEmployees(employeesData);
      setServices(servicesData);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Thêm lịch tour mới
  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      { start_date: "", end_date: "", seats_total: "", price_per_person: "" },
    ]);
  };

  // --- Thêm tour mới ---
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

      // Upload ảnh
      if (images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadTourImage(tourId, formData);
        }
      }

      // 💡 Gửi dữ liệu lịch tour
      for (const s of schedules) {
        if (s.start_date && s.end_date) await adminApi.addTourSchedule(tourId, s);
      }

      // 💡 Gửi hướng dẫn viên
      for (const g of selectedGuides) {
        await adminApi.addTourGuide(tourId, { employee_id: g });
      }

      // 💡 Gửi dịch vụ
      for (const sv of selectedServices) {
        await adminApi.addTourService(tourId, { service_id: sv });
      }

      toast.success("✅ Thêm tour thành công!");
      setCode("");
      setTitle("");
      setPrice("");
      setDuration(1);
      setShortDesc("");
      setImages([]);
      setSchedules([{ start_date: "", end_date: "", seats_total: "", price_per_person: "" }]);
      setSelectedGuides([]);
      setSelectedServices([]);
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm tour"));
    }
  };

  // Xử lý ảnh
  const handleImageSelect = (e) => {
    setImages(Array.from(e.target.files));
  };

  // 🔹 Lấy ảnh của tour khi chỉnh sửa
  const loadTourImages = async (tourId) => {
    try {
      const res = await adminApi.getTourImages(tourId);
      setTourImages(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải ảnh tour:", err);
    }
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

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>🌍 Quản lý Tour du lịch</h2>

      {/* --- Form thêm mới --- */}
      <form
        onSubmit={handleAdd}
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: 800,
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

        {/* 💡 TOUR SCHEDULES */}
        <h4 style={{ marginTop: 20 }}>📅 Lịch khởi hành</h4>
        {schedules.map((s, i) => (
          <div key={i} style={{ border: "1px dashed #aaa", padding: 10, marginBottom: 10 }}>
            <label>Bắt đầu:</label>
            <input
              type="date"
              value={s.start_date}
              onChange={(e) => {
                const arr = [...schedules];
                arr[i].start_date = e.target.value;
                setSchedules(arr);
              }}
            />
            <label>Kết thúc:</label>
            <input
              type="date"
              value={s.end_date}
              onChange={(e) => {
                const arr = [...schedules];
                arr[i].end_date = e.target.value;
                setSchedules(arr);
              }}
            />
            <label>Ghế:</label>
            <input
              type="number"
              placeholder="Tổng ghế"
              value={s.seats_total}
              onChange={(e) => {
                const arr = [...schedules];
                arr[i].seats_total = e.target.value;
                setSchedules(arr);
              }}
            />
            <label>Giá/người:</label>
            <input
              type="number"
              placeholder="Giá mỗi người"
              value={s.price_per_person}
              onChange={(e) => {
                const arr = [...schedules];
                arr[i].price_per_person = e.target.value;
                setSchedules(arr);
              }}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddSchedule}>
          ➕ Thêm lịch mới
        </button>

        {/* 💡 TOUR GUIDES */}
        <h4 style={{ marginTop: 20 }}>🧑‍🏫 Hướng dẫn viên</h4>
        <select
          multiple
          value={selectedGuides}
          onChange={(e) => setSelectedGuides(Array.from(e.target.selectedOptions, (o) => o.value))}
          style={{ width: "100%", height: 100 }}
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        {/* 💡 TOUR SERVICES */}
        <h4 style={{ marginTop: 20 }}>🚍 Dịch vụ đi kèm</h4>
        <select
          multiple
          value={selectedServices}
          onChange={(e) =>
            setSelectedServices(Array.from(e.target.selectedOptions, (o) => o.value))
          }
          style={{ width: "100%", height: 100 }}
        >
          {services.map((sv) => (
            <option key={sv.id} value={sv.id}>
              {sv.name} ({sv.type})
            </option>
          ))}
        </select>

        <label style={{ marginTop: 20 }}>Ảnh tour:</label>
        <input type="file" multiple onChange={handleImageSelect} style={{ width: "100%" }} />

        {images.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {images.map((img, i) => (
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
            marginTop: 15,
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

      {/* --- Danh sách tour --- */}
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

        <tbody>
          {tours.map((t) =>
            editItem?.id === t.id ? (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  <input
                    value={editItem.code || ""}
                    onChange={(e) => setEditItem({ ...editItem, code: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={editItem.title || ""}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editItem.price || ""}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editItem.duration_days || ""}
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
                <td>
                  <div>
                    <input type="file" onChange={handleUploadEdit} style={{ marginBottom: 8 }} />
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
                            type="button"
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
                  <button type="button" onClick={() => handleSave(t.id)}>
                    💾
                  </button>
                  <button type="button" onClick={() => setEditItem(null)}>
                    ❌
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.code}</td>
                <td>{t.title}</td>
                <td>{t.price}</td>
                <td>{t.duration_days}</td>
                <td>{locations.find((l) => l.id === t.main_location_id)?.name || "—"}</td>
                <td>{t.short_description}</td>
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
                <td>
                  <button
                    type="button"
                    onClick={async () => {
                      setEditItem(t);
                      await loadTourImages(t.id);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    ✏️
                  </button>
                  <button type="button" onClick={() => handleDelete(t.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
