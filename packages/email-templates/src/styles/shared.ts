import { CSSProperties } from "react";

export const h1: CSSProperties = {
  color: "#1F2937",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "30px 0",
};

export const text: CSSProperties = {
  color: "#1F2937",
  fontSize: "14px",
  lineHeight: "24px",
};

export const button: CSSProperties = {
  backgroundColor: "#3B82F6",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "100%",
  padding: "10px 20px",
};

export const link: CSSProperties = {
  color: "#3B82F6",
  textDecoration: "underline",
};

export const list: CSSProperties = {
  ...text,
  paddingLeft: "20px",
};
