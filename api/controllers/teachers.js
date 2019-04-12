'use strict';

/**
 * This controller handles blog and news
 */

const config = require('./../config/config');
const request = require('request');
const cheerio = require('cheerio'); // load htmlDOC from string

const teachers_controller = {

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
            const $ = cheerio.load(html, {
                normalizeWhitespace: true,
                xmlMode: false
            });

            // Getting elements from html doc (jQuery like)

            let teacherDivsSelector = 'div.threecol';
            let teachers = [];
            $(teacherDivsSelector).each((index, el) => {
                if (index > 2) { // skipping first 2 items, since are coordinator and manager
                    // name is the nearest h3 in this div
                    let name = $(el).find('h3').html();

                    // imgUrl must be composed in this way because some images are relative path and some are absolute
                    let imgUrl = config.baseSiteUrl + $(el).find('img').attr('src').replace(config.baseSiteUrl, '');

                    /** getting the useful info from the content, since it's not formatted
                        we are splitting the <p> content between <br> tags, then shifting the array (deleting the index 0),
                        of the array since we don't need it, so we have now an array: [email, phone, reception_hours]
                    */
                    let content = $(el).find('p').html();
                    let info = content.split('<br>');
                    info.shift();

                    let email = info[0].replace("\n", '');
                    let phone = info[1] ? info[1].replace("\n", '') : null; // maybe not set
                    let reception_hours = info[2] ? info[2].replace('\n', '') : null; // maybe not set

                    let teacher = { name, imgUrl, email, phone, reception_hours };

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
            teachers_controller.fetch(endpoint)
                .then((data) => {
                    teachers_controller.convert(data).then((json) => {
                        resolve(json);
                    }).catch(reject);
                })
                .catch(reject);
        });
    },
}

module.exports = teachers_controller;