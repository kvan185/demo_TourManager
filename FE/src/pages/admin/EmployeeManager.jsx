import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Paper,
} from "@mui/material";
import { toast } from "sonner";
import adminApi from "../../api/adminApi";

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);

  // --- Popup xem chi tiết / edit ---
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Popup thêm mới
  const [openAdd, setOpenAdd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedRole, setSelectedRole] = useState("");

  // --- Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- Tìm kiếm ---
  const [searchBasic, setSearchBasic] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const fetchData = async () => {
    try {
      const res = await adminApi.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải nhân viên:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await adminApi.getRoles();
      setRoles(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải roles:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  // --- Thêm ---
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addEmployee({
        full_name: fullName,
        email,
        phone,
        status,
        role_id: selectedRole,
      });
      toast.success("✅ Thêm nhân viên thành công!");
      setFullName(""); setEmail(""); setPhone(""); setStatus("active"); setSelectedRole("");
      setOpenAdd(false);
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm nhân viên"));
    }
  };

  // --- Xem chi tiết ---
  const openDetail = (emp) => {
    setSelectedEmp(emp);
    setIsEditing(false);
  };

  // --- Cập nhật ---
  const handleSave = async () => {
    if (!selectedEmp) return;
    try {
      await adminApi.updateEmployee(selectedEmp.id, {
        full_name: selectedEmp.full_name,
        email: selectedEmp.email,
        phone: selectedEmp.phone,
        status: selectedEmp.status,
        role_id: selectedEmp.role_id,
      });
      toast.success("✅ Cập nhật thành công!");
      setIsEditing(false);
      setSelectedEmp(null);
      fetchData();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      await adminApi.deleteEmployee(id);
      toast.success("🗑️ Đã xóa nhân viên!");
      fetchData();
    }
  };

  // --- Lọc nhân viên ---
  const filteredEmployees = employees.filter((e) => {
    const matchBasic =
      e.full_name.toLowerCase().includes(searchBasic.toLowerCase()) ||
      e.email.toLowerCase().includes(searchBasic.toLowerCase());
    const matchRole = searchRole ? e.role_id === searchRole : true;
    const matchStatus = searchStatus ? e.status === searchStatus : true;
    const matchPhone = searchPhone ? (e.phone || "").includes(searchPhone) : true;
    return matchBasic && matchRole && matchStatus && matchPhone;
  });

  // --- Phân trang logic ---
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  return (
    <Box sx={{ padding: 4, fontFamily: "Arial" }}>
      <Typography variant="h4" gutterBottom>Quản lý nhân viên</Typography>

      <Button variant="contained" sx={{ mb: 3 }} onClick={() => setOpenAdd(true)}>
        Thêm nhân viên mới
      </Button>

      {/* --- Tìm kiếm cơ bản + nâng cao --- */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Họ tên / Email"
          size="small"
          value={searchBasic}
          onChange={(e) => { setSearchBasic(e.target.value); setCurrentPage(1); }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={searchRole}
            onChange={(e) => { setSearchRole(e.target.value); setCurrentPage(1); }}
            label="Vai trò"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {roles.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={searchStatus}
            onChange={(e) => { setSearchStatus(e.target.value); setCurrentPage(1); }}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
            <MenuItem value="on_leave">Nghỉ phép</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Số điện thoại"
          size="small"
          value={searchPhone}
          onChange={(e) => { setSearchPhone(e.target.value); setCurrentPage(1); }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchBasic(""); setSearchRole(""); setSearchStatus(""); setSearchPhone(""); setCurrentPage(1);
          }}
        >
          🧹 Xóa lọc
        </Button>
      </Box>

      {/* --- Modal thêm nhân viên --- */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box component={Paper} sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: 400, p: 4, outline: "none", borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>➕ Thêm nhân viên</Typography>
          <Box component="form" onSubmit={handleAdd} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <FormControl fullWidth required>
              <InputLabel>Vai trò</InputLabel>
              <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} label="Vai trò">
                {roles.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Trạng thái">
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
                <MenuItem value="on_leave">Nghỉ phép</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={() => setOpenAdd(false)}>Hủy</Button>
              <Button type="submit" variant="contained">Thêm</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* --- Popup xem chi tiết / edit --- */}
      {selectedEmp && (
        <Modal open={Boolean(selectedEmp)} onClose={() => setSelectedEmp(null)}>
          <Box component={Paper} sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", width: 400, p: 4, outline: "none", borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "✏️ Cập nhật nhân viên" : "👁️ Xem chi tiết nhân viên"}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isEditing ? (
                <>
                  <TextField
                    label="Họ tên" value={selectedEmp.full_name}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, full_name: e.target.value })} fullWidth
                  />
                  <TextField
                    label="Email" type="email" value={selectedEmp.email}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, email: e.target.value })} fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      value={selectedEmp.role_id || ""}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, role_id: e.target.value })}
                    >
                      {roles.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Số điện thoại" value={selectedEmp.phone}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, phone: e.target.value })} fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={selectedEmp.status}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, status: e.target.value })}
                    >
                      <MenuItem value="active">Hoạt động</MenuItem>
                      <MenuItem value="inactive">Không hoạt động</MenuItem>
                      <MenuItem value="on_leave">Nghỉ phép</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Typography><strong>ID:</strong> {selectedEmp.id}</Typography>
                  <Typography><strong>Họ tên:</strong> {selectedEmp.full_name}</Typography>
                  <Typography><strong>Email:</strong> {selectedEmp.email}</Typography>
                  <Typography><strong>Vai trò:</strong> {selectedEmp.role_name || "—"}</Typography>
                  <Typography><strong>Điện thoại:</strong> {selectedEmp.phone}</Typography>
                  <Typography><strong>Trạng thái:</strong> {selectedEmp.status}</Typography>
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)}>Quay lại</Button>
                  <Button variant="contained" onClick={handleSave}>Lưu</Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setIsEditing(true)}>Cập nhật</Button>
              )}
            </Box>
          </Box>
        </Modal>
      )}

      {/* --- Bảng danh sách --- */}
      <Paper sx={{ overflowX: "auto", mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEmployees.map((e) => {
              if (!e) return null;
              const id = e.employee_id || e.id;
              return (
                <TableRow key={id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{e.full_name}</TableCell>
                  <TableCell>{e.role_name || "—"}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>{e.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDetail(e)}>👁️ Xem</Button>
                    <Button color="error" onClick={() => handleDelete(id)}>🗑️</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* --- Phân trang --- */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
        <Button
          disabled={currentPage === 1}
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          ◀️ Prev
        </Button>
        <Typography>Trang {currentPage} / {totalPages}</Typography>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next ▶️
        </Button>
      </Box>
    </Box>
  );
}
