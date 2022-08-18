export default class Parking { 
    constructor() {
        this.ROWS = 21;
        this.PENALTY = 5000;
        this.ParkingSpace = new Array(this.ROWS).fill(null).map((data,key) => {
                let parkInfo = {
                    parkingNumber: key,
                    isAvailable: true,
                }
                return parkInfo;
        });
        this.Parkers = new Array(21).fill(null).map((data,key) => {
            let parkerInfo = {
                parkingNumber: null,
                vehicleType:null,
                startTime: null,
                endTime: null,
                entrance: null,
                plateNumber: null,
            }
            return parkerInfo;
        });

        this.PeopleParked = new Array();
    }
    
    park(r1,size, ent, plateNumber) {
        if(!this.#inputChecker(size,ent)) {
            return 'oops wrong input <press enter>';
        }

        try {
            let parkingNumber = this.#generateRandomPeopleChoices();
            let parkerInfo = {
                parkingNumber: parkingNumber,
                vehicleType: size,
                startTime: new Date(),
                endTime: null,
                entrance: ent,
                plateNumber: plateNumber,
            }
            Object.assign(this.Parkers[parkingNumber], {
                ...parkerInfo
            })
            Object.assign(this.ParkingSpace[parkingNumber], {
                isAvailable:false
            })

            return 'Car '+ this.Parkers[parkingNumber]['plateNumber']+ ' Has parked in ' + parkingNumber;
        }catch(err) {
            r1.question('oops parking is full <press enter>',(data) => {
                r1.prompt();
            });
        }

    }
    

    unpark(parkingNumber, enterEndDate = null) {
        let parkerInfo = {
            parkingNumber: null,
            vehicleType: null,
            startTime: null,
            endTime: null,
            entrance: null,
            plateNumber: null,
        }

        if(!this.ParkingSpace[parkingNumber].isAvailable) {
            Object.assign(this.Parkers[parkingNumber], {
                endTime:enterEndDate ? new Date(enterEndDate) : new Date()
            });
        
            return this.#calculate(parkingNumber);

            this.PeopleParked.push(this.Parkers[parkingNumber]);
    
            Object.assign(this.Parkers[parkingNumber], {
                ...parkerInfo
            })
    
            Object.assign(this.ParkingSpace[parkingNumber], {
                isAvailable:true
            })
            return 'Car has been unparked...'
        }else {
            return 'This space is empty...'
        }
    }

    #inputChecker(size,ent) {
        let defaultSize = ['l','m','s'];
        if(!defaultSize.includes(size)) {
            return false;
        }
        if(ent < 1 || ent > 3) {
            return false
        }
        return true;
    }

    #calculate(parkingNumber) {
        let bill = 0;
        let multiplier = 0;
        let penaltyMultiplier = 0;
        let parkerInfo = this.Parkers[parkingNumber];
        let hoursRendered = Math.round(Math.abs(parkerInfo.endTime - parkerInfo.startTime) / 36e5);
        if(hoursRendered > 24) {
            penaltyMultiplier = Math.round(hoursRendered/24);
            multiplier = hoursRendered - (24 * penaltyMultiplier)
        }else {
            multiplier = hoursRendered;
        }
        switch(parkerInfo.size) {
            case 's':
                bill = 20;
                break;
            case 'm':
                bill = 60;
                break;
            case 'l':
                bill = 100;
                break;
        }
        return penaltyMultiplier+' '+multiplier+' '+hoursRendered
    }

    #generateRandomPeopleChoices() {
        let currentAvalable = this.ParkingSpace.filter((data) => {
            return data.isAvailable;
        }).map((data) => data.parkingNumber);
        
        let randomRangeCalculator = Math.floor(Math.random() * (currentAvalable.length - 1)) + 1;
        return currentAvalable[randomRangeCalculator] 
    }


}