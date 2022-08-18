import readline from 'readline'
import Parking from './Parking.js';

const park = new Parking();

const question  = 'Select an action p/P - park | u/U - unpark | m/M - view map | s/S - view Stats: '
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: question
})

r1.prompt();

r1.on('line',(line) => {
    switch(line.toLowerCase()) {
        case 'p':
            r1.question('what is the size of the car ? (s-small | m-meduim | l-large) ', function(size) {
                r1.question('what entrance does the car took ? (1 - 3) ', function (gate) {
                    r1.question("what is the car's plate number ? ", function (plateNumber) {
                        console.log(park.park(r1,size,gate,plateNumber))
                        r1.prompt();
                    })
                })
            })
        break;
        case 'u':
            r1.question('unpark a car what parking number does he/she has?: ' , function(num) {
                if(num.includes("--endDate")) {
                    r1.question('enter an end date: ', function(enddate) {
                        console.log(park.unpark(parseInt(num.replace('--endDate','')),enddate))
                    }) 
                }else {
                    console.log(park.unpark(num))
                }
                r1.prompt();
            })
        break;
        case 'm':
        break;
        case 's':
        break;
    }
})