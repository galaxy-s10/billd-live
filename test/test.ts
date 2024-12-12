var allMediaTypeList = {
  a: {
    txt: '摄像头',
    priority: 1,
  },
  b: {
    txt: 'dfs',
    priority: 21,
  },
  c: {
    txt: '32',
    priority: 2,
  },
  d: {
    txt: 'abc',
    priority: 2,
  },
};

function objectSort(data: { obj; sortField; sort?: 'asc' | 'desc' }) {
  // 将对象转换为数组
  var entries = Object.entries(data.obj);
  entries.sort(function (a, b) {
    // @ts-ignore
    var res1 = a[1][data.sortField];
    // @ts-ignore
    var res2 = b[1][data.sortField];
    if (data.sort === 'desc') {
      return res2 - res1;
    } else {
      return res1 - res2;
    }
  });

  // 将排序后的数组转换回对象
  var sortedMediaTypeList = {};
  for (var i = 0; i < entries.length; i++) {
    sortedMediaTypeList[entries[i][0]] = entries[i][1];
  }
  return sortedMediaTypeList;
}

console.log(
  objectSort({ obj: allMediaTypeList, sortField: 'priority', sort: 'desc' })
);
