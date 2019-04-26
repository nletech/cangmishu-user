
function getGroup(el) {
  const groupMdoel = el.$parent.$parent;
  if (!groupMdoel) {
    return false;
  } else if (groupMdoel.$vnode.tag.indexOf('my-group') !== -1) {
    return groupMdoel;
  }
  return getGroup(el);
}

export default getGroup;
