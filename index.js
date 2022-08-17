import readline from 'readline'

let question  = 'Select an action p/P - park | u/U - unpark | m/M - view map | s/S - view Stats:'

const questionLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: question
})

questionLine.prompt();