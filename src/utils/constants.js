// // src/utils/constants.js

// export const APP_NAME = 'School Management System';
// export const APP_VERSION = '1.0.0';
// export const DEFAULT_API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// export const STORAGE_KEYS = {
//   ACCESS_TOKEN: 'sms_access_token',
//   REFRESH_TOKEN: 'sms_refresh_token',
//   USER: 'sms_user',
//   THEME: 'sms_theme',
//   SCHOOL: 'sms_school',
//   LAST_ROUTE: 'sms_last_route',
// };

// export const THEMES = {
//   LIGHT: 'light',
//   DARK: 'dark',
// };

// export const USER_ROLES = {
//   SUPER_ADMIN: 'super_admin',
//   PRINCIPAL: 'principal',
//   TEACHER: 'teacher',
//   STUDENT: 'student',
//   PARENT: 'parent',
//   ACCOUNTANT: 'accountant',
// };

// export const ROLE_OPTIONS = [
//   { value: USER_ROLES.PRINCIPAL, label: 'Principal' },
//   { value: USER_ROLES.TEACHER, label: 'Teacher' },
//   { value: USER_ROLES.STUDENT, label: 'Student' },
//   { value: USER_ROLES.PARENT, label: 'Parent' },
//   { value: USER_ROLES.ACCOUNTANT, label: 'Accountant' },
// ];

// export const GENDERS = [
//   { value: 'male', label: 'Male' },
//   { value: 'female', label: 'Female' },
//   { value: 'other', label: 'Other' },
// ];

// export const BLOOD_GROUPS = [
//   'A+',
//   'A-',
//   'B+',
//   'B-',
//   'AB+',
//   'AB-',
//   'O+',
//   'O-',
// ];

// export const STUDENT_STATUS = {
//   ACTIVE: 'active',
//   INACTIVE: 'inactive',
//   TRANSFERRED: 'transferred',
//   GRADUATED: 'graduated',
// };

// export const STUDENT_STATUS_OPTIONS = [
//   { value: STUDENT_STATUS.ACTIVE, label: 'Active' },
//   { value: STUDENT_STATUS.INACTIVE, label: 'Inactive' },
//   { value: STUDENT_STATUS.TRANSFERRED, label: 'Transferred' },
//   { value: STUDENT_STATUS.GRADUATED, label: 'Graduated' },
// ];

// export const TEACHER_STATUS = {
//   ACTIVE: 'active',
//   INACTIVE: 'inactive',
//   ON_LEAVE: 'on_leave',
//   RESIGNED: 'resigned',
// };

// export const TEACHER_STATUS_OPTIONS = [
//   { value: TEACHER_STATUS.ACTIVE, label: 'Active' },
//   { value: TEACHER_STATUS.INACTIVE, label: 'Inactive' },
//   { value: TEACHER_STATUS.ON_LEAVE, label: 'On Leave' },
//   { value: TEACHER_STATUS.RESIGNED, label: 'Resigned' },
// ];

// export const ATTENDANCE_STATUS = {
//   PRESENT: 'present',
//   ABSENT: 'absent',
//   LATE: 'late',
//   HALF_DAY: 'half_day',
//   HOLIDAY: 'holiday',
// };

// export const ATTENDANCE_STATUS_OPTIONS = [
//   { value: ATTENDANCE_STATUS.PRESENT, label: 'Present' },
//   { value: ATTENDANCE_STATUS.ABSENT, label: 'Absent' },
//   { value: ATTENDANCE_STATUS.LATE, label: 'Late' },
//   { value: ATTENDANCE_STATUS.HALF_DAY, label: 'Half Day' },
//   { value: ATTENDANCE_STATUS.HOLIDAY, label: 'Holiday' },
// ];

// export const ASSIGNMENT_STATUS = {
//   DRAFT: 'draft',
//   PUBLISHED: 'published',
//   CLOSED: 'closed',
// };

// export const ASSIGNMENT_SUBMISSION_STATUS = {
//   PENDING: 'pending',
//   SUBMITTED: 'submitted',
//   GRADED: 'graded',
//   LATE: 'late',
// };

// export const EXAM_TYPES = [
//   { value: 'unit_test', label: 'Unit Test' },
//   { value: 'mid_term', label: 'Mid Term' },
//   { value: 'final', label: 'Final Exam' },
//   { value: 'practical', label: 'Practical' },
// ];

// export const FEE_FREQUENCY = [
//   { value: 'monthly', label: 'Monthly' },
//   { value: 'quarterly', label: 'Quarterly' },
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'one_time', label: 'One Time' },
// ];

// export const INVOICE_STATUS = {
//   PENDING: 'pending',
//   PARTIAL: 'partial',
//   PAID: 'paid',
//   OVERDUE: 'overdue',
//   CANCELLED: 'cancelled',
// };

// export const INVOICE_STATUS_OPTIONS = [
//   { value: INVOICE_STATUS.PENDING, label: 'Pending' },
//   { value: INVOICE_STATUS.PARTIAL, label: 'Partial' },
//   { value: INVOICE_STATUS.PAID, label: 'Paid' },
//   { value: INVOICE_STATUS.OVERDUE, label: 'Overdue' },
//   { value: INVOICE_STATUS.CANCELLED, label: 'Cancelled' },
// ];

// export const PAYMENT_MODES = [
//   { value: 'cash', label: 'Cash' },
//   { value: 'online', label: 'Online' },
//   { value: 'cheque', label: 'Cheque' },
//   { value: 'dd', label: 'Demand Draft' },
// ];

// export const NOTICE_AUDIENCE = [
//   { value: 'all', label: 'All' },
//   { value: USER_ROLES.PRINCIPAL, label: 'Principal' },
//   { value: USER_ROLES.TEACHER, label: 'Teacher' },
//   { value: USER_ROLES.STUDENT, label: 'Student' },
//   { value: USER_ROLES.PARENT, label: 'Parent' },
//   { value: USER_ROLES.ACCOUNTANT, label: 'Accountant' },
// ];

// export const DAYS_OF_WEEK = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
// ];

// export const PERIOD_TYPES = [
//   { value: 'regular', label: 'Regular Period' },
//   { value: 'lab', label: 'Lab Session' },
//   { value: 'break', label: 'Break' },
//   { value: 'sports', label: 'Sports' },
//   { value: 'library', label: 'Library' },
//   { value: 'free', label: 'Free Period' },
// ];

// export const MONTHS = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// export const PAGINATION = {
//   DEFAULT_PAGE: 1,
//   DEFAULT_LIMIT: 10,
//   PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
// };

// export const FILE_LIMITS = {
//   IMAGE_MAX_MB: 2,
//   DOCUMENT_MAX_MB: 5,
//   CSV_MAX_MB: 10,
// };

// export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// export const ALLOWED_DOCUMENT_TYPES = [
//   'application/pdf',
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
// ];
// export const ALLOWED_IMPORT_TYPES = ['text/csv', 'application/vnd.ms-excel'];

// export const ALERT_TYPES = {
//   SUCCESS: 'success',
//   ERROR: 'error',
//   WARNING: 'warning',
//   INFO: 'info',
// };

// export const DATE_FORMATS = {
//   DISPLAY: 'dd MMM yyyy',
//   API: 'yyyy-MM-dd',
//   DATE_TIME: 'dd MMM yyyy, hh:mm a',
//   TIME: 'hh:mm a',
// };

// export const DEFAULT_FILTERS = {
//   search: '',
//   page: 1,
//   limit: 10,
//   sortBy: 'created_at',
//   order: 'desc',
//   status: '',
//   classId: '',
//   sectionId: '',
//   academicYear: '',
//   startDate: '',
//   endDate: '',
// };

// export const ROUTES = {
//   ROOT: '/',
//   LOGIN: '/login',
//   DASHBOARD: '/dashboard',
//   STUDENTS: '/students',
//   TEACHERS: '/teachers',
//   CLASSES: '/classes',
//   ATTENDANCE: '/attendance',
//   ASSIGNMENTS: '/assignments',
//   EXAMS: '/exams',
//   FEES: '/fees',
//   NOTICES: '/notices',
//   TIMETABLE: '/timetable',
//   PROFILE: '/profile',
//   SETTINGS: '/settings',
// };

// export const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: '/auth/login',
//     LOGOUT: '/auth/logout',
//     REFRESH: '/auth/refresh-token',
//     FORGOT_PASSWORD: '/auth/forgot-password',
//     RESET_PASSWORD: '/auth/reset-password',
//     VERIFY_EMAIL: '/auth/verify-email',
//   },
//   USERS: {
//     ME: '/users/me',
//     CHANGE_PASSWORD: '/users/me/password',
//     AVATAR: '/users/me/avatar',
//   },
//   STUDENTS: '/students',
//   TEACHERS: '/teachers',
//   CLASSES: '/classes',
//   SECTIONS: '/sections',
//   SUBJECTS: '/subjects',
//   ATTENDANCE: '/attendance',
//   ASSIGNMENTS: '/assignments',
//   EXAMS: '/exams',
//   FEES: '/fees',
//   NOTICES: '/notices',
//   TIMETABLE: '/timetable',
//   REPORTS: '/reports',
//   SETTINGS: '/settings',
//   NOTIFICATIONS: '/notifications',
// };

// export const MESSAGES = {
//   SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
//   NETWORK_ERROR: 'Unable to connect to server.',
//   UNAUTHORIZED: 'Your session has expired. Please login again.',
//   FORBIDDEN: 'You do not have permission to perform this action.',
//   SAVE_SUCCESS: 'Saved successfully.',
//   UPDATE_SUCCESS: 'Updated successfully.',
//   DELETE_SUCCESS: 'Deleted successfully.',
//   LOGIN_SUCCESS: 'Login successful.',
//   LOGOUT_SUCCESS: 'Logged out successfully.',
// };

// export const COLORS = {
//   PRIMARY: '#2563eb',
//   SUCCESS: '#16a34a',
//   WARNING: '#d97706',
//   ERROR: '#dc2626',
//   INFO: '#0891b2',
//   TEXT: '#0f172a',
//   MUTED: '#64748b',
//   BORDER: '#e2e8f0',
//   BG_LIGHT: '#f8fafc',
// };

// export const DASHBOARD_CARDS = [
//   { key: 'students', label: 'Students', color: '#2563eb', icon: '🎓' },
//   { key: 'teachers', label: 'Teachers', color: '#7c3aed', icon: '👨‍🏫' },
//   { key: 'attendance', label: 'Attendance', color: '#16a34a', icon: '✅' },
//   { key: 'fees', label: 'Fees', color: '#d97706', icon: '💰' },
//   { key: 'exams', label: 'Exams', color: '#dc2626', icon: '📊' },
//   { key: 'notices', label: 'Notices', color: '#0891b2', icon: '📢' },
// ];


// src/utils/constants.js

export const APP_NAME = 'School Management System';
export const APP_VERSION = '1.0.0';
export const DEFAULT_API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sms_access_token',
  REFRESH_TOKEN: 'sms_refresh_token',
  USER: 'sms_user',
  USER_ROLE: 'sms_user_role',
  SUPER_ADMIN_FLAG: 'isSuperAdmin',
  THEME: 'sms_theme',
  SCHOOL: 'sms_school',
  LAST_ROUTE: 'sms_last_route',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
};

export const ROLE_OPTIONS = [
  { value: USER_ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: USER_ROLES.PRINCIPAL, label: 'Principal' },
  { value: USER_ROLES.TEACHER, label: 'Teacher' },
  { value: USER_ROLES.STUDENT, label: 'Student' },
  { value: USER_ROLES.PARENT, label: 'Parent' },
  { value: USER_ROLES.ACCOUNTANT, label: 'Accountant' },
];

export const SCHOOL_USER_ROLE_OPTIONS = [
  { value: USER_ROLES.PRINCIPAL, label: 'Principal' },
  { value: USER_ROLES.TEACHER, label: 'Teacher' },
  { value: USER_ROLES.STUDENT, label: 'Student' },
  { value: USER_ROLES.PARENT, label: 'Parent' },
  { value: USER_ROLES.ACCOUNTANT, label: 'Accountant' },
];

export const ADMIN_NAV_SECTIONS = {
  MAIN: 'main',
  SUPER_ADMIN: 'super_admin',
  ACADEMIC: 'academic',
  ADMIN: 'admin',
};

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TRANSFERRED: 'transferred',
  GRADUATED: 'graduated',
};

export const STUDENT_STATUS_OPTIONS = [
  { value: STUDENT_STATUS.ACTIVE, label: 'Active' },
  { value: STUDENT_STATUS.INACTIVE, label: 'Inactive' },
  { value: STUDENT_STATUS.TRANSFERRED, label: 'Transferred' },
  { value: STUDENT_STATUS.GRADUATED, label: 'Graduated' },
];

export const TEACHER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  RESIGNED: 'resigned',
};

export const TEACHER_STATUS_OPTIONS = [
  { value: TEACHER_STATUS.ACTIVE, label: 'Active' },
  { value: TEACHER_STATUS.INACTIVE, label: 'Inactive' },
  { value: TEACHER_STATUS.ON_LEAVE, label: 'On Leave' },
  { value: TEACHER_STATUS.RESIGNED, label: 'Resigned' },
];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  HOLIDAY: 'holiday',
};

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: ATTENDANCE_STATUS.PRESENT, label: 'Present' },
  { value: ATTENDANCE_STATUS.ABSENT, label: 'Absent' },
  { value: ATTENDANCE_STATUS.LATE, label: 'Late' },
  { value: ATTENDANCE_STATUS.HALF_DAY, label: 'Half Day' },
  { value: ATTENDANCE_STATUS.HOLIDAY, label: 'Holiday' },
];

export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
};

export const ASSIGNMENT_SUBMISSION_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
};

export const EXAM_TYPES = [
  { value: 'unit_test', label: 'Unit Test' },
  { value: 'mid_term', label: 'Mid Term' },
  { value: 'final', label: 'Final Exam' },
  { value: 'practical', label: 'Practical' },
];

export const FEE_FREQUENCY = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one_time', label: 'One Time' },
];

export const INVOICE_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

export const INVOICE_STATUS_OPTIONS = [
  { value: INVOICE_STATUS.PENDING, label: 'Pending' },
  { value: INVOICE_STATUS.PARTIAL, label: 'Partial' },
  { value: INVOICE_STATUS.PAID, label: 'Paid' },
  { value: INVOICE_STATUS.OVERDUE, label: 'Overdue' },
  { value: INVOICE_STATUS.CANCELLED, label: 'Cancelled' },
];

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'dd', label: 'Demand Draft' },
];

export const NOTICE_AUDIENCE = [
  { value: 'all', label: 'All' },
  { value: USER_ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: USER_ROLES.PRINCIPAL, label: 'Principal' },
  { value: USER_ROLES.TEACHER, label: 'Teacher' },
  { value: USER_ROLES.STUDENT, label: 'Student' },
  { value: USER_ROLES.PARENT, label: 'Parent' },
  { value: USER_ROLES.ACCOUNTANT, label: 'Accountant' },
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const PERIOD_TYPES = [
  { value: 'regular', label: 'Regular Period' },
  { value: 'lab', label: 'Lab Session' },
  { value: 'break', label: 'Break' },
  { value: 'sports', label: 'Sports' },
  { value: 'library', label: 'Library' },
  { value: 'free', label: 'Free Period' },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const FILE_LIMITS = {
  IMAGE_MAX_MB: 2,
  DOCUMENT_MAX_MB: 5,
  CSV_MAX_MB: 10,
};

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const ALLOWED_IMPORT_TYPES = ['text/csv', 'application/vnd.ms-excel'];

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  API: 'yyyy-MM-dd',
  DATE_TIME: 'dd MMM yyyy, hh:mm a',
  TIME: 'hh:mm a',
};

export const DEFAULT_FILTERS = {
  search: '',
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  order: 'desc',
  status: '',
  classId: '',
  sectionId: '',
  academicYear: '',
  startDate: '',
  endDate: '',
};

export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  STUDENTS: '/students',
  TEACHERS: '/teachers',
  CLASSES: '/classes',
  ATTENDANCE: '/attendance',
  ASSIGNMENTS: '/assignments',
  EXAMS: '/exams',
  FEES: '/fees',
  NOTICES: '/notices',
  TIMETABLE: '/timetable',

  PROFILE: '/profile',
  SETTINGS: '/settings',

  ADMIN_STATS: '/admin/stats',
  ADMIN_SCHOOLS: '/admin/schools',
  ADMIN_SCHOOL_CREATE: '/admin/schools/create',
  ADMIN_SCHOOL_EDIT: '/admin/schools/edit',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  ADMIN_USERS: '/admin/users',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_SETTINGS: '/admin/settings',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SUPER_ADMIN_LOGIN: '/auth/super-admin/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  USERS: {
    ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    AVATAR: '/users/me/avatar',
    LIST: '/users',
  },

  ADMIN: {
    STATS: '/admin/stats',
    SCHOOLS: '/admin/schools',
    SCHOOL_BY_ID: '/admin/schools/:id',
    SUBSCRIPTIONS: '/admin/subscriptions',
    USERS: '/admin/users',
    USER_BY_ID: '/admin/users/:id',
    ACTIVITY_LOGS: '/admin/activity-logs',
    SETTINGS: '/admin/settings',
  },

  STUDENTS: '/students',
  TEACHERS: '/teachers',
  CLASSES: '/classes',
  SECTIONS: '/sections',
  SUBJECTS: '/subjects',
  ATTENDANCE: '/attendance',
  ASSIGNMENTS: '/assignments',
  EXAMS: '/exams',
  FEES: '/fees',
  NOTICES: '/notices',
  TIMETABLE: '/timetable',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
};

export const PERMISSIONS = {
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  VIEW_SYSTEM_STATS: 'view_system_stats',
  VIEW_SCHOOLS: 'view_schools',
  CREATE_SCHOOL: 'create_school',
  EDIT_SCHOOL: 'edit_school',
  DELETE_SCHOOL: 'delete_school',
  VIEW_SUBSCRIPTIONS: 'view_subscriptions',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_ACTIVITY_LOGS: 'view_activity_logs',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',

  VIEW_STUDENTS: 'view_students',
  VIEW_TEACHERS: 'view_teachers',
  VIEW_CLASSES: 'view_classes',
  VIEW_ATTENDANCE: 'view_attendance',
  VIEW_ASSIGNMENTS: 'view_assignments',
  VIEW_EXAMS: 'view_exams',
  VIEW_FEES: 'view_fees',
  VIEW_NOTICES: 'view_notices',
  VIEW_TIMETABLE: 'view_timetable',
};

export const MESSAGES = {
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Unable to connect to server.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SAVE_SUCCESS: 'Saved successfully.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  SCHOOL_CREATED: 'School created successfully.',
  SCHOOL_UPDATED: 'School updated successfully.',
  SCHOOL_DELETED: 'School deleted successfully.',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully.',
  SETTINGS_UPDATED: 'System settings updated successfully.',
};

export const COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#16a34a',
  WARNING: '#d97706',
  ERROR: '#dc2626',
  INFO: '#0891b2',
  TEXT: '#0f172a',
  MUTED: '#64748b',
  BORDER: '#e2e8f0',
  BG_LIGHT: '#f8fafc',
};

export const DASHBOARD_CARDS = [
  { key: 'students', label: 'Students', color: '#2563eb', icon: '🎓' },
  { key: 'teachers', label: 'Teachers', color: '#7c3aed', icon: '👨‍🏫' },
  { key: 'attendance', label: 'Attendance', color: '#16a34a', icon: '✅' },
  { key: 'fees', label: 'Fees', color: '#d97706', icon: '💰' },
  { key: 'exams', label: 'Exams', color: '#dc2626', icon: '📊' },
  { key: 'notices', label: 'Notices', color: '#0891b2', icon: '📢' },
];

export const ADMIN_DASHBOARD_CARDS = [
  { key: 'schools', label: 'Schools', color: '#2563eb', icon: '🏫' },
  { key: 'users', label: 'Users', color: '#7c3aed', icon: '👥' },
  { key: 'subscriptions', label: 'Subscriptions', color: '#16a34a', icon: '💳' },
  { key: 'activityLogs', label: 'Activity Logs', color: '#d97706', icon: '📜' },
  { key: 'settings', label: 'Settings', color: '#0891b2', icon: '⚙️' },
];

export const normalizeUserRole = (role) => {
  if (!role) return '';
  return role === 'superadmin' ? USER_ROLES.SUPER_ADMIN : role;
};

export const isSuperAdminRole = (role) =>
  normalizeUserRole(role) === USER_ROLES.SUPER_ADMIN;