/* js/drive-url.js — Convert Google Drive share URLs to thumbnail URLs */
function convertDriveUrl(url, size) {
  if (size === undefined) size = 'w400';
  if (!url || typeof url !== 'string') return '';
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    var patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/
    ];
    var fileId = null;
    for (var i = 0; i < patterns.length; i++) {
      var m = url.match(patterns[i]);
      if (m) { fileId = m[1]; break; }
    }
    if (fileId) return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=' + size;
  }
  return url;
}