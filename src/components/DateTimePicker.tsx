import { useRef } from "react";
import { formatDateTime } from "../lib/formatDate";
import "./DateTimePicker.css";

interface DateTimePickerProps {
  id: string;
  value: string; // ISO datetime-local format: YYYY-MM-DDTHH:mm
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export function DateTimePicker({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = "Select date and time",
  required = false,
}: DateTimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const displayValue = value ? formatDateTime(new Date(value)) : "";

  return (
    <div className="datetime-picker">
      <input
        type="text"
        value={displayValue}
        placeholder={placeholder}
        onClick={handleClick}
        readOnly
        disabled={disabled}
        className="datetime-display"
      />
      <input
        ref={inputRef}
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="datetime-native"
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
