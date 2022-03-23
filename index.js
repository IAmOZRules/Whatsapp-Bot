// const { create, Client } = require("@open-wa/wa-automate");
const msgHandler = require("./msgHndlr");
const options = require("./options");

const wa = require("@open-wa/wa-automate");

wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: "PT_BR",
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then((client) => start(client));

function start(client) {
  console.log("[SERVER] Server Started!");

  client.onStateChanged((state) => {
    console.log("[SERVER] Client State changed to: " + state);
    if (state === "CONFLICT" || state === "TERMINATED") {
      client.forceRefocus();
    }
  });

  client.onAnyMessage(async (message) => {
    client.getAmountOfLoadedMessages().then((msg) => {
      if (msg > 1500) {
        client.cutMsgCache();
      }
    });
    msgHandler(client, message);
    if (message.body === "Hi") {
      await client.sendText(message.from, "👋 Hello!");
    }
  });
}

// const start = async (client = new Client()) => {
//   console.log("[SERVER] Server Started!");
//   // Force it to keep the current session
//   client.onStateChanged((state) => {
//     console.log("[Client State]", state);
//     if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
//   });
//   // listening on message
//   client.onAnyMessage(async (message) => {
//     client.getAmountOfLoadedMessages().then((msg) => {
//       if (msg >= 3000) {
//         client.cutMsgCache();
//       }
//     });
//     msgHandler(client, message);
//   });

  // client.onAddedToGroup((chat) => {
  //   let totalMem = chat.groupMetadata.participants.length;
  //   if (totalMem < 10) {
  //     client
  //       .sendText(
  //         chat.id,
  //         `Cih member nya cuma ${totalMem}, Kalo mau invite bot, minimal jumlah mem ada 30`
  //       )
  //       .then(() => client.leaveGroup(chat.id))
  //       .then(() => client.deleteChat(chat.id));
  //   } else {
  //     client.sendText(
  //       chat.groupMetadata.id,
  //       `Halo warga grup *${chat.contact.name}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *!help*`
  //     );
  //   }
  // });

  /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/
// };

wa.create(options(true, start))
  .then((client) => start(client))
  .catch((error) => console.log(error));
