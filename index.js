// Node.js
const fs = require('fs')
const path = require('node:path')

// NPM
const { program } = require('commander')

program
  .option('dir')

program.parse();
const options = program.opts();

// Main
const rootDir = options.dir

// Get Directories Containing `message_[0-9]+.json`
const folders = fs.readdirSync(rootDir)
for (let folder of folders) {  
    const messagesDir = path.join(rootDir, folder, 'messages')
    console.log(messagesDir)
}

// User Selects A Chat Using Filter Search (Approximate String Matching)

// Load JSON Chat Files

// Show Menu of Commands

// 1. Show Messages w/ Most Reacts
// 2. Search <text> <user> <start> <end>
// 3. Show Activity by Hour <user>
// 4. Stats <user>
//    - message count, gif count, photo count, reactions used, reactions received, average length of message

