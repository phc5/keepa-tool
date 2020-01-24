const axios = require('axios');
const fs = require('fs');
var inquirer = require('inquirer');
const xl = require('excel4node'); //to write to Excel
const readXlsxFile = require('read-excel-file/node'); //to read from Excel

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

var choiceQuestion = [
  {
    type: 'list',
    name: 'choice',
    message: 'Single or Multiple ASIN?',
    choices: ['Single', 'Multiple']
  }
];

var uploadQuestion = [
  {
    type: 'list',
    name: 'upload',
    message: 'Upload or enter multiple ASIN?',
    choices: ['Upload', 'Enter ASINs manually']
  }
];

var uploadInfoQuestions = [
  {
    type: 'input',
    name: 'fileName',
    message: 'Enter filename w/o the extention .xlsx: '
  },
  {
    type: 'number',
    name: 'numberOfASIN',
    message: 'Enter number of ASINs:'
  }
];

var questions = [
  {
    type: 'input',
    name: 'ASIN',
    message: 'Enter an ASIN: '
  }
];

var manualAsin = [
  {
    type: 'input',
    name: 'ASIN',
    message:
      'Enter all ASINs separated by comma with no spaces (ex: 1234,124124,5235,325235): '
  }
];

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
  chooseChoice();
});

function chooseChoice() {
  inquirer.prompt(choiceQuestion).then(answers => {
    if (answers.choice === 'Single') {
      singleASIN();
    } else {
      inquirer.prompt(uploadQuestion).then(uploadAnswers => {
        if (uploadAnswers.upload === 'Upload') {
          inquirer.prompt(uploadInfoQuestions).then(ans => {
            uploadASIN(ans.fileName, ans.numberOfASIN);
          });
        } else {
          inquirer.prompt(manualAsin).then(manualAnswer => {
            const manualASINs = manualAnswer.ASIN.split(',');
            writeData(manualASINs);
          });
        }
      });
    }
  });
}

function singleASIN() {
  inquirer.prompt(questions).then(answers => {
    writeData([answers.ASIN]);
  });
}

function manualASIN() {}

function uploadASIN(fileName, numberOfASIN) {
  let asinArray = [];
  readXlsxFile(`./${fileName}.xlsx`)
    .then(rows => {
      for (let i = 0; i < numberOfASIN; i++) {
        asinArray.push(rows[i][0]);
      }
    })
    .then(() => {
      writeData(asinArray);
    });
}

function writeData(ASINs) {
  const configArray = ASINs.map(asin => {
    return {
      url: 'https://api.keepa.com/product',
      method: 'GET',
      headers: {
        'Content-Encoding': 'gzip'
      },
      params: {
        key: secret,
        domain: 1,
        asin,
        offers: 100
      }
    };
  });

  const wb = new xl.Workbook();

  configArray.forEach((config, index) => {
    const ws = wb.addWorksheet(`ASIN: ${ASINs[index]}`);

    axios(config)
      .then(response => {
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
        writeHeaderToCell(ws, 2, 2, 'csv0: Amazon Price History', headerStyle);
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
        writeHeaderToCell(ws, 2, 8, 'csv3: Sales Rank History', headerStyle);
        writeDataToCell(ws, style, csv3, 8, 9);

        // List Price History (csv 4)
        writeHeaderToCell(ws, 2, 11, 'csv4: List Price History', headerStyle);
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

        const date = new Date();
        wb.write(`${date.toString().replace(/\s/g, '')}.xlsx`);
      })
      .catch(error => {
        console.log('--------------');
        console.log(error);
      });
  });
}

// B07Q4TJV3C
// ehna7e08pgj3ibqpnhkqbqj28p44tbtk17v1rcmk5n1ilca5ebdc131jj5vi2f51
// B07WCVDKV8,B07ZX487Z4,B07Q4TJV3C,B078M4G2SF,B081DY27LT
