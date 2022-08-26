
function formatTime(time) {
    let currentTime = new Date(time)
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth() + 1;
    let dates = currentTime.getDate();
    return year + '-' + month + '-' + dates
}

export { formatTime }
