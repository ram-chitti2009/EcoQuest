import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

const toastColors = {
  error: "bg-red-600 text-white",
  success: "bg-green-600 text-white",
  info: "bg-blue-600 text-white"
};

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 ${toastColors[type]}`}
      style={{ minWidth: 200, textAlign: "center" }}
    >
      <span>{message}</span>
    </div>
  );
};
