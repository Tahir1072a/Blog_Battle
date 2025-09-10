import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WinnerBadge } from "../blog/WinnerBadge";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";

export function SwipeableCard({ blogs, onVote, disabled, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isVoting, setIsVoting] = useState(false);

  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentBlog = blogs[currentIndex];
  const nextBlog = blogs[currentIndex === 0 ? 1 : 0];

  // Swipe threshold
  const SWIPE_THRESHOLD = 100;

  const handleDragEnd = async (event, info) => {
    if (disabled || isVoting) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine if swipe was strong enough
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      const swipeDirection = offset > 0 ? 1 : -1;
      await handleSwipeVote(swipeDirection);
    } else {
      // Snap back to center
      x.set(0);
    }
  };

  const handleSwipeVote = async (swipeDirection) => {
    if (disabled || isVoting) return;

    setIsVoting(true);
    setDirection(swipeDirection);

    try {
      // Right swipe = vote for current blog, Left swipe = vote for other blog
      const votedBlogId = swipeDirection > 0 ? currentBlog._id : nextBlog._id;
      await onVote(votedBlogId);
    } catch (error) {
      console.error("Vote failed:", error);
      // Reset position on error
      x.set(0);
      setIsVoting(false);
    }
  };

  const handleButtonVote = async (blogId) => {
    if (disabled || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(blogId);
    } catch (error) {
      console.error("Vote failed:", error);
      setIsVoting(false);
    }
  };

  // Reset motion values when blogs change
  useEffect(() => {
    x.set(0);
    setIsVoting(false);
    setDirection(0);
  }, [blogs, x]);

  if (!currentBlog || !nextBlog) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Savaş yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative h-[600px] overflow-hidden">
      {/* Instructions */}
      <div className="text-center mb-4 px-4">
        <p className="text-sm text-gray-600 mb-2">
          Kartı sola veya sağa kaydırarak oy verin
        </p>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>{nextBlog.title.substring(0, 20)}...</span>
          </div>
          <div className="flex items-center">
            <span>{currentBlog.title.substring(0, 20)}...</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Swipeable Card Container */}
      <div ref={constraintsRef} className="relative w-full h-full">
        {/* Background Card (Next Blog) */}
        <div className="absolute inset-4 opacity-50">
          <Card className="h-full border-dashed border-2 border-gray-300">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-gray-500">
                {nextBlog.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={nextBlog.imageUrl}
                alt={nextBlog.title}
                className="w-full h-40 object-cover rounded mb-3 opacity-70"
              />
              <p className="text-sm text-gray-400 text-center">Sola kaydır</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Swipeable Card */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          style={{ x, rotate, opacity }}
          onDragEnd={handleDragEnd}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          animate={
            isVoting ? { x: direction * 300, opacity: 0 } : { x: 0, opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card
            className={`h-full shadow-lg ${className} ${
              disabled ? "opacity-50" : ""
            }`}
          >
            <WinnerBadge level={currentBlog.round} />

            <CardHeader>
              <img
                src={currentBlog.imageUrl}
                alt={currentBlog.title}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-4 text-lg">
                {currentBlog.title}
              </CardTitle>
              <p className="text-sm font-semibold text-blue-700">
                Seviye: {currentBlog.round}
              </p>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 line-clamp-4">
                {currentBlog.content.substring(0, 200)}...
              </p>
              <div className="mt-4 text-xs text-gray-500">
                <p>Yazar: {currentBlog.author?.name || "Bilinmiyor"}</p>
                <p>Kategori: {currentBlog.category}</p>
              </div>
            </CardContent>
          </Card>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full opacity-0"
            style={{
              opacity: useTransform(x, [-200, -50, 0], [1, 0.7, 0]),
            }}
          >
            <X className="h-6 w-6" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-500 text-white p-3 rounded-full opacity-0"
            style={{
              opacity: useTransform(x, [0, 50, 200], [0, 0.7, 1]),
            }}
          >
            <Heart className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* Button Controls (for non-touch devices) */}
      <div className="flex justify-center space-x-4 mt-6 md:hidden">
        <button
          onClick={() => handleButtonVote(nextBlog._id)}
          disabled={disabled || isVoting}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white p-4 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          onClick={() => handleButtonVote(currentBlog._id)}
          disabled={disabled || isVoting}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white p-4 rounded-full transition-colors"
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      {/* Loading Overlay */}
      {isVoting && (
        <motion.div
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="loading-spinner h-8 w-8 border-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Oyunuz kaydediliyor...</p>
          </div>
        </motion.div>
      )}

      {/* Voting Instructions (Hidden on touch devices) */}
      <div className="hidden md:block text-center mt-4 text-xs text-gray-500">
        <p>Masaüstünde: Kartı sürükleyin veya butonları kullanın</p>
      </div>
    </div>
  );
}

// Hook for swipe gestures
export function useSwipe(onSwipeLeft, onSwipeRight, threshold = 100) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
