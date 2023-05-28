const puppeteer = require('puppeteer');
const { Pool } = require('pg');


const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: 'db',
    database: "postgres",
    port: 5432,
});

// function ipCrawler(url) {
//     (async () => {
//         const browser = await puppeteer.launch({headless: true}); //ouvre le navigateur
//         const page = await browser.newPage(); // ouvre une nouvelle page
//         await page.goto(url, {waitUntil: 'networkidle2', timeout: 0}); // va sur l'url
//
//         const dataIp = await page.evaluate(() => {
//             const titledescElements = document.querySelectorAll('.titledesc'); // récupère les éléments de la class titledesc
//
//             return [...titledescElements].map((el) => {
//                 const title = el.querySelector('.title').textContent.trim();
//                 const description = el.querySelector('.desc').textContent.trim();
//                 return { title, description };
//             });
//         });
//
//         console.log(dataIp);
//         await browser.close();
//     })();
// }
// for (let i = 1; i < 2; i++) {
//     ipCrawler('https://serveur-minecraft.com/?page=' + i);
// }



async function crawler(url) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/google-chrome',
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 0});

    const data = await page.evaluate(() => {

        const nameElement = document.querySelector('h2');
        const name = nameElement ? nameElement.innerText : '?';

        const versionElement = document.querySelectorAll('.vr')[0]?.querySelector('strong');
        const version = versionElement ? versionElement.innerText : '?';

        const ipElement = document.querySelector('.inco input');
        const ip = ipElement ? ipElement.value : 'launcher '+ name;

        const tags = document.querySelectorAll('.tag a');
        const tagList = Array.from(tags).map(tag => tag.innerText);

        const imgElement = document.querySelector('.f img');
        const img = imgElement ? imgElement.src : '?';

        const crack = tagList.includes('Cracké') ? 1 : 0;


        const maxSlotElement = document.querySelectorAll('.co')[0];
        const maxSlotText = maxSlotElement ? maxSlotElement.innerText : '?';
        const maxSlotMatch = maxSlotText.match(/(\d+) joueurs$/);
        const maxSlot = maxSlotMatch ? parseInt(maxSlotMatch[1]) : null;

        return {version, ip, tags: JSON.stringify(tagList), name, img, crack, maxSlot};
    });
    await addDataServer(data);
    console.log(data);
    await browser.close();
}


async function getHref(url, nbr) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/google-chrome',
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 0});

    if (nbr === 1) {
        await page.click('.fc-button-label');
    }

    const hrefArray = await page.$$eval('.game li .title', elements => {
        return Array.from(elements).map(a => a.getAttribute('href'));
    });

    console.log(hrefArray.length);
    return hrefArray;
}

async function initData(){
    const client = await pool.connect();
    await client.query('DROP TABLE IF EXISTS servers');
    await client.query('CREATE TABLE IF NOT EXISTS servers (ip VARCHAR, name VARCHAR, icon VARCHAR, version VARCHAR)');
    client.release();
}

async function addDataServer(data) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO servers (ip, name, icon, version, premium, tags, max_slot) VALUES ($1, $2, $3, $4, $5, $6, $7)', [data.ip, data.name, data.img, data.version, data.crack, data.tags, data.maxSlot]);
    } finally {
        client.release();
    }
}

(async () => {
    await initData();
    const url = 'https://serveur-prive.net/minecraft/page/';
    for (let i = 1; i < 3; i++) {
        let arr = await getHref(url + i, i);
        console.log(arr)
        for (let j = 3; j < arr.length; j++) {
            await crawler("https://serveur-prive.net" + arr[j]);
        }
    }
})()




