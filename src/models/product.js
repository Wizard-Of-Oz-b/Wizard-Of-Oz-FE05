/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} brand
 * @property {string} name
 * @property {number} price
 * @property {number} rating
 * @property {number} ratingCount
 * @property {{code:string,name:string,hex:string}[]} colors
 * @property {string[]} sizes
 * @property {string[]} gallery
 * @property {{img:string,text:string}[]} details
 * @property {string[]} material
 * @property {string[]} care
 * @property {"men"|"women"} gender
 * @property {"top"|"bottom"|"shoes"} category
 */

export const KRW = (n) => n.toLocaleString("ko-KR") + "원";
export const LS_RECENT = "recent:items";
