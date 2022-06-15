/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

const express = require("express")
const app = express()
const basicAuth = require("express-basic-auth");
const config = require("./config.json")
const port = process.env.PORT || config.port
const Corrosion = require("./lib/server")
import RhodiumProxy from 'Rhodium'
const auth = process.env['auth']
const username = process.env['username']
const password = process.env['password']
const users = {}
users[username] = password
const mist = require("mist-yt");
const fetch = require("node-fetch");

const proxy = new Corrosion({
    prefix: "/corrosion/",
    codec: "xor",
    title: "sussy",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([
            "accounts.google.com",
        ], "Page is blocked"),
    ]
});

proxy.bundleScripts();

const Rhodium = new RhodiumProxy({
  encode: "xor",
  prefix: "/rhodium/",
  server: app,
  Corrosion: [true, proxy],
  title: "sussy"
})

Rhodium.init();

if (auth == "true") { 
app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: autherror
}));
}

function autherror(req) {
    return req.auth
        ? ("Credentials " + req.auth.user + ":" + req.auth.password + " rejected")
        : "Error"
}

app.use(express.static("./public", {
    extensions: ["html"]
}));

app.get("/", function(req, res){
    res.sendFile("index.html", {root: "./public"});
});

app.get("/suggestions", function(req, res){
async function getsuggestions() {
var term = req.query.q || "";
var response = await fetch("https://duckduckgo.com/ac/?q=" + term + "&type=list");
var result = await response.json();
var suggestions = result[1]
res.send(suggestions)
}
getsuggestions()
});

app.use(function (req, res) {
    if (req.url.startsWith("/watch")) {
      mist.watch(req, res)
    } else if (req.url.startsWith("/video")) {
      mist.video(req, res)
    } else if (req.url.startsWith(proxy.prefix)) {
      proxy.request(req,res);
    } else if (req.url.startsWith(Rhodium.prefix)) {
      return Rhodium.request(req, res)
    } else {
      res.status(404).sendFile("404.html", {root: "./public"});
    }
})

app.listen(port, () => {
  console.log(`The Impostor created a vent from the other side at https://sussy.player123456789.repl.co on port ${port}`)
})