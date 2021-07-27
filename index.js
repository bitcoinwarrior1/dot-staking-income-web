const request = require("superagent");
const { Parser } = require('json2csv');
const download = require("downloadjs");
const parser = new Parser();
const url = "https://dot-staking-income.herokuapp.com/history";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("downloadButton").addEventListener("click", () => {
        const query = getQuery();
        document.getElementById("status").hidden = false;
        request.get(query.url, (err, result) => {
            if(err) {
                document.getElementById("status").innerText = err;
                throw err;
            } else {
                try {
                    let stakingHistory = result.body.list;
                    stakingHistory.push({ total_value_usd: result.body.total_value_usd });
                    const csv = parser.parse(stakingHistory);
                    download(csv, `staking-income-${query.network}-${query.address}.csv`, "text/plain");
                    document.getElementById("status").hidden = true;
                } catch (e) {
                    document.getElementById("status").innerText = "no staking found on this address";
                }
            }
        });
    });

    function getQuery() {
        const userAddress = document.getElementById("address").value;
        const isKSM = document.getElementById("KSM").checked;
        if(isKSM) {
           return {
               network: "KSM",
               address: userAddress,
               url: `${url}/${userAddress}/KSM`
           }
        } else {
            return {
                network: "DOT",
                address: userAddress,
                url: `${url}/${userAddress}/DOT`
            }
        }
    }

});