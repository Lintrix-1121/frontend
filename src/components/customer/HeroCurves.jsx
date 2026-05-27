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



// // HeroCurvesWithImages.jsx
// import { motion } from "framer-motion";

// export default function HeroCurvesWithImages({ images, currentSlide }) {
//   return (
//     <div className="position-absolute top-0 end-0 h-100 w-100" style={{ zIndex: 1 }}>
//       <svg
//         viewBox="0 0 1140 800"
//         className="position-absolute top-0 end-0 h-100 w-100"
//         preserveAspectRatio="none"
//         style={{ zIndex: 2 }}
//       >
//         <defs>
//           {images.map((image, index) => (
//             <pattern
//               key={index}
//               id={`image-${index}`}
//               patternUnits="userSpaceOnUse"
//               width="1440"
//               height="800"
//             >
//               <motion.image
//                 href={image}
//                 x="0"
//                 y="0"
//                 width="1440"
//                 height="800"
//                 preserveAspectRatio="xMidYMid slice"
//                 initial={{ scale: 1.2 }}
//                 animate={{ 
//                   scale: [1.2, 1, 1.2],
//                 }}
//                 transition={{
//                   duration: 20,
//                   repeat: Infinity,
//                   ease: "linear"
//                 }}
//               />
//             </pattern>
//           ))}
//         </defs>
        
//         {/* First curve filled with image */}
//         <motion.path
//           d="M400,0 C400,400 1000,300 1440,400 L1440,0 Z"
//           fill={`url(#image-${currentSlide})`}
//           initial={{ pathLength: 0, opacity: 0 }}
//           animate={{ pathLength: 1, opacity: 1 }}
//           transition={{ duration: 1 }}
//         />
        
//         {/* Second curve with gradient overlay */}
//         <motion.path
//           d="M500,0 C500,450 1100,250 1440,450 L1440,0 Z"
//           fill="url(#gradient)"
//           opacity="0.3"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 0.3 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         />
//       </svg>
      
//       {/* Animated gradient definition */}
//       <svg style={{ position: 'absolute', width: 0, height: 0 }}>
//         <defs>
//           <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#62a04f" stopOpacity="0.3">
//               <animate
//                 attributeName="stop-color"
//                 values="#62a04f; #fccf47; #62a04f"
//                 dur="8s"
//                 repeatCount="indefinite"
//               />
//             </stop>
//             <stop offset="100%" stopColor="#fccf47" stopOpacity="0.3">
//               <animate
//                 attributeName="stop-color"
//                 values="#fccf47; #62a04f; #fccf47"
//                 dur="8s"
//                 repeatCount="indefinite"
//               />
//             </stop>
//           </linearGradient>
//         </defs>
//       </svg>
//     </div>
//   );
// }