import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
} from "@mui/material";

export default function RolePermissionList() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePerms, setRolePerms] = useState([]);
  const [editParent, setEditParent] = useState(null);
  const [childPerms, setChildPerms] = useState([]);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  // === FETCH DATA ===
  const fetchAll = async () => {
    const [resRoles, resPerms] = await Promise.all([
      adminApi.getRoles(),
      adminApi.getPermissions(),
    ]);
    setRoles(resRoles.data);
    setPermissions(resPerms.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchRolePerms = async (roleId) => {
    const res = await adminApi.getPermissionsByRole(roleId);
    setRolePerms(res.data.map((p) => p.id));
    setSelectedRole(roleId);
  };

  // === CRUD ROLES ===
  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addRole(newRole);
      toast.success("Thêm vai trò thành công!");
      setNewRole({ name: "", description: "" });
      setShowAddRoleDialog(false);
      fetchAll();
    } catch {
      toast.error("Lỗi khi thêm vai trò!");
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("Xóa vai trò này?")) {
      await adminApi.deleteRole(id);
      toast.success("Đã xóa vai trò!");
      fetchAll();
    }
  };

  // === GROUP PERMISSIONS ===
  const groupedPerms = permissions.reduce((acc, p) => {
    const [parent, child] = p.name.split(".");
    if (!acc[parent]) acc[parent] = [];
    if (child) acc[parent].push(p);
    return acc;
  }, {});

  // === OPEN PANELS ===
  const openChildPanel = (parentName) => {
    setEditParent(parentName);
    setChildPerms(groupedPerms[parentName] || []);
  };

  const closeAllPanels = () => {
    setEditParent(null);
    setSelectedRole(null);
    setShowAddRoleDialog(false);
  };

  const handleSaveRolePerms = async () => {
    try {
      await adminApi.updateRolePermissions(selectedRole, rolePerms);
      toast.success("Cập nhật quyền thành công!");
      closeAllPanels();
    } catch {
      toast.error("Lỗi khi cập nhật quyền!");
    }
  };

  const handleTogglePerm = (pid) => {
    setRolePerms((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-6xl mx-auto">
      <Typography variant="h4" gutterBottom color="primary">
        🧩 Quản lý Vai trò & Quyền hệ thống
      </Typography>

      {/* === ROLE LIST === */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            📘 Danh sách Vai trò
            <Button size="small" onClick={() => setShowAddRoleDialog(true)}>
              ➕ Thêm vai trò
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Mô tả</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.id}</td>
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.description}</td>
                  <td className="p-2 border space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => fetchRolePerms(r.id)}
                    >
                      ⚙️ Quyền
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteRole(r.id)}
                    >
                      🗑️ Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* === PARENT PERMISSIONS === */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>🔐 Danh sách Quyền hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Tên quyền cha</th>
                <th className="p-2 border">Số quyền con</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedPerms).map(([parent, childs], i) => (
                <tr key={parent} className="hover:bg-gray-50">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border font-semibold">{parent}</td>
                  <td className="p-2 border">{childs.length}</td>
                  <td className="p-2 border">
                    <Button size="small" onClick={() => openChildPanel(parent)}>
                      ✏️ Chỉnh sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* === POPUP DIALOG === */}
      {/* Thêm vai trò */}
      <Dialog open={showAddRoleDialog} onClose={closeAllPanels} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddRole}>
          <DialogTitle>➕ Thêm vai trò mới</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên vai trò"
              fullWidth
              margin="normal"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              required
            />
            <TextField
              label="Mô tả"
              fullWidth
              margin="normal"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">💾 Thêm</Button>
            <Button variant="outlined" onClick={closeAllPanels}>
              ✖ Đóng
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ROLE PERMISSIONS */}
      <Dialog open={!!selectedRole} onClose={closeAllPanels} maxWidth="md" fullWidth>
        <DialogTitle>⚙️ Gán quyền cho Vai trò ID: {selectedRole}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {permissions.map((p) => (
              <Grid item xs={6} key={p.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rolePerms.includes(p.id)}
                      onChange={() => handleTogglePerm(p.id)}
                    />
                  }
                  label={p.name}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveRolePerms}>💾 Lưu</Button>
          <Button variant="outlined" onClick={closeAllPanels}>
            ✖ Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* CHILD PERMISSIONS */}
      <Dialog open={!!editParent} onClose={closeAllPanels} maxWidth="sm" fullWidth>
        <DialogTitle>✏️ Quyền con của {editParent}</DialogTitle>
        <DialogContent dividers>
          {childPerms.map((c) => (
            <div key={c.id} className="flex justify-between items-center border p-2 rounded mb-2">
              <span>{c.name}</span>
              <span className="text-gray-500 text-sm">{c.description}</span>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeAllPanels}>
            ✖ Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
