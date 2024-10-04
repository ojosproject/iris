export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function timestampToString(timestamp: number) {
    let d = new Date(timestamp*1000);

    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}