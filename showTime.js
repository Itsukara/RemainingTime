var timeoutInfos = []

function clearOldTimeout() {
    var newTimeoutInfos = []
    timeoutInfos.forEach(function(timeoutInfo) {
        var timeoutID = timeoutInfo[0]
        var min = timeoutInfo[1]
        var startDateTime = timeoutInfo[2]
        var startTime = (new Date(startDateTime)).getTime()
        var now = new Date()
        var nowTime = now.getTime()
        if (startTime - min*60*1000 <= nowTime) {
            clearTimeout(timeoutID)
        } else {
            newTimeoutInfos.push(timeoutInfo)
        }
    })
    timeoutInfos = newTimeoutInfos
}

function printAllTimeout() {
    console.log("*** LIVE ALARMs ***")
    timeoutInfos.forEach(function(timeoutInfo) {
        var timeoutID = timeoutInfo[0]
        var min = timeoutInfo[1]
        var startDateTime = timeoutInfo[2]
        console.log("    " + min + " min. ALARM for " + startDateTime + " timeoutID=" + timeoutID)
    })
}

function d2(x) { return (x < 10) ? '0' + x : x }

function showTime(startDateTime, id)
{
    var startTime = (new Date(startDateTime)).getTime()
    var now = new Date()
    var nowTime = now.getTime()
    var nowHHMMSS = now.toLocaleTimeString('en-GB')
    // console.log(nowTime)
    var remSec = Math.ceil((startTime - nowTime)/1000)
    var sign = remSec < 0 ? " - " : " + "
    remSec = remSec < 0 ? - remSec : remSec
    var ss = remSec % 60
    var mm = (remSec - ss) / 60 % 60
    var hh = (remSec - ss - 60*mm) / 3600
    var msg = startDateTime + " = " + nowHHMMSS + sign + d2(hh) + ":" + d2(mm) + ":" + d2(ss)
    document.getElementById(id).innerHTML = msg
}

function setAlertTimers(startDateTime, minList)
{
    var startTime = (new Date(startDateTime)).getTime()
    var now = new Date()
    var nowTime = now.getTime()

    var remMiliSec = (startTime - nowTime)
    minList.forEach(function(min) {
        var timerMiliSec = remMiliSec - min*60*1000
        if (timerMiliSec > 0) {
            var timeoutID = setTimeout(function(min) {
                alert("It's " + (new Date()).toLocaleTimeString('en-GB') + " now! (" + min + "min.  before " + startDateTime + ")")
                clearOldTimeout()
            }, timerMiliSec, min)
            timeoutInfos.push([timeoutID, min, startDateTime])
            console.log("Set " + min + " min. ALARM for " + startDateTime + " timeoutID=" + timeoutID)
        }
    })
}

function watchTime(startDateTime, id, minList)
{
    setAlertTimers(startDateTime, minList)
    var waitMiliSec = 1000 - Date.now() % 1000 + 100 // start HH:MM:SS.10
    // console.log(waitMiliSec)
    setTimeout(function() {
        setInterval(showTime, 1000, startDateTime, id)
    }, waitMiliSec)
}
