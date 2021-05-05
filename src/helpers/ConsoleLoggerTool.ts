export const logger = (log: any) => {
    if (!IS_LIVE) {
        console.log(`%c ${log} | Type of log: ${typeof(log)}`, 'background: #00FFF2; color: #000000');
    }
}