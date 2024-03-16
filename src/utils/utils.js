/**
 *生成 16 位随机数
 * @param {*} count 随机数位数
 * @returns
 */
function generateId(count = 16) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < count; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

module.exports = { generateId };
