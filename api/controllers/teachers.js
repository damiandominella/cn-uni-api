'use strict';

const config = require('./../config/config');
const request = require('request');
const cheerio = require('cheerio'); // load htmlDOC from string

const teachersController = {

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
             * List of teachers are divided in rows (div with class .feature-row)
             * Under each row, search for the div .threecol
             * Under each div.threecol > h3 is the name of teacher
             * Then, there is the following structure
             * 
             * p > a href (imgURL) > img src (imgURL) > br [email] br [phone] br [reception_hours]
             * 
             */

            // Loading html document from string using cheerio library
            const $ = cheerio.load(html);

            // Getting elements from html doc (jQuery like)

            let teacherDivsSelector = 'div.threecol';
            let teachers = [];
            $(teacherDivsSelector).each((index, el) => {
                if (index > 2) { // skipping first 2 items, since are coordinator and manager
                    // name is the nearest h3 in this div
                    let name = $(el).find('h3').text();

                    // imgUrl must be composed in this way because some images are relative path and some are absolute
                    let imgUrl = config.baseSiteUrl + $(el).find('img').attr('src').replace(config.baseSiteUrl, '');

                    /** getting the useful info from the content, since it's not formatted
                        we are splitting the <p> content between <br> tags, then shifting the array (deleting the index 0),
                        of the array since we don't need it, so we have now an array: [email, phone, receptionHours]
                    */
                    let content = $(el).find('p').text();

                    let info = content.split('\n');
                    info.shift();

                    let email, phone, receptionHours = null;

                    if (info.length === 3) {
                        email = info[0];
                        phone = info[1];
                        receptionHours = info[2];
                    } else if (info.length === 1) {
                        // there are some teachers that are in different format
                        // we need another way to retrieve their data
                        const separator = 'Ricevimento';
                        let splitted = info[0].split(separator);
                        email = splitted[0];
                        receptionHours = separator + splitted[1];
                    }

                    let teacher = { name, imgUrl, email, phone, receptionHours };

                    teachers.push(teacher);
                }
            });

            resolve(teachers);
        });
    },

    /**
    *  Use controller functions to retrieve and format data
    */
    get: (endpoint) => {
        return new Promise((resolve, reject) => {
            teachersController.fetch(endpoint)
                .then((data) => {
                    teachersController.convert(data).then((json) => {
                        resolve(json);
                    }).catch(reject);
                })
                .catch(reject);
        });
    },
}

module.exports = teachersController;