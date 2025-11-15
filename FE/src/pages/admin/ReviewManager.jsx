import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import adminApi from "../../api/adminApi";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    tour_id: "",
    guide_id: "",
    user_id: "",
    rating: "",
    comment: "",
    status: "pending",
  });

  // --- Phân trang FE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số dòng hiển thị mỗi trang
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Lấy danh sách ---
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReviews();
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi lấy danh sách reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- Thêm / mở popup ---
  const handleOpenAddDialog = () => {
    setForm({
      tour_id: "",
      guide_id: "",
      user_id: "",
      rating: "",
      comment: "",
      status: "pending",
    });
    setOpenAddDialog(true);
    setSelectedReview(null);
    setIsEditing(false);
  };

  const handleOpenDetail = (review) => {
    setSelectedReview(review);
    setForm({
      tour_id: review.tour_id,
      guide_id: review.guide_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
    });
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedReview(null);
    setIsEditing(false);
    setForm({
      tour_id: "",
      guide_id: "",
      user_id: "",
      rating: "",
      comment: "",
      status: "pending",
    });
  };

  // --- Thêm / cập nhật ---
  const handleSubmit = async () => {
    try {
      if (selectedReview && isEditing) {
        await adminApi.updateReview(selectedReview.id, form);
      } else {
        await adminApi.addReview(form);
      }
      handleCloseDialog();
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu review");
    }
  };

  // --- Xóa ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa review này?")) return;
    try {
      await adminApi.deleteReview(id);
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xóa review");
    }
  };

  // --- Hàm helper ---
  const formatPrice = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đánh giá
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleOpenAddDialog}
      >
        Thêm Review
      </Button>

      {/* --- Bảng danh sách --- */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tour ID</TableCell>
            <TableCell>Guide ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedReviews.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.tour_id}</TableCell>
              <TableCell>{r.guide_id}</TableCell>
              <TableCell>{r.user_id}</TableCell>
              <TableCell>{formatPrice(r.rating)}</TableCell>
              <TableCell>{translateStatus(r.status)}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpenDetail(r)}>
                  👁️ Xem
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(r.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* --- Phân trang --- */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Trước
        </Button>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          {currentPage}/{totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Sau
        </Button>
      </Box>

      {/* --- Dialog Thêm / Sửa --- */}
      <Dialog open={openAddDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>➕ Thêm Review</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Tour ID"
            type="number"
            value={form.tour_id}
            onChange={(e) => setForm({ ...form, tour_id: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Guide ID"
            type="number"
            value={form.guide_id}
            onChange={(e) => setForm({ ...form, guide_id: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="User ID"
            type="number"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Rating"
            type="number"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth
            margin="dense"
          >
            <MenuItem value="pending">Đang chờ</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Bị từ chối</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Dialog xem chi tiết + edit --- */}
      {selectedReview && (
        <Dialog
          open={!!selectedReview}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {isEditing ? "✏️ Cập nhật Review" : "👁️ Xem chi tiết Review"}
          </DialogTitle>
          <DialogContent dividers>
            {isEditing ? (
              <>
                <TextField
                  label="Tour ID"
                  type="number"
                  value={form.tour_id}
                  onChange={(e) => setForm({ ...form, tour_id: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Guide ID"
                  type="number"
                  value={form.guide_id}
                  onChange={(e) => setForm({ ...form, guide_id: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="User ID"
                  type="number"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Rating"
                  type="number"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Comment"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  select
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="pending">Đang chờ</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Bị từ chối</MenuItem>
                </TextField>
              </>
            ) : (
              <>
                <Typography><strong>ID:</strong> {selectedReview.id}</Typography>
                <Typography><strong>Tour ID:</strong> {selectedReview.tour_id}</Typography>
                <Typography><strong>Guide ID:</strong> {selectedReview.guide_id}</Typography>
                <Typography><strong>User ID:</strong> {selectedReview.user_id}</Typography>
                <Typography><strong>Rating:</strong> {formatPrice(selectedReview.rating)}</Typography>
                <Typography><strong>Comment:</strong> {selectedReview.comment}</Typography>
                <Typography><strong>Status:</strong> {translateStatus(selectedReview.status)}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Quay lại</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Lưu
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                Cập nhật
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}
