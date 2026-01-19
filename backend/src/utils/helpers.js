// Backend utility helpers

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

const handleError = (res, status, message) => {
  console.error(`[${status}] ${message}`);
  return res.status(status).json({ error: message });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const paginate = (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

const getStatusCounts = (tasks) => {
  return {
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    in_review: tasks.filter((t) => t.status === "in_review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
};

const formatTimestamp = (date) => {
  return date.toISOString();
};

module.exports = {
  generateId,
  validateEmail,
  validatePassword,
  handleError,
  asyncHandler,
  paginate,
  getStatusCounts,
  formatTimestamp,
};
