const express = require('express');
const router = express.Router();
const Movie = require("../model/movie");

router.use(require('../middleware/auth'));

router.get('/', async function(req, res){
    try {
        const movies = await Movie.find({user_id: req.user._id});
        res.json(movies);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "server error!"})
    }
});

router.post('/', async function(req, res){
    try {
        const { movie_name,
        rating,
        cast,
        genre,
        release_date } = req.body;

        if (!movie_name) {
            res.status(422).json({message: "Movie name is required."});
        }
        const oldMovie = await Movie.findOne({ movie_name, user_id: req.user._id });

        if (oldMovie) {
            return res.status(409).json({message:"Movie Already Exist."});
        }

        const movie = await Movie.create({
            movie_name,
            rating,
            cast,
            genre,
            release_date,
            user_id: req.user._id
        });

        res.status(201).json(movie);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "server error!"})
    }
});

router.put('/:id', async function(req, res){
    try {
        const {
        movie_name,
        rating,
        cast,
        genre,
        release_date } = req.body;
        
        if (!req.params.id) {
            res.status(404).json({message: "Movie id param missing."});
        }

        if (!movie_name) {
            res.status(422).json({message: "Movie name is required."});
        }
        const oldMovie = await Movie.findOne({ _id: req.params.id, user_id: req.user._id });

        if (!oldMovie) {
            return res.status(404).json({message:"Movie not found."});
        }

        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            movie_name,
            rating,
            cast,
            genre,
            release_date
        }, {new: true});

        res.status(200).json(movie);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "server error!"})
    }
});

router.delete('/:id', async function(req, res){
    try {

        if (!req.params.id) {
            res.status(404).json({message: "Movie id param missing."});
        }

        const oldMovie = await Movie.findOne({ _id: req.params.id, user_id: req.user._id });

        if (!oldMovie) {
            return res.status(404).json({message:"Movie not found."});
        }

        await oldMovie.deleteOne();

        res.status(200).json({message: "Movie Successfully Deleted!"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "server error!"})
    }
});

module.exports = router;