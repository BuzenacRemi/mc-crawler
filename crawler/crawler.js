const puppeteer = require('puppeteer');

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
        executablePath: '/usr/bin/google-chrome',
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 0});

    const data = await page.evaluate(() => {
        const versionElement = document.querySelectorAll('.vr')[0]?.querySelector('strong');
        const version = versionElement ? versionElement.innerText : '?';

        const ipElement = document.querySelector('.inco input');
        const ip = ipElement ? ipElement.value : '?';

        const tags = document.querySelectorAll('.tag a');
        const tagList = Array.from(tags).map(tag => tag.innerText);

        const nameElement = document.querySelector('h2');
        const name = nameElement ? nameElement.innerText : '?';

        const imgElement = document.querySelector('.f img');
        const img = imgElement ? imgElement.src : '?';

        return {version, ip, tagList, name, img};
    });
    console.log(data);
    await browser.close();
}


async function getHref(url, nbr) {
    const browser = await puppeteer.launch({
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

(async () => {
    const url = 'https://serveur-prive.net/minecraft/page/';
    for (let i = 1; i < 3; i++) {
        let arr = await getHref(url + i, i);
        console.log(arr)
        for (let j = 0; j < arr.length; j++) {
            await crawler("https://serveur-prive.net" + arr[j]);
        }
    }
})()




