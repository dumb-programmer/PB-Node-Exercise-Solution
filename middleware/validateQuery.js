module.exports = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  next();
};
