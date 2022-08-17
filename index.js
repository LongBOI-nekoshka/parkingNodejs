import readline from 'readline'

let question  = 'Select an action p/P - park | u/U - unpark | m/M - view map | s/S - view Stats:'

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: question
})

r1.prompt();

r1.on('line',(line) => {
    switch(line) {
        
    }
})