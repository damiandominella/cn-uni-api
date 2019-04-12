'use strict';

const feed_controller = require('./../controllers/feed');
const teachers_controller = require('./../controllers/teachers');
const study_plan_controller = require('./../controllers/study_plan');

const config = require('./../config/config');

const routes = (app) => {
    // News endpoint, retrieves data from the bulletin board
    app.route('/news').get((req, res) => {
        feed_controller.get(config.endpoints.news).then((data) => {
            res.json({ data: data, count: data.length });
        }).catch((error) => {
            res.status(500).send(error);
        });
    });

    // Blog endpoint, retrieves data from the blog
    app.route('/blog').get((req, res) => {
        feed_controller.get(config.endpoints.blog).then((data) => {
            res.json({ data: data, count: data.length });
        }).catch((error) => {
            res.status(500).send(error);
        });
    });

    // Teachers endpoint, scrapes the data from the teachers page
    app.route('/teachers').get((req, res) => {
        teachers_controller.get(config.endpoints.teachers).then((data) => {
            res.json({ data: data, count: data.length });
        }).catch((error) => {
            res.status(500).send(error);
        });
    });

    // Study plan endpoint, scrapes the data from the study plan page
    app.route('/study_plan').get((req, res) => {
        study_plan_controller.get(config.endpoints.study_plan).then((data) => {
            res.json({ data: data, count: data.length });
        }).catch((error) => {
            res.status(500).send(error);
        });
    });
};

module.exports = routes;
