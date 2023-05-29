const puppeteer = require('puppeteer');
const { Pool } = require('pg');


const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: 'db',
    database: "postgres",
    port: 5432,
});

createTable();

async function createTable(){
    const client = await pool.connect();
    try {
        await client.query('DROP TABLE IF EXISTS servers');
        await client.query('CREATE TABLE IF NOT EXISTS servers(ip varchar(50) PRIMARY KEY,name VARCHAR(75),icon varchar(255), version varchar(150), premium BIT, tags text[], max_slot INT);');

        /*client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.funcraft.fr\',\'Funcraft\',\'https://pbs.twimg.com/profile_images/1083667374379855872/kSsOCKM7_400x400.jpg\',\'1.8.9\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.hypixel.com\',\'Hypixel\',\'https://hypixel.net/styles/hypixel-v2/images/hypixel.png\',\'1.9.x\',\'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\',\'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.8\', \'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.8\',\'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.14.2\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.10\',\'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', \'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.6.4\', \'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.2.5\', \'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
        client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.6.2\', \'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');*/
    }catch (err) {
        console.log(err);
    }finally{
        client.release();
    }
}


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