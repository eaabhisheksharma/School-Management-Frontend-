import api from './axiosConfig';

/**
 * Fee API
 * Handles Fee Structures, Invoices, Payments, and Reports.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// ─── Fee Structures ────────────────────────────────────────────────

// GET /principal/fee-structures
export const getFeeStructures = async (params = {}) => {
  const res = await api.get('/principal/fee-structures', { params });
  return res.data;
};

// POST /principal/fee-structures
export const createFeeStructure = async (data) => {
  const res = await api.post('/principal/fee-structures', data);
  return res.data;
};

// PUT /principal/fee-structures/:id
export const updateFeeStructure = async (id, data) => {
  const res = await api.put(`/principal/fee-structures/${id}`, data);
  return res.data;
};

// DELETE /principal/fee-structures/:id
export const deleteFeeStructure = async (id) => {
  const res = await api.delete(`/principal/fee-structures/${id}`);
  return res.data;
};

// ─── Invoices ──────────────────────────────────────────────────────

// GET /fees/invoices
export const getInvoices = async (params = {}) => {
  const res = await api.get('/fees/invoices', { params });
  return res.data;
};

// GET /fees/invoices/:id
export const getInvoiceById = async (id) => {
  const res = await api.get(`/fees/invoices/${id}`);
  return res.data;
};

// POST /fees/invoices/generate  (bulk generate)
export const generateInvoices = async (data) => {
  const res = await api.post('/fees/invoices/generate', data);
  return res.data;
};

// PUT /fees/invoices/:id
export const updateInvoice = async (id, data) => {
  const res = await api.put(`/fees/invoices/${id}`, data);
  return res.data;
};

// DELETE /fees/invoices/:id  (cancel invoice)
export const cancelInvoice = async (id) => {
  const res = await api.delete(`/fees/invoices/${id}`);
  return res.data;
};

// GET /fees/invoices/student/:id
export const getStudentInvoices = async (id, params = {}) => {
  const res = await api.get(`/fees/invoices/student/${id}`, { params });
  return res.data;
};

// GET /fees/invoices/pending
export const getPendingInvoices = async (params = {}) => {
  const res = await api.get('/fees/invoices/pending', { params });
  return res.data;
};

// GET /fees/invoices/overdue
export const getOverdueInvoices = async (params = {}) => {
  const res = await api.get('/fees/invoices/overdue', { params });
  return res.data;
};

// ─── Payments ──────────────────────────────────────────────────────

// GET /fees/payments
export const getPayments = async (params = {}) => {
  const res = await api.get('/fees/payments', { params });
  return res.data;
};

// POST /fees/payments
export const recordPayment = async (data) => {
  const res = await api.post('/fees/payments', data);
  return res.data;
};

// GET /fees/payments/:id
export const getPaymentById = async (id) => {
  const res = await api.get(`/fees/payments/${id}`);
  return res.data;
};

// GET /fees/payments/:id/receipt  (PDF)
export const getPaymentReceipt = async (id) => {
  const res = await api.get(`/fees/payments/${id}/receipt`, {
    responseType: 'blob',
  });
  return res.data;
};

// POST /fees/payments/razorpay/order
export const createRazorpayOrder = async (data) => {
  const res = await api.post('/fees/payments/razorpay/order', data);
  return res.data;
};

// POST /fees/payments/razorpay/verify
export const verifyRazorpayPayment = async (data) => {
  const res = await api.post('/fees/payments/razorpay/verify', data);
  return res.data;
};

// ─── Fee Reports ───────────────────────────────────────────────────

// GET /fees/reports/collection
export const getCollectionReport = async (params = {}) => {
  const res = await api.get('/fees/reports/collection', { params });
  return res.data;
};

// GET /fees/reports/outstanding
export const getOutstandingFees = async (params = {}) => {
  const res = await api.get('/fees/reports/outstanding', { params });
  return res.data;
};

// GET /fees/reports/defaulters
export const getFeeDefaulters = async (params = {}) => {
  const res = await api.get('/fees/reports/defaulters', { params });
  return res.data;
};

// GET /fees/reports/summary
export const getMonthlySummary = async (params = {}) => {
  const res = await api.get('/fees/reports/summary', { params });
  return res.data;
};