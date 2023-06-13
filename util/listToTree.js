exports.convertToTree = function(data) {
  const map = {};
  const result = [];

  // 创建机构id到机构对象的映射
  for (const item of data) {
    const { deptId, code, name, status, Pid, managerUid, managerUcode, manager, createdAt, updatedAt } = item.dataValues;
    map[deptId] = {
      deptId,
      code,
      name,
      status,
      Pid,
      managerUid,
      managerUcode,
      manager,
      createdAt,
      updatedAt,
      children: []
    };
  }

  // 构建树形结构
  for (const item of data) {
    const { deptId, Pid } = item.dataValues;
    const department = map[deptId];
    if (Pid === '00') {
      result.push(department);
    } else if (map[Pid]) {
      map[Pid].children.push(department);
    }
  }

  // 删除没有子节点的children字段
  removeEmptyChildren(result);

  return result;
}

function removeEmptyChildren(nodes) {
  for (const node of nodes) {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      removeEmptyChildren(node.children);
    }
  }
}
