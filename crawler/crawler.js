const puppeteer = require('puppeteer');
const { Pool } = require('pg');


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'db',
    database: process.env.POSTGRES_DB,
    port: 5432,
});
createTable();

async function createTable(){
    const client = await pool.connect();
    try {
        await client.query('DROP TABLE IF EXISTS servers');
        await client.query('CREATE TABLE IF NOT EXISTS servers(ip varchar(170) PRIMARY KEY,name VARCHAR(75),icon varchar(255), version varchar(150), premium BIT, tags text[], max_slot INT);');
    }catch (err) {
        console.log(err);
    }finally{
        client.release();
    }
}

async function crawler(url) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/google-chrome',
        headless: "new",
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
        console.log(tagList);
        return {ip, name, img, version, crack, tags: Array.from(tagList), maxSlot};
    });
    await addDataServer(data);
    console.log(data);
    await browser.close();
}


async function getHref(url, nbr) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/google-chrome',
        headless: "new",
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

async function addDataServer(data) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO servers (ip, name, icon, version, premium, tags, max_slot) VALUES ($1, $2, $3, $4, $5, $6, $7)', [data.ip, data.name, data.img, data.version, data.crack, data.tags, data.maxSlot]);
    } finally {
        client.release();
    }
}

(async () => {
    const url = 'https://serveur-prive.net/minecraft/page/';
    for (let i = 1; i < 3; i++) {
        let arr = await getHref(url + i, i);
        console.log(arr)
        for (let j = 3; j < arr.length; j++) {
            await crawler("https://serveur-prive.net" + arr[j]);
        }
    }
})()