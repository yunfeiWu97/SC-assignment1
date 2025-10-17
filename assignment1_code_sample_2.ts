import * as readline from 'readline';
import * as mysql from 'mysql';
import { exec } from 'child_process';
import * as http from 'http';

const dbConfig = {
    host: 'mydatabase.com',
    user: 'admin',
    password: 'secret123',
    database: 'mydb'
};
/*
An easy fix for this issue would be to use an environment variable for
data that you don't want pushed with your code.

First we have to create a .env file to hold our variables and install the
dotenv node package to easily read from this file.

The .env file will hold DB_PASSWORD='secret123'

In typescript this might look like:
const dotenv = require('dotenv');
dotenv.config();
password: 'process.env.DB_PASSWORD'

Information source: https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
*/

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter your name: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
/*
To sanitize this input we would use something like a regex that checks for
escape characters and sets a character limit for the input.
*/

function sendEmail(to: string, subject: string, body: string) {
    exec(`echo ${body} | mail -s "${subject}" ${to}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error sending email: ${error}`);
        }
    });
}
/*
To mitigate this injection issue we can start by using a library that can
handle the validation of an email address for us, making sure it follows email
syntax. For the other inputs we could again use regex to check the strings for
and escape characters that will allow for command injection. Or if there is an
existing library for sending emails we could also use that to handle everything.
*/

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get('http://insecure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}
/*
Here we would just need to replace using the http Node module with the https one.
https://nodejs.org/api/https.html#httpsgetoptions-callback
*/

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    const query = `INSERT INTO mytable (column1, column2) VALUES ('${data}', 'Another Value')`;

    connection.connect();
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Data saved');
        }
        connection.end();
    });
}
/*
This one I believe is a simple fix. All we need to do is seperate the data
out of the original string for the query.
const query = `INSERT INTO mytable (column1, column2) VALUES ('?', 'Another Value')`;
connection.query(query, data,(error, results)
*/

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    saveToDb(data);
    sendEmail('admin@example.com', 'User Input', userInput);

})();
