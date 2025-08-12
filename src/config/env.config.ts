export default () => ({
  port: parseInt(process.env.PORT, 10) || 5050,
  token: process.env.DS_TOKEN || undefined,
  guildId: process.env.GUILD_ID || undefined,
  mode: process.env.MODE || 'production',
});
