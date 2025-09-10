import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = "md",
  text = "",
  className = "",
  fullScreen = false,
  color = "primary",
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const colorClasses = {
    primary: "border-blue-200 border-t-blue-600",
    secondary: "border-gray-200 border-t-gray-600",
    white: "border-white/30 border-t-white",
    success: "border-green-200 border-t-green-600",
    danger: "border-red-200 border-t-red-600",
  };

  const spinner = (
    <div
      className={cn(
        "loading-spinner animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={text || "Yükleniyor"}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
        {text && (
          <p className="mt-4 text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        {spinner}
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      </div>
    );
  }

  return spinner;
}

export function SkeletonLoader({ className = "", lines = 3, width = "full" }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-gray-200 rounded",
            width === "full" ? "w-full" : `w-${width}`,
            index === lines - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={cn("border rounded-lg p-6 animate-pulse", className)}>
      <div className="h-48 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function ButtonSpinner({ size = "sm", className = "" }) {
  return (
    <LoadingSpinner
      size={size}
      color="white"
      className={cn("mr-2", className)}
    />
  );
}

export function PageLoader({ text = "Sayfa yükleniyor..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 animate-pulse">{text}</p>
    </div>
  );
}

export function ListLoader({ count = 3, type = "card" }) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader
          key={index}
          lines={2}
          className="p-4 border rounded-lg"
        />
      ))}
    </div>
  );
}
