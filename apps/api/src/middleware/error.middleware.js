export function errorHandler(error, _req, res, _next) {
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (error?.name === 'ZodError') return res.status(400).json({ message: 'Оруулсан мэдээллээ шалгана уу.', details: error.issues });
  if (error?.code === 'P2002') return res.status(409).json({ message: 'Ижил утгатай мэдээлэл бүртгэлтэй байна.' });
  console.error(error);
  res.status(500).json({ message: 'Серверт алдаа гарлаа.' });
}
