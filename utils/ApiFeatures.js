class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    let filteredQuery = { ...this.queryStr };

    const excludedKeys = ["keyword", "limit", "page"];
    excludedKeys.forEach((key) => delete filteredQuery[key]);

    //Filter for pricing and rating
    let queryString = JSON.stringify(filteredQuery); //queryStrCopy is object and replace works only on string
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (operator) => `$${operator}`
    );
    // gte beomes $gte and simlar for all others. It is done for MongoDB command
    // $gte = greater than or equal to
    // $gt = greater than
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }
  pagination(resultPerPage) {
    const currPage = Number(this.queryStr.page) || 1; //by default 1st page will be shown
    const skip = resultPerPage * (currPage - 1); //number of products to be skipped from starting on going from 1 page to other
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
module.exports = ApiFeatures;
