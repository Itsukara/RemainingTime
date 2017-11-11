function d2(x) { return (x < 10) ? '0' + x : x }

function showTime(startDateTime, id)
{
    var startTime = (new Date(startDateTime)).getTime()
    var now = new Date()
    var nowTime = now.getTime()
    var nowHHMMSS = now.toLocaleTimeString('en-GB')

    var remSec = Math.floor((startTime - nowTime)/1000)
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
    for (let i in minList) {
        var min = minList[i]
        var timerMiliSec = remMiliSec - min*60*1000
        if (timerMiliSec > 0) {
            setTimeout(function() {
                alert("It's " + (new Date()).toLocaleTimeString('en-GB') + " now! (" + min + "min.  before " + startDateTime + ")")
            }, timerMiliSec)
            console.log("Set " + min + " min. ALARM for " + startDateTime)
        }
    }
}

function watchTime(startDateTime, id)
{
    setAlertTimers(startDateTime, [5, 15])
    setInterval(showTime, 1000, startDateTime, id)
}