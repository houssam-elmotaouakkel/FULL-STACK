const dataService = require('../services/dataService');


const getProducts = (req, res, next) => {
  try {
    console.log('product API est appelé');
    console.log('query params:', req.query);
    
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice, 
      maxPrice: req.query.maxPrice,
      sort: req.query.sort
    };
    
    const products = dataService.getProducts(filters);
    
    const response = {
      products: products,
      total: products.length,
      filters: filters,
      timestamp: new Date().toISOString()
    };
    
    console.log(`${products.length} produits retournés`);
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Erreur dans getProducts:', error);
  next(new AppError('Erreur lors de la récupération des produits', 500));
  }
};


const getCategories = (req, res, next) => {
  try {
    console.log('categories API est appelé');
    
    const categories = dataService.getCategories();
    
    res.status(200).json({
      categories: categories,
      total: categories.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erreur dans getCategories:', error);
    next(new AppError('Erreur lors de la récupération des catégories', 500));
  }
};

module.exports = {
  getProducts,
  getCategories
};