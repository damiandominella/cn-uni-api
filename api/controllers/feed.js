'use strict';

/**
 * This controller handles blog and news
 */

const request = require('request');
const parseXmlString = require('xml2js').parseString;

const feedController = {

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
     * Converts xml to json
     */
    convert: (xml) => {
        return new Promise((resolve, reject) => {
            parseXmlString(xml, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // List of items we want are located at this point
                    let items = result.rss.channel[0].item;

                    // Getting only the necessary data and kind of parsing in into objects instead of arrays
                    let output = [];
                    items.forEach((item) => {
                        let object = {
                            title: item.title[0],
                            link: item.link[0],
                            pubDate: new Date(item.pubDate[0]),
                            author: item['dc:creator'][0],
                            content: item.description[0],
                            contentEncoded: item['content:encoded'][0]
                        };

                        output.push(object);
                    });

                    resolve(output);
                }
            });
        });
    },

    /**
    *  Use controller functions to retrieve and format data
    */
    get: (endpoint) => {
        return new Promise((resolve, reject) => {
            feedController.fetch(endpoint)
                .then((data) => {
                    feedController.convert(data).then((json) => {
                        resolve(json);
                    }).catch(reject);
                })
                .catch(reject);
        });
    },
}

module.exports = feedController;