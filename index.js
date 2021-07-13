const { App, SocketModeReceiver } = require("@slack/bolt");
const { InstallProvider } = require('@slack/oauth');
const database = require('./config/redis')
require("dotenv").config();
const root = require("./data/roots.json");
const adj = require("./data/adj.json");


// Initializes your app with your bot token and signing secret
/* const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  clientSecret: process.env.CLIENT_SECRET,
  clientId: process.env.CLIENT_ID,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});
 */

/* const receiver = new ExpressReceiver({ 
  signingSecret: process.env.SLACK_SIGNING_SECRET ,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      return await database.set(installation.team.id, installation);
    },
    fetchInstallation: async (InstallQuery) => {
      // change the line below so it fetches from your database
      return await database.get(InstallQuery.teamId);
    },
  },
}); */

// initialize the installProvider
const installer = new InstallProvider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  stateSecret: 'my-state-secret'
});

installer.generateInstallUrl({
  scopes: ['channels:read', 'groups:read', 'commands', 'im:read', 'im:write', 'mpim:read', 'users:read', 'app_mentions:read']
})
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:read', 'groups:read', 'commands', 'im:read', 'im:write', 'mpim:read', 'users:read', 'app_mentions:read'],
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      console.log(installation)
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // support for org wide app installation
        return await database.set(installation.enterprise.id, installation);
      }
      if (installation.team !== undefined) {
        // single team app installation
        return await database.set(installation.team.id, installation);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      // change the line below so it fetches from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation lookup
        return await database.get(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        return await database.get(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
  },
}); 

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
