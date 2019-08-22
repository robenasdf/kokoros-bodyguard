const config = require("./config.json");
const comm = require("./Comm.json");
const http = require('http');
const express = require('express');
const phantom = require('phantom');
const cheerio = require('cheerio');
var child_process = require('child_process');
const discord = require("discord.js");
const client = new discord.Client();
const app = express();
var moment = require('moment');

var icons = [];
var eventUnits = [];
var units;
var attribute;
var icon;
var emoteCode;
var daysLeft;
var hoursLeft;
var minsLeft;
var t100cutoff;
var t100prediction;
var t1000cutoff;
var t1000prediction;
var lastUpdated;
var eventTitle;
var eventType;
var charDict = {
    '/res/icon/chara_icon_1.png': "<:Kasumi:607412174452949015> ",
    '/res/icon/chara_icon_2.png': "<:Otae:607412200780333107> ",
    '/res/icon/chara_icon_3.png': "<:Rimi:607412221433217075> ",
    '/res/icon/chara_icon_4.png': "<:Kasumi:607412174452949015> ",
    '/res/icon/chara_icon_5.png': "<:Arisa:607412266563928067> ",
    '/res/icon/chara_icon_6.png': "<:Ran:607411999080448010> ",
    '/res/icon/chara_icon_7.png': "<:Moca:607412020500758568> ",
    '/res/icon/chara_icon_8.png': "<:Himari:607412042877370377> ",
    '/res/icon/chara_icon_9.png': "<:Tomoe:607412125392044042> ",
    '/res/icon/chara_icon_10.png': "<:Tsugumi:607412146929926145> ",
    '/res/icon/chara_icon_11.png': "<:Kokoro:607411730808700928> ",
    '/res/icon/chara_icon_12.png': "<:Kaoru:607411762224037888> ",
    '/res/icon/chara_icon_13.png': "<:Hagumi:607411786488217610> ",
    '/res/icon/chara_icon_14.png': "<:Kanon:607411811758768129> ",
    '/res/icon/chara_icon_15.png': "<:Michelle:607411836521807913> ",
    '/res/icon/chara_icon_16.png': "<:Aya:607411857027760138> ",
    '/res/icon/chara_icon_17.png': "<:Hina:607411897863503872> ",
    '/res/icon/chara_icon_18.png': "<:Chisato:607411921020387338> ",
    '/res/icon/chara_icon_19.png': "<:Maya:607411953492557834> ",
    '/res/icon/chara_icon_20.png': "<:Eve:607411975529431051> ",
    '/res/icon/chara_icon_21.png': "<:Yukina:607404338251300884> ",
    '/res/icon/chara_icon_22.png': "<:Sayo:607404500898152489> ",
    '/res/icon/chara_icon_23.png': "<:Lisa:607404422611599362> ",
    '/res/icon/chara_icon_24.png': "<:Ako:607404525665386527> ",
    '/res/icon/chara_icon_25.png': "<:Rinko:607404464223027223> "
};
var attrDict = {
    '/res/icon/powerful.svg': "<:Powerful:607419709133946892> ",
    '/res/icon/cool.svg': "<:Cool:607419809633927169> ",
    '/res/icon/happy.svg': "<:Happy:607419853669662761> ",
    '/res/icon/pure.svg': "<:Pure:607419782890782720> "
};
var charUrls = Object.keys(charDict);
var attrUrls = Object.keys(attrDict);

const rando_imgs = [
"<:Lisa:607404422611599362>",
'the bus, better go catch it',
'https://cdn.discordapp.com/attachments/434401275061469197/602017949645144074/1400359240761.gif',
'https://thumbs.gfycat.com/BowedQualifiedCormorant-size_restricted.gif',
]



client.on("message", async message => {
  var formattedMessage = message.content.toLowerCase();
  
  if (message.author.bot) { 
    return undefined; 
  } else {
    if (formattedMessage.includes("whats up")) {
        message.channel.send("https://thumbs.gfycat.com/BowedQualifiedCormorant-size_restricted.gif");
      } else
        if (formattedMessage.includes("wut i miss")) {
        message.channel.send(rando_imgs[Math.floor(Math.random() * rando_imgs.length)])
      } else 
        if (formattedMessage.includes(config.prefix)) {
            switch (true) {
                case (formattedMessage.endsWith(" t100")):
                    message.channel.send("T100 Cutoff is currently at: " + t100cutoff + ". It is predicted to cutoff at: " + t100prediction + ". Cutoff and Prediction was last updated: " + lastUpdated + ".");
                    break;
                case (formattedMessage.endsWith(" t1000")):
                    message.channel.send("T1000 Cutoff is currently at: " + t1000cutoff + ". It is predicted to cutoff at: " + t1000prediction + ". Cutoff and Prediction was last updated: " + lastUpdated + ".");
                    break;
                case (formattedMessage.endsWith(" rose")):
                    message.channel.send("<:Yukina:607404338251300884> <:Sayo:607404500898152489> <:Lisa:607404422611599362> <:Ako:607404525665386527> <:Rinko:607404464223027223>");
                    break;
                case (formattedMessage.endsWith(" poppin")):
                    message.channel.send("<:Kasumi:607412174452949015> <:Otae:607412200780333107> <:Rimi:607412221433217075> <:Saya:607412244287848454> <:Arisa:607412266563928067>");
                    break;
                case (formattedMessage.endsWith(" afterglow")):
                    message.channel.send("<:Ran:607411999080448010> <:Moca:607412020500758568> <:Himari:607412042877370377> <:Tomoe:607412125392044042> <:Tsugumi:607412146929926145>");
                    break;
                case (formattedMessage.endsWith(" pastel")):
                    message.channel.send("<:Aya:607411857027760138> <:Hina:607411897863503872> <:Chisato:607411921020387338> <:Maya:607411953492557834> <:Eve:607411975529431051>");
                    break;
                case (formattedMessage.endsWith(" hhw")):
                    message.channel.send("<:Kokoro:607411730808700928> <:Kaoru:607411762224037888> <:Hagumi:607411786488217610> <:Kanon:607411811758768129> <:Michelle:607411836521807913>");
                    break;
                case (formattedMessage.endsWith(" attribute")):
                    message.channel.send(attribute);
                    break;
                case (formattedMessage.endsWith(" eventunits")):
                    message.channel.send(attribute + " " + units);
                    break;
                case (formattedMessage.endsWith(" timeleft")):
                    message.channel.send(daysLeft + " Days " + hoursLeft + " Hours " + minsLeft + " Minutes");
                    break;
                case (formattedMessage.endsWith(" eventinfo")):
                    message.channel.send("The current event is: " + eventTitle + ".\n The event type is: " + eventType + ".\nThe event currently has: " + daysLeft + " Days " + hoursLeft + " Hours " + minsLeft + " Minutes" + " left.\nThe current event units and attribute are: " + attribute + " " + units + ".\nT100 Cutoff is currently at: " + t100cutoff + ". It is predicted to cutoff at: " + t100prediction + ". Cutoff and Prediction was last updated: " + lastUpdated + ".\nT1000 Cutoff is currently at: " + t1000cutoff + ". It is predicted to cutoff at: " + t1000prediction + ". Cutoff and Prediction was last updated: " + lastUpdated + ".")
                default:
                    return;
            }
      } else return;
    }
  })


app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);


    (async function() {
        const instance = await phantom.create();
        const page = await instance.createPage();
        const status = await page.open('https://bestdori.com/info/events/52/Summer-in-the-Shining-Land-of-Water'); //change url to current event
        const content = await page.property('content');

        //save site to html for cheerio reading
        var fs = require('fs');
        await fs.writeFile("public/event.html", content, function(err) {
            if (err) return console.log(err);
            console.log("The event file was saved");
        })
      
        const  status2 = await page.open('https://bestdori.com/tool/eventtracker/en/t100/52/Summer-in-the-Shining-Land-of-Water'); //change url to t100 event
         const content2 = await page.property('content');

        //save site to html for cheerio reading
        await fs.writeFile("public/t100.html", content2, function(err) {
            if (err) return console.log(err);
            console.log("The t100 file was saved");
        })
      
        const status3 = await page.open('https://bestdori.com/tool/eventtracker/en/t1000/52/Summer-in-the-Shining-Land-of-Water'); //change url to t1000 event
        const content3 = await page.property('content');

        //save site to html for cheerio reading
        await fs.writeFile("public/t1000.html", content3, function(err) {
            if (err) return console.log(err);
            console.log("The t1000 was saved");
        })

        await instance.exit();
    })();
});


function getIcons(url) {
    return url.filter(function(item) {
        return icons.includes(item);
    })
}

function getEmote(dict) {
    return function(myKey) {
        return dict[myKey];
    };
}

/*
* Get All Event Icons
*/
var fs = require('fs');
var $ = cheerio.load(fs.readFileSync('public/event.html'));
$('img').each(function(i, image) {
    icons[i] = $(this).attr('src');
});


/*
* Get Event Units
*/
icon = getIcons(charUrls);
emoteCode = getEmote(charDict);
if (eventUnits === undefined || eventUnits.length == 0) {
    for (var i = 0; i < icon.length; i++) {
        eventUnits.push(emoteCode(icon[i]));
    }
    units = eventUnits.join("");
}


/*
* Get Event Attribute
*/
icon = getIcons(attrUrls);
emoteCode = getEmote(attrDict);
attribute = emoteCode(icon);

/*
* Get Event Title
*/
eventTitle = $("title").text().trim().split('|')[0];
console.log(eventTitle);

/*
* Get Event Type
*/
eventType = $('td:contains("Type")').next().text().trim();
console.log(eventType);

/*
* Get Dates
*/
var startDate = $('tr:contains("Start Date")').find('div').children().eq(0).text().trim().split(',')[0];
var endDate = $('tr:contains("End Date")').find('div').children().eq(0).text().trim().split(',')[0];

var starter = startDate.substring(0,6) + startDate.substring(8);
var ender = endDate.substring(0,6) + endDate.substring(8);
var date = new Date(Date.parse(ender));
var now = moment();
var end = moment(date).add(7, 'hours');
var duration = moment.duration(end.diff(now));
var diffDuration = moment.duration(duration);

// display
daysLeft = diffDuration.days();
hoursLeft = diffDuration.hours();
minsLeft = diffDuration.minutes();
console.log("Days:", diffDuration.days());
console.log("Hours:", diffDuration.hours());
console.log("Minutes:", diffDuration.minutes());





/**
* Read T100 Page
*/
fs = require('fs');
$ = cheerio.load(fs.readFileSync('public/t100.html'));
t100cutoff = $('td:contains("Latest Cutoff")').next().text();
console.log("t100 cutoff var is: " + t100cutoff);
t100prediction = $('td:contains("Latest Prediction")').next().text();
console.log("t100 prediction var is: " + t100prediction);
lastUpdated = $('td:contains("Last Updated")').next().text();

/**
* Read T1000 Page
*/
fs = require('fs');
$ = cheerio.load(fs.readFileSync('public/t1000.html'));
t1000cutoff = $('td:contains("Latest Cutoff")').next().text();
console.log("t1000 cutoff var is: " + t1000cutoff);
t1000prediction = $('td:contains("Latest Prediction")').next().text();
console.log("t1000 prediction var is: " + t1000prediction);


/*
 * Pings main next by uptimerobot
 * Pings resecond last
 * Need to be pinged again
*/
app.get('/refresh', function(request, response) {
    response.send("Refreshing app");
    child_process.exec('refresh', function(error, stdout, stderr) {
        console.log(stdout);
    });
})

app.get('/resecond', function(request, response) {
    response.send("Refreshing app");
    child_process.exec('refresh', function(error, stdout, stderr) {
        console.log(stdout);
    });
})


app.listen(process.env.PORT);

client.login(process.env.token, );