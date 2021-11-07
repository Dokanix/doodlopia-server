export default function setOptions(req, res, next) {
  const options = {
    page: Number(req.query.page ?? 1),
    limit: 20,
    sort: req.query.sort ?? '-addedAt',
  };

  res.locals.options = options;

  next();
}
