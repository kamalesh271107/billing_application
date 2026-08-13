export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ success: false, message: `Validation Error: ${formattedErrors}` });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};
