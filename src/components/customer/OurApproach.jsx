// export default function OurApproach() {
//   return (
//     <section className="py-5">
//       <div className="container">
//         <div className="row align-items-center">

//           {/* Left Column */}
//           <div className="col-md-5 mb-4">
//             <h2 className="fw-bold">Our Approach</h2>

//             <div
//               style={{
//                 width: "60px",
//                 height: "3px",
//                 background: "#f4b400",
//                 marginTop: "10px"
//               }}
//             />
//           </div>

//           {/* Right Column */}
//           <div className="col-md-7">

//             {/* Icons */}
//             <div className="d-flex gap-4 mb-4">

//               <i className="bi bi-lightning-charge fs-1"></i>

//               <i className="bi bi-building fs-1"></i>

//               <i className="bi bi-gear fs-1"></i>

//             </div>

//             <h3 className="fw-light mb-3">
//               Delivering Safe, Reliable LPG Engineering & Distribution Solutions
//             </h3>

//             <p className="text-muted">
//               At Lintrix LPG Engineering & Distributors, we provide end-to-end LPG
//               solutions including system design, installation, maintenance, and
//               bulk gas distribution. Our operations comply strictly with national
//               and international safety standards, ensuring dependable energy
//               supply for residential, commercial, and industrial clients.
//             </p>

//             <p className="text-muted">
//               From pipeline engineering and storage systems to cylinder supply and
//               safety audits, our experienced technical team guarantees efficiency,
//               compliance, and long-term reliability. We prioritize customer
//               safety, operational excellence, and sustainable energy delivery.
//             </p>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



export default function OurApproach() {
  return (
    <section
      className="py-5"
      style={{ backgroundColor: "#0b1d33" }}   // Dark navy
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Left Column */}
          <div className="col-md-5 mb-4">
            <h2 className="fw-bold text-white">Our Approach</h2>

            <div
              style={{
                width: "60px",
                height: "3px",
                background: "#f4b400",
                marginTop: "10px"
              }}
            />
          </div>

          {/* Right Column */}
          <div className="col-md-7">

            {/* Icons */}
            <div className="d-flex gap-4 mb-4 text-white">

              <i className="bi bi-lightning-charge fs-1"></i>

              <i className="bi bi-building fs-1"></i>

              <i className="bi bi-gear fs-1"></i>

            </div>

            <h3 className="fw-light mb-3 text-white">
              Delivering Safe, Reliable LPG Engineering & Distribution Solutions
            </h3>

            <p style={{ color: "#cfd8e3" }}>
              At SynerPhix Uganda Limited, we provide end-to-end LPG
              solutions including system design, installation, maintenance and
              bulk gas distribution. Our operations comply strictly with national
              and international safety standards, ensuring dependable energy
              supply for residential, commercial and industrial clients.
            </p>

            <p style={{ color: "#cfd8e3" }}>
              From pipeline engineering and storage systems to cylinder supply and
              safety audits, our experienced technical team guarantees efficiency,
              compliance and long-term reliability. We prioritize customer
              safety, operational excellence and sustainable energy delivery.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

