import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function TourManager() {
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [images, setImages] = useState([]);
  const [tourImages, setTourImages] = useState([]);

  // ======= FORM 1: THÊM TOUR =======
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(1);
  const [mainLocationId, setMainLocationId] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // ======= FORM 2: THÊM LỊCH =======
  const [schTourId, setSchTourId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [seatsTotal, setSeatsTotal] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");

  // ======= FORM 3: THÊM LỊCH TRÌNH =======
  const [itiTourId, setItiTourId] = useState("");
  const [dayNumber, setDayNumber] = useState(1);
  const [itiTitle, setItiTitle] = useState("");
  const [itiDesc, setItiDesc] = useState("");

  // FETCH data
  const fetchData = async () => {
    try {
      const [tourRes, locRes, empRes, svRes] = await Promise.all([
        adminApi.getTours(),
        adminApi.getLocations(),
        adminApi.getEmployees(),
        adminApi.getServices(),
      ]);

      const toursData = tourRes.data || [];

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
      setLocations(locRes.data || []);
      setEmployees(empRes.data || []);
      setServices(svRes.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------- ADD TOUR --------
  const handleAddTour = async (e) => {
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

      // NEW API: return tour inside {tour: {...}}
      const tourId = res.data?.tour?.id;
      if (!tourId) return toast.error("Không lấy được ID tour mới");

      // upload images
      if (images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadTourImage(tourId, formData);
        }
      }

      // add guides
      for (const g of selectedGuides) {
        await adminApi.addTourGuide(tourId, { employee_id: g });
      }

      // add services
      for (const s of selectedServices) {
        await adminApi.addTourService(tourId, { service_id: s });
      }

      toast.success("✅ Thêm tour thành công!");

      setCode("");
      setTitle("");
      setPrice("");
      setDuration(1);
      setShortDesc("");
      setImages([]);
      setSelectedGuides([]);
      setSelectedServices([]);

      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm tour"));
    }
  };

  // -------- ADD SCHEDULE --------
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!schTourId) return toast.error("Chọn tour trước");

    try {
      await adminApi.addSchedule({
        tour_id: schTourId,
        start_date: startDate,
        end_date: endDate,
        seats_total: seatsTotal,
        price_per_person: pricePerPerson,
      });

      toast.success("✅ Thêm lịch thành công!");

      setStartDate("");
      setEndDate("");
      setSeatsTotal("");
      setPricePerPerson("");

      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi thêm lịch");
    }
  };

  // -------- ADD ITINERARY --------
  const handleAddItinerary = async (e) => {
    e.preventDefault();
    if (!itiTourId) return toast.error("Chọn tour trước");

    try {
      await adminApi.addItinerary({
        tour_id: itiTourId,
        day_number: dayNumber,
        title: itiTitle,
        description: itiDesc,
      });

      toast.success("✅ Thêm lịch trình thành công!");

      setDayNumber(1);
      setItiTitle("");
      setItiDesc("");

      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi thêm lịch trình");
    }
  };

  // upload images for edit
  const loadTourImages = async (tourId) => {
    try {
      const res = await adminApi.getTourImages(tourId);
      setTourImages(res.data || []);
    } catch (err) {
      console.error("Lỗi load tour images:", err);
      setTourImages([]);
    }
  };

  const handleUploadEdit = async (e) => {
    const file = e.target.files[0];
    if (!file || !editItem) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await adminApi.uploadTourImage(editItem.id, formData);
      toast.success("✅ Upload ảnh thành công!");
      await loadTourImages(editItem.id);
    } catch (err) {
      toast.error("❌ Lỗi upload ảnh");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    try {
      await adminApi.deleteTourImage(imageId);
      toast.success("🗑️ Đã xóa ảnh!");
      await loadTourImages(editItem.id);
    } catch (err) {
      toast.error("❌ Lỗi xóa ảnh");
    }
  };

  const handleSave = async (id) => {
    try {
      await adminApi.updateTour(id, editItem);
      toast.success("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tour này?")) return;
    try {
      await adminApi.deleteTour(id);
      toast.success("🗑️ Đã xóa tour!");
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi xóa tour");
    }
  };

  const handleImageSelect = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>🌍 Quản lý Tour du lịch</h2>

      {/* ====== FORM 1: Thêm Tour ====== */}
      <form
        onSubmit={handleAddTour}
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: 900,
          background: "#fafafa",
        }}
      >
        <h3>➕ Thêm Tour mới</h3>

        <label>Mã tour:</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Tên tour:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: 8 }} />

        <label>Giá (VND):</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: "100%", padding: 8 }} />

        <label>Thời gian (ngày):</label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Địa điểm chính:</label>
        <select value={mainLocationId} onChange={(e) => setMainLocationId(e.target.value)} style={{ width: "100%", padding: 8 }}>
          <option value="">-- Chọn địa điểm --</option>
          {locations.map((loc) => (
            <option key={`loc-${loc.id}`} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        <label>Mô tả ngắn:</label>
        <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <h4 style={{ marginTop: 20 }}>🧑‍🏫 Hướng dẫn viên</h4>
        <select
          multiple
          value={selectedGuides}
          onChange={(e) => setSelectedGuides(Array.from(e.target.selectedOptions, (o) => o.value))}
          style={{ width: "100%", height: 100 }}
        >
          {employees.map((emp, index) => (
            <option key={`emp-${emp.id || index}`} value={emp.id}>
              {emp.full_name || "Chưa có tên"}
            </option>
          ))}
        </select>

        <h4 style={{ marginTop: 20 }}>🚍 Dịch vụ đi kèm</h4>
        <select
          multiple
          value={selectedServices}
          onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, (o) => o.value))}
          style={{ width: "100%", height: 100 }}
        >
          {services.map((sv) => (
            <option key={`sv-${sv.id}`} value={sv.id}>{sv.name} ({sv.type})</option>
          ))}
        </select>

        <label style={{ marginTop: 20 }}>Ảnh tour:</label>
        <input type="file" multiple onChange={handleImageSelect} style={{ width: "100%" }} />

        {images.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {images.map((img, i) => (
              <img key={i} src={URL.createObjectURL(img)} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }} />
            ))}
          </div>
        )}

        <button type="submit" style={{ marginTop: 15 }}>Thêm Tour</button>
      </form>

      {/* ====== FORM 2: Thêm Lịch ====== */}
      <form onSubmit={handleAddSchedule} style={{ marginBottom: 30, padding: 15, border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>📅 Thêm Lịch Khởi Hành</h3>

        <label>Chọn tour:</label>
        <select value={schTourId} onChange={(e) => setSchTourId(e.target.value)} style={{ width: "100%", padding: 8 }}>
          <option value="">-- Chọn tour --</option>
          {tours.map((t) => (
            <option key={`sch-${t.id}`} value={t.id}>{t.title}</option>
          ))}
        </select>

        <label>Ngày bắt đầu:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Ngày kết thúc:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Số ghế:</label>
        <input type="number" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Giá/người:</label>
        <input type="number" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <button type="submit" style={{ marginTop: 12 }}>Thêm lịch</button>
      </form>

      {/* ====== FORM 3: Thêm Lịch Trình ====== */}
      <form onSubmit={handleAddItinerary} style={{ marginBottom: 30, padding: 15, border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>🗺️ Thêm Lịch Trình Theo Ngày</h3>

        <label>Chọn tour:</label>
        <select value={itiTourId} onChange={(e) => setItiTourId(e.target.value)} style={{ width: "100%", padding: 8 }}>
          <option value="">-- Chọn tour --</option>
          {tours.map((t) => (
            <option key={`iti-${t.id}`} value={t.id}>{t.title}</option>
          ))}
        </select>

        <label>Ngày thứ:</label>
        <input type="number" value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Tiêu đề:</label>
        <input value={itiTitle} onChange={(e) => setItiTitle(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <label>Mô tả:</label>
        <textarea value={itiDesc} onChange={(e) => setItiDesc(e.target.value)} style={{ width: "100%", padding: 8 }} />

        <button type="submit" style={{ marginTop: 12 }}>Thêm lịch trình</button>
      </form>

      {/* ====== DANH SÁCH TOUR ====== */}
      <h2>Danh sách Tour</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", background: "white" }}>
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
          {tours.map((t) => {
            const isEditing = editItem?.id === t.id;
            const rowKey = isEditing ? `edit-${t.id}` : `view-${t.id}`;

            return isEditing ? (
              <tr key={rowKey}>
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
                    onChange={(e) => setEditItem({ ...editItem, duration_days: e.target.value })}
                  />
                </td>

                <td>
                  <select
                    value={editItem.main_location_id || ""}
                    onChange={(e) => setEditItem({ ...editItem, main_location_id: e.target.value })}
                  >
                    <option value="">-- Chọn --</option>
                    {locations.map((loc) => (
                      <option key={`loc-edit-${loc.id}`} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    value={editItem.short_description || ""}
                    onChange={(e) => setEditItem({ ...editItem, short_description: e.target.value })}
                  />
                </td>

                <td>
                  <div>
                    <input type="file" onChange={handleUploadEdit} style={{ marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {tourImages.map((img) => (
                        <div key={`tiimg-${img.id}`} style={{ position: "relative" }}>
                          <img
                            src={`http://localhost:8088/${img.img_url}`}
                            alt=""
                            style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }}
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
                  <button type="button" onClick={() => handleSave(t.id)} style={{ marginRight: 8 }}>
                    💾
                  </button>
                  <button type="button" onClick={() => setEditItem(null)}>❌</button>
                </td>
              </tr>
            ) : (
              <tr key={rowKey}>
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
                      alt="preview"
                      style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }}
                    />
                  ) : (
                    <span style={{ color: "#888" }}>Không có ảnh</span>
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
                  <button type="button" onClick={() => handleDelete(t.id)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
