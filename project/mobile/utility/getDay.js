export default (date)=>{
    let day_num = 0
    if(date instanceof Date)
        day_num = date.getDay()
    else    //If the date is formatted as a string or something to pass in to a constructor
        day_num = (new Date(date)).getDay()

    switch(day_num){
        case(0):
            return "Sunday"
        case(1):
            return "Monday"
        case(2):
            return "Tuesday"
        case(3):
            return "Wednesday"
        case(4):
            return "Thursday"
        case(5):
            return "Friday"
        case(6):
            return "Saturday"
    }
}