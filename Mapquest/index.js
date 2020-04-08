const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const collection = "places";

app.use(express.static('public'));
app.use(express.json());

app.get('/getLocations', (request, response) => {
    db.getDB().collection(collection).find({}).toArray((error, data) => {
        if(error) {
            console.log(error);
        }
        else {
            console.log(data);
            response.json(data);
        }
    });
})

app.put('/:id', (request, response) => {
    const placeID = request.params.id;
    const userInput = request.body;
    db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(placeID)}, {$set : {places : userInput.places}},{returnOriginal : false, upsert : true},  (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            response.json(result);
        }
    })
})

app.post('/', (request, response) => {
    const userInput = request.body;
    db.getDB().collection(collection).insertOne(userInput, (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            response.json({result : result, document : result.ops[0]});
        }
    })
})

app.delete('/:id', (request, response) => {
    const placeID = request.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(placeID)}, (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            response.json(result);
        }
    })
})

db.connect((error) => {
    if(error) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(3001, () => {
            console.log('listening at port 3001')
        });
    }
})