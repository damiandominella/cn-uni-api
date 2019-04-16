'use strict';

const config = require('./../config/config');
const request = require('request');
const cheerio = require('cheerio'); // load htmlDOC from string

const studyPlanController = {

    /**
     * Fetch data from url
     */
    fetch: (endpoint) => {
        return new Promise((resolve, reject) => {
            request(endpoint, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response && response.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(response);
                    }
                }
            });
        });
    },

    /**
     * Extract useful information and returns a JSON starting with HTML web page
     */
    convert: (html) => {
        return new Promise((resolve, reject) => {

            /**
             *  data is inside table.tab-list
             * 
             * tr > td > b is the year 
             * tr > td:first > a or nothig is the name of subject 
             * tr > td:last is the cfu amount
             */

            // Loading html document from string using cheerio library
            const $ = cheerio.load(html);

            let subjects = [];
            // Getting elements from html doc (jQuery like)

            // we need to distinguish between full time and part time
            let fullTimeTable = $('table.tab-list').first();

            let yearCount = 0;
            fullTimeTable.find('tr').each((index, el) => {
                let addSubject = true;
                let firstColumn = $(el).find('td').first();

                let name = firstColumn.find('a').html() || firstColumn.html();
                let link = firstColumn.find('a').attr('href');

                let year = firstColumn.find('b').html();
                if (year) {
                    yearCount++;
                    addSubject = false;
                }

                // kind of formatting data
                name = name.replace('<i>', '').replace('</i>', '');

                let lastColumn = $(el).find('td').last();
                let cfu = lastColumn.html();

                if (cfu) {
                    cfu = parseInt(cfu.replace(/&#xA0;/g).match(/\d+/)[0]); // get only the number
                }

                if (addSubject) {
                    let subject = {
                        name,
                        link: link ? config.baseSiteUrl + link : null,
                        year: yearCount > 3 ? null : yearCount,
                        cfu
                    };
                    subjects.push(subject);
                }
            });

            resolve(subjects);
        });
    },

    /**
    *  Use controller functions to retrieve and format data
    */
    get: (endpoint) => {
        return new Promise((resolve, reject) => {
            studyPlanController.fetch(endpoint)
                .then((data) => {
                    studyPlanController.convert(data).then((json) => {
                        resolve(json);
                    }).catch(reject);
                })
                .catch(reject);
        });
    },
}

module.exports = studyPlanController;