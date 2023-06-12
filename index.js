const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com', {waitUntil: 'networkidle2'});
    const pdf = await page.pdf({format: 'A4'});

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
});

app.listen(3000, () => console.log('ctrl+clic sur http://localhost:3000'));
