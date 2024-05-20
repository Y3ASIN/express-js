/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const checkLogin = require('../middlewares/checkLogin');

const Todo = new mongoose.model('Todo', todoSchema);

// GET all the TODO
router.get('/', checkLogin, async (req, res) => {
    console.log(req.username);
    console.log(req.userId);
    try {
        const result = await Todo.find({ status: 'active' }).select({ _id: 0, __v: 0, date: 0 });
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
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    try {
        await newTodo.save();
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
                    status: 'inactive',
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

// DELETE TODO using deleteMany
// router.delete('/:id', async (req, res) => {
//     try {
//         const result = await Todo.deleteMany({ status: 'inactive' });
//         res.status(200).json({
//             message: 'Todo was deleted successfully!',
//         });
//         console.log(result);
//     } catch (err) {
//         res.status(500).json({
//             error: 'There was a error in the server side!',
//         });
//     }
// });

module.exports = router;
