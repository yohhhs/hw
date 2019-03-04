export const getTagsList = () => {
  let tagsList = window.sessionStorage.getItem('ym-tagsList')
  if (tagsList) {
    tagsList = JSON.parse(tagsList)
  } else {
    tagsList = [['home-index', '首页']]
    window.sessionStorage.setItem('hk-tagsList',JSON.stringify(tagsList))
  }
  return tagsList
}

export const getCurrentRoute = () => {
  let route = window.sessionStorage.getItem('hk-currentRoute')
  if (!route) {
    route = 'home-index'
    window.sessionStorage.setItem('hk-currentRoute', route)
  }
  return route
}
