import { AppError } from "./errorMiddleware.js";

/**
 * Admin yetkisi kontrolü middleware
 * protect middleware'den sonra kullanılmalıdır
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Yetkisiz işlem. Önce giriş yapmalısınız.", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("Bu işlem için admin yetkisi gereklidir.", 403));
  }

  next();
};

/**
 * Resource ownership veya admin yetkisi kontrolü
 * Kullanıcı kendi kaynaklarına erişebilir veya admin tüm kaynaklara erişebilir
 */
export const requireOwnershipOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Yetkisiz işlem. Önce giriş yapmalısınız.", 401)
      );
    }

    const isOwner = req.user._id.toString() === resourceUserId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Bu kaynağa erişim yetkiniz bulunmuyor.", 403));
    }

    next();
  };
};

/**
 * Conditional admin middleware - admin ise ek bilgiler döner
 */
export const conditionalAdmin = (req, res, next) => {
  // Admin kullanıcılar için ek veri bayrakları set et
  req.isAdmin = req.user && req.user.role === "admin";

  if (req.isAdmin) {
    req.includeAdminData = true; // Controllers'da kullanılabilir
  }

  next();
};

/**
 * Rate limiting bypass for admin users
 */
export const adminRateLimitBypass = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    req.skipRateLimit = true;
  }
  next();
};

/**
 * Admin action logger - admin işlemlerini loglar
 */
export const logAdminActions = (action) => {
  return (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      console.log(
        `[ADMIN ACTION] User: ${
          req.user.email
        }, Action: ${action}, Time: ${new Date().toISOString()}`
      );

      // Gelecekte database'e log kaydı yapılabilir
      // await AdminLog.create({
      //   admin: req.user._id,
      //   action: action,
      //   details: req.body,
      //   ip: req.ip,
      //   timestamp: new Date()
      // });
    }
    next();
  };
};

/**
 * Feature flag middleware - belirli özellikleri sadece admin için aktif et
 */
export const featureFlag = (featureName) => {
  return (req, res, next) => {
    const adminFeatures = [
      "bulk_operations",
      "advanced_analytics",
      "user_management",
      "battle_management",
    ];

    if (adminFeatures.includes(featureName)) {
      if (!req.user || req.user.role !== "admin") {
        return next(
          new AppError(
            "Bu özellik şu anda sadece admin kullanıcılar için aktif.",
            403
          )
        );
      }
    }

    next();
  };
};
