import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState("");

  // Form thêm mới
  const [type, setType] = useState("hotel");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  // Lấy danh sách
  const fetchData = async () => {
    const res = await adminApi.getServices();
    setServices(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addService({ type, name, provider, details, price });
      setMessage("✅ Thêm dịch vụ thành công!");
      setName(""); setProvider(""); setDetails(""); setPrice("");
      fetchData();
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm"));
    }
  };

  // Xử lý cập nhật
  const handleSave = async (id) => {
    try {
      await adminApi.updateService(id, editItem);
      setMessage("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi cập nhật!");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      await adminApi.deleteService(id);
      fetchData();
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>Hi</h2>
        
      </div>
    </div>
  );
}
