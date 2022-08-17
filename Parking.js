export default class Parking { 
    constructor() {
        this.ROWS = 21;
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
    
    park(r1,size, ent, plateNumber,isReparking) {
        let parkingNumber = this.#generateRandomPeopleChoices();
        let parkerInfo = {
            parkingNumber: parkingNumber,
            vehicleType: size,
            startTime: new Date(),
            endTime: null,
            entrance: ent,
            plateNumber: plateNumber,
        }
        try {
            Object.assign(this.Parkers[parkingNumber], {
                ...parkerInfo
            })
            Object.assign(this.ParkingSpace[parkingNumber], {
                isAvailable:false
            })
        }catch(err) {
            r1.question('oops parking is full <press enter>',(data) => {
                r1.prompt();
            });
        }

        if(isReparking) {

        }

        return this.ParkingSpace[parkingNumber];
    }

    unpark(parkingNumber) {
 

        let parkerInfo = {
            parkingNumber: null,
            vehicleType: null,
            startTime: null,
            endTime: null,
            entrance: null,
            plateNumber: null,
        }

        if(this.ParkingSpace[parkingNumber].isAvailable == false) {
            this.PeopleParked.push(this.Parkers[parkingNumber]);
    
            Object.assign(this.Parkers[parkingNumber], {
                ...parkerInfo
            })
    
            Object.assign(this.ParkingSpace[parkingNumber], {
                isAvailable:true
            })
        }
    }

    #calculate(parkingNumber) {
        
    }

    #generateRandomPeopleChoices() {
        let currentAvalable = this.ParkingSpace.filter((data) => {
            return data.isAvailable;
        }).map((data) => data.parkingNumber);
        
        let randomRangeCalculator = Math.floor(Math.random() * (currentAvalable.length - 1)) + 1;
        return currentAvalable[randomRangeCalculator] 
    }


}