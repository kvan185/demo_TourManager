import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function RolePermissionList() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePerms, setRolePerms] = useState([]);
  const [editParent, setEditParent] = useState(null);
  const [childPerms, setChildPerms] = useState([]);
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

  // === POPUP ANIMATION ===
  const popupMotion = {
    initial: { y: 30, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 30, opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center gap-2">
          🧩 Quản lý Vai trò & Quyền hệ thống
        </h2>

        {/* === ROLE LIST === */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              📘 Danh sách Vai trò
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRole} className="flex gap-2 mb-4">
              <Input
                placeholder="Tên vai trò"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                required
              />
              <Input
                placeholder="Mô tả"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
              />
              <Button type="submit">➕ Thêm</Button>
            </form>

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
                      <Button variant="outline" size="sm" onClick={() => fetchRolePerms(r.id)}>
                        ⚙️ Quyền
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(r.id)}>
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
                      <Button size="sm" onClick={() => openChildPanel(parent)}>
                        ✏️ Chỉnh sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>

      {/* === POPUPS === */}
      <AnimatePresence>
        {(selectedRole || editParent) && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto"
              {...popupMotion}
            >
              {/* === ROLE PERMISSIONS === */}
              {selectedRole && (
                <>
                  <h3 className="text-xl font-bold mb-4 text-blue-700">
                    ⚙️ Gán quyền cho Vai trò ID: {selectedRole}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((p) => (
                      <label key={p.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={rolePerms.includes(p.id)}
                          onCheckedChange={() => handleTogglePerm(p.id)}
                        />
                        <span>{p.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6 gap-3">
                    <Button onClick={handleSaveRolePerms}>💾 Lưu</Button>
                    <Button variant="outline" onClick={closeAllPanels}>
                      ✖ Đóng
                    </Button>
                  </div>
                </>
              )}

              {/* === CHILD PERMISSIONS === */}
              {editParent && (
                <>
                  <h3 className="text-xl font-bold mb-4 text-green-700">
                    ✏️ Quyền con của <b>{editParent}</b>
                  </h3>
                  <div className="space-y-2">
                    {childPerms.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center border p-2 rounded hover:bg-gray-50 transition"
                      >
                        <span>{c.name}</span>
                        <span className="text-gray-500 text-sm">{c.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button variant="outline" onClick={closeAllPanels}>
                      ✖ Đóng
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
