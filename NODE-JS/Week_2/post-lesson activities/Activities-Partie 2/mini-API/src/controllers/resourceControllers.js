const resourceService = require('../services/resourceService');
const AppError = require ('../utils/appError');

const getAll = (req, res, next) => {
    try {
    const resources = resourceService.findAll();

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    
    const paginatedResources = resources.slice(startIndex, endIndex);

    res.status(200).json({
        data: paginatedResources,
        currentPage: page,
        totalPages: Math.ceil(resources.length / limit),
        totalItem: resources.length,
        hasNext: endIndex < resources.length,
        hasPrev: startIndex > 0
    });
    } catch (error) {
        next(new AppError("erruer fl'recuperation dyal resources", 500));
    }
};


const getById = (req, res, next) => {
    try {
        const resourceId = req.params.id;
        if (!resourceId) {
            return next(new AppError('ID dyal Ressource makinch sf ghayrha', 400));
        }

        const resource = resourceService.findById(resourceId);

        if (!resource) {
            return next(new AppError('mal9inach had l\'Id li ktebti jib chi Id s7i7', 404));
        }

        res.status(200).json(resource);

    } catch (error) {
        next(new AppError('erreur f\'getById', 500));
    }
};


const createResource = (req, res, next) => {
      try {
        const {title} = req.body;

        if (!title || title.trim() === '') {
            return next(new AppError('titre makinch, blast titre daroria', 400));
        }

        const newResourceData = {
            title: title.trim()
        };

        const newResource = resourceService.create(newResourceData);

        res.status(201).json(newResource);
      } catch (error) {
       next(new AppError('erreur fl\'creation dyal resource', 500));
  }
};


const updateResource = (req, res,next) => {
    try {
        const resourceId = req.params.id;

        if (!resourceId) {
            return next(new AppError('ID khawi, l\'ID darori bach n9albo 3la resource', 400));
        }

    const existingResource = resourceService.findById(resourceId);
    if (!existingResource) {
      return next(new AppError('mal9inach had Ressource', 404));
    }
    


    const {title} = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();

    const updatedResource = resourceService.update(resourceId, updateData);
    res.status(200).json(updatedResource);

  } catch (error) {
    next(new AppError('erreur fl\'updatedResource', 500));
  }
};


const deleteResource = (req, res) => {
    try {
        const resourceId = req.params.id;

        if (!resourceId) {
            return next(new AppError('id khawi, l\'ID dyal resource darori', 400));
        }
        
        const existingResource = resourceService.findById(resourceId);
        if (!existingResource) {
          return next(new AppError('Ressource makinch, maymknch tmse7 had resource', 404));
        }
    
        const isDeleted = resourceService.deleteById(resourceId);
    
        if (isDeleted) {
          res.status(204).send(); // No content
        } else {
          return next(new AppError('Errer fl\'msi7 dyal hdchi', 500));
        }
    } catch (error) {
        next(new AppError('erreur f\'deletResource', 500));
  }
};


module.exports = {
    getAll,
    getById,
    createResource,
    updateResource,
    deleteResource
};