const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs-extra')
const json2csv = require('json2csv');

const writeStream = fs.createWriteStream("productData.csv");


const URL = 'https://www.quill.com/hanging-file-folders/cbk/122567.html';
const products=[];

async function getHTML () {
    const {data: html} = await axios.get(URL);
    return html;
}


getHTML().then((res) => {

        const $ = cheerio.load(res)
        $('.search-product-card').each((i, ele) => {

            if(i>=10) return;
            
            const name = $(ele).find('div > div.col.js-middleSection.p-0 > div.row.row-cols-1.product-card-main > div.col.js-productSection.product-name-wrap.py-0.col-12 > span > a').text().trim();
            const price = $(ele).find('div.col.js-middleSection.p-0 > div.row.row-cols-1.product-card-main > div.col.js-pricingSection.pricing-section-wrap.py-0.col-12 > div.mb-3 > div.d-block > div > div > div > div > div:nth-child(2) > div.h6.mb-1.savings-highlight-wrap > span').text().trim();
            const SKU = $(ele).find(' div > div.col.js-middleSection.p-0 > div.row.row-cols-1.product-card-main > div.col.js-productSection.product-name-wrap.py-0.col-12 > div.row.mt-2.pt-1.GEffortFindNum > div').text();
            const item_no = i;
            const category="Folders"
        
            console.log("Price", price);
            console.log("Desc", name);
            console.log("SKU", SKU);

            products.push({name, price, item_no, SKU, category});
            
        })

        const fields = ['name', 'price', 'item_no', 'SKU', 'category'];
        const csv = json2csv.parse(products, { fields });

        writeStream.write(csv);

        // Close the write stream
        writeStream.end();
    }).catch((err) => {
        console.log('Error', err);
    });