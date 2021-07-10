const { App } = require("@slack/bolt");
require("dotenv").config();
const root = require("./data/roots.json")
const adj = require("./data/adj.json")
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

app.command("/scrum", async ({ command, ack, say }) => {
    try {
      await ack();
      let members = await app.client.conversations.members({ 
          channel: 'C027P6PEWRY'
      })

      let rndMember = Math.floor(Math.random() * members.members.length - 1);
      let rndRoot = Math.floor(Math.random() * root.length - 1);
      let rndAdj = Math.floor(Math.random() * adj.length - 1);

      say(`<@${members.members[rndMember]}> has the ${adj[rndAdj]} ${root[rndRoot]}`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();