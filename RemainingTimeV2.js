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

function cancelAlertTimer(timeoutID, cancelNode)
{
    // console.log(timeoutID)
    clearTimeout(timeoutID)
    // console.log(cancelNode)
    cancelNode.parentNode.removeChild(cancelNode)
    timeoutInfos = timeoutInfos.filter(function(n) {return n[0] != timeoutID})
    printAllTimeout()
}

function setAlertTimer(startDateTime, waitminName)
{
    var waitminNode = document.getElementById(waitminName)
    var min = waitminNode.value

    var startTime = (new Date(startDateTime)).getTime()
    var now = new Date()
    var nowTime = now.getTime()

    var remMiliSec = (startTime - nowTime)
    var timerMiliSec = remMiliSec - min*60*1000
    if (timerMiliSec > 0) {
        var cancelNode = document.createElement('span')
        // console.log(cancelNode)
        var spanNode = waitminNode.parentNode
        spanNode.parentNode.insertBefore(cancelNode, spanNode.nextSibling)

        var timeoutID = setTimeout(function(min) {
            alert("It's " + (new Date()).toLocaleTimeString('en-GB') + " now! (" + min + "min.  before " + startDateTime + ")")
            cancelAlertTimer(timeoutID, cancelNode)
            clearOldTimeout()
        }, timerMiliSec, min)

        var cancelInnerHTML = '  <button type="button" onclick="cancelAlertTimer(timeoutID, this)">MIN</button>'
        cancelInnerHTML = cancelInnerHTML.replace("timeoutID", timeoutID).replace("MIN", min)
        cancelNode.innerHTML = cancelInnerHTML

        timeoutInfos.push([timeoutID, min, startDateTime])
        printAllTimeout()
        // console.log("Set " + min + " min. ALARM for " + startDateTime + " timeoutID=" + timeoutID)
        
    } else {
        alert("Remaining time < " + min + " min.")
    }
}

function watchTime(startDateTime, id)
{
    var waitMiliSec = 1000 - Date.now() % 1000 + 100 // start HH:MM:SS.10
    // console.log(waitMiliSec)
    setTimeout(function() {
        setInterval(showTime, 1000, startDateTime, id)
    }, waitMiliSec)

    var waitminName = "waitmin_" + id
    var timerInnerHTML = '   Timers(min.) <button type="button" onclick="setAlertTimer(\'startDateTime\', \'waitmin\')">Set</button> <input type="text" id="waitmin" value=15 size=3> Cancel:'
    timerInnerHTML = timerInnerHTML.replace("startDateTime", startDateTime).replace(/waitmin/g, waitminName)
    var timerNode = document.createElement('span');
    timerNode.innerHTML = timerInnerHTML
    // console.log(timerNode)
    var spanNode = document.getElementById(id)
    var parentNode = spanNode.parentNode
    parentNode.insertBefore(timerNode, spanNode.nextSibling)
}

