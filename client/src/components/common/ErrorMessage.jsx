import { AlertCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorMessage({
  message = "Bir hata oluştu",
  title,
  type = "error",
  variant = "default",
  onRetry,
  onDismiss,
  className = "",
  showIcon = true,
  fullPage = false,
}) {
  const typeStyles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconMap = {
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const Icon = iconMap[type];

  const content = (
    <div
      className={cn(
        "border rounded-lg p-4",
        typeStyles[type],
        fullPage && "max-w-md mx-auto",
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <Icon
            className={cn(
              "h-5 w-5 mt-0.5 mr-3 flex-shrink-0",
              type === "error" && "text-red-500",
              type === "warning" && "text-yellow-500",
              type === "info" && "text-blue-500"
            )}
          />
        )}

        <div className="flex-1 min-w-0">
          {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>

          {(onRetry || onDismiss) && (
            <div className="flex items-center space-x-2 mt-3">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className={cn(
                    "text-xs",
                    type === "error" &&
                      "border-red-300 text-red-700 hover:bg-red-100",
                    type === "warning" &&
                      "border-yellow-300 text-yellow-700 hover:bg-yellow-100",
                    type === "info" &&
                      "border-blue-300 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tekrar Dene
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-xs"
                >
                  Kapat
                </Button>
              )}
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Hatayı kapat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        {content}
      </div>
    );
  }

  return content;
}

export function NetworkError({ onRetry, ...props }) {
  return (
    <ErrorMessage
      title="Bağlantı Hatası"
      message="Sunucuya bağlanırken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin."
      onRetry={onRetry}
      {...props}
    />
  );
}

export function NotFoundError({ entity = "sayfa", ...props }) {
  return (
    <ErrorMessage
      title="Bulunamadı"
      message={`Aradığınız ${entity} bulunamadı veya kaldırılmış olabilir.`}
      type="warning"
      {...props}
    />
  );
}

export function PermissionError({ ...props }) {
  return (
    <ErrorMessage
      title="Erişim Engellendi"
      message="Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor."
      type="warning"
      {...props}
    />
  );
}

export function ValidationError({ errors = [], ...props }) {
  const errorList = Array.isArray(errors) ? errors : [errors];

  return (
    <ErrorMessage
      title="Form Hatası"
      message={
        <ul className="list-disc list-inside space-y-1">
          {errorList.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      }
      type="warning"
      {...props}
    />
  );
}

export function ErrorFallback({ error, resetError }) {
  return (
    <ErrorMessage
      title="Beklenmeyen Hata"
      message="Uygulamada beklenmeyen bir hata oluştu. Sayfayı yeniden yüklemeyi deneyin."
      onRetry={resetError}
      fullPage
      className="my-8"
    />
  );
}

export function ErrorToast({ message, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <ErrorMessage
        message={message}
        onDismiss={onClose}
        className="shadow-lg"
      />
    </div>
  );
}
