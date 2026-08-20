export default function HeroCurves({ color1, color2 }) {
  return (
    <svg
      viewBox="0 0 1140 800"
      className="position-absolute top-0 end-0 h-100"
      preserveAspectRatio="none"
    >
      <path
        d="M400,0 C400,400 1000,300 1440,400 L1440,0 Z"
        fill={color1}
      />
      <path
        d="M500,0 C500,450 1100,250 1440,450 L1440,0 Z"
        fill={color2}
        opacity="0.9"
      />
    </svg>
  );
}

