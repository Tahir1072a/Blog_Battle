import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { X, Heart } from "lucide-react";
import { WinnerBadge } from "../blog/WinnerBadge";

export function SwipeableCard({ battle, onVote, disabled }) {
  const { blog1, blog2 } = battle;

  const x = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  const rightIconOpacity = useTransform(x, [50, 150], [0, 1]);
  const leftIconOpacity = useTransform(x, [-150, -50], [1, 0]);

  const leftCardScale = useTransform(x, [-100, 0], [1.05, 1]);
  const leftCardOpacity = useTransform(x, [-100, 0], [1, 0.8]);

  const rightCardScale = useTransform(x, [0, 100], [1, 1.05]);
  const rightCardOpacity = useTransform(x, [0, 100], [0.8, 1]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;

    if (info.offset.x > 100) {
      onVote(blog2._id);
    } else if (info.offset.x < -100) {
      onVote(blog1._id);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 px-4">
        <h2 className="text-xl font-bold mb-2">Hangisini tercih edersiniz?</h2>
        <p className="text-gray-600 text-sm">
          Sola kaydır ← • Sağa kaydır → • Veya kartlara tıklayın
        </p>
      </div>

      <div className="w-full h-[500px] relative flex items-center justify-center">
        <motion.div
          style={{ scale: leftCardScale, opacity: leftCardOpacity }}
          className="absolute left-0 w-[45%] h-full cursor-pointer"
          onClick={() => !disabled && onVote(blog1._id)}
        >
          {/* Sol Kart */}
          <div className="relative w-full h-full rounded-2xl shadow-lg bg-white border flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <WinnerBadge level={blog1.round} />
            <div className="w-full h-1/2 flex-shrink-0">
              <img
                src={blog1.imageUrl}
                alt={blog1.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {blog1.title}
              </h3>
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Seviye: {blog1.round}
              </p>
              <p className="text-sm text-gray-600 line-clamp-4 flex-grow">
                {blog1.content}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ scale: rightCardScale, opacity: rightCardOpacity }}
          className="absolute right-0 w-[45%] h-full cursor-pointer"
          onClick={() => !disabled && onVote(blog2._id)}
        >
          {/* Sağ Kart */}
          <div className="relative w-full h-full rounded-2xl shadow-lg bg-white border flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <WinnerBadge level={blog2.round} />
            <div className="w-full h-1/2 flex-shrink-0">
              <img
                src={blog2.imageUrl}
                alt={blog2.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {blog2.title}
              </h3>
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Seviye: {blog2.round}
              </p>
              <p className="text-sm text-gray-600 line-clamp-4 flex-grow">
                {blog2.content}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          style={{ x, rotate }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        >
          <motion.div
            style={{ opacity: leftIconOpacity }}
            className="absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2 p-4 border-4 border-blue-500 rounded-full text-blue-500 pointer-events-none bg-white shadow-lg"
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>

          <motion.div
            style={{ opacity: rightIconOpacity }}
            className="absolute top-1/2 right-[25%] transform translate-x-1/2 -translate-y-1/2 p-4 border-4 border-green-500 rounded-full text-green-500 pointer-events-none bg-white shadow-lg"
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-gray-300 rounded-full"></div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center font-bold text-gray-600 shadow-md z-20">
        VS
      </div>

      <div className="flex justify-center space-x-8 mt-8">
        <button
          onClick={() => !disabled && onVote(blog1._id)}
          disabled={disabled}
          className="px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sol Kartı Seç
        </button>
        <button
          onClick={() => !disabled && onVote(blog2._id)}
          disabled={disabled}
          className="px-6 py-3 rounded-lg border-2 border-green-500 text-green-500 hover:bg-green-50 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sağ Kartı Seç
        </button>
      </div>
    </div>
  );
}
