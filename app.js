const axios = require('axios');
const fs = require('fs');
const xl = require('excel4node');
var inquirer = require('inquirer');
const {
  formatTimePrice,
  writeHeaderToCell,
  writeDataToCell
} = require('./utils');

var question = [
  {
    type: 'input',
    name: 'secret',
    message: 'Enter your KEEPA secret key: '
  }
];

var questions = [
  {
    type: 'input',
    name: 'ASIN',
    message: 'Enter an ASIN: '
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Want to enter another ASIN? (just hit enter for YES)?',
    default: true
  }
];

var ASIN = [];
let secret = null;

const dataModel = {
  title: null,
  variationCSV: null,
  csv0: null,
  csv1: null,
  csv3: null,
  csv4: null,
  csv10: null
};

inquirer.prompt(question).then(answer => {
  secret = answer.secret;
  ask();
});

function ask() {
  inquirer.prompt(questions).then(answers => {
    ASIN.push(answers.ASIN);
    if (answers.askAgain) {
      ask();
    } else {
      console.log('Your ASINs:', ASIN.join(', '));

      const configArray = ASIN.map(asin => {
        return {
          url: 'https://api.keepa.com/product',
          method: 'GET',
          headers: {
            'Content-Encoding': 'gzip'
          },
          params: {
            key: secret,
            domain: 1,
            asin: asin,
            offers: 100
          }
        };
      });

      const wb = new xl.Workbook();

      configArray.forEach((config, index) => {
        const ws = wb.addWorksheet(`ASIN: ${ASIN[index]}`);

        axios(config)
          .then(response => {
            fs.writeFileSync('./data', JSON.stringify(response.data));
            const product = response.data.products[0];
            dataModel.title = product.title;
            dataModel.variationCSV =
              product.variationCSV && product.variationCSV.split(',');
            dataModel.csv0 = formatTimePrice(product.csv[0], true);
            dataModel.csv1 = formatTimePrice(product.csv[1], true);
            dataModel.csv3 = formatTimePrice(product.csv[3]);
            dataModel.csv4 = formatTimePrice(product.csv[4], true);
            dataModel.csv10 = formatTimePrice(product.csv[10], true);

            var style = wb.createStyle({
              font: {
                color: '#000000',
                size: 12
              }
            });

            var headerStyle = wb.createStyle({
              font: {
                color: '#000000',
                size: 14
              }
            });

            // Title
            ws.cell(1, 1)
              .string(dataModel.title)
              .style(wb.createStyle({ font: { color: '#000000', size: 16 } }));

            const { csv0, csv1, csv3, csv4, csv10 } = dataModel;
            // Amazon Price History (csv 0)
            writeHeaderToCell(
              ws,
              2,
              2,
              'csv0: Amazon Price History',
              headerStyle
            );
            writeDataToCell(ws, style, csv0, 2, 3);

            // Marketplace New Price History (csv 1)
            writeHeaderToCell(
              ws,
              2,
              5,
              'csv1: Marketplace New Price History',
              headerStyle
            );
            writeDataToCell(ws, style, csv1, 5, 6);

            // Sales Rank History (csv 3)
            writeHeaderToCell(
              ws,
              2,
              8,
              'csv3: Sales Rank History',
              headerStyle
            );
            writeDataToCell(ws, style, csv3, 8, 9);

            // List Price History (csv 4)
            writeHeaderToCell(
              ws,
              2,
              11,
              'csv4: List Price History',
              headerStyle
            );
            writeDataToCell(ws, style, csv4, 11, 12);

            // Price history of lowest 3rd party (csv 10)
            writeHeaderToCell(
              ws,
              2,
              14,
              'csv10: Price hist lowest 3rd party',
              headerStyle
            );

            writeDataToCell(ws, style, csv10, 14, 15);

            wb.write('Excel2.xlsx');
          })
          .catch(error => {
            console.log('--------------');
            console.log(error);
          });
      });
    }
  });
}
