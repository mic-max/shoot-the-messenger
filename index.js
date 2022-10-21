// Node.js
import fs from 'fs'
import path from 'node:path'

// NPM
import { program } from 'commander'
import inquirer from 'inquirer';
import fuzzy from 'fuzzy';
import inquirerPrompt from 'inquirer-autocomplete-prompt'

program
  .option('-d, --dir <root>', 'Root directory of Messenger data')

program.parse()
const options = program.opts()

// Main
const rootDir = options.dir

let chats = {}
// {id: {name: "micmax", paths: [ "..." ]}}

for (let folder of fs.readdirSync(rootDir)) {
  const chatPath = path.join(rootDir, folder, 'messages', 'inbox')
  for (let chatFolder of fs.readdirSync(chatPath)) {
    const sepIndex = chatFolder.indexOf('_')
    const id = chatFolder.substring(sepIndex + 1)

    if (id in chats) {
      chats[id].paths.push(chatPath)
    } else {
      chats[id] = {
        name: chatFolder.substring(0, sepIndex),
        paths: [ chatPath ] // TODO: only really need the fb/<dir>/ value, the path can be extrapolated from other data
      }
    }
  }
}

inquirer.registerPrompt('autocomplete', inquirerPrompt)

const chat = await inquirer.prompt([
  {
    type: 'autocomplete',
    name: 'chat',
    message: 'Select a chat to inspect',
    source: searchChatName
  }
])
.then((answers) => {
  console.log(JSON.stringify(answers, null, 2))
  const result = Object.values(chats).filter(x => x.name === answers.chat)
  if (result.length !== 1)
    throw Error("Chat Not Found")

  return result[0]
})

console.log(chat)


// Functions
function searchChatName(_, input = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fuzzy.filter(input, Object.values(chats).map(x => x.name)).map((el) => el.original))
    }, Math.random() * 470 + 30)
  })
}

// User Selects A Chat Using Filter Search (Approximate String Matching)

// Load JSON Chat Files

// Show Menu of Commands

// 1. Show Messages w/ Most Reacts
// 2. Search <text> <user> <start> <end>
// 3. Show Activity by Hour <user>
// 4. Stats <user>
//    - message count, gif count, photo count, reactions used, reactions received, average length of message

