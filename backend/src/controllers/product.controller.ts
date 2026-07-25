import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { productSearchSchema } from '../schemas/product.schema.js';

export class ProductController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = productSearchSchema.parse(req.query);
      const result = await ProductService.searchProducts(params);
      res.status(200).json(ApiResponse.success('Products retrieved successfully', result.products, result.meta));
    } catch (error) { next(error); }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      res.status(200).json(ApiResponse.success('Product details retrieved', product));
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json(ApiResponse.success('Product details retrieved', product));
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(ApiResponse.success('Product created successfully', product));
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json(ApiResponse.success('Product updated successfully', product));
    } catch (error) { next(error); }
  }
}

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductService.getAllCategories();
      res.status(200).json(ApiResponse.success('Categories retrieved successfully', categories));
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ProductService.getCategoryById(req.params.id);
      res.status(200).json(ApiResponse.success('Category retrieved', category));
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ProductService.createCategory(req.body);
      res.status(201).json(ApiResponse.success('Category created successfully', category));
    } catch (error) { next(error); }
  }
}
