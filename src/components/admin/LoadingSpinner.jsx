import React from "react";
import logo from '../../assets/logo';
const LoadingSpinner = () => {
  return (
    <>
      {/* Animations */}
      <style>
        {`
          @keyframes synerSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes synerSpinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          @keyframes synerPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <div
        style={{
          minHeight: "240px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "120px",
            height: "120px",
          }}
        >
          {/* Outer Ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "5px solid #e9ecef",
              borderTop: "5px solid #198754",
              animation: "synerSpin 1.5s linear infinite",
            }}
          />

          {/* Inner Ring */}
          <div
            style={{
              position: "absolute",
              inset: "15px",
              borderRadius: "50%",
              border: "4px dashed #ffc107",
              animation: "synerSpinReverse 2s linear infinite",
            }}
          />

          {/* Logo */}
          <div
            style={{
              position: "absolute",
              inset: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 0 18px rgba(25,135,84,.3)",
              animation: "synerPulse 2s ease-in-out infinite",
            }}
          >
            <img
              src={logo}
              alt="SynerPhix"
              style={{
                width: "42px",
                height: "42px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <h5
          style={{
            marginTop: "24px",
            marginBottom: "6px",
            color: "#198754",
            fontWeight: 700,
          }}
        >
          SynerPhix Technologies
        </h5>

        <p
          style={{
            margin: 0,
            color: "#6c757d",
            fontSize: "0.95rem",
            textAlign: "center",
          }}
        >
          Engineering Smart Solutions...
        </p>
      </div>
    </>
  );
};

export default LoadingSpinner;