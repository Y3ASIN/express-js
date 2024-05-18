/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// instance methods
todoSchema.methods = {
    findActive() {
        return mongoose.model('Todo').find({ status: 'active' });
    },
};

// static methods
todoSchema.statics = {
    findByJS() {
        return this.find({ title: /js/i });
    },
};

// query helper
todoSchema.query = {
    byLanguage(language) {
        return this.find({ title: new RegExp(language, 'i') });
    },
};

module.exports = todoSchema;
