export const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#FFFFFF",
    borderRadius: "14px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },

  stepHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },

  uploadContainer: {
    border: "2px dashed #93C5FD",
    padding: "40px",
    borderRadius: "10px",
    backgroundColor: "#EFF6FF",
  },

  summaryCard: {
    backgroundColor: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  tableContainer: {
    overflowX: "auto" as const,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  button: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#E5E7EB",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#111827",
  },
};