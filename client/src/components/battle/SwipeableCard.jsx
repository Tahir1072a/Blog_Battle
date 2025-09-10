import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SwipeableCard({ battle, onVote, disabled }) {
  const { blog1, blog2 } = battle;

  const x = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  const rightIconOpacity = useTransform(x, [10, 100], [0, 1]);
  const leftIconOpacity = useTransform(x, [-100, -10], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;

    if (info.offset.x > 100) {
      onVote(blog1._id);
    } else if (info.offset.x < -100) {
      onVote(blog2._id);
    }
  };

  return (
    <div className="w-full max-w-sm h-[550px] mx-auto relative flex flex-col items-center justify-center">
      <div className="text-center mb-4 px-4 h-[50px]">
        <p className="text-sm text-gray-600">
          Beğendiğini sağa, diğerini sola kaydır.
        </p>
      </div>

      <div className="w-full h-[450px] relative flex items-center justify-center">
        <Card className="absolute h-[95%] w-[95%] bg-gray-100 rounded-2xl">
          <CardHeader>
            <CardTitle className="truncate text-center text-gray-400">
              {blog2.title}
            </CardTitle>
          </CardHeader>
        </Card>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.5}
          onDragEnd={handleDragEnd}
          style={{ x, rotate }}
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Card className="w-full h-full rounded-2xl shadow-xl flex flex-col overflow-hidden border">
            <div className="w-full h-1/2 flex-shrink-0">
              <img
                src={blog1.imageUrl}
                alt={blog1.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{blog1.title}</CardTitle>
              <p className="text-sm font-semibold text-blue-600 pt-1">
                Seviye: {blog1.round}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-4">
                {blog1.content}
              </p>
            </CardContent>

            <motion.div
              style={{ opacity: rightIconOpacity }}
              className="absolute top-1/2 left-4 -translate-y-1/2 p-4 bg-green-500/80 rounded-full text-white pointer-events-none"
            >
              <Heart size={32} />
            </motion.div>
            <motion.div
              style={{ opacity: leftIconOpacity }}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-4 bg-red-500/80 rounded-full text-white pointer-events-none"
            >
              <X size={32} />
            </motion.div>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center space-x-8 mt-6 h-[50px]">
        <Button
          onClick={() => !disabled && onVote(blog2._id)}
          disabled={disabled}
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600"
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          onClick={() => !disabled && onVote(blog1._id)}
          disabled={disabled}
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600"
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
