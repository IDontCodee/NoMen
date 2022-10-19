/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Config
require('dotenv').config()
const config = require("./config.json")
const port = process.env.PORT || config.port
const barePrefix = "/not-sus-server/" || process.env['barePath']

// Auth
const auth = process.env['auth'] || "false"
const username = process.env['username'] || "user"
const password = process.env['password'] || "secret"
const users = {}
users[username] = password

const fetch = require("node-fetch");

// Web Server
import http from 'http';
import express from 'express'
const httpPatch = http.createServer();
const app = express()
const basicAuth = require("express-basic-auth");

// PX imports
const Corrosion = require("./corrosion/server")
const { xor } = require("./corrosion/codec")
import RhodiumProxy from 'Rhodium';
import createServer from '@tomphttp/bare-server-node';

const bare = createServer(barePrefix);

const proxy = new Corrosion({
    prefix: "/co/",
    codec: "xor",
    title: "sussy",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([ "accounts.google.com" ], "Page is not allowed here or is not compatible"),
    ]
});

proxy.bundleScripts();

const Rhodium = new RhodiumProxy({
  encode: "xor",
  prefix: "/rho/",
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

app.use(express.static(config.ROOT, {
    extensions: ["html"]
}));

app.get("/", function(req, res){
    res.sendFile("index.html", {root: config.ROOT});
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

app.get("/URIconfig", function(req, res) {
res.send({
  DC: process.env['INVITE_URL'] || "example.com",
  WD: "/co/" +  xor.encode(process.env['CHATBOX_URL'] || "example.com")
  })
})

app.use(function (req, res) {
    res.status(404).sendFile("404.html", {root: config.ROOT});
})

// Bad patch for dumb issue

httpPatch.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res)
  } else if(req.url.startsWith(proxy.prefix)) {
    proxy.request(req,res);
  } else if(req.url.startsWith(Rhodium.prefix)) {
    Rhodium.request(req, res)
  } else { app(req, res) }
})

httpPatch.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) { bare.routeUpgrade(req, socket, head) } else { socket.end() }
})

httpPatch.on('listening', () => {
  console.log(`The Impostor created a vent from the other side on port ${port}`)
})

httpPatch.listen({ port: port, })