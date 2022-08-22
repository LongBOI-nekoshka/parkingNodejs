export default class Parking { 
    constructor() {
        this.ROWS = 21;
        this.PENALTY = 5000;
        this.ParkingSpace = new Array(this.ROWS).fill(null).map((data,key) => {
                let parkInfo = {
                    parkingNumber: key,
                    isAvailable: true,
                }
                
                if(key <= 6) {
                    Object.assign(parkInfo,{
                        size:'LP'
                    })
                }
                if(key > 6 && key <= 13) {
                    Object.assign(parkInfo,{
                        size:'MP'
                    });
                }
                if(key >= 14) {
                    Object.assign(parkInfo,{
                        size:'SP'
                    });
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

        this.PeopleParked = [];
    }
    
    
    park(r1,size, ent, plateNumber) {
        if(!this.#inputChecker(size,ent)) {
            return 'oops wrong input <press enter>';
        }
        if(this.#checkIfColorum(plateNumber)) {
            return 'oops duplicate plate number'
        }
        try {
            let parkingNumber = this.generateNearChoices(size,ent);
            let checkHour = this.#checkIfOneOur(plateNumber)
            let parkerInfo = {
                parkingNumber: parkingNumber,
                vehicleType: size,
                startTime:checkHour ? checkHour : new Date(),
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
        
            let receipt = this.#calculate(parkingNumber);
    
            Object.assign(this.Parkers[parkingNumber], {
                ...parkerInfo
            })
    
            Object.assign(this.ParkingSpace[parkingNumber], {
                isAvailable:true
            })
            return receipt;
        }else {
            return 'This space is empty...'
        }
    }
    
    viewHistoryTemp(plateNumber = null) {
        if(plateNumber) {
            this.PeopleParked.filter((data) => {
                return data.info.plateNumber == plateNumber
            })
        }
        return this.PeopleParked;
    }
    
    viewMap() {
        return this.ParkingSpace.map((data,key) => {
            if((key+1) % 7 === 0) {
                return ' | '+ (data.isAvailable ? 'ok' : 'no') +'-'+ data.size+' '+ key+' | Entrc '

            }
            return ' | '+ (data.isAvailable ? 'ok' : 'no') +'-'+ data.size+' '+ key
            
        });
    }

    #checkIfOneOur(plateNumber) {
        let lastOccurenceIndex = this.PeopleParked.map((data) => data.info.plateNumber).lastIndexOf(plateNumber);
        let current = this.PeopleParked[lastOccurenceIndex];
        if(lastOccurenceIndex == -1) {
            return false;
        }
        if((Math.abs(current.info.endTime - new Date()) / 36e5) < 1) {
            return new Date(current.info.endTime)
        }
        return false;
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

    #checkIfColorum(plateNumber) {
        let filterPlateNumber = this.Parkers.filter((data) => {
            return data.plateNumber == plateNumber;
        });
        return filterPlateNumber.length == 0 ? false : true;
    }

    #calculate(parkingNumber) {
        let bill = 40;
        let billMultiplier = 0;
        let multiplier = 0;
        let penaltyMultiplier = 0;
        let parkerInfo = this.Parkers[parkingNumber];
        let hoursRendered = Math.round(Math.abs(parkerInfo.endTime - parkerInfo.startTime) / 36e5);
        
        if(hoursRendered > 24) {
            penaltyMultiplier = Math.round(hoursRendered/24);
            multiplier =  hoursRendered - (24 * penaltyMultiplier - 1)
        }
        if(hoursRendered <= 24) {
            if(hoursRendered > 3) {
                multiplier = hoursRendered-3;
            }
        }

        switch(this.ParkingSpace[parkingNumber].size) {
            case 'SP':
                billMultiplier = 20;
                break;
            case 'MP':
                billMultiplier = 60;
                break;
            case 'LP':
                billMultiplier = 100;
                break;
        }

        let receipt = {
            'penalty ':penaltyMultiplier,
            'penalty Charge': this.PENALTY,
            'total penalty charge': this.PENALTY * penaltyMultiplier,
            'regular ': multiplier,
            'regular charge': billMultiplier,
            'total regular charge': billMultiplier * multiplier,
            'entry fee': bill,
            'total hours rendered': hoursRendered,
            'start time':new Date(parkerInfo.startTime).toLocaleString(),
            'end time':new Date(parkerInfo.endTime).toLocaleString(),
            'parksize ': this.ParkingSpace[parkingNumber].size,
            'total':bill + (this.PENALTY * penaltyMultiplier) + ( billMultiplier * multiplier)
        }
        this.PeopleParked.push({info:{
            startTime: parkerInfo.startTime,
            endTime: parkerInfo.endTime,
            plateNumber: parkerInfo.plateNumber
        },reciept:receipt});

        return receipt;
    }

    generateNearChoices(size,ent) {
        let currentAvalable = this.ParkingSpace.filter((data) => {
            if(size == 's') {
                return data.isAvailable;
            }
            if(size == 'm') {
                return data.isAvailable && (data.size == 'MP' || data.size == 'LP')
            }
            if(size == 'l') {
                return data.isAvailable && data.size == 'LP';
            }
        }).map((data) => data.parkingNumber);
        let sort = this.returnIdealSort(ent).filter((data) => currentAvalable.includes(data))
        return sort[currentAvalable.length - 1]
    }

    returnIdealSort(ent) {
        ent = parseInt(ent)
        switch(ent) {
            case 1:
                return [
                    6,5,13,12,4,20,3,
                    11,19,2,10,18,1,
                    9,17,0,8,16,7,15,14
                ].reverse();
            case 2:
                return [
                    13,6,20,12,5,19,11,
                    4,18,10,3,17,9,2,16,
                    8,1,15,7,0,14
                ].reverse();
            case 3:
                return [
                    20,19,13,18,12,6,
                    17,11,5,16,10,4,15,
                    9,3,14,8,2,7,1,0
                ].reverse();
        }
    }
}