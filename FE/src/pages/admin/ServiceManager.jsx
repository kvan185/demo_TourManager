import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [serviceImages, setServiceImages] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [images, setImages] = useState([]);

  // Form thêm mới
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  // Phân trang FE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);

  // Tìm kiếm cơ bản + nâng cao
  const [searchBasic, setSearchBasic] = useState(""); // tên / nhà cung cấp
  const [searchType, setSearchType] = useState("");
  const [searchMinPrice, setSearchMinPrice] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  const typeMap = {
    hotel: "Khách sạn",
    flight: "Máy bay",
    bus: "Xe khách",
    car: "Xe thuê",
    restaurant: "Nhà hàng",
    ticket: "Vé",
    other: "Khác",
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return parseFloat(value).toLocaleString("vi-VN") + "₫";
  };

  const fetchServices = async () => {
    try {
      const res = await adminApi.getServices();
      setServices(res.data || []);
    } catch (err) {
      toast.error("❌ Lỗi tải danh sách dịch vụ");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.addService({ type, name, provider, details, price });
      const serviceId = res.data.id;
      if (images.length > 0) {
        for (let img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await adminApi.uploadServiceImage(serviceId, formData);
        }
      }
      toast.success("✅ Thêm dịch vụ thành công!");
      setType(""); setName(""); setProvider(""); setDetails(""); setPrice(""); setImages([]);
      setOpenAddDialog(false);
      setPage(1);
      fetchServices();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm dịch vụ"));
    }
  };

  const handleImageSelect = (e) => setImages([...e.target.files]);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      await adminApi.deleteService(id);
      toast.success("🗑️ Đã xóa dịch vụ!");
      fetchServices();
    }
  };

  const handleView = async (s) => {
    setSelectedItem({ ...s });
    setIsEditing(false);
    try {
      const res = await adminApi.getServiceImages(s.id);
      setServiceImages(Array.isArray(res.data) ? res.data : []);
    } catch {
      setServiceImages([]);
    }
  };

  const handleUploadEdit = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedItem) return;
    const formData = new FormData();
    formData.append("image", file);
    await adminApi.uploadServiceImage(selectedItem.id, formData);
    toast.success("✅ Upload ảnh thành công!");
    const res = await adminApi.getServiceImages(selectedItem.id);
    setServiceImages(Array.isArray(res.data) ? res.data : []);
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Xóa ảnh này?")) {
      await adminApi.deleteServiceImage(imageId);
      toast.success("🗑️ Đã xóa ảnh!");
      const res = await adminApi.getServiceImages(selectedItem.id);
      setServiceImages(Array.isArray(res.data) ? res.data : []);
    }
  };

  const handleSave = async () => {
    try {
      await adminApi.updateService(selectedItem.id, selectedItem);
      toast.success("✅ Cập nhật thành công!");
      setIsEditing(false);
      fetchServices();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  // Lọc dịch vụ theo tìm kiếm
  const filteredServices = services.filter(s => {
    const basicMatch = s.name.toLowerCase().includes(searchBasic.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchBasic.toLowerCase());

    const typeMatch = searchType ? s.type === searchType : true;

    const priceMatch =
      (!searchMinPrice || parseFloat(s.price) >= parseFloat(searchMinPrice)) &&
      (!searchMaxPrice || parseFloat(s.price) <= parseFloat(searchMaxPrice));

    return basicMatch && typeMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredServices.length / limit);
  const currentServices = filteredServices.slice((page - 1) * limit, page * limit);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <Typography variant="h4" gutterBottom>Quản lý Dịch vụ</Typography>

      {/* --- TÌM KIẾM --- */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
        <TextField
          label="Tên / Nhà cung cấp"
          size="small"
          value={searchBasic}
          onChange={(e) => { setSearchBasic(e.target.value); setPage(1); }}
        />
        <FormControl size="small" style={{ minWidth: 120 }}>
          <InputLabel>Loại</InputLabel>
          <Select
            value={searchType}
            onChange={(e) => { setSearchType(e.target.value); setPage(1); }}
            label="Loại"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(typeMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Giá từ (VND)"
          size="small"
          type="number"
          value={searchMinPrice}
          onChange={(e) => { setSearchMinPrice(e.target.value); setPage(1); }}
        />
        <TextField
          label="Đến (VND)"
          size="small"
          type="number"
          value={searchMaxPrice}
          onChange={(e) => { setSearchMaxPrice(e.target.value); setPage(1); }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchBasic(""); setSearchType(""); setSearchMinPrice(""); setSearchMaxPrice(""); setPage(1);
          }}
        >🧹 Xóa lọc</Button>
        <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)}>➕ Thêm Dịch vụ</Button>
      </div>

      {/* --- Bảng dịch vụ --- */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", background: "white" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Tên dịch vụ</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentServices.map(s => (
            <tr key={s.id} style={{ background: "#fdfdfd" }}>
              <td>{s.id}</td>
              <td>{typeMap[s.type] || s.type}</td>
              <td>{s.name}</td>
              <td>{formatPrice(s.price)}</td>
              <td>
                <Button variant="outlined" size="small" onClick={() => handleView(s)}>👁️ Xem</Button>
                <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(s.id)}>🗑️ Xóa</Button>
              </td>
            </tr>
          ))}
          {currentServices.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "red" }}>Không có dịch vụ nào phù hợp</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Phân trang --- */}
      <div style={{ marginTop: 10 }}>
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>⏮️ Trước</Button>
        <span style={{ margin: "0 10px" }}>Trang {page} / {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>⏭️ Tiếp</Button>
      </div>

      {/* --- Dialog Thêm / Xem / Edit --- */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Thêm Dịch vụ mới</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            margin="dense"
            value={type}
            onChange={(e) => setType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Chọn loại dịch vụ</MenuItem>
            {Object.entries(typeMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
          <TextField label="Tên dịch vụ" fullWidth margin="dense" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Nhà cung cấp" fullWidth margin="dense" value={provider} onChange={(e) => setProvider(e.target.value)} />
          <TextField label="Chi tiết" fullWidth margin="dense" multiline minRows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
          <TextField label="Giá (VND)" fullWidth margin="dense" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="file" multiple onChange={handleImageSelect} style={{ marginTop: 10 }} />
          {images.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              {Array.from(images).map((img, i) => <img key={i} src={URL.createObjectURL(img)} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }} />)}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Thêm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedItem} onClose={() => { setSelectedItem(null); setIsEditing(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "✏️ Chỉnh sửa dịch vụ" : "👁️ Xem chi tiết dịch vụ"}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Select
                fullWidth
                margin="dense"
                value={selectedItem.type || ""}
                disabled={!isEditing}
                onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}
              >
                {Object.entries(typeMap).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
              <TextField
                label="Tên dịch vụ"
                fullWidth
                margin="dense"
                value={selectedItem.name || ""}
                disabled={!isEditing}
                onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              />
              <TextField
                label="Nhà cung cấp"
                fullWidth
                margin="dense"
                value={selectedItem.provider || ""}
                disabled={!isEditing}
                onChange={(e) => setSelectedItem({ ...selectedItem, provider: e.target.value })}
              />
              <TextField
                label="Chi tiết"
                fullWidth
                margin="dense"
                multiline
                minRows={3}
                value={selectedItem.details || ""}
                disabled={!isEditing}
                onChange={(e) => setSelectedItem({ ...selectedItem, details: e.target.value })}
              />
              <TextField
                label="Giá (VND)"
                fullWidth
                margin="dense"
                type="number"
                value={selectedItem.price || ""}
                disabled={!isEditing}
                onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
              />
              {isEditing && (
                <>
                  <input type="file" onChange={handleUploadEdit} style={{ marginTop: 10 }} />
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
                    {serviceImages.map(img => (
                      <div key={img.id} style={{ position: "relative" }}>
                        <img src={`http://localhost:8088/${img.img_url}`} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 5 }} />
                        <button onClick={() => handleDeleteImage(img.id)} style={{ position: "absolute", top: 0, right: 0, background: "rgba(255,0,0,0.7)", border: "none", color: "white", borderRadius: "50%", cursor: "pointer" }}>✖</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>✏️ Cập nhật</Button>}
          {isEditing && <Button variant="contained" color="primary" onClick={handleSave}>💾 Lưu</Button>}
          <Button onClick={() => { setSelectedItem(null); setIsEditing(false); }}>↩️ Quay lại</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
