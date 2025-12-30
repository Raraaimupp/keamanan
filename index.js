const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = "8130692964:AAG58QmniAvymKKuJfsJEW10cA10BJrgDUc";

const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  }
});

// ===============================
// KONFIGURASI
// ===============================
const GROUP_ID = -1003363228421;
const CHANNEL_USERNAME = "@kepoluyee";
const CHANNEL_LINK = "https://t.me/kepoluyee";

// cache status user
const warnedUsers = new Set();     // sudah diperingatkan
const joinedNotified = new Set();  // sudah dikirimi notif join

// ===============================
// CEK KEANGGOTAAN CHANNEL
// ===============================
async function sudahJoin(userId) {
  try {
    const member = await bot.getChatMember(CHANNEL_USERNAME, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch {
    return false;
  }
}

// ===============================
// HANDLER UTAMA
// ===============================
async function forceJoinHandler(msg) {
  try {
    if (!msg.chat || msg.chat.id !== GROUP_ID) return;
    if (!msg.from || msg.from.is_bot) return;

    const userId = msg.from.id;
    const chatId = msg.chat.id;

    const join = await sudahJoin(userId);

    // mention user
    const mention = msg.from.username
      ? `@${msg.from.username}`
      : `<a href="tg://user?id=${userId}">${msg.from.first_name || "Pengguna"}</a>`;

    // ===============================
    // ✅ USER SUDAH JOIN → KIRIM NOTIF
    // ===============================
    if (join) {
      warnedUsers.delete(userId);

      if (!joinedNotified.has(userId)) {
        joinedNotified.add(userId);

        const teksJoin = `
🌟 <b>SELAMAT DATANG</b>

<blockquote>
👋 Halo ${mention}

Terima kasih telah bergabung
dengan channel resmi kami:
<b>${CHANNEL_USERNAME}</b>

✨ Semoga informasi yang dibagikan
dapat bermanfaat dan menambah wawasan.
Selamat berinteraksi di grup ini,
tetap jaga etika dan kenyamanan bersama.
</blockquote>

💎 <i>Selamat bergabung & selamat berdiskusi!</i>
        `.trim();

        await bot.sendMessage(chatId, teksJoin, {
          parse_mode: "HTML",
          disable_web_page_preview: true
        });
      }
      return; // stop, user sudah aman
    }

    // ===============================
    // ❌ USER BELUM JOIN
    // ===============================

    // hapus pesan user
    if (msg.message_id) {
      await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
    }

    // jangan spam peringatan
    if (warnedUsers.has(userId)) return;
    warnedUsers.add(userId);

    const teksPeringatan = `
💎 <b>SISTEM KEAMANAN GRUP</b>

<blockquote>
👤 <b>Pengguna</b> : ${mention}
🔒 <b>Status</b> : Akses dibatasi

Untuk menjaga ketertiban dan
kenyamanan bersama,
setiap anggota <b>WAJIB</b>
bergabung ke channel resmi kami.

📢 <b>Channel Resmi</b>
${CHANNEL_USERNAME}

⛔ Selama belum bergabung,
setiap pesan akan <b>otomatis dihapus</b>
oleh sistem.
</blockquote>

✨ <i>Silakan bergabung melalui tombol di bawah
untuk tidak mendapatkan peringatan ini lagi.</i>
    `.trim();

    await bot.sendMessage(chatId, teksPeringatan, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✨ CLICK BUAT JOIN",
              url: CHANNEL_LINK
            }
          ]
        ]
      }
    });

  } catch (err) {
    console.error("FORCE JOIN ERROR:", err);
  }
}

// ===============================
// DATA COUNTDOWN
// ===============================
const accCountdown = new Map(); // targetId -> interval

// ===============================
// HELPER: CEK ADMIN
// ===============================
async function isAdmin(chatId, userId) {
  try {
    const m = await bot.getChatMember(chatId, userId);
    return m.status === "administrator" || m.status === "creator";
  } catch {
    return false;
  }
}

// ===============================
// COMMAND /acc (ADMIN ONLY, REPLY)
// ===============================
bot.onText(/^\/acc$/i, async (msg) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;

  if (!(await isAdmin(chatId, adminId))) {
    return bot.sendMessage(
      chatId,
      "⛔ <b>Akses Ditolak</b>\n\nPerintah ini hanya dapat digunakan oleh <b>admin grup</b>.",
      { parse_mode: "HTML" }
    );
  }

  if (!msg.reply_to_message || !msg.reply_to_message.from) {
    return bot.sendMessage(
      chatId,
      "⚠️ Gunakan perintah ini dengan <b>membalas pesan</b> pengguna.",
      { parse_mode: "HTML" }
    );
  }

  const target = msg.reply_to_message.from;
  if (target.is_bot) return;

  const targetId = target.id;

  // cegah double countdown
  if (accCountdown.has(targetId)) {
    return bot.sendMessage(chatId, "⚠️ Hitungan mundur sedang berjalan untuk pengguna ini.");
  }

  const mention = target.username
    ? `@${target.username}`
    : `<a href="tg://user?id=${targetId}">${target.first_name || "Pengguna"}</a>`;

  // info awal
  await bot.sendMessage(
    chatId,
    `
⚠️ <b>PERINGATAN ADMIN</b>

<blockquote>
👤 <b>Pengguna</b> : ${mention}

Hitungan mundur dimulai.
Setelah selesai, akses berbicara
akan <b>dibatasi</b>.
</blockquote>
    `.trim(),
    {
      parse_mode: "HTML",
      reply_to_message_id: msg.reply_to_message.message_id
    }
  );

  let angka = 10;

  const interval = setInterval(async () => {
    try {
      await bot.sendMessage(
        chatId,
        `<b>${angka}</b>`,
        {
          parse_mode: "HTML",
          reply_to_message_id: msg.reply_to_message.message_id
        }
      );

      angka--;

      if (angka < 0) {
        clearInterval(interval);
        accCountdown.delete(targetId);

        // 🔇 MUTE
        await bot.restrictChatMember(chatId, targetId, {
          permissions: {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false,
            can_send_polls: false
          }
        });

        await bot.sendMessage(
          chatId,
          `
🔇 <b>AKSES DIBATASI</b>

<blockquote>
👤 <b>Pengguna</b> : ${mention}

Hitungan telah selesai.
Pengguna dibatasi dari
mengirim pesan di grup ini.
</blockquote>

💎 <i>Gunakan /batal untuk membuka kembali akses.</i>
          `.trim(),
          { parse_mode: "HTML" }
        );
      }
    } catch {
      clearInterval(interval);
      accCountdown.delete(targetId);
    }
  }, 1000);

  accCountdown.set(targetId, interval);
});

// ===============================
// COMMAND /berhenti (ADMIN ONLY)
// Batalkan SEMUA hitungan (tidak jadi mute)
// ===============================
bot.onText(/^\/berhenti$/i, async (msg) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;

  if (!(await isAdmin(chatId, adminId))) {
    return bot.sendMessage(
      chatId,
      "⛔ <b>Akses Ditolak</b>\n\nPerintah ini hanya dapat digunakan oleh <b>admin grup</b>.",
      { parse_mode: "HTML" }
    );
  }

  if (accCountdown.size === 0) {
    return bot.sendMessage(
      chatId,
      "ℹ️ <b>Tidak Ada Proses Aktif</b>\n\nTidak ada hitungan mundur yang sedang berjalan.",
      { parse_mode: "HTML" }
    );
  }

  for (const [, interval] of accCountdown.entries()) {
    clearInterval(interval);
  }
  accCountdown.clear();

  await bot.sendMessage(
    chatId,
    `
🛑 <b>PROSES DIHENTIKAN</b>

<blockquote>
Hitungan mundur dibatalkan
oleh admin.
Tidak ada pengguna
yang dibatasi aksesnya.
</blockquote>
    `.trim(),
    { parse_mode: "HTML" }
  );
});

// ===============================
// COMMAND /batal @username (ADMIN ONLY)
// Unmute + hentikan proses user tertentu
// ===============================
bot.onText(/^\/batal\s+@?(\w+)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;

  if (!(await isAdmin(chatId, adminId))) {
    return bot.sendMessage(
      chatId,
      "⛔ <b>Akses Ditolak</b>\n\nPerintah ini hanya untuk <b>admin grup</b>.",
      { parse_mode: "HTML" }
    );
  }

  const username = match[1];
  const member = await bot.getChatMember(chatId, `@${username}`).catch(() => null);
  if (!member) {
    return bot.sendMessage(chatId, "❌ Pengguna tidak ditemukan.");
  }

  const targetId = member.user.id;

  // stop countdown jika ada
  if (accCountdown.has(targetId)) {
    clearInterval(accCountdown.get(targetId));
    accCountdown.delete(targetId);
  }

  // 🔓 UNMUTE
  await bot.restrictChatMember(chatId, targetId, {
    permissions: {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true,
      can_send_polls: true
    }
  });

  const mention = member.user.username
    ? `@${member.user.username}`
    : `<a href="tg://user?id=${targetId}">${member.user.first_name || "Pengguna"}</a>`;

  await bot.sendMessage(
    chatId,
    `
🔓 <b>AKSES DIPULIHKAN</b>

<blockquote>
👤 <b>Pengguna</b> : ${mention}

Akses berbicara telah
dibuka kembali oleh admin.
</blockquote>
    `.trim(),
    { parse_mode: "HTML" }
  );
});

// ===============================
// LISTENER
// ===============================
bot.on("message", forceJoinHandler);
bot.on("edited_message", forceJoinHandler);

console.log("💎 SISTEM WAJIB JOIN & NOTIF JOIN AKTIF (SUPER PREMIUM)");