/*
Telegram Gacha Bot (Node.js)
Versi: Final + Local File Storage + Cooldown 20s
*/

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

///// CONFIG /////
const TOKEN = '8244447574:AAGySZK52LNrOxO_Uw5hjCaH-pcR4cUsnsk';
const OWNER_ID = 1886007660;
const REQUIRED_CHANNEL = 'kepoluyee';
const COOLDOWN_SECONDS = 35; // jeda waktu 20 detik
///// END CONFIG /////

const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_DIR = path.join(__dirname, 'storage');
const DOCS_DIR = path.join(STORAGE_DIR, 'docs');
for (const d of [DATA_DIR, STORAGE_DIR, DOCS_DIR]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
if (!fs.existsSync(ITEMS_FILE)) fs.writeFileSync(ITEMS_FILE, JSON.stringify([]));
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}));

const bot = new TelegramBot(TOKEN, { polling: true });

function readItems() {
  return JSON.parse(fs.readFileSync(ITEMS_FILE));
}
function writeItems(items) {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
}
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}
function writeUsers(u) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2));
}
function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// 🟢 START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "Pengguna";
  const users = readUsers();
  const items = readItems();

  if (!users[chatId]) {
    users[chatId] = {
      id: chatId,
      startedAt: new Date().toISOString(),
      gachaCount: 0,
      gachaDate: todayKey(),
      lastGachaTime: 0
    };
  }

  // reset harian
  if (users[chatId].gachaDate !== todayKey()) {
    users[chatId].gachaCount = 0;
    users[chatId].gachaDate = todayKey();
  }

  writeUsers(users);

  const remaining = 10 - users[chatId].gachaCount;
  const menu = `
👋 <b>Halo ${username}</b>
Selamat datang di bot Gacha 🎰

📜 <b>Fitur tersedia:</b>
🎰 /gacha – Main gacha (${remaining}x tersisa hari ini)
➕ /additem – Tambah item (Owner)
➖ /delitem – Hapus item (Owner)

📦 Jumlah item tersedia: ${items.length}

📢 Kamu harus join channel @${REQUIRED_CHANNEL} untuk bisa /gacha.
`;

  bot.sendMessage(chatId, menu, { parse_mode: "HTML" });
});

// 👑 ADD ITEM
bot.onText(/\/additem(?:\s+(.+))?/, async (msg, match) => {
  const fromId = msg.from.id;
  if (fromId !== OWNER_ID)
    return bot.sendMessage(msg.chat.id, "❌ Hanya owner yang bisa menambah item.");
  if (!msg.reply_to_message)
    return bot.sendMessage(
      msg.chat.id,
      "📎 Balas (reply) ke pesan yang berisi file/text yang ingin dijadikan item.\n\nFormat:\n/additem <nama>|<weight>|<isZonk>"
    );

  const arg = match[1] || "";
  let [name, weightStr, isZonkStr] = arg.split("|").map((s) => s && s.trim());
  const weight = parseFloat(weightStr) || 1;
  const isZonk = isZonkStr === "true";
  const r = msg.reply_to_message;
  const items = readItems();
  const id = Date.now();
  let filePath = null;
  let fileType = "none";

  // Jika reply ke dokumen
  if (r.document) {
    const fileId = r.document.file_id;
    const fileName = r.document.file_name || `${id}.bin`;
    try {
      const fileLink = await bot.getFileLink(fileId);
      const savePath = path.join(DOCS_DIR, fileName);
      const res = await axios.get(fileLink, { responseType: "arraybuffer" });
      fs.writeFileSync(savePath, res.data);
      filePath = savePath;
      fileType = "localDocument";
      bot.sendMessage(msg.chat.id, `📁 Dokumen disimpan: ${savePath}`);
    } catch (e) {
      console.error("Gagal download dokumen:", e.message);
      return bot.sendMessage(msg.chat.id, "❌ Gagal menyimpan dokumen.");
    }
  } else if (r.photo) {
    const photos = r.photo;
    filePath = photos[photos.length - 1].file_id;
    fileType = "photo";
  } else if (r.text || r.caption) {
    fileType = "text";
  }

  const newItem = { id, name, weight, isZonk, fileType, filePath };
  items.push(newItem);
  writeItems(items);

  bot.sendMessage(
    msg.chat.id,
    `✅ Item ditambahkan!\n\n📛 Nama: ${name}\n⚖️ Bobot: ${weight}\n💥 Zonk: ${isZonk}\n📂 FileType: ${fileType}`
  );

  // Kirim notifikasi ke semua user
  const users = readUsers();
  const notify = `📢 Item baru ditambahkan: ${name}\nCoba sekarang di /gacha!`;
  for (const uid of Object.keys(users)) {
    try {
      await bot.sendMessage(parseInt(uid), notify);
    } catch {}
  }
});

// 🔎 CEK CHANNEL
async function isMemberOfRequiredChannel(userId) {
  try {
    const member = await bot.getChatMember(`@${REQUIRED_CHANNEL}`, userId);
    return ["creator", "administrator", "member"].includes(member.status);
  } catch {
    return false;
  }
}

// 🎰 GACHA
bot.onText(/\/gacha/, async (msg) => {
  const chatId = msg.chat.id;
  const users = readUsers();
  if (!users[chatId]) {
    users[chatId] = { id: chatId, gachaCount: 0, gachaDate: todayKey(), lastGachaTime: 0 };
  }

  // reset harian
  if (users[chatId].gachaDate !== todayKey()) {
    users[chatId].gachaCount = 0;
    users[chatId].gachaDate = todayKey();
  }

  // cek cooldown
  const now = Date.now();
  const lastTime = users[chatId].lastGachaTime || 0;
  const diff = Math.floor((now - lastTime) / 1000);
  if (diff < COOLDOWN_SECONDS) {
    return bot.sendMessage(
      chatId,
      `⏳ Tunggu ${COOLDOWN_SECONDS - diff} detik lagi sebelum gacha berikutnya.`
    );
  }

  if (users[chatId].gachaCount >= 10)
    return bot.sendMessage(chatId, "⚠️ Batas 10x gacha per hari. Coba lagi besok.");

  const joined = await isMemberOfRequiredChannel(msg.from.id);
  if (!joined)
    return bot.sendMessage(
      chatId,
      `🚫 Kamu harus join channel @${REQUIRED_CHANNEL} dulu untuk bisa /gacha.`
    );

  const items = readItems();
  if (!items.length)
    return bot.sendMessage(chatId, "📦 Belum ada item gacha.");

  const progressMsg = await bot.sendMessage(chatId, "🎰 Mengocok gacha...");
  for (let p = 10; p <= 100; p += 10) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      await bot.editMessageText(`🎰 Mengocok gacha...\nLoading ${p}%`, {
        chat_id: chatId,
        message_id: progressMsg.message_id,
      });
    } catch {}
  }

  const pick = weightedPick(items);
  users[chatId].gachaCount++;
  users[chatId].lastGachaTime = now;
  writeUsers(users);

  let hasilText = "";
  try {
    if (pick.isZonk) {
      hasilText = "💥 ZONK! Tidak dapat apa-apa kali ini.";
      await bot.sendMessage(chatId, hasilText);
    } else if (pick.fileType === "localDocument" && pick.filePath && fs.existsSync(pick.filePath)) {
      hasilText = `🎉 Selamat! Kamu mendapat: ${pick.name}`;
      await bot.sendDocument(chatId, pick.filePath, { caption: hasilText });
    } else if (pick.fileType === "photo") {
      hasilText = `🎉 Selamat! Kamu mendapat: ${pick.name}`;
      await bot.sendPhoto(chatId, pick.filePath, { caption: hasilText });
    } else {
      hasilText = `🎉 Selamat! Kamu mendapat: ${pick.name}`;
      await bot.sendMessage(chatId, hasilText);
    }
  } catch (err) {
    console.error("Gagal kirim hadiah:", err.message);
    hasilText = `🎉 Selamat! Kamu mendapat: ${pick.name}\n⚠️ File tidak ditemukan.`;
    await bot.sendMessage(chatId, hasilText);
  }

  try {
    await bot.editMessageText("✅ Selesai! Lihat hasil di bawah.", {
      chat_id: chatId,
      message_id: progressMsg.message_id,
    });
  } catch {}

  // ==============================
  // 🔔 NOTIFIKASI KE OWNER
  // ==============================
  const username = msg.from.username
    ? `@${msg.from.username}`
    : `${msg.from.first_name || "TanpaNama"}`;
  const hasil = pick.isZonk ? "💥 ZONK" : `🎁 ${pick.name}`;
  const notifText = `📢 <b>User Gacha!</b>\n\n👤 <b>User:</b> ${username} (${chatId})\n🎰 <b>Hasil:</b> ${hasil}`;
  await bot.sendMessage(OWNER_ID, notifText, { parse_mode: "HTML" }).catch(() => {});
});

// ⚙️ LIST ITEM
bot.onText(/\/listitems/, (msg) => {
  if (msg.from.id !== OWNER_ID) return;
  const items = readItems();
  if (!items.length) return bot.sendMessage(msg.chat.id, "Belum ada item.");
  let s = "📦 Items:\n";
  for (const it of items) {
    s += `- ${it.name} | weight:${it.weight} | zonk:${it.isZonk}\n`;
  }
  bot.sendMessage(msg.chat.id, s);
});

// ❌ HAPUS ITEM
bot.onText(/\/delitem\s+(\d+)/, (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;
  const id = parseInt(match[1]);
  let items = readItems();
  const before = items.length;
  items = items.filter((x) => x.id !== id);
  writeItems(items);
  bot.sendMessage(msg.chat.id, `🗑️ Dihapus ${before - items.length} item.`);
});

function weightedPick(items) {
  const total = items.reduce((s, i) => s + (i.weight || 1), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight || 1;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

bot.on('polling_error', (e) => console.error(e.message));
console.log('🤖 Gacha Bot running...');
