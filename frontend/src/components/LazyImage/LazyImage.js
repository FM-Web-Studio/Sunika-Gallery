import React, { useEffect, useRef, useState } from 'react';

// ============================================
// LAZY IMAGE COMPONENT
// ============================================
// Progressive image loading and unloading with Intersection Observer
// Automatically loads images when entering viewport and unloads when exiting
// Significantly reduces memory usage and improves performance for image-heavy pages

// ============================================
// COMPONENT DEFINITION
// ============================================

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  style,
  threshold = 0.1,
  rootMargin = '50px',
  unloadMargin = '400px',
  enableUnload = true,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  onLoad,
  onUnload,
  ...props
}) => {
  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // ----------------------------------------
  // Intersection Observer Effect
  // ----------------------------------------
  // Observes when image enters/exits viewport for loading/unloading
  
  useEffect(() => {
    const currentRef = imgRef.current;
    
    // Exit early if ref is not available
    if (!currentRef) return;

    // Create observer for loading/unloading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is entering viewport - load it
            setIsInView(true);
          } else if (enableUnload) {
            // Image is leaving viewport - unload it to save memory
            setIsInView(false);
            setIsLoaded(false);
            
            // Trigger unload callback if provided
            if (onUnload) {
              onUnload();
            }
          }
        });
      },
      {
        threshold,
        rootMargin: enableUnload ? unloadMargin : rootMargin
      }
    );

    // Start observing
    observer.observe(currentRef);

    // Cleanup on unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, unloadMargin, enableUnload, onUnload]);

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onLoad={handleLoad}
      {...props}
    />
  );
};

// ============================================
// EXPORTS
// ============================================

export default LazyImage;