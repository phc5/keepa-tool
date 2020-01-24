# keepa-tool

## installation

1. Download this repository by clicking on the green button `Clone or download` and click `Download ZIP`.
2. On Windows or Mac, go here: https://nodejs.org/en/download/ and install Node.js for your operating system.
   - For Windows, open up Command Prompt and type `node -v` and it should print out something like `v12.15.1`. The number doesn't have to match since it will install the latest version.
   - For Mac, open up Terminal and type `node -v` and it should and it should print out something like `v12.15.1`. The number doesn't have to match since it will install the latest version.
3. With either Command Prompt (on Windows) or Terminal (on Mac), type `cd Downloads`. This will take you into the Downloads folder
4. Now type `cd keepa-tool-master`, which will take you into the project directory.
5. Now you should see something like this: C:\Users\Paul\Downloads\keepa-tool-master>
6. Type `cd keepa-tool-master` again.
7. Now you should see something like this: C:\Users\Paul\Downloads\keepa-tool-master\keepa-tool-master>
8. Inside the project directory, type `npm install`.
9. After installation the project is ready to go: type `node app.js`.

## Workflow

1. Follow the questions that it asks you:
   - What is your secret key? = Keepa secret key
2. It then asks if you want to upload single ASIN or multiple ASIN. Use your arrow keys to select your choice and press ENTER.
3. If you selected multiple, you have two options:
   1. UPLOAD: Upload an EXCEL file (.xlsx) with the ASINs listed in Column A.
      - For this option, the next question it will ask is: how many ASINs you are going to add to the Excel file.
   2. MANUAL: Enter ASINs manually by comma separating them.
      - For this option, please follow this format: 123,12345,12351235,12355
      - Notice there are no spaces between the ASINs and commas.
4. The Excel file should be generated in the project folder.
