const getData = (req, selector) => {
  switch (selector) {
    case "body":
      return req.body;
    case "param":
      return req.param;
    case "query":
      return req.query;
  }
};

module.exports = (selector, schema) => (req, res, next) => {
  const parsed = schema.safeParse(getData(req, selector));
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  next();
};
