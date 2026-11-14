import { ImageResponse } from "next/og";

export const alt = "George Wanyoike — security practitioner, founder of Knight Labs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0e1113",
          color: "#ece7dc",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#7fcca8", fontFamily: "monospace" }}>
          SECURITY PRACTITIONER · FOUNDER, KNIGHT LABS · NAIROBI
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.05 }}>I build the systems</div>
          <div style={{ fontSize: 96, lineHeight: 1.05, color: "#7fcca8", fontStyle: "italic" }}>I break.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#a7a297" }}>
          <span>George Wanyoike</span>
          <span>realsirgeorge.knightlabs.co.ke</span>
        </div>
      </div>
    ),
    size
  );
}
