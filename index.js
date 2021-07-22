const request = require("superagent");
const { Parser } = require('json2csv');
const download = require("downloadjs");
const parser = new Parser();
const url = "https://dot-staking-income.herokuapp.com/";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("downloadButton").addEventListener("click", () => {
        const query = getQuery();
        request.get(query.url, (err, result) => {
            if(err) throw err;
            let stakingHistory = result.data.history;
            stakingHistory.push({ total_value_usd: result.data.total_value_usd });
            const csv = parser.parse(stakingHistory);
            download(csv, `staking-income-${query.network}.csv`, "text/plain");
        });
    });

    function getQuery() {
        const userAddress = document.getElementById("address").value;
        const isKSM = document.getElementById("DOT").checked;
        if(isKSM) {
           return {
               network: "KSM",
               url: `${url}/${userAddress}/kusama`
           }
        } else {
            return {
                network: "DOT",
                url: `${url}/${userAddress}/polkadot`
            }
        }
    }

});