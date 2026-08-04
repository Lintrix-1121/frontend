import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

const ProductsCarousel = ({
  products = [],
  onAddToCart,
  isInCart,
  cartQuantity,
  basePath = '/shop',
  title = 'Featured Products',
  limit = 12,
  autoPlayInterval = 5000,
  pauseOnHover = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive items
  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      if(width < 576){
        setItemsPerSlide(1);
      }
      else if(width < 768){
        setItemsPerSlide(2);
      }
      else if(width < 992){
        setItemsPerSlide(3);
      }
      else{
        setItemsPerSlide(4);
      }
    };
    updateItems();
    window.addEventListener(
      'resize',
      updateItems
    );

    return () =>
      window.removeEventListener(
        'resize',
        updateItems
      );
  }, []);

  const displayProducts = useMemo(() => {
      return products.slice(0, limit);
    },[
      products,
      limit
  ]);

  const totalSlides = Math.ceil(
    displayProducts.length / itemsPerSlide
  );

  const slides = useMemo(()=>{
    const result=[];
    for(
      let i=0;
      i<totalSlides;
      i++
    ){
      result.push(
        displayProducts.slice(
          i * itemsPerSlide,
          i * itemsPerSlide + itemsPerSlide
        )
      );
    }
    return result;
  },[
    displayProducts,
    itemsPerSlide,
    totalSlides
  ]);
  // Auto play
  useEffect(()=>{
    if(
      totalSlides <= 1 ||
      isPaused
    ){
      return;
    }
    const timer=setInterval(()=>{
      setCurrentIndex(
        prev =>
        (prev + 1) % totalSlides
      );
    },autoPlayInterval);
    return ()=>clearInterval(timer);
  },[
    totalSlides,
    isPaused,
    autoPlayInterval
  ]);

  const nextSlide=()=>{
    setCurrentIndex(
      prev =>
      (prev + 1) % totalSlides
    );
  };
  const prevSlide=()=>{
    setCurrentIndex(
      prev =>
      (prev - 1 + totalSlides) % totalSlides
    );
  };
  if(!displayProducts.length){

    return null;

  }
  const handleAddToCart =
    onAddToCart ||
    (
      product =>
      toast.success(
        `${product.name} added`
      )
    );
  const checkCart =
    isInCart ||
    (()=>false);
  const getQuantity =
    cartQuantity ||
    (()=>0);
return (
  <div
  className="mb-5"
  onMouseEnter={()=>
    pauseOnHover &&
    setIsPaused(true)
  }
  onMouseLeave={()=>
    pauseOnHover &&
    setIsPaused(false)
  }
  >
    {
    title &&
    <h3 className="mb-4">
    {title}
    </h3>
    }
    <div
    className="position-relative"
    style={{
      overflow:'hidden'
    }}
    >
      <div
      className="d-flex"
      style={{
      transform:
      `translateX(-${currentIndex * 100}%)`,
      transition:
      'transform .5s ease',
      width:
      `${totalSlides * 100}%`
      }}
      >
        {
        slides.map(
        (slide,index)=>(
        <div
        key={index}
        className="d-flex flex-wrap"
        style={{
        flex:'0 0 100%'
        }}
        >
        {
        slide.map(product=>{
        const id =
        product.productId ||
        product.id;

        return (
        <div
          key={id}
          className={`col-${12/itemsPerSlide}`}
          style={{
          padding:'0 .75rem'
          }}
          >
          <ProductCard
          product={product}
          onAddToCart={handleAddToCart}
          isInCart={
          checkCart(id)
          }
          cartQuantity={
          getQuantity(id)
          }
          basePath={basePath}
          />
          </div>
          );
          })
          }
          </div>
          ))
          }
        </div>
          {
          totalSlides > 1 &&
          <>
          <button
          className="
          btn btn-light
          position-absolute
          top-50
          start-0
          translate-middle-y
          rounded-circle
          shadow
          "
          style={{
          width:40,
          height:40,
          zIndex:2
          }}
          onClick={prevSlide}
          >
          <ChevronLeft/>
          </button>
          <button
          className="
          btn btn-light
          position-absolute
          top-50
          end-0
          translate-middle-y
          rounded-circle
          shadow
          "
          style={{
          width:40,
          height:40,
          zIndex:2
          }}
          onClick={nextSlide}
          >
          <ChevronRight/>
          </button>
          </>
          }
        </div>
      {
      totalSlides > 1 &&
      <div className="
      d-flex
      justify-content-center
      gap-2
      mt-3
      ">
      {
      Array.from({
      length:totalSlides
      })
      .map((_,i)=>(
      <button
      key={i}
      onClick={()=>
      setCurrentIndex(i)
      }
      className="btn p-0"
      style={{
      width:10,
      height:10,
      borderRadius:'50%',
      border:'none',
      background:
      i===currentIndex
      ?
      '#28a745'
      :
      '#dee2e6'
      }}
      />
      ))
      }
    </div>
    }
  </div>
);
};

export default ProductsCarousel;