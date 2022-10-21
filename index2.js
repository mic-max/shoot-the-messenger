// Node.js
import fs from 'fs'
import path from 'node:path'

// NPM
import utf8 from 'utf8'

// Main
const rootDir = 'C:/Users/PROLE/Downloads/chud'

const jsonsInDir = fs.readdirSync(rootDir).filter(file => path.extname(file) === '.json')

let participants = {}
let messages = []

jsonsInDir.forEach(file => {
  const fileData = fs.readFileSync(path.join(rootDir, file))
  const json = JSON.parse(fileData.toString())
  messages.push(...json.messages)
})

console.log(`Total Messages: ${messages.length}`)

messages.sort((a, b) => (b.reactions ? b.reactions.length : 0) - (a.reactions ? a.reactions.length : 0))

for (let msg of messages) {
    if (msg.reactions.length < 16)
        break
    const combined = combineReacts(msg.reactions)
    const reactStr = reactsToString(combined)
    console.log(`${msg.sender_name}: ${msg.content} - ${msg.reactions.length / 2} - ${reactStr}`)
}

function combineReacts(reacts) {
    let seenActors = []
    let result = {}

    for (let r of reacts) {
        if (!seenActors.includes(r.actor)) {
            const emoji = utf8.decode(r.reaction)
            if (emoji in result) {
                result[emoji]++
            } else {
                result[emoji] = 1
            }
            seenActors.push(r.actor)
        }
    }

    return result
}

function reactsToString(reacts) {
    let result = ''

    const sortable = Object.fromEntries(
        Object.entries(reacts).sort(([,a],[,b]) => a - b)
    )
    
    for (let r in sortable) {
        result += `${r}: ${sortable[r]}`
    }
    return result
}
