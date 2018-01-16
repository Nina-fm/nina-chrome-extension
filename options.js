// Saves options to chrome.storage.sync.
function save_options() {
  var stream_url = document.getElementById('stream_url').value;
  var inactivity_time = document.getElementById('inactivity_time').value;
  chrome.storage.sync.set({
    stream_url: stream_url,
    inactivity_time: inactivity_time
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    stream_url: 'http://flux.nina.fm/nina.mp3',
    inactivity_time: 180
  }, function(items) {
    document.getElementById('stream_url').value = items.stream_url;
    document.getElementById('inactivity_time').value = items.inactivity_time;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
