'use strict';

const config = require('./../config/config');
const express = require('express');
const router = express.Router();

const feedController = require('./../controllers/feed');
const teachersController = require('./../controllers/teachers');
const studyPlanController = require('./../controllers/study_plan');

// News endpoint, retrieves data from the bulletin board
router.get('/news', (req, res) => {
    feedController.get(config.endpoints.news).then((data) => {
        res.json({ data: data, count: data.length });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// Blog endpoint, retrieves data from the blog
router.get('/blog', (req, res) => {
    feedController.get(config.endpoints.blog).then((data) => {
        res.json({ data: data, count: data.length });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// Teachers endpoint, scrapes the data from the teachers page
router.get('/teachers', (req, res) => {
    teachersController.get(config.endpoints.teachers).then((data) => {
        res.json({ data: data, count: data.length });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// Study plan endpoint, scrapes the data from the study plan page
router.get('/study_plan', (req, res) => {
    studyPlanController.get(config.endpoints.study_plan).then((data) => {
        res.json({ data: data, count: data.length });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

module.exports = router;
