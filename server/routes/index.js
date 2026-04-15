const express = require('express');
const controllers = require('../controllers');
const authMiddleware = require('../middleware/authMiddleware');

const createRouter = (controller) => {
    const router = express.Router();
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);

    // Protect routes that modify data
    router.post('/', authMiddleware, controller.create);
    router.put('/:id', authMiddleware, controller.update);
    router.delete('/:id', authMiddleware, controller.delete);
    return router;
};

module.exports = {
    skillRoutes: createRouter(controllers.skills),
    projectRoutes: createRouter(controllers.projects),
    experienceRoutes: createRouter(controllers.experience),
    blogRoutes: createRouter(controllers.blogs),
    messageRoutes: createRouter(controllers.messages)
};
