const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle2' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
}

app.post('/generate-pdf', async function (req, res) {
  // Extract form data from request
  let formData = req.body;

  console.log(__dirname);
  console.log(formData);

  // Render your EJS template with the form data
  let html = await new Promise((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, 'public', 'ticket.ejs'), formData, {}, function (err, str) {
      if (err) return reject(err);
      resolve(str);
    });
  });

  // Use Puppeteer to generate a PDF from the HTML
  const pdf = await generatePdfFromHtml(html);

  // Send the PDF as the response
  res.setHeader('Content-Disposition', 'attachment; filename=ticket-' + formData.model + '.pdf');
  res.contentType('application/pdf');
  res.send(pdf);
});


app.listen(3000, () => console.log('Server running on port 3000'));
