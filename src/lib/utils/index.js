// 工具函数

// 功能: 创建一个 HTML 节点。
// @ params  createElementTag          { String }      必填
// @ params  createElementAttritubes   { Object }      必填
// @ return  element                   { HTNML Element}
/*
* 示例:
* createAnChildNode('image', {
*   width: '100px',
*   height: '100px',
* })
* 返回值: <image width="100px" height="100px"></image>
*/
function createAnChildNode(createElementTag, createElementAttritubes) {
  const element = document.createElement(createElementTag);
  for (const key in createElementAttritubes) {
    if (Object.prototype.hasOwnProperty.call(createElementAttritubes, key)) {
      element[key] = createElementAttritubes[key];
    }
  }
  return element;
}

export {
  // eslint-disable-next-line
  createAnChildNode,
};
