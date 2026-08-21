"use client";

export function Button({ label, onClick}: { label: string; onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#3B82F6",
        color: "#fff",
        padding: "10px",
        borderRadius: "6px"
      }}
    >
      {label}
    </button>
  );
}
