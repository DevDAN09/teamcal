"use client";

export const formatDateForInput = (date: string) => {
  return date.split('T')[0]; // Convert ISO date to YYYY-MM-DD
};

export const validateDateRange = (startDate: string, endDate: string) => {
  return new Date(startDate) <= new Date(endDate);
};