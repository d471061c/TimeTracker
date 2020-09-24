/**
 * Convert seconds into readable format, e.g. 620 seconds converts to '10 min 20 s'
 * @param {int} seconds Seconds
 */
const secondsToText = (seconds) => {
    let remainder = seconds

    let minutes = Math.floor(seconds / 60)
    if (minutes == 0) {
        return `${seconds} s`
    }
    remainder -= minutes * 60
    
    let hours = Math.floor(minutes / 60)
    if (hours == 0) {
        return `${minutes} min ${remainder > 0 ? `${remainder} s` : ''}`
    }
    minutes -= hours * 60

    let days = Math.floor(hours / 24)
    if (days == 0) {
        return `${hours} h ${minutes} min ${remainder > 0 ? `${remainder} s` : ''}`
    }
    hours -= days * 24
    return `${days} d ${hours} h ${minutes} min ${remainder > 0 ? `${remainder} s` : ''}` 
}

export {
    secondsToText
}