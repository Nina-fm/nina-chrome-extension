// SETTINGS

var default_options = {
  inactivity_time: 30
}

var equalizer = {
  min: 1,
  max: 11,
  current: 1,
  prefix: 'img/equalizer/step',
  suffix: '.png',
  update: 80 // ms
}

var stream = 'http://flux.nina.fm/nina.mp3'

// SCRIPT

var settings, ninaPlayer, inactivity, time, refreshInterval

chrome.storage.sync.get(default_options, function (data) {
  chrome.storage.sync.set(data)
  settings = data
  
  // Initialize the player
  ninaPlayer = new Audio(stream)
  ninaPlayer.muted = true
  ninaPlayer.load()
  
  // Launch the icon periodical update
  updateIcon()
  
  // Handle the click on extension icon
  chrome.browserAction.onClicked.addListener(toggleAudio)
})

// FUNCTIONS

/**
 * Play the audio stream
 */
function playAudio () {
  ninaPlayer.src = stream
  ninaPlayer.muted = false
  ninaPlayer.play()
  
  // Init data for inactivity check
  inactivity = Date.now()
  time = ninaPlayer.currentTime
  
  // Run the live refresh
  refreshInterval = setInterval(refresh, 1000)
}

/**
 * Stop the audio stream
 */
function stopAudio () {
  // Stop the live refresh
  clearInterval(refreshInterval)
  
  // Kill the audio stream with blank audio data
  ninaPlayer.pause()
  ninaPlayer.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA='
  time = ninaPlayer.currentTime = 0
  inactivity = Date.now()
}

/**
 * Callback function to toggle the mute status
 */
function toggleAudio () {
  if (ninaPlayer.paused) {
    playAudio()
  } else {
    ninaPlayer.muted = !ninaPlayer.muted
    if (ninaPlayer.muted) {
      inactivity = Date.now()
    }
  }
}

/**
 * Callback function for refreshing
 */
function refresh () {
  chrome.storage.sync.get(['inactivity_time'], function (data) {
    settings = data
  })
  checkPlayer()
}

/**
 * Function to check the player status
 */
function checkPlayer () {
  if (!ninaPlayer.muted && playerIsDown()) {
    playAudio()
  }
  if (ninaPlayer.muted && inactivityExpired()) {
    stopAudio()
  }
}

/**
 * Check if the inactivity delay is expired
 * @returns {boolean}
 */
function inactivityExpired () {
  let inactivityDuration = Date.now() - inactivity
  let delay = settings.inactivity_time * 1000
  return inactivityDuration > delay
}

/**
 * Check if the player is down
 * @returns {boolean}
 */
function playerIsDown () {
  return time >= ninaPlayer.currentTime && time > 0
}

/**
 * Function to update the extension icon
 * depending on the mute status
 */
function updateIcon () {
  // Default icon is the off one
  let icon = equalizer.prefix + 'off' + equalizer.suffix
  
  // If player is on, loop on the equalizer images
  if (ninaPlayer && !ninaPlayer.muted) {
    if (equalizer.current > equalizer.max) {
      equalizer.current = equalizer.min
    }
    icon = equalizer.prefix + equalizer.current + equalizer.suffix
    equalizer.current++
  }
  
  // Update the icon
  chrome.browserAction.setIcon({
      path: icon,
    },
    function () {
      chrome.runtime.lastError
    }
  )
  
  // Call this function again after a timeout
  window.setTimeout(updateIcon, equalizer.update)
}
