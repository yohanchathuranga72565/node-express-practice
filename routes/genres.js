const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);



router.get('/',async (req,res)=>{
    const genres = await Genre.find().sort({name:1});
    res.send(genres);
});

router.get('/:id',async (req,res)=>{
   const genre =  await Genre.findById(req.params.id);
   if(!genre) return res.status(404).send('The cource wit the given ID was not found');
   res.send(genre);
});

router.post('/', async (req, res)=>{

    console.log(req.body); 

    const { error, value } = validateCource(req.body);

    if(error){
       return res.status(404).send(error.details[0].message);
       
   }


    let genre =new Genre( {
        name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id',async (req,res)=>{

    const { error, value } = validateCource(req.body);

     if(error){
       return res.status(404).send(error.details[0].message);
        
    }

    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id,{name: req.body.name},{
            new: true
        });
    }
    catch(err){
        res.send("can't find the id");
    }
    

    if(!genre){
        return res.status(404).send('The genre with the given ID was not found');
    } 
  

    res.send(genre);
  
});

router.delete('/:id', async (req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
});

function validateCource(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

module.exports = router;