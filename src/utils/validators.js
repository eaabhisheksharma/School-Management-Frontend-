// src/utils/validators.js

import {
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMPORT_TYPES,
  FILE_LIMITS,
} from './constants';

export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneIN: /^[6-9]\d{9}$/,
  pincodeIN: /^[1-9][0-9]{5}$/,
  aadhar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  admissionNo: /^[A-Za-z0-9/_-]{3,30}$/,
  employeeId: /^[A-Za-z0-9/_-]{3,30}$/,
  percentage: /^(100|[1-9]?\d)(\.\d+)?$/,
  amount: /^\d+(\.\d{1,2})?$/,
};

export const required = (value, label = 'This field') => {
  if (value === null || value === undefined) return `${label} is required`;
  if (typeof value === 'string' && value.trim() === '') return `${label} is required`;
  if (Array.isArray(value) && value.length === 0) return `${label} is required`;
  return '';
};

export const minLength = (value, min, label = 'This field') => {
  if (!String(value || '').trim()) return '';
  return String(value).trim().length < min
    ? `${label} must be at least ${min} characters`
    : '';
};

export const maxLength = (value, max, label = 'This field') => {
  if (!String(value || '').trim()) return '';
  return String(value).trim().length > max
    ? `${label} must be at most ${max} characters`
    : '';
};

export const exactLength = (value, len, label = 'This field') => {
  if (!String(value || '').trim()) return '';
  return String(value).trim().length !== len
    ? `${label} must be exactly ${len} characters`
    : '';
};

export const isEmail = (value, label = 'Email') => {
  if (!String(value || '').trim()) return '';
  return regex.email.test(String(value).trim()) ? '' : `${label} is invalid`;
};

export const isIndianPhone = (value, label = 'Phone number') => {
  if (!String(value || '').trim()) return '';
  return regex.phoneIN.test(String(value).trim())
    ? ''
    : `${label} must be a valid 10-digit mobile number`;
};

export const isPincode = (value, label = 'Pincode') => {
  if (!String(value || '').trim()) return '';
  return regex.pincodeIN.test(String(value).trim()) ? '' : `${label} is invalid`;
};

export const isAadhar = (value, label = 'Aadhar number') => {
  if (!String(value || '').trim()) return '';
  return regex.aadhar.test(String(value).trim().replace(/\s+/g, ''))
    ? ''
    : `${label} must be 12 digits`;
};

export const isPAN = (value, label = 'PAN number') => {
  if (!String(value || '').trim()) return '';
  return regex.pan.test(String(value).trim().toUpperCase()) ? '' : `${label} is invalid`;
};

export const isIFSC = (value, label = 'IFSC code') => {
  if (!String(value || '').trim()) return '';
  return regex.ifsc.test(String(value).trim().toUpperCase()) ? '' : `${label} is invalid`;
};

export const isStrongPassword = (value, label = 'Password') => {
  if (!String(value || '').trim()) return `${label} is required`;
  return regex.passwordStrong.test(String(value))
    ? ''
    : `${label} must contain 8+ chars, uppercase, lowercase and number`;
};

export const isAdmissionNo = (value, label = 'Admission number') => {
  if (!String(value || '').trim()) return '';
  return regex.admissionNo.test(String(value).trim())
    ? ''
    : `${label} is invalid`;
};

export const isEmployeeId = (value, label = 'Employee ID') => {
  if (!String(value || '').trim()) return '';
  return regex.employeeId.test(String(value).trim())
    ? ''
    : `${label} is invalid`;
};

export const isPositiveNumber = (value, label = 'Value') => {
  if (value === '' || value === null || value === undefined) return '';
  return Number(value) >= 0 ? '' : `${label} must be a positive number`;
};

export const isAmount = (value, label = 'Amount') => {
  if (!String(value ?? '').trim()) return '';
  return regex.amount.test(String(value).trim()) ? '' : `${label} is invalid`;
};

export const isPercentage = (value, label = 'Percentage') => {
  if (!String(value ?? '').trim()) return '';
  const str = String(value).trim();
  if (!regex.percentage.test(str)) return `${label} is invalid`;
  const num = Number(str);
  return num >= 0 && num <= 100 ? '' : `${label} must be between 0 and 100`;
};

export const isDate = (value, label = 'Date') => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? `${label} is invalid` : '';
};

export const isFutureDate = (value, label = 'Date') => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${label} is invalid`;
  return date.getTime() > Date.now() ? '' : `${label} must be in the future`;
};

export const isPastDate = (value, label = 'Date') => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${label} is invalid`;
  return date.getTime() < Date.now() ? '' : `${label} must be in the past`;
};

export const compareDates = (startDate, endDate, startLabel = 'Start date', endLabel = 'End date') => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
  return start <= end ? '' : `${endLabel} must be after ${startLabel.toLowerCase()}`;
};

export const matchesField = (value, compareValue, label = 'Value', compareLabel = 'field') => {
  return value === compareValue ? '' : `${label} must match ${compareLabel}`;
};

export const validateFileSize = (file, maxMB, label = 'File') => {
  if (!file) return '';
  const maxBytes = maxMB * 1024 * 1024;
  return file.size <= maxBytes ? '' : `${label} size must be less than ${maxMB} MB`;
};

export const validateFileType = (file, allowedTypes = [], label = 'File') => {
  if (!file) return '';
  return allowedTypes.includes(file.type)
    ? ''
    : `${label} type is not supported`;
};

export const validateImageFile = (file) => {
  const typeError = validateFileType(file, ALLOWED_IMAGE_TYPES, 'Image');
  if (typeError) return typeError;
  return validateFileSize(file, FILE_LIMITS.IMAGE_MAX_MB, 'Image');
};

export const validateDocumentFile = (file) => {
  const typeError = validateFileType(file, ALLOWED_DOCUMENT_TYPES, 'Document');
  if (typeError) return typeError;
  return validateFileSize(file, FILE_LIMITS.DOCUMENT_MAX_MB, 'Document');
};

export const validateCsvFile = (file) => {
  const typeError = validateFileType(file, ALLOWED_IMPORT_TYPES, 'CSV file');
  if (typeError) return typeError;
  return validateFileSize(file, FILE_LIMITS.CSV_MAX_MB, 'CSV file');
};

export const validateLogin = (values = {}) => {
  const errors = {};

  errors.email = required(values.email, 'Email') || isEmail(values.email);
  errors.password = required(values.password, 'Password') || minLength(values.password, 4, 'Password');
  errors.role = required(values.role, 'Role');

  return cleanErrors(errors);
};

export const validateStudent = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Student name') || minLength(values.name, 2, 'Student name');
  errors.admissionNo =
    required(values.admissionNo, 'Admission number') || isAdmissionNo(values.admissionNo);
  errors.email = required(values.email, 'Email') || isEmail(values.email);
  errors.phone = required(values.phone, 'Phone number') || isIndianPhone(values.phone);
  errors.gender = required(values.gender, 'Gender');
  errors.classId = required(values.classId, 'Class');
  errors.sectionId = required(values.sectionId, 'Section');
  errors.parentName =
    required(values.parentName, 'Parent name') || minLength(values.parentName, 2, 'Parent name');
  errors.parentPhone =
    required(values.parentPhone, 'Parent phone number') ||
    isIndianPhone(values.parentPhone, 'Parent phone number');
  errors.address = required(values.address, 'Address');
  errors.dob = required(values.dob, 'Date of birth') || isDate(values.dob, 'Date of birth');

  return cleanErrors(errors);
};

export const validateTeacher = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Teacher name') || minLength(values.name, 2, 'Teacher name');
  errors.employeeId =
    required(values.employeeId, 'Employee ID') || isEmployeeId(values.employeeId);
  errors.email = required(values.email, 'Email') || isEmail(values.email);
  errors.phone = required(values.phone, 'Phone number') || isIndianPhone(values.phone);
  errors.gender = required(values.gender, 'Gender');
  errors.department = required(values.department, 'Department');
  errors.qualification = required(values.qualification, 'Qualification');
  errors.joiningDate =
    required(values.joiningDate, 'Joining date') || isDate(values.joiningDate, 'Joining date');
  errors.salary = required(values.salary, 'Salary') || isAmount(values.salary, 'Salary');

  return cleanErrors(errors);
};

export const validateClass = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Class name');
  errors.academicYear = required(values.academicYear, 'Academic year');

  return cleanErrors(errors);
};

export const validateSection = (values = {}) => {
  const errors = {};

  errors.classId = required(values.classId, 'Class');
  errors.name = required(values.name, 'Section name');

  return cleanErrors(errors);
};

export const validateSubject = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Subject name');
  errors.code = required(values.code, 'Subject code');
  errors.classId = required(values.classId, 'Class');

  return cleanErrors(errors);
};

export const validateAttendanceEntry = (values = {}) => {
  const errors = {};

  errors.classId = required(values.classId, 'Class');
  errors.sectionId = required(values.sectionId, 'Section');
  errors.date = required(values.date, 'Date') || isDate(values.date);
  errors.records =
    Array.isArray(values.records) && values.records.length > 0
      ? ''
      : 'At least one attendance record is required';

  return cleanErrors(errors);
};

export const validateAssignment = (values = {}) => {
  const errors = {};

  errors.title = required(values.title, 'Title');
  errors.classId = required(values.classId, 'Class');
  errors.subjectId = required(values.subjectId, 'Subject');
  errors.dueDate = required(values.dueDate, 'Due date') || isDate(values.dueDate, 'Due date');
  errors.maxMarks = required(values.maxMarks, 'Max marks') || isPositiveNumber(values.maxMarks, 'Max marks');

  return cleanErrors(errors);
};

export const validateExam = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Exam name');
  errors.type = required(values.type, 'Exam type');
  errors.classId = required(values.classId, 'Class');
  errors.startDate = required(values.startDate, 'Start date') || isDate(values.startDate);
  errors.endDate = required(values.endDate, 'End date') || isDate(values.endDate);
  errors.dateOrder = compareDates(values.startDate, values.endDate);

  return cleanErrors(errors);
};

export const validateExamResult = (values = {}) => {
  const errors = {};

  errors.studentId = required(values.studentId, 'Student');
  errors.subjectId = required(values.subjectId, 'Subject');
  errors.marksObtained =
    required(values.marksObtained, 'Marks obtained') ||
    isPositiveNumber(values.marksObtained, 'Marks obtained');
  errors.maxMarks =
    required(values.maxMarks, 'Max marks') || isPositiveNumber(values.maxMarks, 'Max marks');

  if (!errors.marksObtained && !errors.maxMarks) {
    const obtained = Number(values.marksObtained);
    const max = Number(values.maxMarks);
    if (obtained > max) errors.marksObtained = 'Marks obtained cannot exceed max marks';
  }

  return cleanErrors(errors);
};

export const validateFeeStructure = (values = {}) => {
  const errors = {};

  errors.name = required(values.name, 'Fee name');
  errors.classId = required(values.classId, 'Class');
  errors.amount = required(values.amount, 'Amount') || isAmount(values.amount);
  errors.frequency = required(values.frequency, 'Frequency');

  return cleanErrors(errors);
};

export const validatePayment = (values = {}) => {
  const errors = {};

  errors.invoiceId = required(values.invoiceId, 'Invoice');
  errors.amount = required(values.amount, 'Amount') || isAmount(values.amount);
  errors.paymentDate =
    required(values.paymentDate, 'Payment date') || isDate(values.paymentDate, 'Payment date');
  errors.paymentMode = required(values.paymentMode, 'Payment mode');

  return cleanErrors(errors);
};

export const validateNotice = (values = {}) => {
  const errors = {};

  errors.title = required(values.title, 'Title') || minLength(values.title, 3, 'Title');
  errors.content = required(values.content, 'Content') || minLength(values.content, 5, 'Content');
  errors.targetRoles =
    Array.isArray(values.targetRoles) && values.targetRoles.length > 0
      ? ''
      : 'Audience is required';

  return cleanErrors(errors);
};

export const validateTimetableEntry = (values = {}) => {
  const errors = {};

  errors.day = required(values.day, 'Day');
  errors.period = required(values.period, 'Period');
  errors.classId = required(values.classId, 'Class');
  errors.sectionId = required(values.sectionId, 'Section');
  errors.subjectId = required(values.subjectId, 'Subject');
  errors.teacherId = required(values.teacherId, 'Teacher');
  errors.startTime = required(values.startTime, 'Start time');
  errors.endTime = required(values.endTime, 'End time');

  return cleanErrors(errors);
};

export const cleanErrors = (errors = {}) =>
  Object.fromEntries(Object.entries(errors).filter(([, value]) => value));

export const hasErrors = (errors = {}) => Object.keys(cleanErrors(errors)).length > 0;

export const firstError = (errors = {}) => {
  const cleaned = cleanErrors(errors);
  const firstKey = Object.keys(cleaned)[0];
  return firstKey ? cleaned[firstKey] : '';
};

export const runValidation = (values, rules = {}) => {
  const errors = {};

  Object.entries(rules).forEach(([field, validators]) => {
    const value = values?.[field];
    const validatorList = Array.isArray(validators) ? validators : [validators];

    for (const validator of validatorList) {
      const error = validator(value, values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return cleanErrors(errors);
};