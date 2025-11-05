const resourceService = require('../services/resourceService');

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
        console.error('error fhad getAll:', error);
        next(error);
    }
};


const getById = (req, res, next) => {
    try {
        const resourceId = req.params.id;
        if (!resourceId) {
            return res.status(404).json({
                error: ' ID dyal Ressource not found sf ghayrha',
                message: `makin hta chi resource bhad l'ID: ${req.params.id}`
            });
        }

        const resource = resourceService.findById(resourceId);

        if (!resource) {
            return res.status(404).json({
                error: 'ressource makinach',
                message: `makin hta resource bhad l'Id: ${resourceId}`
            });
        }

        res.status(200).json(resource);

    } catch (error) {
        console.error('erreur f\'getById:', error);
        next(error);
    }
};


const createResource = (req, res, next) => {
      try {
        const {title} = req.body;

        if (!title || title.trim() === '') {
            return res.status(404).json({
                error: 'titre makinch',
                message: 'blast "titre" daroria'
            });
        }

        const newResourceData = {
            title: title.trim()
        };

        const newResource = resourceService.create(newResourceData);

        res.status(201).json(newResource);
      } catch (error) {
        console.error('erreur fl\'creation dyal resource:', error);
        next(error);
  }
};


const updateResource = (req, res,next) => {
    try {
        const resourceId = req.params.id;

        if (!resourceId) {
            return res.status(404).json({
                error: 'ID khawi',
                message: 'l\'ID darori bach n9albo 3la resource'
            });
        }

    const existingResource = resourceService.findById(resourceId);
    if (!existingResource) {
      return res.status(404).json({
        error: 'Ressource mal9inahach',
        message: `maymknch tbedl hdchi -had ressource ${req.params.id} makinach`
      });
    }
    


    const {title} = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();

    const updatedResource = resourceService.update(resourceId, updateData);


    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('erreur fl\'updatedResource:', error);
    next(error);
  }
};


const deleteResource = (req, res) => {
    try {
        const resourceId = req.params.id;

        if (!resourceId) {
            return res.status(404).json({
                error: 'id khawi',
                message: 'l\'ID dyal resource darori'
            });
        }
        
        const existingResource = resourceService.findById(resourceId);
        if (!existingResource) {
          return res.status(404).json({
            error: 'Ressource makinch',
            message: `maymknch tmse7 had resource - had ressource ${resourceId} makinch asln`
          });
        }
    
        const isDeleted = resourceService.deleteById(resourceId);
    
        if (isDeleted) {
          res.status(204).send(); // No content
        } else {
          res.status(500).json({
            error: 'Errer fl\'msi7 dyal hdchi'
          });
        }
    } catch (error) {
        console.error('erreur f\'deletResource:', error);
        next(error);
  }
};


module.exports = {
    getAll,
    getById,
    createResource,
    updateResource,
    deleteResource
};