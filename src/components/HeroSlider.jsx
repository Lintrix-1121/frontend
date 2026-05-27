import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export default function HeroSlider() {
  // Later this comes from backend API
  const slides = [
    "/hero-1.png",
    "/hero-2.png",
    "/hero-3.png",
  ];

  return (
    <div className="relative w-full h-80 md:h-96">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="w-full h-full"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
