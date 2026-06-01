import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCurves from "./HeroCurves";
import controllers from "../../assets/controllers.jpg";
import sensors from '../../assets/sensor.jpg'
import passive from '../../assets/passive.jpg'

export default function Hero() {
  const [index, setIndex] = useState(0);

 const slides = [
  {
    title: "Modern & Professional Products.                ",
    description:
      "Discover high-quality electronics components and innovative software solutions designed to power your projects and accelerate  your success.",
    image: controllers,
    curve1: "#62a04f",
    curve2: "#fccf47",
    animation: "slideLeft",
  },
  {
    title: "Your Trusted Source for Electronics & Software.",
    description:
      "From essential electronics components to cutting-edge software applications, we provide the tools that drive technological advancement.",
    image: sensors,
    curve1: "#1e3a8a",
    curve2: "#60a5fa",
    animation: "zoom",
  },
  {
    title: "Future Ready Technology Solutions.             ",
    description:
      "Where innovation meets technology, Synerphix delivers scalable systems streamlined to your operational needs.",
    image: passive,
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

