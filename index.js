const { App } = require("@slack/bolt");
require("dotenv").config();
const root = [
  "Yucca",
  "Potato",
  "Carrot",
  "Parsnips",
  "Onion",
  "Fennel",
  "Celeriac",
  "Raddish",
  "Salsify",
  "Beets",
  "Ginger",
  "Garlic",
  "Clark",
  "Turnip",
  "Goomba"
]
const adj = [
  "Frosty",
  "Boiling",
  "Smoldering",
  "Frozen",
  "Ghastly",
  "Blazing",
  "Frigid",
  "Glacial",
  "Chilly",
  "Icy",
  "Steaming",
  "Bubbling",
  "Evaporating",
  "Burning",
  "Lazy"
]


// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  clientSecret: process.env.CLIENT_SECRET,
  clientId: process.env.CLIENT_ID,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});


app.command("/scrum", async ({ command, ack, say }) => {
  try {
    let members = await app.client.conversations.members({
      channel: "CG6QELR41",
    });

    if (command.channel_id === "CG6QELR41") {
      await ack();

      let rndMember = Math.floor(Math.random() * members.members.length - 1);
      let rndRoot = Math.floor(Math.random() * root.length - 1);
      let rndAdj = Math.floor(Math.random() * adj.length - 1);

      say(
        `<@${members.members[rndMember]}> has the ${adj[rndAdj]} ${root[rndRoot]}`
      );
    }
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  const port = 8001;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
