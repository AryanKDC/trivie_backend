import catchAsync from "../utils/catchAsync.js";
import Portfolio from "../database/models/portfolio_model.js";
import { DynamicSearch } from "../utils/DynamicSearch.js";
import { dynamic_filter } from "../utils/dynamic_filter.js";

export const addPortfolio = catchAsync(async (req, res, next) => {
  console.log("Received addPortfolio request");
  console.log("Body:", req.body);
  console.log("Files:", req.files);

  const {
    projectTitle,
    category,
    challenge,
    solution,
    result
  } = req.body;

  // Extract thumbnail
  let thumbnail = req.files.thumbnail_image?.[0]?.path;

  // Extract gallery images
  let galleryImages = req.files.images_gallery?.map(f => f.path) || [];

  if (thumbnail) {
    thumbnail = thumbnail.replace(/\\/g, "/");
  }

  galleryImages = galleryImages.map(img => img.replace(/\\/g, "/"));
  if (!thumbnail || galleryImages.length === 0) {
    return res.status(400).json({
      status: false,
      message: "Please upload thumbnail and at least one gallery image",
    });
  }

  // Category is simple string based on your form: "Residential"
  const processedCategory = category || null;

  try {
    const portfolio = await Portfolio.create({
      title: projectTitle,
      category: processedCategory,
      thumbnail_image: thumbnail,
      image_gallery: galleryImages,
      the_challenge: challenge,
      our_solution: solution,
      the_result: result,
    });

    res.status(201).json({
      status: true,
      message: "Portfolio item added successfully",
      data: portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
});

export const getPortfolio = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sort = "desc",
    search = "",
  } = req.query;

  // Default search fields if not provided in body
  const {
    string = ["projectTitle", "title"],
    boolean = [],
    numbers = [],
    arrayField = ["category"],
  } = req.body.searchFields || {};

  const filter = req.body.filter || {};
  const customFilters = {};

  // Handle Title (Partial Match)
  if (filter.title) {
    customFilters.title = { $regex: filter.title, $options: "i" };
    delete filter.title;
  }

  // Handle Page (Partial Match)
  if (filter.page) {
    customFilters.page = { $regex: filter.page, $options: "i" };
    delete filter.page;
  }

  // Handle Category (Partial Match in Array)
  if (filter.category && Array.isArray(filter.category) && filter.category.length > 0) {
    const categoryRegexes = filter.category.map((category) => new RegExp(category, "i"));
    customFilters.category = { $in: categoryRegexes };
    delete filter.category;
  }

  let search_query = {};
  if (
    search &&
    typeof search === "string" &&
    !search.trim().startsWith("{") &&
    !search.trim().startsWith("[") &&
    search !== "[object Object]"
  ) {
    const search_data = DynamicSearch(
      search,
      boolean,
      numbers,
      string,
      arrayField
    );
    if (search_data?.length > 0) {
      search_query = search_data;
    }
  }

  const filterData = dynamic_filter(filter);

  const match_query = {
    ...filterData,
    ...customFilters,
    ...(Array.isArray(search_query) && search_query.length > 0
      ? { $or: search_query }
      : {}),
  };
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Match Query:", JSON.stringify(match_query, null, 2));

  const aggSort = {
    $sort: {
      [sortBy]: sort === "desc" ? -1 : 1,
    },
  };

  const aggSkip = {
    $skip: (parseInt(page) - 1) * parseInt(limit),
  };

  const aggLimit = {
    $limit: parseInt(limit),
  };

  const listAggregate = [{ $match: match_query }, aggSort, aggSkip, aggLimit];

  // Log the pipeline
  console.log("Pipeline:", JSON.stringify(listAggregate, null, 2));

  const list_aggregate = [
    { $match: match_query },
    {
      $facet: {
        data: listAggregate,
        totalCount: [
          {
            $count: "totalCount",
          },
        ],
      },
    },
  ];

  const result = await Portfolio.aggregate(list_aggregate);
  console.log("Result Count:", result[0]?.totalCount?.[0]?.totalCount || 0);
  if (result[0]?.data?.length > 0) {
    console.log("First Result Title:", result[0].data[0].title);
  }

  const total = result[0]?.totalCount?.[0]?.totalCount || 0;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: true,
    message: "Portfolio data fetched successfully",
    data: result[0]?.data || [],
    pagination: {
      total,
      page: parseInt(page),
      totalPages,
      limit: parseInt(limit),
    },
  });
});

export const getPortfolioById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const portfolio = await Portfolio.findById(id);

  if (!portfolio) {
    return res.status(404).json({
      status: false,
      message: "Portfolio item not found",
    });
  }

  res.status(200).json({
    status: true,
    message: "Portfolio item fetched successfully",
    data: portfolio,
  });
});

export const getFrontendPortfolios = catchAsync(async (req, res, next) => {
  const portfolios = await Portfolio.find().sort({ createdAt: -1 });
  res.status(200).json(portfolios);
});

export const getAllTags = catchAsync(async (req, res, next) => {
  const tags = await Portfolio.distinct("tags");
  res.status(200).json({
    status: true,
    message: "Tags fetched successfully",
    data: tags,
  });
});

export const editPortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const portfolio = await Portfolio.findById(id);

  if (!portfolio) {
    return res.status(404).json({
      status: false,
      message: "Portfolio item not found",
    });
  }

  const {
    projectTitle,
    category,
    challenge,
    solution,
    result,
    title,
    the_challenge,
    our_solution,
    the_result,
    existing_images
  } = req.body;

  let thumbnail = req.files?.thumbnail_image?.[0]?.path;
  let galleryImages = req.files?.images_gallery?.map((f) => f.path) || [];

  const updateData = {};

  if (projectTitle) updateData.title = projectTitle;
  if (title) updateData.title = title;

  if (category) updateData.category = category;

  if (challenge) updateData.the_challenge = challenge;
  if (the_challenge) updateData.the_challenge = the_challenge;

  if (solution) updateData.our_solution = solution;
  if (our_solution) updateData.our_solution = our_solution;

  if (result) updateData.the_result = result;
  if (the_result) updateData.the_result = the_result;

  if (thumbnail) {
    updateData.thumbnail_image = thumbnail.replace(/\\/g, "/");
  }

  if (existing_images !== undefined) {
    const existingImagesArray = existing_images ? JSON.parse(existing_images) : [];
    const normalizedExisting = existingImagesArray.map(img =>
      typeof img === 'string' ? img.replace(/\\/g, "/") : img
    );

    const normalizedNew = galleryImages.map(img => img.replace(/\\/g, "/"));

    updateData.image_gallery = [...normalizedExisting, ...normalizedNew];
  } else if (galleryImages.length > 0) {
    updateData.image_gallery = galleryImages.map(img => img.replace(/\\/g, "/"));
  }

  const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: "Portfolio item updated successfully",
    data: updatedPortfolio,
  });
});

export const deletePortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const portfolio = await Portfolio.findByIdAndDelete(id);

  if (!portfolio) {
    return res.status(404).json({
      status: false,
      message: "Portfolio item not found",
    });
  }

  res.status(200).json({
    status: true,
    message: "Portfolio item deleted successfully",
    data: portfolio,
  });
});