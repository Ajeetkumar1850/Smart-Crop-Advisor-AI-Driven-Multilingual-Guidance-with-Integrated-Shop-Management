const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({

        name: { 
            type: String, 
            required: true
         },
        role: { 
            type: String, 
            required: true 
        },
        age: { 
            type: Number
        },
         salary: { 
            type: Number
         },
          contact: { 
            type: String 
        }
       
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);