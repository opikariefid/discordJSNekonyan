'use strict';
var auth = require('./auth.json');
var opikarief = require('./assets/opikarief/opikarief.json');
var kataKasar = opikarief.badword.split(" ");
var confirmStorage = [];
var cmdStorage = [];
var timeStorage = [];
let interval = [];
let msgLogID = [];
let confirmAuthorID = [];
let inputAuthorID = [];

// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "!";

// Fungsi Pesan Berwaktu 
function timerConfirmMessage(msg, msgSend, data, cmd){
    var ownerID = msg.author.id;
    msg.channel.send(msgSend).then((msg) =>{
        confirmAuthorID[ownerID] = cmd;
        inputAuthorID[ownerID] = data;
        msgLogID[ownerID] = msg;
        interval[ownerID] = setInterval(function() {
            msg.edit('Pengaturan `'+cmd+'` batal disimpan.');
            clearConfirm(ownerID);
        }, 10*1000);             
    });
}

async function kirimPesanKeChannelSama(msg,data){
    var errorCode;
    await msg.channel.send(data).catch(function(err){
        errorCode = err.code;
    });
    if(msg.channel.type == 'text'){
        var channelName = msg.channel.name;
        var guildName = msg.guild.name;
        if(errorCode !== undefined){
            const messageEmbed = new Discord.MessageEmbed()
            .setTitle('Hak akses hilang!')
            .addField("Nama server", '`'+guildName+'`', true)
            .addField("Nama channel", '`#'+channelName+'`', true)
            .addField("Saran", "`Coba ajukan ke pemilik server`")
            .setTimestamp()
            msg.author.send(messageEmbed);
        }   
    }
}

const fs = require('fs');
function configJSON(filename,guildID){
    let dir = './config/'+guildID+'/'+filename+'.json';
    let config = JSON.parse(fs.readFileSync(dir));
    return config;
}

function clearConfirm(id){
    confirmAuthorID.splice(id,1);
    msgLogID.splice(id,1);
    clearInterval(interval[id]);
    interval[id] = undefined;
}

function prefixChange(msgSend, msg){
    var listPrefix = ['!servername','!member'];
    var changedPrefix = [msg.guild.name,'<@!'+msg.author.id+'>'];
    var i;
    for (i = 0; i < listPrefix.length; i++) {
        msgSend = msgSend.replace(listPrefix[i],changedPrefix[i]);
    }
    return msgSend;
}

function getListAdmin(msg){
    var guildID = msg.guild.id;
    var server = configJSON('server',guildID);
    var listAdmin = [];
    var listAdminName = [];
    // Kumpulkan Data Admin dari server.json
    listAdmin.push(server.ownerServerID);
    server.adminID.forEach(function(item){
        listAdmin.push(item);
    });
    listAdmin.forEach(function(item){
        var user = client.users.cache.find(usr => usr.id === item);
        listAdminName.push(user.tag);                    
    });
    var listDataAdmin = [listAdmin,listAdminName];
    // console.log(listDataAdmin);
    return listDataAdmin;
    //
}

function checkAdmin(msg){
    var authorID = msg.author.id;    
    var admin = false;
    var listDataAdmin = getListAdmin(msg);
    var i;
    for (i = 0; i < listDataAdmin[0].length; i++) {
        if(authorID == listDataAdmin[0][i]){
            admin = true;
            break;
        }                   
    }
    if(admin){
        return admin;
    } else {
        return admin;
    }
}

// Baca Report
function bacaReport(msg,authorID){    
    var guildID = msg.guild.id
    var config = configJSON('report',guildID);
    var reportID = config.reportID;
    var reportStat = config.reportStat;
    var reportAll = [];
    var key;
    if(reportID.indexOf(authorID) !== -1){
        key = reportID.indexOf(authorID);
        reportAll = [authorID,reportStat[key]]
        // console.log(reportAll);
        return reportAll;
    } 
}

// Fungsi Simpan server.json
async function saveServerJSON(config, guildID){
    var dirConfig = "./config/" + guildID + "/server.json";
    var server_conf = config;
    var greeting = server_conf.greeting;
    var noticeChannelID = server_conf.noticeChannelID;
    var noticeStat = server_conf.noticeStat;
    var ownerServerID = server_conf.ownerServerID;
    var adminID = server_conf.adminID;
    var beta = server_conf.beta;
    // JSON Config
    var jsonData = 
    '{'+
    '"greeting":'+JSON.stringify(greeting)+','+
    '"noticeChannelID":'+JSON.stringify(noticeChannelID)+','+
    '"noticeStat":'+JSON.stringify(noticeStat)+','+
    '"ownerServerID":'+JSON.stringify(ownerServerID)+','+
    '"adminID":'+JSON.stringify(adminID)+','+
    '"beta":'+JSON.stringify(beta)+''+
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

// Fungsi Cek File
async function cekFile(g){
    var guildID = g.id;
    var guiidName = g.name;
    var ownerID = g.ownerID;
    const fs = require('fs');
    var guildDir = "./config/" + guildID;
    var fileList = ['server.json','report.json'];
    var contentList = [
        '{'+
        '"greeting":["Selamat datang di Server !servername, !member","Selamat Tinggal, !member"],'+
        '"noticeChannelID":"",'+
        '"noticeStat":true,'+
        '"ownerServerID":"'+ownerID+'",'+
        '"adminID":[],'+
        '"beta":[]'+
        '}',
        '{'+
        '"reportID":[],'+
        '"reportStat":[]'+
        '}'
    ];
    var exists = fs.existsSync(guildDir);
        if (exists) { }
        else {
            await fs.promises.mkdir(guildDir, { recursive: true });
        }
    var i;
    for (i = 0; i < fileList.length; i++) {
        var exists = fs.existsSync(guildDir + '/' + fileList[i]);
        if(exists){}else{
            await fs.promises.writeFile(guildDir+'/'+fileList[i], contentList[i]);
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(function(g){
        cekFile(g);
    });
});

client.on('message', msg => {
    // Cek agar pesan DiscordBot sendiri tidak masuk perintah
    if(msg.author.id !== client.user.id && msg.author.bot == false){ 
        // Config Command
        var ownerID = msg.author.id;
        var args = msg.content.split(" ");
        var cmd = args[0].toLowerCase();
        var totalcmd = args.length;
        if(cmd == prefix+'report'){
            if(args[1] == 'show' && totalcmd == 4){
                var user = client.users.cache.find(usr => usr.tag === args[2]);
                if(user !== undefined){
                    var authorID = user.id;
                    var numb = parseInt(args[3]-1);
                    var config = bacaReport(msg,authorID);
                    if(config !== undefined){
                        if(Number.isInteger(numb)){
                            if(numb >= 0 && numb < config[1].length){
                                var k = config[1][numb][0];
                                var u = config[1][numb][1];
                                var d = config[1][numb][2];
                                var m = config[1][numb][3];
                                var t = config[1][numb][4];
                                var reason = "";
                                if(k > 0){
                                    reason = reason+" "+"`Berkata Kasar x"+k+"`"
                                }        
                                if(u > 0){
                                    reason = reason+" "+"`Huruf Kapital x"+u+"`"
                                }        
                                if(d > 0){
                                    reason = reason+" "+"`Kata Duplikat x"+d+"`"
                                }                        
                                const messageEmbed = new Discord.MessageEmbed()
                                .setTitle('Laporan #'+(numb+1))
                                .setColor('#f7c55b')
                                .setAuthor(user.tag,user.avatarURL())
                                .addField("**Alasan:** "+reason, m)
                                .addField("\u200B ", "`Laporan #"+(numb+1)+' - #'+config[1].length+'`')
                                .setTimestamp(t)
                                msg.channel.send(messageEmbed);
                            } else {
                                msg.channel.send('Laporan `'+user.tag+'` hanya tersedia dari `1-'+config[1].length+'`');
                            }
                        }
                    } else {
                        msg.channel.send('`'+user.tag+'` Belum mempunyai laporan');
                    }
                } else {
                    msg.channel.send('User tidak ditemukan');
                }
            }
            if(args[1] == 'summary' && totalcmd == 3){
                var user = client.users.cache.find(usr => usr.tag === args[2]);
                if(user !== undefined){
                    var authorID = user.id;
                    var numb = parseInt(args[3]);
                    var config = bacaReport(msg,authorID);
                    if(config !== undefined){
                        var k = 0;
                        var u = 0;
                        var d = 0;
                        var reason = "";
                        config[1].forEach(function(item){
                            k = k+parseInt(item[0]);
                            u = u+parseInt(item[1]);
                            d = d+parseInt(item[2]);
                        });    
                        reason = reason+" "+"`Berkata Kasar x"+k+"`\n"
                        reason = reason+" "+"`Huruf Kapital x"+u+"`\n"
                        reason = reason+" "+"`Kata Duplikat x"+d+"`\n"                   
                        const messageEmbed = new Discord.MessageEmbed()
                        .setColor('#f7c55b')
                        .setTitle('Summary Report')
                        .setAuthor(user.tag,user.avatarURL())
                        .addField("Pelanggaran:", reason)
                        .addField("Total Laporan:", config[1].length)
                        .setTimestamp()
                        msg.channel.send(messageEmbed);                        
                    } else {
                        msg.channel.send('`'+user.tag+'` Belum mempunyai laporan');
                    }
                } else {
                    msg.channel.send('User tidak ditemukan');
                }
            }
        }
        if(cmd == prefix+'config'){
            if(args[1] == 'notice' && args[2] == 'custom' && totalcmd == 4){
                var guildID = msg.guild.id;
                var server = require('./config/'+guildID+'/server.json')
                var verAdmin = false;
                var listAdmin = server.adminUserID
                var i;
                for (i = 0; i < listAdmin.length; i++) {
                    if(msg.author.id == listAdmin[i]){
                        verAdmin = true;
                        break;
                    }                   
                }
                if(verAdmin){
                    msg.channel.send("Sukses");
                } else {
                    msg.channel.send("Kamu tidak memiliki hak akses untuk mengubah.");
                }
            }    
            if(args[1] == 'admin' && totalcmd == 2){
                var guildID = msg.guild.id;
                var listDataAdmin = getListAdmin(msg);
                var i;                
                var msgAdmin = "";
                for (i = 0; i < listDataAdmin[0].length; i++) {
                    msgAdmin = msgAdmin+(i+1)+'. '+listDataAdmin[1][i]+'\n';
                }
                msg.channel.send("Daftar Admin\n"+msgAdmin);
            } else if(args[1] == 'admin' && args[2] == 'add' && totalcmd == 4){
                var isMention = msg.mentions.users.first(1).length;
                if(isMention > 0){
                    var mentionID = msg.mentions.users.firstKey(1);
                    var sudahAda = false;
                    var listDataAdmin = getListAdmin(msg);
                    var admin = checkAdmin(msg);
                    var i;
                    for (i = 0; i < listDataAdmin[0].length; i++) {
                        if(mentionID == listDataAdmin[0][i]){
                            sudahAda = true;
                            break;
                        }                   
                    }
                    if(admin){
                        if(sudahAda){
                            msg.channel.send("Admin sebelumnya sudah terdaftar");
                        } else {
                            var msgSend = 'Anda akan menambahkan <@!'+mentionID[0]+'> sebagai `admin`'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                            timerConfirmMessage(msg,msgSend,mentionID[0],'admin_add')
                        }
                    } else {
                        msg.channel.send("Kamu tidak memiliki hak akses untuk mengubah.");
                    }
                }
            } else if(args[1] == 'admin' && args[2] == 'remove' && totalcmd == 4){
                var isMention = msg.mentions.users.first(1).length;
                if(isMention > 0){
                    var mentionID = msg.mentions.users.firstKey(1);
                    var sudahAda = false;
                    var listDataAdmin = getListAdmin(msg);
                    var admin = checkAdmin(msg);
                    var i;
                    for (i = 0; i < listDataAdmin[0].length; i++) {
                        if(mentionID == listDataAdmin[0][i]){
                            sudahAda = true;
                            break;
                        }                   
                    }
                    if(admin){
                        if(mentionID[0] !== msg.guild.ownerID){
                            if(sudahAda){
                                var msgSend = 'Anda akan menghapus <@!'+mentionID[0]+'> sebagai `admin`'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                                timerConfirmMessage(msg,msgSend,mentionID[0],'admin_remove')
                            } else {
                                msg.channel.send("Admin tidak terdaftar");
                            }                            
                        } else {
                            msg.channel.send("Anda tidak dapat menghapus `Pemilik` server");
                        }
                    } else {
                        msg.channel.send("Kamu tidak memiliki `hak akses` untuk mengubah.");
                    }
                }
            }            
            if(args[1] == 'welcome' && totalcmd == 2){
                var guildID = msg.guild.id;
                var server = configJSON('server',guildID);
                var msgOut = prefixChange(server.greeting[0],msg);
                msg.channel.send('```'+msgOut+'```');
            } else if(args[1] == 'leave' && totalcmd == 2){
                var guildID = msg.guild.id;
                var server = configJSON('server',guildID);
                var msgOut = prefixChange(server.greeting[1],msg);
                msg.channel.send('```'+msgOut+'```');
            }
            if(args[1] == 'notice' && totalcmd == 3){
                var admin = checkAdmin(msg);
                if(admin){
                    var idCh = args[2];
                    if(idCh == 'on'){            
                        var msgSend = '> Mengatur `Notice` ke `on`'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                        timerConfirmMessage(msg,msgSend,'','notice_on')
                    } else if(idCh == 'off'){            
                        var msgSend = '> Mengatur `Notice` ke `off`'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                        timerConfirmMessage(msg,msgSend,'','notice_off')
                    } else if(idCh == 'default'){            
                        var msgSend = '> Memindahkan Channel `Notice` ke `default`'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                        timerConfirmMessage(msg,msgSend,'','notice_ch')
                    } else {
                        idCh = idCh.replace(/\D/g,'');
                        var channel = msg.guild.channels.cache.find(ch => ch.id === idCh);
                        if(channel !== undefined){            
                            var msgSend = '> Memindahkan Channel `Notice` ke Channel <#'+idCh+'>'+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                            timerConfirmMessage(msg,msgSend,idCh,'notice_ch')
                        } else {
                            kirimPesanKeChannelSama(msg,"Nama Channel tidak valid (Bantuan ketik !help).");
                        }
                    }
                } else {
                    kirimPesanKeChannelSama(msg,"Kamu tidak memiliki `hak akses` untuk mengubah.");
                }
            }
            if(args[1] == 'welcome' && totalcmd >= 3){
                var admin = checkAdmin(msg);
                if(admin){
                    var position = msg.content.indexOf(args[2]);
                    var msgPost = msg.content.substr(position);
                    var msgDisplay = prefixChange(msgPost,msg);                
                    var msgSend = '\n> '+msgDisplay+''+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                    timerConfirmMessage(msg,msgSend,msgPost,'welcome')
                } else {
                    msg.channel.send("Kamu tidak memiliki `hak akses` untuk mengubah.");
                }
            }
            if(args[1] == 'leave' && totalcmd >= 3){
                var admin = checkAdmin(msg);
                if(admin){
                    var position = msg.content.indexOf(args[2]);
                    var msgPost = msg.content.substr(position);
                    var msgDisplay = prefixChange(msgPost,msg);
                    var msgSend = '\n> '+msgDisplay+''+'\nKetik `ya` untuk menyimpan `tidak` untuk batal.';                
                    timerConfirmMessage(msg,msgSend,msgPost,'leave')
                } else {
                    kirimPesanKeChannelSama(msg,"Kamu tidak memiliki `hak akses` untuk mengubah.");
                }
            }                       
            if(args[1] == 'test'){
                var ownerID = msg.author.id;
                var guildID = msg.guild.id;
                msgSend = "Ketik `ya` untuk konfirmasi dan `tidak` untuk batal";                
                timerConfirmMessage(msg,msgSend,data)
                msg.channel.send(msgSend).then((msg) =>{
                    confirmAuthorID[ownerID] = 'test';
                    msgLogID[ownerID] = msg;
                    interval[ownerID] = setInterval(function() {
                        confirmAuthorID.splice(ownerID,1);
                        msgLogID.splice(ownerID,1);
                        // Hapus Pesan Konfirmasi
                        msg.delete();
                        // Reset Waktu
                        clearInterval(interval[ownerID]);
                        interval[ownerID] = undefined;
                    }, 10*1000);             
                });
            } 
            if(msg.mentions.users.first(1).length == 1){
            }
        } else if(cmd == prefix+'pukul' && totalcmd == 1){
            msg.channel.send("Pengen dipukul sama gua? Bantuan ketik !help");
        } else if(cmd == prefix+'play' && totalcmd == 1){
            var ownerID = msg.author.id;
            if (!interval[ownerID]) {
                msg.channel.send('Playing QOTD').then((msg) =>{
                    interval[ownerID] = setInterval(async function() {
                        msg.edit("Timeout.");
                        clearInterval(interval[ownerID]);
                        interval[ownerID] = undefined;
                    }, 10*1000);             
                });
            } else {
                msg.channel.send('QOTD already running');
            }
        } else if(cmd == prefix+'stop' && totalcmd == 1){
            var ownerID = msg.author.id;
            clearInterval(interval[msg.author.id]);
            interval[msg.author.id] = undefined;
        } else if(cmd == 'ya'){
            if(interval[ownerID] !== undefined){
                var ownerID = msg.author.id;
                var guildID = msg.guild.id;
                var cmd = confirmAuthorID[ownerID];
                msgLogID[ownerID].edit('Pengaturan `'+cmd+'` berhasil disimpan.');
                clearConfirm(ownerID);
                var config = configJSON('server',guildID);
                if(cmd == 'test'){
                } else if(cmd == 'welcome'){
                    config.greeting[0] = inputAuthorID[ownerID];
                    saveServerJSON(config,guildID);
                } else if(cmd == 'leave'){
                    config.greeting[1] = inputAuthorID[ownerID];
                    saveServerJSON(config,guildID);
                } else if(cmd == 'admin_add'){
                    config.adminID.push(inputAuthorID[ownerID]);
                    saveServerJSON(config,guildID);
                } else if(cmd == 'admin_remove'){
                    var key = config.adminID.indexOf(inputAuthorID[ownerID])
                    if(key !== -1){
                        config.adminID.splice(key,1);
                        saveServerJSON(config,guildID);
                    }
                } else if(cmd == 'notice_ch'){
                    config.noticeChannelID = inputAuthorID[ownerID];
                    saveServerJSON(config,guildID);
                } else if(cmd == 'notice_on'){
                    config.noticeStat = true;
                    saveServerJSON(config,guildID);
                } else if(cmd == 'notice_off'){
                    config.noticeStat = false;
                    saveServerJSON(config,guildID);
                }
            }
        } else if(cmd == 'tidak'){
            var ownerID = msg.author.id;
            var guildID = msg.guild.id;
            var cmd = confirmAuthorID[ownerID];
            clearConfirm(ownerID);
            msgLogID[ownerID].edit('Pengaturan `'+cmd+'` batal disimpan.');
        }
        // Kirim ke Spesifik Channel
        if(msg.author.id == "197847716485791744"){
            // kirimPesanKeChannelSama(msg,"Test!");
        }
        // Help Config       
        if(cmd == prefix+'help' && totalcmd == 1){
            const messageEmbed = new Discord.MessageEmbed()
            .setTitle('Bantuan NekonyAn Bot')
            .addField("Sapa Teman", "`!help sapa`")
            .addField("Pengaturan Sistem", "`!help config`")
            .addField("Sistem Laporan", "`!help report`")
            .setTimestamp()
            msg.channel.send(messageEmbed);
        }
        if(cmd == prefix+'help'){
            if(args[1] == "sapa" && totalcmd == 2){
                const messageEmbed = new Discord.MessageEmbed()
                .setTitle('Perintah Sapa Teman')
                .addField("Sapa Teman", "`!sapa @mention`", true)
                .setTimestamp()
                msg.channel.send(messageEmbed);
            }
            if(args[1] == "config" && totalcmd == 2){
                const messageEmbed = new Discord.MessageEmbed()
                .setTitle('Pengaturan Sistem')
                .addField('\u200B', "Sapa Member")
                .addFields(
                    { name: 'Masuk server', value: '`!help config welcome`', inline: true },
                    { name: 'Keluar server', value: '`!help config leave`', inline: true },
                )
                .addField('\u200B', "Admin NekonyAn [BOT]")
                .addFields(
                    { name: 'Perintah', value: '`!help config admin`', inline: true },
                )
                .addField('\u200B', "Notice Bahasa Kasar dan Huruf Kapital")
                .addFields(
                    { name: 'Perintah', value: '`!help config notice`', inline: true },
                )
                .setTimestamp()
                msg.channel.send(messageEmbed);
            }
            if(args[1] == "report" && totalcmd == 2){
                const messageEmbed = new Discord.MessageEmbed()
                .setTitle('Bantuan Laporan')
                .addField('\u200B', "Summary Report")
                .addFields(
                    { name: 'Lihat Summary Report', value: '`!report summary Member#Number`'},
                    { name: 'Lihat Detail Report', value: '`!report show Member#Number <number report>`'},
                )
                .setTimestamp()
                msg.channel.send(messageEmbed);
            }
            if(args[1] == "config" && totalcmd == 3){                
                if(args[2] == "welcome"){
                    const messageEmbed = new Discord.MessageEmbed()
                    .setTitle('Pengaturan Sapa Masuk Server')
                    .addFields(
                        { name: 'Lihat data', value: '`!config welcome`', inline: true },
                        { name: 'Ubah data', value: '`!config welcome <pesan>`', inline: true },
                    )
                    .addField('\u200B', "Kalimat Unik")
                    .addFields(
                        { name: 'Nama Server', value: '`!servername`', inline: true },
                        { name: 'Nama Member', value: '`!member`', inline: true },
                        { name: 'Contoh', value: '`Selamat datang di Server !servername, !member`'},
                        { name: 'Hasil', value: '`Selamat datang di Server '+msg.guild.name+', '+msg.author.tag+'`'},
                    )
                    .setTimestamp()
                    msg.channel.send(messageEmbed);
                } else if(args[2] == "leave"){
                    const messageEmbed = new Discord.MessageEmbed()
                    .setTitle('Pengaturan Sapa Keluar Server')
                    .addFields(
                        { name: 'Lihat data', value: '`!config leave`', inline: true },
                        { name: 'Ubah data', value: '`!config leave <pesan>`', inline: true },
                    )
                    .addField('\u200B', "Kalimat Unik")
                    .addFields(
                        { name: 'Nama Server', value: '`!servername`', inline: true },
                        { name: 'Nama Member', value: '`!member`', inline: true },
                        { name: 'Contoh', value: '`Selamat Tinggal dari Server !servername, !member`'},
                        { name: 'Hasil', value: '`Selamat Tinggal dari Server '+msg.guild.name+', '+msg.author.tag+'`'},
                    )
                    .setTimestamp()
                    msg.channel.send(messageEmbed);
                } else if(args[2] == "admin"){
                    const messageEmbed = new Discord.MessageEmbed()
                    .setTitle('Pengaturan Admin NekonyAn [BOT]')
                    .addFields(
                        { name: 'Lihat data', value: '`!config admin`'},
                        { name: 'Tambah data', value: '`!config admin add <mention member>`'},
                        { name: 'Hapus data', value: '`!config admin remove <mention member>`'},
                    )
                    .setTimestamp()
                    msg.channel.send(messageEmbed);
                } else if(args[2] == "notice"){
                    const messageEmbed = new Discord.MessageEmbed()
                    .setTitle('Pengaturan Notice Bahasa Kasar dan Huruf Kapital')
                    .addFields(
                        { name: 'Ubah Channel', value: '`!config notice <tag channel>`'},
                        { name: 'Ubah Channel ke Default', value: '`!config notice default`'},
                        { name: 'Hidupkan Notice', value: '`!config notice on`'},
                        { name: 'Matikan Notice', value: '`!config notice off`'},
                    )
                    .setTimestamp()
                    msg.channel.send(messageEmbed);
                }
            }            
        } 
    }
});

client.login(auth.token);