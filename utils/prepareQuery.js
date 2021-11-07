export default function prepareQuery(query, options) {
  query
    .find({})
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  return query;
}
