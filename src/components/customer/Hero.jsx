import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCurves from "./HeroCurves";
import logo from "../../assets/logo/logo.png";
import img1 from '../../assets/partners/harris.jpg'
import img2 from '../../assets/partners/prime.jpg'

export default function Hero() {
  const [index, setIndex] = useState(0);

 const slides = [
  {
    title: "Born To Secure Your LPG Systems.",
    description:
      "Design, install and maintain your LPG equipment with expert solutions.",
    image: logo,
    curve1: "#62a04f",
    curve2: "#fccf47",
    animation: "slideLeft",
  },
  {
    title: "Precision Engineering. Maximum Safety.",
    description:
      "Advanced LPG control systems built with certified safety standards.",
    image: img1,
    curve1: "#1e3a8a",
    curve2: "#60a5fa",
    animation: "zoom",
  },
  {
    title: "Reliable Industrial Gas Solutions.",
    description:
      "From installation to maintenance, we power industries efficiently.",
    image: img2,
    curve1: "#7c3aed",
    curve2: "#c084fc",
    animation: "fadeUp",
  },
];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[index];

  // 🎯 Different animation styles
  const getAnimation = () => {
    switch (currentSlide.animation) {
      case "slideLeft":
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 },
        };
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
        };
      case "fadeUp":
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -40 },
        };
      default:
        return {};
    }
  };

  const animation = getAnimation();

  return (
    <div className="position-relative overflow-hidden py-5 bg-light">

      {/* CURVES */}
      {/* <HeroCurves
        color1={currentSlide.curve1}
        color2={currentSlide.curve2}
      /> */}

      {/* IMAGE INSIDE CURVE AREA */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide.image}
          src={currentSlide.image}
          alt="Hero"
          className="position-absolute end-0 top-50 translate-middle-y pe-5"
          style={{ width: "40%", zIndex: 1 }}
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ duration: 1.4 }}
        />
      </AnimatePresence>

      {/* TEXT CONTENT */}
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="col-md-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            >
              <h1 className="fw-bold">{currentSlide.title}</h1>
              <p className="text-muted mt-3">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import HeroCurves from "./HeroCurves";
// import logo from "../../assets/logo/logo.png";
// import logo2 from "../../assets/logo/logo2.png"; // Add more images
// import logo3 from "../../assets/logo/logo3.png";

// export default function Hero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [direction, setDirection] = useState(0);

//   // Content for each slide
//   const slides = [
//     {
//       id: 1,
//       title: "Born To Secure Your LPG Systems.",
//       description: "Design, install and maintain your LPG equipment with expert solutions.",
//       image: logo,
//       curveColor: "#62a04fff",
//       secondaryColor: "#fccf47ff"
//     },
//     {
//       id: 2,
//       title: "Innovation in Gas Safety.",
//       description: "Advanced monitoring systems for complete peace of mind.",
//       image: logo2,
//       curveColor: "#4a7c9a",
//       secondaryColor: "#e67e22"
//     },
//     {
//       id: 3,
//       title: "24/7 Professional Support.",
//       description: "Round-the-clock assistance for all your LPG needs.",
//       image: logo3,
//       curveColor: "#8e44ad",
//       secondaryColor: "#3498db"
//     }
//   ];

//   // Auto-slide functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       handleSlideChange((currentSlide + 1) % slides.length, 1);
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [currentSlide]);

//   const handleSlideChange = (newIndex, newDirection) => {
//     setDirection(newDirection);
//     setCurrentSlide(newIndex);
//   };

//   const handleDotClick = (index) => {
//     if (index !== currentSlide) {
//       handleSlideChange(index, index > currentSlide ? 1 : -1);
//     }
//   };

//   // Animation variants
//   const textVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 100 : -100,
//       opacity: 0
//     }),
//     center: {
//       x: 0,
//       opacity: 1
//     },
//     exit: (direction) => ({
//       x: direction < 0 ? 100 : -100,
//       opacity: 0
//     })
//   };

//   const imageVariants = {
//     enter: (direction) => ({
//       scale: 0.8,
//       opacity: 0,
//       rotateY: direction > 0 ? 45 : -45
//     }),
//     center: {
//       scale: 1,
//       opacity: 1,
//       rotateY: 0
//     },
//     exit: (direction) => ({
//       scale: 0.8,
//       opacity: 0,
//       rotateY: direction < 0 ? 45 : -45
//     })
//   };

//   return (
//     <div className="position-relative bg-light" style={{ minHeight: "600px", overflow: "hidden" }}>
//       {/* Curves with animations */}
//       <HeroCurves 
//         color={slides[currentSlide].curveColor}
//         secondaryColor={slides[currentSlide].secondaryColor}
//         currentSlide={currentSlide}
//       />
      
//       {/* Main content */}
//       <div className="container d-flex align-items-center py-5" style={{ minHeight: "600px", position: "relative", zIndex: 2 }}>
//         <div className="row w-100 align-items-center">
//           {/* Text content with AnimatePresence */}
//           <div className="col-md-6">
//             <AnimatePresence mode="wait" custom={direction}>
//               <motion.div
//                 key={currentSlide}
//                 custom={direction}
//                 variants={textVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   duration: 0.5,
//                   ease: "easeInOut"
//                 }}
//               >
//                 <motion.h1 
//                   className="fw-bold display-4 mb-4"
//                   initial={{ y: 20 }}
//                   animate={{ y: 0 }}
//                   transition={{ delay: 0.2, duration: 0.5 }}
//                 >
//                   {slides[currentSlide].title}
//                 </motion.h1>
//                 <motion.p 
//                   className="text-muted lead"
//                   initial={{ y: 20 }}
//                   animate={{ y: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5 }}
//                 >
//                   {slides[currentSlide].description}
//                 </motion.p>
//               </motion.div>
//             </AnimatePresence>
//           </div>
          
//           {/* Image with AnimatePresence */}
//           <div className="col-md-6">
//             <AnimatePresence mode="wait" custom={direction}>
//               <motion.div
//                 key={currentSlide}
//                 custom={direction}
//                 variants={imageVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   duration: 0.6,
//                   ease: [0.16, 1, 0.3, 1] // Custom easing for smooth effect
//                 }}
//               >
//                 <motion.img
//                   src={slides[currentSlide].image}
//                   alt={`Slide ${currentSlide + 1}`}
//                   className="img-fluid rounded-3"
//                   style={{ 
//                     maxHeight: "400px", 
//                     objectFit: "contain",
//                     filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))"
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* Navigation dots with animations */}
//       <motion.div 
//         className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3"
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         style={{ zIndex: 3 }}
//       >
//         {slides.map((_, index) => (
//           <motion.button
//             key={index}
//             onClick={() => handleDotClick(index)}
//             className="nav-dot"
//             style={{
//               width: "12px",
//               height: "12px",
//               borderRadius: "50%",
//               border: "none",
//               backgroundColor: index === currentSlide ? slides[currentSlide].curveColor : "#ddd",
//               cursor: "pointer",
//               padding: 0
//             }}
//             whileHover={{ scale: 1.3 }}
//             whileTap={{ scale: 0.9 }}
//             animate={index === currentSlide ? {
//               scale: [1, 1.2, 1],
//               transition: { duration: 0.5, repeat: Infinity }
//             } : {}}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </motion.div>
//     </div>
//   );
// }


