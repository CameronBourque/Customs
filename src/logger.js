// These were made for code consistency's sake
export function logDebug(msg) {
    console.log(msg);
}

export function logError(error) {
    console.error('ERROR: ' + error, error.stack);
}