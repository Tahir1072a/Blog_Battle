// @desc    Dosya yükler ve dosya yolunu döner
// @route   POST /api/upload
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Lütfen bir dosya seçin." });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    message: "Dosya başarıyla yüklendi.",
    imageUrl: fileUrl,
  });
};
