console.log("Page has finished loading.")

const puppeteer = require('puppeteer')
var labelModel = require("./schema.js").getModel();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var http = require('http');
var path = require('path');
var fs = require('fs')
var browser;

var app = express(),
  dbUri ='mongodb://joosting:pronetosheep@geekformers.com:27018/knowledge?authSource=admin'
;

async function openBrowser(err, labels) {
    browser = await puppeteer.launch({args:['--no-sandbox']});
    let page = await browser.newPage();
    console.log("Opened the browser")
    console.log("Starting for loop")
    for (var i = 0; i < labels.length;) {
        var label = labels[i]
        var url = label.url
        console.log(url)
        try{
            console.log("Going to url")
            await page.goto(url, { waitUntil: 'load' });
            await page.waitFor(4000);
            console.log("Scraping Text")
            label.text = await scrapeText(browser, page, url);
            console.log("Scraping Image")
            await scrapeImage(browser, page, url, label);
            console.log("Saving to DB")
            label.save();
        }
        catch(ex){
            console.log('error scraping page', ex);
            try {
                console.log("Closing Browser");
                await browser.close();
            } catch(ex) {
                console.log('error closing browser', ex);
            }
            browser = await puppeteer.launch({args:['--no-sandbox']});
            console.log("Creating new page");
            page = await browser.newPage();
        }

        console.log("Scraped " + ++i + " site(s)")
    }
}

async function scrapeText(browser, page, url) {
  const result = await page.evaluate(() => {
    return document.querySelector('html').innerHTML
  })
  return result;
}

async function scrapeImage(browser, page, url, label) {
    console.log(label.label, url);
    if(label.label === 'y'){
        var path = `./educational/${label._id.toString()}.png`
        const buffer = await page.screenshot({
          fullPage: true
          ,path: path
        });
        label.imagePath = path
    } else if(label.label === 'n'){
        var path = `./uneducational/${label._id.toString()}.png`
        const buffer = await page.screenshot({
          fullPage: true
          ,path: path
        });
        label.imagePath = path
    } else if(label.label === 'm'){
        var path = `./maybe/${label._id.toString()}.png`
        const buffer = await page.screenshot({
          fullPage: true
          ,path: path
        });
        label.imagePath = path
    } else {
        var path = `./Null/${label._id.toString()}.png`
        const buffer = await page.screenshot({
            fullPage: true
            ,path:path
        });
        label.imagePath = path
    }
}



async function startBrowser() {
    console.log(dbUri);
    mongoose.connect(dbUri, function(err){
        if (err){
            return console.log(err)
        }
        check()
    })
}




function check() {
    console.log("Starting Process")
    labelModel.find({imagePath:null}, async function(err, labels) {
        if(err) {
            console.log("Found an error")
            console.log(err)
            return
        }
        if(labels.length === 0) {
            console.log("No new links found")
            return
        }
        console.log("Found sites needing scraping, opening browser")
        openBrowser(err, labels)
        setTimeout(check, 1000*3600)
    })
}


startBrowser()
