# keepa-tool

## Installation

Make sure you have Node.js installed: Go to https://nodejs.org/en/download/ and install Node.js for your operating system.
   - For Windows, open up Command Prompt and type `node -v` and it should print out something like `v12.15.1`. The number doesn't have to match since it will install the latest version.
   - For Mac, open up Terminal and type `node -v` and it should and it should print out something like `v12.15.1`. The number doesn't have to match since it will install the latest version.

After installing Node.js, make sure you have Git installed on your machine. Go here to install it https://git-scm.com/downloads. Follow all the steps in the installation and just click Next/Finish. At the end of the Installation screen, there will be an option to open GitBash. Check mark it and open GitBash.

A Terminal window should open. From there type `cd Desktop` and press ENTER. This will bring you to your desktop in the Terminal.

Now type this into your terminal: `git clone https://github.com/phc5/keepa-tool.git` and press ENTER. You can copy and paste this as well.

Now type `cd keepa-tool` and press ENTER. This will bring you into the project directory. You should see something like: `~/Desktop/keepa-tool`.

Now type `npm install` and press ENTER. This will install necessary packages for the app to work.

Now type `node app.js` and press ENTER. This will start the app.

## Using the App

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

## Pulling in Updates

Every once in a while there will be updates to this app. To bring in those updates open GitBash. 

Type `cd Desktop`. and then type `cd keepa-tool`. This will bring you to the project directory.

Then type `git pull`. This will bring in the latest changes. 

To start the app, type `node app.js`. 
