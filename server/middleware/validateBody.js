module.exports = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  console.log(parsed.error);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  next();
};
