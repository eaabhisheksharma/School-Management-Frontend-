// src/utils/helpers.js

import {
  STORAGE_KEYS,
  USER_ROLES,
  INVOICE_STATUS,
  ATTENDANCE_STATUS,
  STUDENT_STATUS,
  TEACHER_STATUS,
} from './constants';

export const noop = () => {};

export const isNil = (value) => value === null || value === undefined;

export const isEmpty = (value) => {
  if (isNil(value)) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const setStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  const finalValue = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, finalValue);
};

export const getStorage = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return safeJsonParse(value, value);
};

export const removeStorage = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

export const clearAuthStorage = () => {
  removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
  removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
  removeStorage(STORAGE_KEYS.USER);
  removeStorage(STORAGE_KEYS.SCHOOL);
};

export const getAccessToken = () => getStorage(STORAGE_KEYS.ACCESS_TOKEN, '');
export const getCurrentUser = () => getStorage(STORAGE_KEYS.USER, null);

export const capitalize = (value = '') =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

export const toTitleCase = (value = '') =>
  String(value)
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((item) => capitalize(item))
    .join(' ');

export const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const generateAcademicYear = (startYear = new Date().getFullYear()) =>
  `${startYear}-${String(startYear + 1).slice(-2)}`;

export const generateInitials = (name = '') =>
  String(name)
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const getFullName = (...parts) =>
  parts.filter((item) => !isEmpty(item)).join(' ').trim();

export const formatCurrency = (amount = 0, currency = 'INR', locale = 'en-IN') => {
  const numeric = Number(amount || 0);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(numeric);
};

export const formatNumber = (value = 0, locale = 'en-IN') =>
  new Intl.NumberFormat(locale).format(Number(value || 0));

export const formatPercent = (value = 0, digits = 2) =>
  `${Number(value || 0).toFixed(digits)}%`;

export const formatDate = (value, locale = 'en-IN') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (value, locale = 'en-IN') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (value, locale = 'en-IN') => {
  if (!value) return '-';
  const date = new Date(`2000-01-01T${value}`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPhone = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone || '-';
};

export const maskEmail = (email = '') => {
  if (!email.includes('@')) return email;
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0] || ''}***@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
};

export const maskText = (value = '', visible = 4) => {
  const str = String(value);
  if (str.length <= visible) return str;
  return `${'*'.repeat(str.length - visible)}${str.slice(-visible)}`;
};

export const getStatusColor = (status = '') => {
  const map = {
    [STUDENT_STATUS.ACTIVE]: '#16a34a',
    [STUDENT_STATUS.INACTIVE]: '#64748b',
    [STUDENT_STATUS.TRANSFERRED]: '#d97706',
    [STUDENT_STATUS.GRADUATED]: '#7c3aed',
    [TEACHER_STATUS.ACTIVE]: '#16a34a',
    [TEACHER_STATUS.INACTIVE]: '#64748b',
    [TEACHER_STATUS.ON_LEAVE]: '#f59e0b',
    [TEACHER_STATUS.RESIGNED]: '#dc2626',
    [ATTENDANCE_STATUS.PRESENT]: '#16a34a',
    [ATTENDANCE_STATUS.ABSENT]: '#dc2626',
    [ATTENDANCE_STATUS.LATE]: '#f59e0b',
    [ATTENDANCE_STATUS.HALF_DAY]: '#0891b2',
    [ATTENDANCE_STATUS.HOLIDAY]: '#7c3aed',
    [INVOICE_STATUS.PAID]: '#16a34a',
    [INVOICE_STATUS.PARTIAL]: '#f59e0b',
    [INVOICE_STATUS.PENDING]: '#64748b',
    [INVOICE_STATUS.OVERDUE]: '#dc2626',
    [INVOICE_STATUS.CANCELLED]: '#94a3b8',
  };
  return map[status] || '#64748b';
};

export const getStatusBg = (status = '') => {
  const map = {
    active: '#dcfce7',
    inactive: '#f1f5f9',
    transferred: '#fef3c7',
    graduated: '#ede9fe',
    on_leave: '#fef3c7',
    resigned: '#fee2e2',
    present: '#dcfce7',
    absent: '#fee2e2',
    late: '#fef3c7',
    half_day: '#cffafe',
    holiday: '#ede9fe',
    paid: '#dcfce7',
    partial: '#fef3c7',
    pending: '#f1f5f9',
    overdue: '#fee2e2',
    cancelled: '#e5e7eb',
  };
  return map[status] || '#f1f5f9';
};

export const getRoleLabel = (role = '') => {
  const roleMap = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.PRINCIPAL]: 'Principal',
    [USER_ROLES.TEACHER]: 'Teacher',
    [USER_ROLES.STUDENT]: 'Student',
    [USER_ROLES.PARENT]: 'Parent',
    [USER_ROLES.ACCOUNTANT]: 'Accountant',
  };
  return roleMap[role] || toTitleCase(role.replace(/_/g, ' '));
};

export const hasRole = (user, roles = []) => {
  if (!user?.role) return false;
  const list = Array.isArray(roles) ? roles : [roles];
  return list.includes(user.role);
};

export const hasAnyPermission = (userPermissions = [], requiredPermissions = []) => {
  const userList = Array.isArray(userPermissions) ? userPermissions : [];
  const requiredList = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];
  return requiredList.some((permission) => userList.includes(permission));
};

export const getPaginationMeta = ({ page = 1, limit = 10, total = 0 } = {}) => {
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const totalRecords = Number(total) || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  return {
    page: currentPage,
    limit: pageSize,
    total: totalRecords,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    start: totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    end: Math.min(currentPage * pageSize, totalRecords),
  };
};

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (isNil(value) || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (!isNil(item) && item !== '') query.append(key, item);
      });
      return;
    }

    query.append(key, value);
  });

  const finalQuery = query.toString();
  return finalQuery ? `?${finalQuery}` : '';
};

export const downloadBlob = (blob, fileName = 'download') => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getFileExtension = (name = '') => {
  const parts = String(name).split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const bytesToSize = (bytes = 0) => {
  if (!bytes) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** i;
  return `${value.toFixed(value >= 10 ? 0 : 2)} ${sizes[i]}`;
};

export const isImageFile = (file) =>
  Boolean(file && file.type && file.type.startsWith('image/'));

export const getErrorMessage = (error) => {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong.'
  );
};

export const normalizeApiResponse = (response) => ({
  success: response?.data?.success ?? true,
  data: response?.data?.data ?? response?.data ?? null,
  message: response?.data?.message ?? '',
  pagination: response?.data?.pagination ?? null,
});

export const sortByKey = (list = [], key, direction = 'asc') => {
  const cloned = [...list];
  cloned.sort((a, b) => {
    const aVal = a?.[key];
    const bVal = b?.[key];

    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return direction === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  return cloned;
};

export const groupBy = (list = [], key) =>
  list.reduce((acc, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item?.[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});

export const uniqueBy = (list = [], key) => {
  const seen = new Map();
  list.forEach((item) => {
    const mapKey = typeof key === 'function' ? key(item) : item?.[key];
    seen.set(mapKey, item);
  });
  return Array.from(seen.values());
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const sleep = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStudentDisplayName = (student = {}) =>
  student.name || getFullName(student.firstName, student.lastName) || 'Unknown Student';

export const getTeacherDisplayName = (teacher = {}) =>
  teacher.name || getFullName(teacher.firstName, teacher.lastName) || 'Unknown Teacher';