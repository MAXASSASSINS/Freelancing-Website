class Features {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keywords = this.queryStr.keyword ?  this.queryStr.keyword.split(",") : [];
    let query = {};
    if (keywords.length > 0) {
      query = {
        $or: keywords.map((kw) => ({
          $or: [
            { title: { $regex: kw, $options: "i" } },
            { searchTags: { $regex: kw, $options: "i" } },
          ],
        })),
      };
    }

    this.query = this.query.find({ ...query });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // removing some fields for category
    const removeFileds = ["keyword", "page", "limit"];
    removeFileds.forEach((key) => delete queryCopy[key]);

    // fiter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  populate() {
    this.query = this.query.populate("user", "name avatar");
    return this;
  }

  select() {
    this.query = this.query.select("title pricing images ratings numOfRatings searchTags");
    return this;
  }

}

export default Features;
