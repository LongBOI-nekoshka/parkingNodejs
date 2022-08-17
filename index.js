import readline from 'readline'
import Parking from './Parking.js';

const park = new Parking();

const question  = 'Select an action p/P - park | u/U - unpark | m/M - view map | s/S - view Stats:'
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: question
})

r1.prompt();

r1.on('line',(line) => {
    switch(line.toLowerCase()) {
        case 'p':
            r1.question('park a car', function() {
                
            })
            console.log(park.park(r1,'s',1))
            r1.prompt();
        break;
        case 'u':
            r1.question('unpark a car what parking number does he/she has?: ' , function(num) {
                console.log(park.unpark(num))
                r1.prompt();
            })
        break;
        case 'm':
        break;
        case 's':
        break;
    }
})