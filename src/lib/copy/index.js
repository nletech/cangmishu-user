function isClass(o) {
  if (o === null) return 'Null';
  if (o === undefined) return 'Undefined';
  return Object.prototype.toString.call(o).slice(8, -1);
}

const clone = {
  // array(arr) {
  //   const newArr = [];
  //   for (const item of arr) {
  //     newArr.push(this[_getType(item)](item));
  //   }
  //   return newArr;
  // },
  object(obj) {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const copy = obj.key;
        if (isClass(copy) === 'Object') {
          newObj[key] = this.object(copy); // 递归调用
        } else if (isClass(copy) === 'Array') {
          newObj[key] = this.object(copy);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  },
};

export default clone;
