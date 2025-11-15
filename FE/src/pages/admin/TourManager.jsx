import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";

export default function TourManager() {
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [images, setImages] = useState([]);
  const [tourImages, setTourImages] = useState([]);

  // ===== Dialog Open =====
  const [openTour, setOpenTour] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openItinerary, setOpenItinerary] = useState(false);

  // ===== Tour Form =====
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(1);
  const [mainLocationId, setMainLocationId] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // ===== Schedule Form =====
  const [schTourId, setSchTourId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [seatsTotal, setSeatsTotal] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");

  // ===== Itinerary Form =====
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

  // ------------------ HANDLE ADD ------------------
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

      const tourId = res.data?.tour?.id;
      if (!tourId) return toast.error("Không lấy được ID tour mới");

      if (images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadTourImage(tourId, formData);
        }
      }

      for (const g of selectedGuides) await adminApi.addTourGuide(tourId, { employee_id: g });
      for (const s of selectedServices) await adminApi.addTourService(tourId, { service_id: s });

      toast.success("✅ Thêm tour thành công!");
      setOpenTour(false);
      setCode(""); setTitle(""); setPrice(""); setDuration(1);
      setShortDesc(""); setImages([]); setSelectedGuides([]); setSelectedServices([]);
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm tour"));
    }
  };

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
      setOpenSchedule(false);
      setStartDate(""); setEndDate(""); setSeatsTotal(""); setPricePerPerson("");
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi thêm lịch");
    }
  };

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
      setOpenItinerary(false);
      setDayNumber(1); setItiTitle(""); setItiDesc("");
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi thêm lịch trình");
    }
  };

  // ------------------ UPLOAD & DELETE IMAGES ------------------
  const loadTourImages = async (tourId) => {
    try {
      const res = await adminApi.getTourImages(tourId);
      setTourImages(res.data || []);
    } catch (err) {
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
    } catch {
      toast.error("❌ Lỗi upload ảnh");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    try {
      await adminApi.deleteTourImage(imageId);
      toast.success("🗑️ Đã xóa ảnh!");
      await loadTourImages(editItem.id);
    } catch {
      toast.error("❌ Lỗi xóa ảnh");
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div style={{ padding: 30 }}>
      <h2>Quản lý Tour du lịch</h2>

      {/* Button mở Dialog */}
      <div style={{ marginBottom: 20 }}>
        <Button variant="contained" onClick={() => setOpenTour(true)} style={{ marginRight: 10 }}>➕ Thêm Tour</Button>
        <Button variant="contained" onClick={() => setOpenSchedule(true)} style={{ marginRight: 10}}>📅 Thêm Lịch</Button>
        <Button variant="contained" onClick={() => setOpenItinerary(true)}>🗺️ Thêm Lịch Trình</Button>
      </div>

      {/* ===== DIALOG Thêm Tour ===== */}
      <Dialog open={openTour} onClose={() => setOpenTour(false)} fullWidth maxWidth="sm">
        <DialogTitle>Thêm Tour mới</DialogTitle>
        <DialogContent>
          <TextField label="Mã tour" fullWidth margin="dense" value={code} onChange={(e) => setCode(e.target.value)} />
          <TextField label="Tên tour" fullWidth margin="dense" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Giá (VND)" type="number" fullWidth margin="dense" value={price} onChange={(e) => setPrice(e.target.value)} />
          <TextField label="Thời gian (ngày)" type="number" fullWidth margin="dense" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Địa điểm chính</InputLabel>
            <Select value={mainLocationId} onChange={(e) => setMainLocationId(e.target.value)} label="Địa điểm chính">
              <MenuItem value="">-- Chọn --</MenuItem>
              {locations.map((loc) => <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Mô tả ngắn" fullWidth multiline margin="dense" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTour(false)}>Hủy</Button>
          <Button onClick={handleAddTour}>Thêm Tour</Button>
        </DialogActions>
      </Dialog>

      {/* ===== DIALOG Thêm Lịch ===== */}
      <Dialog open={openSchedule} onClose={() => setOpenSchedule(false)} fullWidth maxWidth="sm">
        <DialogTitle>📅 Thêm Lịch Khởi Hành</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Chọn tour</InputLabel>
            <Select value={schTourId} onChange={(e) => setSchTourId(e.target.value)} label="Chọn tour">
              <MenuItem value="">-- Chọn tour --</MenuItem>
              {tours.map((t) => <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Ngày bắt đầu" type="date" fullWidth margin="dense" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Ngày kết thúc" type="date" fullWidth margin="dense" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Số ghế" type="number" fullWidth margin="dense" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} />
          <TextField label="Giá/người" type="number" fullWidth margin="dense" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSchedule(false)}>Hủy</Button>
          <Button onClick={handleAddSchedule}>Thêm Lịch</Button>
        </DialogActions>
      </Dialog>

      {/* ===== DIALOG Thêm Lịch Trình ===== */}
      <Dialog open={openItinerary} onClose={() => setOpenItinerary(false)} fullWidth maxWidth="sm">
        <DialogTitle>🗺️ Thêm Lịch Trình Theo Ngày</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Chọn tour</InputLabel>
            <Select value={itiTourId} onChange={(e) => setItiTourId(e.target.value)} label="Chọn tour">
              <MenuItem value="">-- Chọn tour --</MenuItem>
              {tours.map((t) => <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Ngày thứ" type="number" fullWidth margin="dense" value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
          <TextField label="Tiêu đề" fullWidth margin="dense" value={itiTitle} onChange={(e) => setItiTitle(e.target.value)} />
          <TextField label="Mô tả" fullWidth multiline margin="dense" value={itiDesc} onChange={(e) => setItiDesc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItinerary(false)}>Hủy</Button>
          <Button onClick={handleAddItinerary}>Thêm Lịch Trình</Button>
        </DialogActions>
      </Dialog>

      {/* ====== DANH SÁCH TOUR ====== */}
      <h2>Danh sách Tour</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", background: "white" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th><th>Mã</th><th>Tên Tour</th><th>Giá</th><th>Thời gian</th><th>Địa điểm chính</th><th>Mô tả</th><th>Ảnh</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((t) => {
            const isEditing = editItem?.id === t.id;
            const rowKey = isEditing ? `edit-${t.id}` : `view-${t.id}`;
            return (
              <tr key={rowKey}>
                <td>{t.id}</td>
                <td>{t.code}</td>
                <td>{t.title}</td>
                <td>{t.price}</td>
                <td>{t.duration_days}</td>
                <td>{locations.find((l) => l.id === t.main_location_id)?.name || "—"}</td>
                <td>{t.short_description}</td>
                <td>{t.preview_image ? <img src={`http://localhost:8088/${t.preview_image}`} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }} /> : "Không có ảnh"}</td>
                <td>
                  <Button variant="outlined" size="small" onClick={async () => { setEditItem(t); await loadTourImages(t.id); }}>✏️</Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => { if(window.confirm("Bạn có chắc muốn xóa tour này?")) adminApi.deleteTour(t.id).then(fetchData); }}>🗑️</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
