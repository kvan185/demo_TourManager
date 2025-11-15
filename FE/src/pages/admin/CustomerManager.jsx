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
  Typography,
} from "@mui/material";

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Form dữ liệu
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "other",
    address: "",
    note: "",
  });

  // --- Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- Tìm kiếm ---
  const [searchBasic, setSearchBasic] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  // --- Lấy danh sách khách hàng ---
  const fetchData = async () => {
    try {
      const res = await adminApi.getCustomers();
      setCustomers(res.data || []);
      if (currentPage > Math.ceil((res.data?.length || 0) / itemsPerPage)) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("❌ Lỗi tải khách hàng:", err);
      toast.error("❌ Lỗi tải danh sách khách hàng!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Hiển thị giới tính ---
  const displayGender = (g) => {
    if (!g) return "Khác";
    const lower = g.toLowerCase();
    if (lower === "male") return "Nam";
    if (lower === "female") return "Nữ";
    return "Khác";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Lọc khách hàng ---
  const filteredCustomers = customers.filter((c) => {
    const matchBasic =
      c.full_name.toLowerCase().includes(searchBasic.toLowerCase()) ||
      c.email.toLowerCase().includes(searchBasic.toLowerCase());

    const matchGender = searchGender ? c.gender === searchGender : true;
    const matchPhone = searchPhone ? (c.phone || "").includes(searchPhone) : true;
    const matchAddress = searchAddress
      ? (c.address || "").toLowerCase().includes(searchAddress.toLowerCase())
      : true;

    return matchBasic && matchGender && matchPhone && matchAddress;
  });

  // --- Phân trang ---
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIdx, startIdx + itemsPerPage);

  // --- Xử lý thêm / sửa ---
  const openAddDialog = () => {
    setFormData({ full_name: "", email: "", phone: "", gender: "other", address: "", note: "" });
    setSelectedCustomer(null);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const openEditDialog = (customer) => {
    setFormData({ ...customer });
    setSelectedCustomer(customer);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("⚠️ Họ tên và email không được để trống!");
      return;
    }
    try {
      if (selectedCustomer) {
        // Cập nhật
        await adminApi.updateCustomer(selectedCustomer.id, formData);
        toast.success("✅ Cập nhật khách hàng thành công!");
      } else {
        // Thêm mới
        await adminApi.addCustomer(formData);
        toast.success("✅ Thêm khách hàng thành công!");
      }
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể lưu khách hàng"));
    }
  };

  // --- Xóa ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      try {
        await adminApi.deleteCustomer(id);
        toast.success("🗑️ Đã xóa khách hàng!");
        fetchData();
      } catch (err) {
        toast.error("❌ Xóa thất bại!");
      }
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Quản lý khách hàng</h2>

      <Button variant="contained" color="success" style={{ marginBottom: 20 }} onClick={openAddDialog}>
        Thêm khách hàng mới
      </Button>

      {/* --- Tìm kiếm --- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap" }}>
        <TextField
          label="Tìm kiếm Họ tên / Email"
          value={searchBasic}
          onChange={(e) => {
            setSearchBasic(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Giới tính</InputLabel>
          <Select
            value={searchGender}
            onChange={(e) => {
              setSearchGender(e.target.value);
              setCurrentPage(1);
            }}
            label="Giới tính"
            style={{ width: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Điện thoại"
          value={searchPhone}
          onChange={(e) => {
            setSearchPhone(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
        />
        <TextField
          label="Địa chỉ"
          value={searchAddress}
          onChange={(e) => {
            setSearchAddress(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchBasic("");
            setSearchGender("");
            setSearchPhone("");
            setSearchAddress("");
            setCurrentPage(1);
          }}
        >
          🧹 Xóa lọc
        </Button>
      </div>

      {/* --- Bảng --- */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", background: "white" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Giới tính</th>
            <th>Địa chỉ</th>
            <th>Ghi chú</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            currentCustomers.map((c) => {
              const id = c.customer_id || c.id;
              return (
                <tr key={`customer-${id}`}>
                  <td>{id}</td>
                  <td>{c.email}</td>
                  <td>{c.full_name}</td>
                  <td>{c.phone}</td>
                  <td>{displayGender(c.gender)}</td>
                  <td>{c.address}</td>
                  <td>{c.note}</td>
                  <td>{formatDate(c.created_at)}</td>
                  <td>
                    <Button onClick={() => openEditDialog(c)} variant="outlined">
                      👁️ / ✏️
                    </Button>
                    <Button color="error" onClick={() => handleDelete(id)}>
                      🗑️
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* --- Phân trang --- */}
      <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: 10 }}>
        <Button disabled={currentPage === 1} variant="outlined" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          ◀️ Prev
        </Button>
        <Typography>
          Trang {currentPage} / {totalPages || 1}
        </Typography>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next ▶️
        </Button>
      </div>

      {/* --- Dialog Thêm / Sửa --- */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedCustomer ? "✏️ Cập nhật khách hàng" : "➕ Thêm khách hàng mới"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Họ tên"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Giới tính</InputLabel>
            <Select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Ghi chú"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            fullWidth
            margin="dense"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
