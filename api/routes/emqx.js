import { Router } from "express";
const router = Router();
const axios = require('axios');
require('colors');

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_MANAGMENT_PASSWORD
    }
};


global.saverResource = null;
global.alarmResource = null;

// ****************************************
// ******** EMQX RESOURCES MANAGER ********
// ****************************************

async function listResources() {


    try {
        const url = "http://localhost:8085/api/v4/resources/";
        const res = await axios.get(url, auth);
        const size = res.data.data.length

        if (res.status === 200) {
            if (size == 0) {
                console.log("***** Creating emqx webhook resources *****".green)
                createResources();
            } else if (size == 2) {

                res.data.data.forEach(resource => {

                    if (resource.description == "alarm-webhook") {
                        global.alarmResource = resource;

                        console.log("▼ ▼ ▼ ALARM RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                        console.log(global.alarmResource);
                        console.log("▲ ▲ ▲ ALARM RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                        console.log("\n");
                        console.log("\n");
                    }

                    if (resource.description == "saver-webhook") {
                        global.saverResource = resource;

                        console.log("▼ ▼ ▼ SAVER RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                        console.log(global.saverResource);
                        console.log("▲ ▲ ▲ SAVER RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                        console.log("\n");
                        console.log("\n");
                    }

                });
            } else {


                function printWarning() {
                    console.log("DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE - youremqxdomain:8085/#/resources".red);
                    setTimeout(() => {
                        printWarning();
                    }, 1000);
                }
                printWarning();
            }
        } else {
            console.log("Error in EMQX API");
        }
    } catch (e) {
        console.log(e)
    }




}

async function createResources() {

    try {
        const url = "http://localhost:8085/api/v4/resources";

        const dataSaverWebhook = {
            "type": "web_hook",
            "config": {
                url: `http://localhost:${process.env.API_PORT}/api/saver-webhook`,
                headers: {
                    token: process.env.EMQX_MANAGMENT_TOKEN
                },
                method: "POST"
            },
            description: "saver-webhook"
        }

        const dataAlarmWebhook = {
            "type": "web_hook",
            "config": {
                url: `http://localhost:${process.env.API_PORT}/api/alarm-webhook`,
                headers: {
                    token: process.env.EMQX_MANAGMENT_TOKEN
                },
                method: "POST"
            },
            description: "alarm-webhook"
        }

        const res1 = await axios.post(url, dataSaverWebhook, auth);

        if (res1.status === 200) {
            console.log("Saver resource created!".green);
        }

        const res2 = await axios.post(url, dataAlarmWebhook, auth);

        if (res2.status === 200) {
            console.log("Alarm resource created!".green);
        }

        setTimeout(() => {
            console.log("***** Emqx WH resources created! :) *****".green);
            listResources();
        }, 1000);
    } catch (error) {
        console.log("Error creating resources");
        console.log(error);
    }

}


setTimeout(() => {
    listResources();
}, 1000);

module.exports = router;