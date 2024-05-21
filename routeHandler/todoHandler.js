/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const checkLogin = require('../middlewares/checkLogin');

const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);

// GET all the TODO
router.get('/', checkLogin, async (req, res) => {
    try {
        const result = await Todo.find({})
            .populate('user', 'name username -_id')
            .select({ _id: 0, __v: 0, date: 0 });
        res.status(200).json({
            result,
            message: 'Success!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a error in the server side!',
        });
    }
});

// GET Active TODO
router.get('/active', async (req, res) => {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
        data,
    });
});

// GET Static TODO
router.get('/js', async (req, res) => {
    try {
        const data = await Todo.findByJS();
        res.status(200).json({
            data,
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
});

// GET Using Query Helper
router.get('/language', async (req, res) => {
    const data = await Todo.find().byLanguage('js');
    res.status(200).json({
        data,
    });
});

// GET a TODO
router.get('/:id', checkLogin, async (req, res) => {
    try {
        const result = await Todo.find({ _id: req.params.id }).select({ _id: 0, __v: 0, date: 0 });
        res.status(200).json({
            result,
            message: 'Success!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a error in the server side!',
        });
    }
});

// POST a TODO
router.post('/', checkLogin, async (req, res) => {
    const newTodo = new Todo({ ...req.body, user: req.userId });
    try {
        const todo = await newTodo.save();
        await User.updateOne(
            { _id: req.userId },
            {
                $push: {
                    todos: todo._id,
                },
            }
        );
        res.status(200).json({
            message: 'Todo inserted successfully!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was an error on server side!',
        });
    }
});

// POST multiple TODO
router.post('/all', async (req, res) => {
    try {
        await Todo.insertMany(req.body);
        res.status(200).json({
            message: 'Todo were inserted successfully!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was an error on server side!',
        });
    }
});

// PUT TODO for update
router.put('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    status: 'active',
                },
            },
            { new: true }
        );
        res.status(200).json({
            message: 'Todo was updated successfully!',
        });
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: 'There was an error on server side!',
        });
    }
});

// DELETE TODO
router.delete('/:id', async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id });
        res.status(200).json({
            message: 'Todo was deleted successfully!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a error in the server side!',
        });
    }
});

// DELETE Multiple TODO using deleteMany
router.delete('/', async (req, res) => {
    try {
        const result = await Todo.deleteMany({ status: 'active' });
        res.status(200).json({
            message: 'All todo was deleted successfully!',
        });
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: 'There was a error in the server side!',
        });
    }
});

module.exports = router;
