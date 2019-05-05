// 必须包含外文
export function English(value) {
  return /[a-zA-z]/g.test(value);
}
// 必须包含中文
export function Chinese(value) {
  return /\w*[\u4E00-\u9FFF]+\w*/g.test(value);
}
// 只能输入字母数字
export function OnlyLetterAndNumber(value) {
  return /^[a-zA-Z0-9]{1,}$/g.test(value);
}
// 只能输入数字
export function OnlyNumber(value) {
  return /^[0-9]{1,}$/g.test(value);
}
// 不能包含中文
export function noChinese(value) {
  return !/\w*[\u4E00-\u9FFF]+\w*/g.test(value);
}
// 编号只能输入包含字母、数字和连字符组成的的字符
export function code(value) {
  return /^[0-9a-zA-Z-]{1,}$/g.test(value);
}
export function shelfCode(value) {
  const middleNumber = value.split('-')[1];
  return middleNumber >= 1 && middleNumber <= 9;
}
export function area(value) {
  return /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/g.test(value);
}
