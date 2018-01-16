// SETTINGS
var equalizer = {
  min: 1,
  max: 11,
  current: 1,
  prefix: "img/equalizer/step",
  suffix: ".png",
  update: 80, // ms
}
var settings, ninaPlayer, inactivity, time, checkStream;


// SCRIPT

chrome.storage.sync.get(["stream_url", "inactivity_time"], function(data) {
  settings = data;
  
  // Initialize the player
  ninaPlayer = new Audio(settings.stream_url);
  ninaPlayer.muted = true;
  ninaPlayer.play();

  // Reloading when sound is down
  inactivity = Date.now();
  time = ninaPlayer.currentTime;
  checkStream = setInterval(checkPlayer, 1000);

  // Launch the icon periodical update
  updateIcon();

  // Handle the click on extension icon
  chrome.browserAction.onClicked.addListener(toggleAudio);
});


// FUNCTIONS

/**
 * Callback function to toggle the mute status
 * @param tab
 */
function toggleAudio(tab) {
  if (ninaPlayer.paused) {
    ninaPlayer.load();
    ninaPlayer.play();
    ninaPlayer.muted = false;
  } else {
    ninaPlayer.muted = !ninaPlayer.muted;
    if (ninaPlayer.muted) {
      inactivity = Date.now();
    }
  }
}

/**
 * Function to update the extension icon
 * depending on the mute status
 */
function updateIcon() {
  // Default icon is the off one
  let icon = equalizer.prefix + 'off' + equalizer.suffix;
  
  // If player is on, loop on the equalizer images
  if (!ninaPlayer.muted) {
    if (equalizer.current > equalizer.max) {
      equalizer.current = equalizer.min;
    }
    icon = equalizer.prefix + equalizer.current + equalizer.suffix;
    equalizer.current++;
  }
  
  // Update the icon
  chrome.browserAction.setIcon({
      path: icon,
    },
    function() {
      chrome.runtime.lastError;
    }
  );
  
  // Call this function again after a timeout
  window.setTimeout(updateIcon, equalizer.update);
}

/**
 * Check if the inactivity delay is expired
 * @returns {boolean}
 */
function inactivityExpired() {
  let inactivityDuration = Date.now() - inactivity;
  let delay = settings.inactivity_time*1000;
  return inactivityDuration > delay;
}

/**
 * Check if the player is down
 * @returns {boolean}
 */
function playerIsDown() {
  return time >= ninaPlayer.currentTime && time > 0;
}

/**
 * Function to check the player status
 */
function checkPlayer() {
  if (!ninaPlayer.muted && playerIsDown()) {
    ninaPlayer.load();
    ninaPlayer.play();
  }
  if (ninaPlayer.muted && inactivityExpired() ) {
    ninaPlayer.pause()
  }
  time = ninaPlayer.currentTime;
}
