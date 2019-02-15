const { exec } = require('child_process')
const distanceInWordsStrict = require('date-fns/distance_in_words_strict')
let interval = 5000
const stats = {
  connected: false,
  upSince: null,
  downSince: null,
}

const timeSince = (time) => distanceInWordsStrict(new Date(), time)

const reconnect = () => exec(`netsh WLAN connect EncoreatForest_Resident`, (error, stdout, stderr) => {
  error && console.log('RECONNECTION ERROR: ', error)
  stdout && console.log('RECONNECTING... ')
})

const ping = () => exec(`ping -n 1 charter.guestinternet.com`, (error, stdout, stderr) => {
  if (error) {
    if(stats.connected === true) {
      stats.downSince = new Date()
      console.log(`PING ERROR: ${stats.connected ? `Uptime lasted ${timeSince(stats.upSince)}.`: ''}`)
    }
    if (timeSince(stats.downSince) === 'less than 20 seconds') { // only try to reconnect about every 15 seconds
      reconnect()
    }
    stats.upSince = null
    stats.connected = false
    return;
  }

  if (stdout) {
    if(stats.connected === false) {
      stats.connected = true
      stats.upSince = new Date()
      console.log(`CONNECTED!}`)
      stats.downSince = null
    }
  }
})

setInterval(ping, interval)