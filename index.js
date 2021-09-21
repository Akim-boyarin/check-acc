const express = require("express");
const fs = require("fs");

const app = express();

let port = 5000;
let jsonParser = express.json();

app.use("/", express.static(`${__dirname}/public`));

app.get("/", (request, response) => {
    console.log("This get is listened");
    response.send("message");
});

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
});

app.listen(port, () => {
    console.log(`Server run on port ${port}`);
});