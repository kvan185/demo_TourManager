import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// --- map loại nếu có ---
const translateType = (type) => {
  switch (type) {
    case "food":
      return "Thức ăn";
    case "drink":
      return "Đồ uống";
    case "other":
      return "Khác";
    default:
      return type || "";
  }
};

// --- format giá ---
const formatPrice = (price) => {
  if (!price && price !== 0) return "—";
  return Number(price).toLocaleString("vi-VN");
};

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");

  // --- Popup xem chi tiết / edit ---
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form thêm mới
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("other");
  const [price, setPrice] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // --- Phân trang ---
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // --- TÌM KIẾM ---
  const [searchBasic, setSearchBasic] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");

  // --- Lấy dữ liệu ---
  const fetchData = async () => {
    try {
      const res = await adminApi.getLocations();
      setLocations(res.data || []);
    } catch (err) {
      setMessage("❌ Lỗi tải dữ liệu: " + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Thêm ---
  const handleAdd = async () => {
    try {
      await adminApi.addLocation({ name, country, region, description, type, price });
      setMessage("✅ Thêm địa điểm thành công!");
      setName(""); setCountry("Việt Nam"); setRegion(""); setDescription(""); setType("other"); setPrice("");
      setOpenAddDialog(false);
      fetchData();
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm"));
    }
  };

  // --- Cập nhật ---
  const handleSave = async () => {
    try {
      await adminApi.updateLocation(selectedLoc.id, selectedLoc);
      setMessage("✅ Cập nhật thành công!");
      setIsEditing(false);
      setOpenDetailDialog(false);
      setSelectedLoc(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi cập nhật!");
    }
  };

  // --- Xóa ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
      await adminApi.deleteLocation(id);
      fetchData();
    }
  };

  // --- Mở popup chi tiết ---
  const openDetail = (loc) => {
    setSelectedLoc(loc);
    setIsEditing(false);
    setOpenDetailDialog(true);
  };

  // --- Lọc dữ liệu theo tìm kiếm ---
  const filteredLocations = locations.filter((loc) => {
    const matchBasic = loc.name.toLowerCase().includes(searchBasic.toLowerCase()) ||
                       (loc.country || "").toLowerCase().includes(searchBasic.toLowerCase()) ||
                       (loc.region || "").toLowerCase().includes(searchBasic.toLowerCase());
    const matchType = searchType ? loc.type === searchType : true;
    const matchPriceMin = searchPriceMin ? Number(loc.price) >= Number(searchPriceMin) : true;
    const matchPriceMax = searchPriceMax ? Number(loc.price) <= Number(searchPriceMax) : true;
    return matchBasic && matchType && matchPriceMin && matchPriceMax;
  });

  // --- Phân trang dữ liệu hiển thị ---
  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Quản lý địa điểm</h2>
      {message && <p>{message}</p>}

      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenAddDialog(true)}
        style={{ marginBottom: "20px" }}
      >
        Thêm địa điểm mới
      </Button>

      {/* --- Tìm kiếm cơ bản + nâng cao --- */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 15 }}>
        <TextField
          label="Tìm kiếm Tên/Quốc gia/Vùng"
          value={searchBasic}
          onChange={(e) => { setSearchBasic(e.target.value); setCurrentPage(1); }}
          size="small"
        />
        <FormControl size="small" style={{ minWidth: 120 }}>
          <InputLabel>Loại</InputLabel>
          <Select
            value={searchType}
            onChange={(e) => { setSearchType(e.target.value); setCurrentPage(1); }}
            label="Loại"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="food">Thức ăn</MenuItem>
            <MenuItem value="drink">Đồ uống</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Giá min"
          value={searchPriceMin}
          onChange={(e) => { setSearchPriceMin(e.target.value); setCurrentPage(1); }}
          size="small"
          type="number"
        />
        <TextField
          label="Giá max"
          value={searchPriceMax}
          onChange={(e) => { setSearchPriceMax(e.target.value); setCurrentPage(1); }}
          size="small"
          type="number"
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchBasic(""); setSearchType(""); setSearchPriceMin(""); setSearchPriceMax(""); setCurrentPage(1);
          }}
        >
          🧹 Xóa lọc
        </Button>
      </div>

      {/* --- Bảng danh sách --- */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", background: "white" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vùng</th>
            <th>Quốc gia</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentLocations.map((loc) => (
            <tr key={loc.id}>
              <td>{loc.id}</td>
              <td>{loc.name}</td>
              <td>{loc.region}</td>
              <td>{loc.country}</td>
              <td>{translateType(loc.type)}</td>
              <td>{formatPrice(loc.price)}</td>
              <td>
                <Button onClick={() => openDetail(loc)}>👁️ Xem</Button>
                <Button color="error" onClick={() => handleDelete(loc.id)}>🗑️ Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Pagination --- */}
      <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: 10 }}>
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅️ Trước
        </Button>
        <Typography>Trang {currentPage} / {totalPages || 1}</Typography>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Sau ➡️
        </Button>
      </div>

      {/* --- Popup thêm mới --- */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>➕ Thêm địa điểm mới</DialogTitle>
        <DialogContent>
          <TextField label="Tên địa điểm" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="dense" />
          <TextField label="Quốc gia" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth margin="dense" />
          <TextField label="Vùng" value={region} onChange={(e) => setRegion(e.target.value)} fullWidth margin="dense" />
          <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="dense" multiline rows={3} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="food">Thức ăn</MenuItem>
              <MenuItem value="drink">Đồ uống</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Giá" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth margin="dense" type="number"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleAdd}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* --- Popup xem chi tiết / edit --- */}
      {selectedLoc && (
        <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{isEditing ? "✏️ Cập nhật địa điểm" : "👁️ Xem chi tiết địa điểm"}</DialogTitle>
          <DialogContent dividers>
            {isEditing ? (
              <>
                <TextField
                  label="Tên địa điểm"
                  value={selectedLoc.name}
                  onChange={(e) => setSelectedLoc({ ...selectedLoc, name: e.target.value })}
                  fullWidth margin="dense"
                />
                <TextField
                  label="Quốc gia"
                  value={selectedLoc.country || ""}
                  onChange={(e) => setSelectedLoc({ ...selectedLoc, country: e.target.value })}
                  fullWidth margin="dense"
                />
                <TextField
                  label="Vùng"
                  value={selectedLoc.region || ""}
                  onChange={(e) => setSelectedLoc({ ...selectedLoc, region: e.target.value })}
                  fullWidth margin="dense"
                />
                <TextField
                  label="Mô tả"
                  value={selectedLoc.description || ""}
                  onChange={(e) => setSelectedLoc({ ...selectedLoc, description: e.target.value })}
                  fullWidth margin="dense"
                  multiline rows={3}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={selectedLoc.type || "other"}
                    onChange={(e) => setSelectedLoc({ ...selectedLoc, type: e.target.value })}
                  >
                    <MenuItem value="food">Thức ăn</MenuItem>
                    <MenuItem value="drink">Đồ uống</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Giá"
                  value={selectedLoc.price || ""}
                  onChange={(e) => setSelectedLoc({ ...selectedLoc, price: e.target.value })}
                  fullWidth margin="dense"
                  type="number"
                />
              </>
            ) : (
              <>
                <Typography><strong>ID:</strong> {selectedLoc.id}</Typography>
                <Typography><strong>Tên:</strong> {selectedLoc.name}</Typography>
                <Typography><strong>Quốc gia:</strong> {selectedLoc.country}</Typography>
                <Typography><strong>Vùng:</strong> {selectedLoc.region}</Typography>
                <Typography><strong>Mô tả:</strong> {selectedLoc.description}</Typography>
                <Typography><strong>Loại:</strong> {translateType(selectedLoc.type)}</Typography>
                <Typography><strong>Giá:</strong> {formatPrice(selectedLoc.price)}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Quay lại</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>Cập nhật</Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
