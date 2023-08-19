export function registerRoutes (items) {
  items.forEach((item) => {
    item.component = getViews('layout/layout')
    let fatherPath = item.path
    item.children.forEach((i) => {
      let component = (fatherPath + '/' + i.path).substring(1)
      i.component = getViews(component)
    })
  });
  return items
}

function getViews (path) {
  return resolve => {
    require.ensure([], (require) => {
      resolve(require('@/modules/' + path + '.vue'))
    })
  }
}
