import Product from "../models/product-model.js"
import { AppError } from "../utils/app-error.js"

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    // Add the current user as the creator
    req.body.createdBy = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((field) => delete queryObj[field])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    // Execute query
    const products = await query

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update a product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    // Check if user is the creator of the product
    if (product.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new AppError("You do not have permission to update this product", 403))
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    // Check if user is the creator of the product
    if (product.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new AppError("You do not have permission to delete this product", 403))
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

