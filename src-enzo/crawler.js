const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://serveur-prive.net/minecraft/page/';
const totalPages = 10;
const servers = [];

async function crawlPage(page) {
    try {
        const url = baseUrl + page;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('li.pre').each((index, element) => {
            const server = {};
            const $element = $(element);
            const imageSrc = $element.find('.cover img.lazy').attr('data-src');

            server.title = $element.find('.desc a.title').text().trim();
            server.description = $element.find('.desc p').text().trim();
            server.imageSrc = imageSrc;
            server.votes = $element.find('.right .if:nth-child(1)').text().trim();
            server.clicks = $element.find('.right .if:nth-child(2)').text().trim();
            server.reviews = $element.find('.right .if:nth-child(3)').text().trim();
            server.rating = $element.find('.bottom .rate').children('i.fas.fa-star').length;
            server.tags = [];
            $element.find('.bottom .tag a').each((index, tagElement) => {
                server.tags.push($(tagElement).text().trim());
            });

            servers.push(server);
        });

        console.log(`Page ${page} crawled successfully.`);
    } catch (error) {
        console.error(`Error crawling page ${page}: ${error}`);
    }
}

async function crawlAllPages() {
    for (let page = 1; page <= totalPages; page++) {
        await crawlPage(page);
    }

    saveData();
}

function saveData() {
    const data = JSON.stringify(servers, null, 2);
    fs.writeFile('savecraw/servers.json', data, (error) => {
        if (error) {
            console.error(`Error saving data: ${error}`);
        } else {
            console.log('Data saved successfully.');
        }
    });
}

crawlAllPages();
