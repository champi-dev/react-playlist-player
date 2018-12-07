export const formatTime = timestamp => {
  if (isNaN(timestamp)) return ''
  let minutes = Math.floor(timestamp / 60)
  let seconds = timestamp - minutes * 60
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  timestamp = minutes + ':' + seconds
  timestamp = timestamp.split('.')[0]
  return timestamp
}
