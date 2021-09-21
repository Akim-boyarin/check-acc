const express = require("express");
const fs = require("fs");

const app = express();

let port = process.env.PORT || 5000;
let jsonParser = express.json();

app.use("/", express.static(`${__dirname}/public`));

app.post("/", jsonParser, (request, response) => {
    fs.readFile("./dataForAuthorization.json", "utf-8", (error, desiredData) => {
        if (request.body.task !== "logIn") return;

        let parsedDesiredData = JSON.parse(desiredData);
        let body = request.body;

        let authCondition;
        if (body.type === "email") {
            authCondition = body.email === parsedDesiredData.userData.email && body.password === parsedDesiredData.userData.password;
        } else if (body.type === "tel") {
            authCondition = body.tel === parsedDesiredData.userData.telephone;
        }

        let answer;
        if (authCondition) {
            parsedDesiredData.isLoggedIn = true;
            let newDataToJSON = JSON.stringify(parsedDesiredData);
            fs.writeFile("./dataForAuthorization.json", newDataToJSON, () => {});

            answer = { authResult: true };
        } else {
            answer = { authResult: false };
        }

        response.json(answer);
    });

    if (request.body.task === "logOut") {
        fs.readFile("./dataForAuthorization.json", "utf-8", (error, dataFromServer) => {
            let parcedDataFromServer = JSON.parse(dataFromServer);
            parcedDataFromServer.isLoggedIn = false;

            fs.writeFile("./dataForAuthorization.json", JSON.stringify(parcedDataFromServer), () => {});

            response.json({ value: true });
        })
    }
});

app.listen(port, () => {
    console.log(`Server run on port ${port}`);
});


/*
links: 
https://obscure-savannah-30470.herokuapp.com/
https://git.heroku.com/obscure-savannah-30470.git
*/