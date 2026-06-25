const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');
const fetch = global.fetch;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName('chi')
    .setDescription('Nhập chi phí Trung Thu')
    .addStringOption(option =>
      option
        .setName('noidung')
        .setDescription('Nội dung chi')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('soluong')
        .setDescription('Số lượng')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('donvi')
        .setDescription('Đơn vị')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('giatien')
        .setDescription('Giá tiền')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nguoichi')
        .setDescription('Người chi')
        .setRequired(true)
    ),
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN
  );

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APP_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash command đã đăng ký');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'chi') {
    const noidung = interaction.options.getString('noidung');
    const soluong = interaction.options.getInteger('soluong');
    const donvi = interaction.options.getString('donvi');
    const giatien = interaction.options.getInteger('giatien');
    const nguoichi = interaction.options.getString('nguoichi');

    await interaction.reply({
      content:
`✅ Đã ghi nhận chi phí

📌 Nội dung: ${noidung}
📦 Số lượng: ${soluong}
📏 Đơn vị: ${donvi}
💰 Giá tiền: ${giatien.toLocaleString()} đ
👤 Người chi: ${nguoichi}
📸 Vui lòng upload ảnh hóa đơn/chứng từ ngay bên dưới tin nhắn này.`,
    });
    await fetch(
  'http://n8n-zbeos5oumjfdy4pattr3i5cv.45.76.163.125.sslip.io/webhook/507f5fa0-4cab-49fa-9fc4-00db6a1a6c32',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ngay: new Date().toLocaleDateString('vi-VN'),
      noidung,
      soluong,
      donvi,
      giatien,
      nguoichi,
    }),
  }
);
  }
});

client.login(process.env.DISCORD_TOKEN);
