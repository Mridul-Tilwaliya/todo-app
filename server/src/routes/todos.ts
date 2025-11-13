import express, { Request, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Todo } from '../models/Todo';
import { createTodoSchema, updateTodoSchema } from '../utils/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all todos for authenticated user
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { completed, search } = req.query;

    const query: any = { userId };

    // Filter by completion status
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    // Search in title and description
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single todo
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userId });
    
    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// Create todo
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const validatedData = createTodoSchema.parse(req.body);

    const todo = await Todo.create({
      ...validatedData,
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// Update todo
router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const validatedData = updateTodoSchema.parse(req.body);

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { ...validatedData },
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// Delete todo
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Toggle todo completion
router.patch('/:id/toggle', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      success: true,
      message: 'Todo status updated successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

export default router;

