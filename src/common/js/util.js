import Vue from 'vue'
import router from '@/router'
import Axios from 'axios'
import { Notice } from 'iview'
import { appRouter, page404 } from '@/router/routers'
import { getPermissions } from '@/api/request'
import * as types from '@/store/mutation-types'


Vue.component('Notice', Notice)
/**
 * 根据权限名称返回没有children的路由对象
 * @param {String} routeName 对应的路由name
 */
const returnRoute = (routeName) => {
  let route = null
  appRouter.forEach((item, i) => {
    if (item.single === routeName) {
    return route = appRouter.slice(i, i + 1)[0]
  }
})
  return route
}
/**
 * 根据权限名称返回有children的路由对象
 * @param {Object} routeObj 对应的路由对象
 */
const returnRoutes = (routeObj) => {
  let route = null
  appRouter.forEach((item, i) => {
    if (item.name === routeObj.route) {
    return route = appRouter.slice(i, i + 1)[0]
  }
})
  if (!route) {
    return route
  }
  let temp = []
  routeObj.children.forEach(item => {
    route.children.forEach((child, i) => {
    if (item.route === child.name) {
    return temp.push(route.children.slice(i, i + 1)[0])
  }
})
})
  route.children = temp;
  return route
}
const setMenu = (contrast, permissions) => {
  let handles = {}
  console.log(permissions)
  permissions.forEach((item, index) => {
    if (item.handles) {
      handles[item.route] = item.handles
    }
    if (item.children) {
      item.children.forEach(child => {
        if (child.handles) {
          handles[child.route] = child.handles
        }
      })
    }
  })

  Vue.prototype.menu = permissions
  Vue.prototype.checkList = contrast
  Vue.prototype.handleList = handles
  console.log(Vue.prototype.menu)
}
/**
 * 返回权限内的路由并设置侧边栏菜单
 * @param {Array} contrast 路由名称对照表
 * @param {Array} permissionsTree 权限树
 */
export const settingRoutes = (contrast, permissionsTree) => {
  let routes = []
  let tree = []
  permissionsTree.forEach((item) => {
    if (item.children) {
      if (returnRoutes(item)) {
        tree.push(item)
        routes.push(returnRoutes(item))
      }
    } else {
      if (returnRoute(item.route)) {
        tree.push(item)
        routes.push(returnRoute(item.route))
      }
    }
  })
  setMenu(contrast, tree)
  return routes
}
/**
 * 请求接口成功，但状态码非200的处理方法
 * @param {Number} status statusCode状态码
 * @param {String} message 后端返回的信息
 */
export const catchCode = (status, message) => {
  switch (status) {
    case 413:
      router.push({name: 'login'})
      break;
    case 412:
      Vue.prototype.$Notice.error({
        title: '请求失败',
        desc: message,
        duration: 2
      })
      break;
    case 414:
      Vue.prototype.$Notice.error({
        title: '请求失败',
        desc: message,
        duration: 2
      })
      break;
    case 500:
      Vue.prototype.$Notice.error({
        title: '请求失败',
        desc: message,
        duration: 3
      })
      break;
    default:
      Vue.prototype.$Notice.error({
        title: '未知错误',
        desc: '请联系技术人员处理',
        duration: 3
      })
      break;
  }
}
/**
 * 请求失败的处理方法
 * @param {Object} error axios的错误对象
 */
export const catchError = function(error) {
  if (error.response) {
    console.log(error.response.status)
    switch (error.response.status) {
      case 400:
        Vue.prototype.$Notice.error({
          title: '请求参数异常',
          duration: 3
        })
        break;
      case 403:
        Vue.prototype.$Notice.error({
          title: '服务器拒绝您的请求',
          duration: 3
        })
        break;
      case 404:
        Vue.prototype.$Notice.error({
          title: '请求的资源未找到',
          duration: 3
        })
        break;
      default:
        Vue.prototype.$Notice.error({
          title: '请求失败，请联系技术人员',
          duration: 3
        })
    }
  }
  return Promise.reject(error);
}
/**
 * 打开页面以后更新菜单与标签栏
 * @param {Object} vm 当前app实例
 * @param {Object} to 当前页面路由对象
 */
export const openNewPage = (vm, to) => {
  let tagsList = vm.$store.state.tagsList.slice()
  let toName = to.name
  let isOpen = false
  tagsList.forEach(item => {
    if (item[0] === toName) {
    return isOpen = true
  }
})
  if (!isOpen) {
    tagsList.push([toName, Vue.prototype.checkList[toName]])
    window.sessionStorage.setItem('hk-tagsList', JSON.stringify(tagsList))
    vm.$store.commit(types.SET_TAGSLIST, tagsList)
  }
  window.sessionStorage.setItem('hk-currentRoute', toName)
  vm.$store.commit(types.SET_CURRENTROUTE, toName)
}
/**
 * 点击tag关闭页面
 * @param {Object} vm 当前app实例
 * @param {String} routeName
 */
export const closeTag = (vm, routeName) => {
  let tagsList = vm.$store.state.tagsList.slice()
  let currentTag = vm.$store.state.currentRoute
  let len = tagsList.length - 1
  let goRoute
  tagsList.forEach((item, index) => {
    if (item[0] === routeName) {
    if (index === len) {
      goRoute = tagsList[index - 1][0]
    } else {
      goRoute = tagsList[index + 1][0]
    }
    return tagsList.splice(index, 1)
  }
})
  if (currentTag !== routeName) {
    goRoute = currentTag
  }
  window.sessionStorage.setItem('ym-tagsList', JSON.stringify(tagsList))
  vm.$store.commit(types.SET_TAGSLIST, tagsList)
  vm.$router.replace({name: goRoute})
}
/**
 * 通过标签选项关闭页面
 * @param {Object} vm 当前app实例
 * @param {String} type 关闭的类型
 */
export const closePage = (vm, type) => {
  let tagsList = vm.$store.state.tagsList.slice()
  if (type === 'all') {
    tagsList.splice(1)
    vm.$router.replace({name: 'home-index'})
  } else {
    let currentRoute = vm.$store.state.currentRoute
    if (currentRoute === 'home-index') {
      tagsList.splice(1)
    } else {
      tagsList.forEach((item,index) => {
        if (item[0] === currentRoute) {
        tagsList = [[...tagsList[0]], [...tagsList[index]]]
      }
    })
    }
  }
  window.sessionStorage.setItem('ym-tagsList', JSON.stringify(tagsList))
  vm.$store.commit(types.SET_TAGSLIST, tagsList)
}
/**
 * 给权限添加lookAuth字段
 * @param {String} permissions 权限树
 * @param {Boolean} flag 设置lookAuth的值
 */
export const returnCheckTree = (permissions, flag) => {
  let returnObj = JSON.parse(permissions)
  returnObj.forEach(item => {
    item.lookAuth = flag
  if (item.children) {
    item.children.forEach(child => {
      child.lookAuth = flag
    if (child.handles) {
      let temp = []
      child.handles.forEach(handle => {
        temp.push({
        name: handle,
        turn: flag
      })
    })
      child.handles = temp
    }
  })
  } else if (item.handles) {
    let temp = []
    item.handles.forEach(handle => {
      temp.push({
      name: handle,
      turn: flag
    })
  })
    item.handles = temp
  }
})
  return JSON.parse(JSON.stringify(returnObj))
}
export const setAuth = (current, init) => {
  init.forEach(initParent => {
    current.forEach(currParent => {
    if (initParent.route === currParent.route) {
    initParent.lookAuth = true
    if (initParent.handles && initParent.handles.length > 0 && currParent.handles && currParent.handles.length > 0) {
      initParent.handles.forEach(initParentHandles => {
        currParent.handles.forEach(currParentHandles => {
        if (initParentHandles.name === currParentHandles) {
        initParentHandles.turn = true
      }
    })
    })
    } else if (initParent.children && initParent.children.length > 0 && currParent.children && currParent.children.length > 0) {
      setAuth(currParent.children, initParent.children)
    }
  }
})
})
}
/**
 * 根据自身权限与初始权限，返回可编辑的权限树
 * @params {String} currents 当前权限树
 * @params {String} init 初始权限树
 */
export const checkPermissions = (currents, init) => {
  let initPermissions = returnCheckTree(init, false)
  if (currents) {
    let currentPermissions = JSON.parse(currents)
    setAuth(currentPermissions, initPermissions)
  }
  return JSON.parse(JSON.stringify(initPermissions))
}
/**
 * 获取文件md5码
 * @params {Object} file 文件对象
 */
const getMd5 = function (file) {
  return new Promise(function (resolve, reject) {
    let fileReader = new FileReader(),
      spark = new SparkMD5();
    fileReader.onload = function(e) {
      spark.appendBinary(e.target.result);
      resolve('{' + encodeURI(file.name) + ":" + spark.end() + '}')
    };
    fileReader.readAsBinaryString(file);
  })
};
/**
 * 返回上传接口所需的请求头
 * @param {Object} file 上传的图片对象
 */
export const returnHeaders = async (file) => {
  let data = await Axios({
    method: 'get',
    url: 'http://182.140.132.183/sms/getauth',
    headers: {
      'smsDate': new Date().toGMTString(),
      'type': 1
    }
  })
  let token = data.data.token
  let md5 = await getMd5(file)
  let time = new Date().toGMTString()
  let signItems = ["POST", time, 1, "/sms/upload", md5];
  let sign = hex_hmac_sha1(token, signItems.join("\n"));
  let auth = 'HMAC-SHA1 token=' + token + ' Signature=' + sign;
  return {
    'smsDate': time,
    'type': 1,
    'Content-md5': md5,
    'Authorization': auth
  }
}
