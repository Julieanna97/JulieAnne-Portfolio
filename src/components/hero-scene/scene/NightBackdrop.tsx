export default function NightBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",
        inset:
          0,
        background:
          "#000000",
        pointerEvents:
          "none",
      }}
    />
  );
}