import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for detecting swipe gestures on touch devices
 * @param {Object} config - Configuration object
 * @param {Function} config.onSwipeLeft - Callback for left swipe
 * @param {Function} config.onSwipeRight - Callback for right swipe
 * @param {Function} config.onSwipeUp - Callback for up swipe
 * @param {Function} config.onSwipeDown - Callback for down swipe
 * @param {number} config.threshold - Minimum distance for a swipe (default: 50)
 * @param {number} config.velocityThreshold - Minimum velocity for a swipe (default: 0.3)
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 0.3,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const elementRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const time = Date.now() - touchStartTime;
    const velocityX = Math.abs(distanceX) / time;
    const velocityY = Math.abs(distanceY) / time;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const hasMinDistance =
      Math.abs(distanceX) > threshold || Math.abs(distanceY) > threshold;
    const hasMinVelocity =
      velocityX > velocityThreshold || velocityY > velocityThreshold;

    if (!hasMinDistance && !hasMinVelocity) return;

    if (isHorizontalSwipe) {
      // Horizontal swipes
      if (distanceX > 0 && onSwipeLeft) {
        onSwipeLeft({
          distance: distanceX,
          velocity: velocityX,
          duration: time,
        });
      } else if (distanceX < 0 && onSwipeRight) {
        onSwipeRight({
          distance: Math.abs(distanceX),
          velocity: velocityX,
          duration: time,
        });
      }
    } else {
      // Vertical swipes
      if (distanceY > 0 && onSwipeUp) {
        onSwipeUp({
          distance: distanceY,
          velocity: velocityY,
          duration: time,
        });
      } else if (distanceY < 0 && onSwipeDown) {
        onSwipeDown({
          distance: Math.abs(distanceY),
          velocity: velocityY,
          duration: time,
        });
      }
    }
  };

  const bindSwipeEvents = (element) => {
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
  };

  const unbindSwipeEvents = (element) => {
    if (!element) return;

    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      bindSwipeEvents(element);
      return () => unbindSwipeEvents(element);
    }
  }, []);

  return {
    ref: elementRef,
    touchEvents: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Simplified swipe hook for horizontal swipes only
 */
export function useHorizontalSwipe(onSwipeLeft, onSwipeRight, threshold = 100) {
  return useSwipe({
    onSwipeLeft: onSwipeLeft ? (data) => onSwipeLeft(data) : undefined,
    onSwipeRight: onSwipeRight ? (data) => onSwipeRight(data) : undefined,
    threshold,
  });
}

/**
 * Hook for detecting swipe direction without callbacks
 */
export function useSwipeDetection(threshold = 50) {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const { ref, touchEvents } = useSwipe({
    onSwipeLeft: () => setSwipeDirection("left"),
    onSwipeRight: () => setSwipeDirection("right"),
    onSwipeUp: () => setSwipeDirection("up"),
    onSwipeDown: () => setSwipeDirection("down"),
    threshold,
  });

  useEffect(() => {
    if (swipeDirection) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setSwipeDirection(null);
        setIsActive(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection]);

  return {
    ref,
    swipeDirection,
    isActive,
    touchEvents,
  };
}

/**
 * Hook for card stack swipe (Tinder-like)
 */
export function useCardSwipe(onSwipeAction) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipeAction = (direction, data) => {
    if (onSwipeAction) {
      onSwipeAction({
        direction,
        ...data,
      });
    }
    // Reset position after swipe
    setDragOffset({ x: 0, y: 0 });
  };

  const { ref, touchEvents } = useSwipe({
    onSwipeLeft: (data) => handleSwipeAction("left", data),
    onSwipeRight: (data) => handleSwipeAction("right", data),
    threshold: 100,
    velocityThreshold: 0.5,
  });

  return {
    ref,
    dragOffset,
    isDragging,
    touchEvents: {
      ...touchEvents,
      onTouchStart: (e) => {
        setIsDragging(true);
        touchEvents.onTouchStart(e);
      },
      onTouchEnd: (e) => {
        setIsDragging(false);
        touchEvents.onTouchEnd(e);
      },
    },
  };
}
