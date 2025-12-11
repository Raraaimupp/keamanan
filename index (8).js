// index.js
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js');
const bot = new TelegramBot(config.telegram.token, { polling: true });

const fs = require('fs');

// Fungsi untuk backup data
function backupData() {
  const data = {
    nokos: nokos,
    userNokos: userNokos,
  };

  fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
  console.log('Data berhasil di backup!');
}

// Panggil fungsi backupData setiap 3 jam
setInterval(backupData, 10800000); // 3 jam = 10800000 milidetik
// ... kode lainnya ...

const nokos = [
  { id: 1, number: '+628123456789', status: 'available' },
  { id: 2, number: '+628987654321', status: 'available' },
  { id: 3, number: '+628111111111', status: 'available' },
  // Tambahkan nokos lainnya di sini
];

const userNokos = {};

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === 'gacha') {
    // Cek apakah user sudah bergabung dengan channel atau grup
    try {
      const [channelMember, groupMember] = await Promise.all([
        bot.getChatMember(config.telegram.channelId, userId),
        bot.getChatMember(config.telegram.groupId, userId),
      ]);

          if (channelMember.status === 'left' || groupMember.status === 'left') {
      bot.sendMessage(chatId, `Halo! Untuk menggunakan bot ini, silakan join channel ${config.telegram.channelId} dan grup ${config.telegram.groupId} terlebih dahulu.`, {
        reply_markup: {
          inline_keyboard: [
            [
                { text: 'Join Channel', url: `https://t.me/${config.telegram.channelId.slice(1)}` }
              ],
              [
                { text: 'Join Grup', url: `https://t.me/${config.telegram.groupId.slice(1)}` }
              ],
              [
                { text: 'Join Channel 2', url: `https://t.me/${config.telegram.channel2Id.slice(1)}` }
              ],
              [
                { text: 'Sudah Join', callback_data: 'verify' },
            ],
          ],
        },
      });
      return;
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Terjadi kesalahan. Pastikan bot adalah admin di channel/grup.');
    return;
  }

// Animasi mengacha nokos
  let animasi = ['Menggacha nokos...', 'Menggacha nokos...', 'Nokos sedang diproses...', 'Nokos hampir jadi...', 'Selamat, Anda mendapatkan nokos!'];
  let i = 0;
  let intervalId = setInterval(async () => {
    if (i > 0) {
      await bot.deleteMessage(chatId, msg.message_id + i);
    }
    let message = await bot.sendMessage(chatId, animasi[i]);
    i++;
    if (i >= animasi.length) {
      clearInterval(intervalId);
      // Gacha nokos
      const availableNokos = nokos.filter((nokos) => nokos.status === 'available');
      if (availableNokos.length === 0) {
        bot.sendMessage(chatId, 'Maaf, tidak ada nokos yang tersedia saat ini.');
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableNokos.length);
      const selectedNokos = availableNokos[randomIndex];

      // 20% chance untuk mendapatkan zonk
      if (Math.random() < 0.2) {
        bot.sendMessage(chatId, 'ZONK! Anda tidak mendapatkan nokos.');
      } else {
        // Update status nokos
        selectedNokos.status = 'unavailable';
        selectedNokos.userId = userId;

        // Kirim nomor nokos
        // Kirim nomor nokos
bot.sendMessage(chatId, `Selamat,
Anda mendapatkan nokos:
${selectedNokos.number}`, {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Ambil Otp Anda', callback_data: 'get_otp' },
            ],
        ],
    },
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === 'verify') {
    try {
      const [channelMember, groupMember] = await Promise.all([
        bot.getChatMember(config.telegram.channelId, userId),
        bot.getChatMember(config.telegram.groupId, userId),
      ]);

      if (channelMember.status !== 'left' && groupMember.status !== 'left') {
        bot.sendMessage(chatId, 'Verifikasi berhasil! Silakan gunakan perintah /gacha untuk mendapatkan nokos.');
        bot.answerCallbackQuery(query.id, { text: 'Berhasil diverifikasi!' });
      } else {
        bot.answerCallbackQuery(query.id, { text: 'Anda belum join channel/grup.' });
      }
    } catch (error) {
      bot.answerCallbackQuery(query.id, { text: 'Terjadi kesalahan.' });
    }
  } else if (query.data === 'get_otp') {
    // Acak OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    bot.sendMessage(chatId, `OTP Anda adalah: ${otp}`);
    bot.answerCallbackQuery(query.id, { text: 'OTP telah dikirim!' });
  }
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    const [channelMember, groupMember, channel2Member] = await Promise.all([
      bot.getChatMember(config.telegram.channelId, userId),
      bot.getChatMember(config.telegram.groupId, userId),
      bot.getChatMember(config.telegram.channel2Id, userId)
    ]);

    if (
      channelMember.status !== 'left' &&
      groupMember.status !== 'left' &&
      channel2Member.status !== 'left'
    ) {
      const isOwner = userId.toString() === config.telegram.ownerId;
      const extraText = isOwner ? ' Anda adalah owner!' : '';

      await bot.sendMessage(
        chatId,
        `Sudah bergabung! Akses diberikan.${extraText}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Gacha Menu', callback_data: 'menugacha' }
              ],
              [
                { text: '📚 Panduan', callback_data: 'panduan' },
                { text: '🎲 Fun Games', callback_data: 'games' },
                { text: '📢 Info', callback_data: 'info' }
              ],
              [
                { text: '👋 Owner', url: `https://t.me/${config.telegram.ownerUsername}` },
                { text: '📢 Channel', url: `https://t.me/${config.telegram.ownerChannel}` }
              ]
            ]
          }
        }
      );
    } else {
      await bot.sendMessage(
        chatId,
        `Halo! Untuk menggunakan bot ini, silakan join channel ${config.telegram.channelId}, grup ${config.telegram.groupId}, dan channel ${config.telegram.channel2Id} terlebih dahulu.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Join Channel', url: `https://t.me/${config.telegram.channelId.slice(1)}` }
              ],
              [
                { text: 'Join Grup', url: `https://t.me/${config.telegram.groupId.slice(1)}` }
              ],
              [
                { text: 'Join Channel 2', url: `https://t.me/${config.telegram.channel2Id.slice(1)}` }
              ],
              [
                { text: 'Sudah Join', callback_data: 'verify' }
              ],
              [
                { text: '👋 Owner', url: `https://t.me/${config.telegram.ownerUsername}` }
              ]
            ]
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      'Terjadi kesalahan. Pastikan bot adalah admin di channel/grup.'
    );
  }
});

const userGachaLimit = {};

function checkLimitGacha(userId) {
  if (!userGachaLimit[userId]) {
    userGachaLimit[userId] = 5;
  }
  return userGachaLimit[userId];
}

bot.on('callback_query', async (query) => {
  try {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;

    await bot.answerCallbackQuery(query.id);

    if (data === 'verify') {
      const [channelMember, groupMember, channel2Member] = await Promise.all([
        bot.getChatMember(config.telegram.channelId, userId),
        bot.getChatMember(config.telegram.groupId, userId),
        bot.getChatMember(config.telegram.channel2Id, userId)
      ]);

      if (
        channelMember.status !== 'left' &&
        groupMember.status !== 'left' &&
        channel2Member.status !== 'left'
      ) {
        const isOwner = userId.toString() === config.telegram.ownerId;
        const extraText = isOwner ? ' Anda adalah owner!' : '';

        return bot.sendMessage(chatId,
          `Verifikasi berhasil! Akses diberikan.${extraText}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Gacha Menu', callback_data: 'menugacha' }],
              [
                { text: '📚 Panduan', callback_data: 'panduan' },
                { text: '🎲 Fun Games', callback_data: 'games' },
                { text: '📢 Info', callback_data: 'info' }
              ],
              [
                { text: '👋 Owner', url: `https://t.me/${config.telegram.ownerUsername}` },
                { text: '📢 Channel', url: `https://t.me/${config.telegram.ownerChannel}` }
              ]
            ]
          }
        });
      } else {
        return bot.sendMessage(chatId, 'Anda belum join channel/grup.');
      }
    }

    if (data === 'menugacha') {
      const limitGacha = checkLimitGacha(userId);

      return bot.sendMessage(chatId, 
`🎉 Selamat Datang di Menu Gacha! 🎉
🔥 Silahkan pilih yang Anda Inginkan! 🔥
🌟 Limit Gacha Anda: ${limitGacha} 🌟`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎁 Gacha Nokos', callback_data: 'gacha' }],
            [
              { text: '📚 Panduan Gacha', callback_data: 'panduan' },
              { text: '🔥 Info Bot', callback_data: 'info' }
            ],
            [
              { text: '🎉 Undang Teman', url: `https://t.me/share/url?url=https://t.me/${config.telegram.botUsername}` }
            ],
            [
              { text: '🔥 Share Bot ke Grup', url: `https://t.me/share/url?url=https://t.me/${config.telegram.botUsername}` }
            ],
            [
              { text: '👋 Owner', url: `https://t.me/${config.telegram.ownerUsername}` }
            ],
            [
              { text: '📢 Channel', url: `https://t.me/${config.telegram.ownerChannel}` }
            ]
          ]
        }
      });
    }

    if (data === 'gacha') {
      return bot.sendMessage(chatId, "🔮 Sedang melakukan gacha...");
    }

    if (data === 'panduan') {
      return bot.sendMessage(chatId, "📚 Panduan Gacha!");
    }

    if (data === 'games') {
      return bot.sendMessage(chatId, "🎲 Fun Games: Coming soon!");
    }

    if (data === 'info') {
      return bot.sendMessage(chatId, "📢 Info Bot!");
    }

  } catch (err) {
    console.error("Callback Query Error:", err);
  }
});

bot.onText(/\/listnokos/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId.toString() !== config.telegram.ownerId) {
    bot.sendMessage(chatId, 'Maaf, Anda tidak memiliki akses untuk melihat list nokos.');
    return;
  }

  let listNokos = 'List Nokos:\n';
  nokos.forEach((nokos, index) => {
    listNokos += `${index + 1}. ${nokos.number} - ${nokos.status}\n`;
  });

  bot.sendMessage(chatId, listNokos, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Tambah Nokos', callback_data: 'add_nokos' },
          { text: 'Hapus Nokos', callback_data: 'delete_nokos' }
        ]
      ]
    }
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === 'add_nokos') {
    bot.sendMessage(chatId, 'Silakan masukkan nomor nokos yang ingin ditambahkan:', {
      reply_markup: {
        force_reply: true,
      },
    });

    bot.once('message', (msg) => {
      const nomor = msg.text;
      nokos.push({ id: nokos.length + 1, number: nomor, status: 'available' });
      bot.sendMessage(chatId, `Nokos ${nomor} telah ditambahkan.`);
    });
  } else if (query.data === 'delete_nokos') {
    bot.sendMessage(chatId, 'Silakan masukkan nomor nokos yang ingin dihapus:', {
      reply_markup: {
        force_reply: true,
      },
    });

    bot.once('message', (msg) => {
      const nomor = msg.text;
      const index = nokos.findIndex((nokos) => nokos.number === nomor);
      if (index !== -1) {
        nokos.splice(index, 1);
        bot.sendMessage(chatId, `Nokos ${nomor} telah dihapus.`);
      } else {
        bot.sendMessage(chatId, `Nokos ${nomor} tidak ditemukan.`);
      }
    });
  }
});

bot.on("polling_error", (err) => console.log(err));

bot.on('polling_error', (error) => {
  console.log(error);
});

bot.on('polling_start', () => {
  console.log('BERHASIL TERSAMBUNG');
});
