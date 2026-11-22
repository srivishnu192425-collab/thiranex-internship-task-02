const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', taskController.getStats);
router.get('/activities', taskController.getActivities);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);

router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
