var default_options = {
  inactivity_time: 180
}

// SCRIPT

// Get the option fields DOM
var $inactivity_time = document.getElementById('inactivity_time')

// Option page load
document.addEventListener('DOMContentLoaded', get_options)
// Save button click
document.getElementById('save').addEventListener('click', save_options)
// Restore button click
document.getElementById('restore').addEventListener('click', restore_options)


// FUNCTIONS

/**
 * Save the extension options
 * from option fields to chrome sync data
 */
function save_options () {
  var inactivity_time = parseInt(document.getElementById('inactivity_time').value, 10)
  chrome.storage.sync.set({
    inactivity_time: inactivity_time
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(function () {
      status.textContent = ''
    }, 750)
  })
}

/**
 * Get the extensions options from chrome sync data
 * and set the option fields
 */
function get_options () {
  chrome.storage.sync.get(['inactivity_time'], function (data) {
    if (data.inactivity_time) {
      $inactivity_time.value = data.inactivity_time
    }
    if (!data) {
      chrome.storage.sync.set(default_options, function () {
        $inactivity_time.value = default_options.inactivity_time
      })
    }
  })
}

/**
 * Restore the default extension options
 * to option fields and chrome sync data
 */
function restore_options () {
  chrome.storage.sync.set(default_options, function () {
    $inactivity_time.value = default_options.inactivity_time
    var status = document.getElementById('status')
    status.textContent = 'Options restored.'
    setTimeout(function () {
      status.textContent = ''
    }, 750)
  })
}
