const express = require('express');
const controllers = require('../controllers');

const createRouter = (controller) => {
    const router = express.Router();
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    return router;
};

module.exports = {
    skillRoutes: createRouter(controllers.skills),
    projectRoutes: createRouter(controllers.projects),
    experienceRoutes: createRouter(controllers.experience),
    blogRoutes: createRouter(controllers.blogs),
    messageRoutes: createRouter(controllers.messages)
};
