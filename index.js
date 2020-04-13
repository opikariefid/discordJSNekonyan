const express = require("express");
const app = express();

const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});

// Import Dependencies

//Specify port

// Body parser

// Home route
app.get("/", (req, res) => {
    res.send("Discord Bot NekonyAn is online!");
  });

  // Mock APIs
//   app.get("/users", (req, res) => {
//     res.json([
//       { name: "William", location: "Abu Dhabi" },
//       { name: "Chris", location: "Vegas" }
//     ]);
//   });
  
//   app.post("/user", (req, res) => {
//     const { name, location } = req.body;
  
//     res.send({ status: "User created", name, location });
//   });

'use strict';

var auth = require('../auth.json');
// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "!";

// Fungsi Baca JSON
const fs = require('fs');
function configJSON(filename,guildID){
    let dir = '../config/'+guildID+'/'+filename+'.json';
    let config = JSON.parse(fs.readFileSync(dir));
    return config;
}

// Fungsi Simpan report.json
async function saveReportJSON(config, guildID){
    var dirConfig = "../config/" + guildID + "/report.json";
    var report_conf = config;
    var reportID = report_conf.reportID;
    var reportStat = report_conf.reportStat;
    // JSON Config
    var jsonData = 
    '{'+
    '"reportID":'+JSON.stringify(reportID)+','+
    '"reportStat":'+JSON.stringify(reportStat)+''+
    '}';   
    var jsonObj = JSON.parse(jsonData);
    var jsonContent = JSON.stringify(jsonObj);
    // Save JSON File
    const fs = require('fs');
    fs.exists(dirConfig,function(exists){
        // console.log(exists);
        if(exists){
            fs.writeFile(dirConfig, jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }                         
                console.log("JSON file has been saved.");
            });
        }
    });
}

function buatReport(msg){
    var guildID = msg.guild.id
    var authorID = msg.author.id;    
    var config = configJSON('report',guildID);
    var reportID = config.reportID;
    var reportStat = config.reportStat;
    var kArr = cekKasar(msg.content);
    var dArr = cekDuplikat(msg.content);
    var uArr = cekUppercase(msg.content);
    var date = new Date();
    var reportList = [kArr[1],dArr[1],uArr[1],msg.content,date.getTime()];
    var key;
    // console.log(reportList);
    if(reportID.indexOf(authorID) !== -1){
        key = reportID.indexOf(authorID);
        reportStat[key].push(reportList);
    } else {
        reportID.push(authorID);
        reportStat.push([reportList]);
    }
    // console.log(config);
    saveReportJSON(config,guildID);
}

// Fungsi Cek Kalimat atau Kata Duplikat
function cekDuplikat(kalimat){
    var kalimatSplit = kalimat.split(" ");
    var kalimatSayaSplit = [];
    var kalimatDuplikat = [];
    var jmlDuplikat = 0;
    var kataDuplikat = false;
    var kata;
    var hasil;
    var kalimatAkhir = "";
    var i,j;
    // Cek Kalimat Duplikat
    for (i = 0; i < kalimatSplit.length; i++) {
        for (j = 0; j < kalimatSayaSplit.length; j++) {
            if(kalimatSplit[i] == kalimatSayaSplit[j]){
                kalimatDuplikat.push(kalimatSayaSplit[j]);
            }
        }
        if(kalimatSayaSplit.length < kalimatSplit.length){
            kalimatSayaSplit.push(kalimatSplit[i]);
        }
    };
    // Saring menjadi sebuah kalimat    
    for (i = 0; i < kalimatDuplikat.length; i++) {
        if(kalimatDuplikat[i] == kalimatDuplikat[i+1]){
            kalimatDuplikat.splice(i,kalimatDuplikat.length);
        }
    }
    kalimatDuplikat.forEach(function(item){
        kalimatAkhir = kalimatAkhir+" "+item;
    });
    kalimatAkhir = kalimatAkhir.substr(1);
    if(kalimatAkhir !== ""){
        var frasa = new RegExp(kalimatAkhir,'g');
        jmlDuplikat = kalimat.match(frasa).length;
        hasil = [kalimatAkhir,jmlDuplikat];
        return hasil;
    } else {
        // Cek Kata Duplikat
        for (i = 0; i < kalimatSplit.length; i++) {
            if(kalimatSplit[i] == kalimatSplit[i+1]){
                kataDuplikat = true;
                kata = kalimatSplit[i];
                break;
            }
        }
        if(kataDuplikat){
            var frasa = new RegExp(kata,'g');
            jmlDuplikat = kalimat.match(frasa).length;
            hasil = [kata,jmlDuplikat];
            return hasil;
        } else {
            hasil = [0,0]
            return hasil;
        }
    }
}

function cekKasar(kalimat){
    var opikariefDir = './assets/opikarief/opikarief.json';
    let opikarief = JSON.parse(fs.readFileSync(opikariefDir));
    var kataKasar = opikarief.badword.split(" ");
    var msgUp = kalimat.split(" ");
    var tkatakasar = 0;
    var storageWord = [];
    var hasil;
    var i,j;
    for (i = 0; i < kataKasar.length; i++) {
        for (j = 0; j < msgUp.length; j++) {
            if(msgUp[j].toLowerCase() == kataKasar[i].toLowerCase()){
                tkatakasar++;
                if(storageWord.indexOf(msgUp[j]) == -1){
                    storageWord.push(msgUp[j]);
                }
            }             
        }                        
    }
    hasil = [storageWord,tkatakasar]
    return hasil;
}

function cekUppercase(kalimat){
    var msgUp = kalimat.split(" ");
    var storageWord = [];
    var tmsgUp = 0;
    var hasil;
    var i,j;
    for (i = 0; i < msgUp.length; i++) {
        var hUP = 0;
        if(msgUp[i].length > 4){
            for (j = 0; j < msgUp[i].length; j++) {
                if(msgUp[i][j].toLowerCase() !== msgUp[i][j] && msgUp[i][j].toUpperCase() == msgUp[i][j]){
                    hUP++;
                    if(hUP > 4){
                        tmsgUp++;
                        if(storageWord.indexOf(msgUp[i]) == -1){
                            storageWord.push(msgUp[i]);
                        }
                        break;
                    }
                }
            }
        }                      
    }
    hasil = [storageWord,tmsgUp]
    return hasil;
}

client.on('message', msg => {
    // Cek agar pesan DiscordBot sendiri tidak masuk perintah
    if(msg.author.id !== client.user.id && msg.author.bot == false){
        var args = msg.content.toLowerCase().split(" ");
        var cmd = args[0];
        var totalcmd = args.length;

        if (msg.content == prefix+'ping') {
          msg.channel.send('Pong');
        }
        // Filter Kata Kasar
        var duplikatArr = cekDuplikat(msg.content);
        var kasarArr = cekKasar(msg.content);
        var uppercaseArr = cekUppercase(msg.content);
        var tduplikat = duplikatArr[1];
        var tkatakasar = kasarArr[1];
        var tmsgUp = uppercaseArr[1];
        var storageWord = [];
        var reason = "";
        var kalimat = "";
        if(tkatakasar > 0){
            reason = reason+" "+"`Berkata Kasar x"+tkatakasar+"`"
        }        
        if(tmsgUp > 0){
            reason = reason+" "+"`Huruf Kapital x"+tmsgUp+"`"
        }        
        if(tduplikat > 0){
            storageWord.push(duplikatArr[0]);
            reason = reason+" "+"`Kata Duplikat x"+tduplikat+"`"
        }
        kasarArr[0].forEach(function(item){
            storageWord.push(item);
        })
        uppercaseArr[0].forEach(function(item){
            storageWord.push(item);
        })
        storageWord.forEach(function(item){
            kalimat = kalimat+' '+'`'+item+'`';
        })

        if(tkatakasar > 0 || tmsgUp > 0 || tduplikat > 0){
            kalimat = kalimat.substr(1);
            var guildID = msg.guild.id
            var server = configJSON('server',guildID);
            var channelID = server.noticeChannelID;
            var enable = server.noticeStat;
            // console.log(server);
            var channel = msg.guild.channels.cache.find(ch => ch.id === channelID);
            const messageEmbed = new Discord.MessageEmbed()
            .setColor('#f7c55b')
            .setAuthor(msg.author.tag,msg.author.avatarURL())
            .addField("**Alasan:** "+reason, msg.content)
            .setTimestamp()
            if(enable){
                if(channelID == ""){
                    msg.channel.send("Laporan <@!"+msg.author.id+"> berhasil dibuat.");
                    msg.channel.send(messageEmbed);                
                } else {
                    if(channel !== undefined){
                        channel.send("Laporan dibuat untuk <@!"+msg.author.id+"> berhasil dibuat.");
                        channel.send(messageEmbed);  
                    }
                }
                buatReport(msg);
            }
        }
        // Sapa Config       
        if(cmd == prefix+'sapa' && totalcmd == 2){
            if(msg.mentions.users.first(1).length == 1){
                msg.channel.send("Halo "+args[1]+", Apa Kabar?");
            }
        } else if(cmd == prefix+'sapa' && totalcmd == 1){
            msg.channel.send("Anda mau menyapa siapa? Bantuan ketik !help");
        }
        // Pukul Config       
        if(msg.author.id == "197847716485791744"){
            // console.log(msg.author)
            // console.log(msg.mentions.users.firstKey(1));
        }
        if(cmd == prefix+'pukul' && totalcmd == 2){            
            if(msg.mentions.users.first(1).length == 1){
                if(msg.mentions.users.firstKey(1) == msg.author.id){
                    msg.channel.send("Gua aja ya yang pukul anda? <@!"+msg.author.id+">");
                } else {
                    var damage = Math.floor(Math.random() * 50);                
                    msg.channel.send(args[1]+" Terkena pukulan dari <@!"+msg.author.id+"> dan berkurang -"+damage+"HP");
                    const messageEmbed = new Discord.MessageEmbed()
                    .setImage('https://media.giphy.com/media/l1J3G5lf06vi58EIE/giphy.gif')
                    .setTimestamp()
                    msg.channel.send(messageEmbed);
                }
            }
        } else if(cmd == prefix+'pukul' && totalcmd == 1){
            msg.channel.send("Pengen dipukul sama gua? Bantuan ketik !help");
        }
    }
});

client.login(auth.token);