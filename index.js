const request = require("superagent");
const { Parser } = require('json2csv');
const download = require("downloadjs");
const parser = new Parser();
const url = "https://dot-staking-income.herokuapp.com/history";

document.addEventListener("DOMContentLoaded", () => {

    function downloadEventListener() {
        const query = getQuery();
        document.getElementById("status").hidden = false;
        document.getElementById("downloadButton").hidden = true;
        request.get(query.url, (err, result) => {
            if(err) {
                document.getElementById("status").innerText = err;
                throw err;
            } else {
                try {
                    const activity = addTotalValue(result, query.network, query.currency);
                    const csv = parser.parse(activity);
                    download(csv, `staking-income-${query.network}-${query.address}-${query.currency}.csv`, "text/plain");
                    document.getElementById("status").hidden = true;
                } catch (e) {
                    document.getElementById("status").innerText = "no staking found on this address";
                }
            }
        });
    }

    document.getElementById("downloadButton").addEventListener("click", downloadEventListener, { once: true });

    function addTotalValue(result, network, currency) {
        const activity = result.body.list;
        const title = `total_value_${currency}`;
        activity.push({ [title]: result.body[title] });
        if(network === "DOT") {
            activity.push({ total_value_DOT : result.body.total_value_DOT });
        } else {
            activity.push({ total_value_KSM : result.body.total_value_KSM });
        }

        return activity.filter((e) => {
            return e != null;
        });
    }

    function getQuery() {
        const userAddress = document.getElementById("address").value;
        const isKSM = document.getElementById("KSM").checked;
        const currencyElement = document.getElementById("currency");
        const currency = currencyElement.options[currencyElement.selectedIndex].text.toLowerCase();
        if(isKSM) {
           return {
               network: "KSM",
               address: userAddress,
               currency: currency,
               url: `${url}/${userAddress}/KSM/${currency}`
           }
        } else {
            return {
                network: "DOT",
                address: userAddress,
                currency: currency,
                url: `${url}/${userAddress}/DOT/${currency}`
            }
        }
    }

});