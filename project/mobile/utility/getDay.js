export default (date)=>{
    let day_num = 0
    if(date instanceof Date)
        day_num = date.getDay()
    else    //If the date is formatted as a string or something to pass in to a constructor
        day_num = (new Date(date)).getDay()

    switch(day_num){
        case(0):
            return "Sun."
        case(1):
            return "Mon."
        case(2):
            return "Tue."
        case(3):
            return "Wed."
        case(4):
            return "Thu."
        case(5):
            return "Fri."
        case(6):
            return "Sat."
    }
}