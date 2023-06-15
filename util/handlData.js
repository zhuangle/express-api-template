// 数据类型检测
exports.getDataType = (value) => {
  const dataType = Object.prototype.toString.call(value);
  return dataType.slice(8, -1);
}
// 机构  删除机构前对用户传入的数组重排
exports.sortArrByLenth = (arr) => {
  arr.sort((a, b) => a.length - b.length);
  return arr;
}

// 是否为空对象或数组
exports.isEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }
  return false;
}