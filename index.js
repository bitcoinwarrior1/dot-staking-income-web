const request = require("superagent");
const { Parser } = require('json2csv');
const { download } = require("downloadjs");
const parser = new Parser();
const url = "https://";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("downloadButton").addEventListener("click", () => {
        const query = getQuery();
        request.get(query, (err, result) => {
            if(err) throw err;
            const csv = parser.parse(result);
            download(csv, "staking-income.csv", "text/plain");
        });
    });

    function getQuery() {
        const userAddress = document.getElementById("address").value;
        const isKSM = document.getElementById("DOT").checked;
        if(isKSM) {
           return `${url}/${userAddress}/polkadot`;
        } else {
            return `${url}/${userAddress}/kusama`;
        }
    }

});