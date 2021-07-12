const { App, SocketModeReceiver } = require("@slack/bolt");
require("dotenv").config();
const root = require("./data/roots.json");
const adj = require("./data/adj.json");


// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  clientSecret: process.env.CLIENT_SECRET,
  clientId: process.env.CLIENT_ID,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

/* app.client.users.conversations({
  user:
}) */
app.command("/scrum", async ({ command, ack, say }) => {
  try {
    let botInfo = await app.client.bots.info()
    let members = await app.client.conversations.members({
      channel: "C027P6PEWRY",
    });

    if (command.channel_id === "C027P6PEWRY") {
      await ack();

      let rndMember = Math.floor(Math.random() * members.members.length - 1);
      let rndRoot = Math.floor(Math.random() * root.length - 1);
      let rndAdj = Math.floor(Math.random() * adj.length - 1);

      say(
        `<@${members.members[rndMember]}> has the ${adj[rndAdj]} ${root[rndRoot]}`
      );
    }
    console.log(botInfo);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  const port = 3000;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
