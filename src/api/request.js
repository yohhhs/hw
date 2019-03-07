import instance from './index.js'
import md5 from 'js-md5'

// 登录
export const login = params => {
  params.password = md5(params.password)
  return instance.post('/account/login', params)
}
// 退出登录
export const outLogin = () => {
  return instance.post('/account/loginOut')
}
// 获取用户权限
export const getPermissions = () => {
  return instance.post('/permission/getPermissions')
}
// 获取初始权限和角色权限
export const getInitPermissions = params => {
  return instance.post('/permission/getInitializePermissions', params)
}
// 修改初始权限
export const changeInitPermissions = params => {
  return instance.post('/permission/initialize', params)
}
// 获取角色列表
export const getRoleList = () => {
  return instance.post('/role/getRoleList')
}
// 添加角色
export const addRole = params => {
  return instance.post('/role/addRole', params)
}
// 删除角色
export const deleteRole = params => {
  return instance.post('/role/delteRole', params)
}
// 修改角色
export const changeRole = params => {
  return instance.post('/role/updateRole/Permissions', params)
}
// 添加用户
export const addUser = params => {
  params.password = md5(params.password)
  return instance.post('/cmsUser/addCmsUser', params)
}
// 根据角色ID查询用户
export const queryUserById = params => {
  return instance.post('/cmsUser/getCmsUserVoListByCmsRoleId', params)
}
// 用户信息
export const getUserInfo = params => {
  return instance.post('/cmsUser/getUserData', params)
}
// 超级管理员修改用户信息
export const updateUserInfo = params => {
  if (params.password === '') {
    delete params.password
  } else {
    params.password = md5(params.password)
  }
  return instance.post('/cmsUser/updateCmsUser', params)
}
// 用户修改个人信息
export const updateUserInfoBySelf = params => {
  return instance.post('/cmsUser/updateCmsUserState', params)
}
// 超级管理员修改用户状态
export const updateUserState = params => {
  return instance.post('/cmsUser/updateCmsUserState', params)
}
// 删除用户
export const deleteUser = params => {
  return instance.post('/cmsUser/deleteCmsUserState', params)
}
/*
* 商品模块接口
* */
// 添加商品
export const addGoods = params => {
  return instance.post('/goods/addGoods', params)
}
// 获取品牌列表
export const getBrandList = params => {
  return instance.post('/goods/getGoodsBrandList', params)
}
// 商品详情
export const getGoodsDetail = params => {
  return instance.post('/goods/getGoodsDetail', params)
}
// 获取商品列表
export const getGoodsList = params => {
  return instance.post('/goods/getGoodsList', params)
}
// 更新商品
export const updateGoods = params => {
  return instance.post('/goods/updateGoods', params)
}
// 新增结构用户
export const addOrganizeUser = params => {
  return instance.post('/organize/addOrganize', params)
}
// 查询机构用户列表
export const getOrganizeUserList = params => {
  return instance.post('/organize/getOrganizeList', params)
}
// 更新机构用户
export const updateOrganizeUser = params => {
  return instance.post('/organize/updateOrganize', params)
}
// 经纪人列表
export const getBrokerList = params => {
  return instance.post('/agentMember/getAgentMemberList', params)
}
// 更新经纪人状态
export const updateBrokerStatus = params => {
  return instance.post('/agentMember/updateStatus', params)
}
// 添加供应商
export const addSupplier = params => {
  return instance.post('/supplier/addSupplier', params)
}
// 删除供应商
export const deleteSupplier = params => {
  return instance.post('/supplier/deleteSupplier', params)
}
// 供应商列表
export const getSupplierList = params => {
  return instance.post('/supplier/getSupplierList', params)
}
// 更新供应商
export const updateSupplier = params => {
  return instance.post('/supplier/updateSupplier', params)
}
// 添加集采商品
export const addPurchaseGoods = params => {
  return instance.post('/purchaseGoods/addPurchaseGoods', params)
}
// 集采商品详情
export const getPurchaseGoodsDetail = params => {
  return instance.post('/purchaseGoods/getPurchaseGoodsDetail', params)
}
// 集采商品列表
export const getPurchaseGoodsList = params => {
  return instance.post('/purchaseGoods/getPurchaseGoodsList', params)
}
// 更新集采商品
export const updatePurchaseGoods = params => {
  return instance.post('/purchaseGoods/updatePurchaseGoods', params)
}
// 更新集采商品状态
export const updatePurchaseGoodsStatus = params => {
  return instance.post('/purchaseGoods/updateState', params)
}
// 添加活动
export const addActive = params => {
  return instance.post('/activity/addActivity', params)
}
// 活动列表
export const getActiveList = params => {
  return instance.post('/activity/getActivityList', params)
}
// 更新活动
export const updateActive = params => {
  return instance.post('/activity/updateActivity', params)
}
// 更新活动状态
export const updateActiveStatus = params => {
  return instance.post('/activity/updateStatus', params)
}
// 关闭订单
export const closeOrder = params => {
  return instance.post('/purchaseOrder/closeOrder', params)
}
// 订单详情
export const orderDetail = params => {
  return instance.post('/purchaseOrder/getPurchaseOrderDetail', params)
}
// 采购订单列表
export const getOrderList = params => {
  return instance.post('/purchaseOrder/getPurchaseOrderList', params)
}
// 批量发货
export const sendOrder = params => {
  return instance.post('/purchaseOrder/sendGoods', params)
}
// 添加公司
export const addCompany = params => {
  return instance.post('/company/addCompany', params)
}
// 删除公司
export const deleteCompany = params => {
  return instance.post('/company/deleteCompany', params)
}
// 公司列表
export const companyList = params => {
  return instance.post('/company/getCompanyList', params)
}
// 更新公司
export const updateCompany = params => {
  return instance.post('/company/updateCompany', params)
}
// 添加运营部
export const addSaleDepartment = params => {
  return instance.post('/saleDepartment/addSaleDepartment', params)
}
// 删除运营部
export const deleteSaleDepartment = params => {
  return instance.post('/saleDepartment/deleteSaleDepartment', params)
}
// 运营部列表
export const getSaleDepartmentList = params => {
  return instance.post('/saleDepartment/getSaleDepartmentList', params)
}
// 更新运营部
export const updateSaleDepartment = params => {
  return instance.post('/saleDepartment/updateSaleDepartment', params)
}
// 添加内勤人员
export const addInside = params => {
  params.password = md5(params.password)
  return instance.post('/insideMember/addInsideMemberList', params)
}
// 内勤人员列表
export const getInsideList = params => {
  return instance.post('/insideMember/getInsideMemberList', params)
}
// 获取内勤所需营业部
export const getInsideSaleList = params => {
  return instance.post('/insideMember/getSaleDepartmentList', params)
}
// 更新内勤人员
export const updateInside = params => {
  if (params.password !== '') {
    params.password = md5(params.password)
  }
  return instance.post('/insideMember/updateInsideMemberList', params)
}
// 更新内勤人员状态
export const updateInsideStatus = params => {
  return instance.post('/insideMember/updateStatus', params)
}
// 财务管理订单列表
export const getFinanceList = params => {
  return instance.post('/finance/getFinanceList', params)
}
// 财务管理金额统计
export const getFinanceCount = params => {
  return instance.post('/finance/getMoneyCount', params)
}
// 获取礼品派送列表
export const getGiftRecordList = params => {
  return instance.post('/business/getGiftRecordList', params)
}
// 获取派送明细列表
export const getMemberList = params => {
  return instance.post('/business/getMemberList', params)
}
// 获取转接人列表
export const getTransferMember = params => {
  return instance.post('/business/getTransferMemberList', params)
}
// 集采订单统计
export const getPurchaseGoodsCountList = params => {
  return instance.post('/business/getPurchaseGoodsList', params)
}
// 集采订单明细
export const getGoodsCountDetail = params => {
  return instance.post('/business/getPurchaseGoodsOrderList', params)
}
// 交易数据统计
export const getDataCount = params => {
  return instance.post('/business/getSaleDepartmentMoney', params)
}
// 分月交易数据统计
export const getMonthDataCount = params => {
  return instance.post('/business/getSaleDepartmentMoneyByMonth', params)
}
// 退款
export const returnPay = params => {
  return instance.post('/purchaseOrder/refundOrder', params)
}
// 查询有未发货的营业部
export const getNotSendSale = params => {
  return instance.post('/purchaseOrder/getNotSendSaleDepartment', params)
}
// 查询营业部未发货的订单
export const getNotSendOrder = params => {
  return instance.post('/purchaseOrder/getNotSendPurchaseGoods', params)
}
// 一键发货
export const oneTapSend = params => {
  return instance.post('/purchaseOrder/sendOrderByGoods', params)
}
// 获取专区列表
export const getGoodsSpecialList = params => {
  return instance.post('/goodsSpecial/getGoodsSpecialList', params)
}
// 添加专区
export const addGoodsSpecial = params => {
  return instance.post('/goodsSpecial/addGoodsSpecial', params)
}
// 修改专区状态
export const updateStatus = params => {
  return instance.post('/goodsSpecial/updateStatus', params)
}
// 修改专区
export const updateGoodsSpecial = params => {
  return instance.post('/goodsSpecial/updateGoodsSpecial', params)
}
// 添加地区负责人
export const addManagerMember = params => {
  params.password = md5(params.password)
  return instance.post('/managerMember/addManagerMember', params)
}
// 地区负责人列表
export const getManagerMemberList = params => {
  return instance.post('/managerMember/getManagerMemberList', params)
}
// 更新地区负责人
export const updateManagerMember = params => {
  if (params.password !== '') {
    params.password = md5(params.password)
  }
  return instance.post('/managerMember/updateManagerMember', params)
}
// 更新状态
export const updateManagerStatus = params => {
  return instance.post('/managerMember/updateStatus', params)
}
// 添加关联地址
export const addManagerMemberArea = params => {
  return instance.post('/managerMemberArea/addManagerMemberArea', params)
}
// 删除关联地址
export const deleteManagerMemberArea = params => {
  return instance.post('/managerMemberArea/deleteManagerMemberArea', params)
}
// 获取关联地址列表
export const getManagerMemberAreaList = params => {
  return instance.post('/managerMemberArea/getManagerMemberAreaList', params)
}
// 获取商品相关订单统计
export const getGoodsAndOrderCount = params => {
  return instance.post('/finance/getGoodsAndOrderCount', params)
}
// 获取用户及下单量统计
export const getMemberAndOrderCount = params => {
  return instance.post('/finance/getMemberAndOrderCount', params)
}
// 根据日期时间统计订单数量
export const getOrderCountByDate = params => {
  return instance.post('/finance/getOrderCountByDate', params)
}

export const home = {
  getGoodsAndOrderCount,
  getMemberAndOrderCount,
  getOrderCountByDate
}
export const areaEdit = {
  addManagerMemberArea,
  deleteManagerMemberArea,
  getManagerMemberAreaList
}
export const insideUser = {
  addManagerMember,
  getManagerMemberList,
  updateManagerMember,
  updateManagerStatus
}

export const dealCount = {
  getDataCount,
  getMonthDataCount
}
export const collectCount = {
  getPurchaseGoodsCountList,
  getGoodsCountDetail
}
export const giftCount = {
  getGiftRecordList,
  getMemberList,
  getTransferMember
}
export const baseGoods = {
  addGoods,
  getGoodsSpecialList,
  getGoodsDetail,
  getGoodsList,
  updateGoods,
  updateGoodsStatus
}
export const organizeUser = {
  addOrganizeUser,
  getOrganizeUserList,
  updateOrganizeUser
}
export const broker = {
  getBrokerList,
  updateBrokerStatus
}
export const supplierManager = {
  getGoodsSpecialList,
  addGoodsSpecial,
  updateStatus,
  updateGoodsSpecial
}
export const collectGoods = {
  addPurchaseGoods,
  getPurchaseGoodsDetail,
  getPurchaseGoodsList,
  updatePurchaseGoods,
  updatePurchaseGoodsStatus,
  getGoodsList,
  getActiveList,
  getOrganizeUserList
}
export const activeList = {
  addActive,
  getActiveList,
  updateActive,
  updateActiveStatus
}

export const organizeManager = {
  addCompany,
  deleteCompany,
  companyList,
  updateCompany,
  addSaleDepartment,
  deleteSaleDepartment,
  getSaleDepartmentList,
  updateSaleDepartment,
  getOrganizeUserList
}
export const addSolicitGoods = params => {
  return instance.post('/solicit/goods/addSolicitGoods', params)
}
export const getSolicitGoodsList = params => {
  return instance.post('/solicit/goods/getSolicitGoodsList', params)
}
export const updateGoodsStatus = params => {
  return instance.post('/solicit/goods/updateGoodsStatus', params)
}
export const updateSolicitGoods = params => {
  return instance.post('/solicit/goods/updateSolicitGoods', params)
}
export const deleteSolicitGoods = params => {
  return instance.post('/solicit/goods/deleteSolicitGoods', params)
}

// 通过订单号查询入库记录
export const getOrderInDetail = params => {
  return instance.post('/order/in/getOrderInDetail', params)
}
// 入库列表
export const getOrderInList = params => {
  return instance.post('/order/in/getOrderInList', params)
}
// 修改入库数量
export const updateOrderInCount = params => {
  return instance.post('/order/in/updateOrderInCount', params)
}
// 添加出库记录
export const addOrderOutCount = params => {
  return instance.post('/order/out/addOrderOutCount', params)
}
// 司机列表
export const getDriverList = params => {
  return instance.post('/order/out/getDriverList', params)
}
// 出库列表
export const getOrderOutList = params => {
  return instance.post('/order/out/getOrderOutList', params)
}
// 入库审核
export const auditOrderIn = params => {
  return instance.post('/order/in/auditOrderIn', params)
}
// 出库审核
export const auditOrderOut = params => {
  return instance.post('/order/out/auditOrderOut', params)
}
// 出库审核
export const reAuditOrderIn = params => {
  return instance.post('/order/in/reAuditOrderIn', params)
}
// 出库审核
export const deleteOrderIn = params => {
  return instance.post('/order/in/deleteOrderIn', params)
}
// 出库审核
export const reAuditOrderOut = params => {
  return instance.post('/order/out/reAuditOrderOut', params)
}
export const allOrder = {
  getOrderInList,
  updateOrderInCount,
  auditOrderIn,
  reAuditOrderIn,
  deleteOrderIn
}
export const sendOrderPage = {
  getOrderInDetail,
  addOrderOutCount,
  getDriverList,
  getOrderOutList,
  auditOrderOut,
  reAuditOrderOut
}
// 经销商修改
export const orderInUpdateAgency = params => {
  return instance.post('/update/record/orderInUpdateAgency', params)
}
// 品牌修改
export const orderInUpdateBrand = params => {
  return instance.post('/update/record/orderInUpdateBrand', params)
}
// 客户修改
export const orderInUpdateCustomer = params => {
  return instance.post('/update/record/orderInUpdateCustomer', params)
}
// 们数量修改
export const orderInUpdateDoorCount = params => {
  return instance.post('/update/record/orderInUpdateDoorCount', params)
}
// 指定物流及电话修改
export const orderInUpdateLogistics = params => {
  return instance.post('/update/record/orderInUpdateLogistics', params)
}
// 物流园修改
export const orderInUpdateLogisticsPark = params => {
  return instance.post('/update/record/orderInUpdateLogisticsPark', params)
}
// 计划日期修改
export const orderInUpdatePlanTime = params => {
  return instance.post('/update/record/orderInUpdatePlanTime', params)
}
// 收货人修改
export const orderInUpdateReceivedMember = params => {
  return instance.post('/update/record/orderInUpdateReceivedMember', params)
}
// 收货人电话修改
export const orderInUpdateReceivedPhone = params => {
  return instance.post('/update/record/orderInUpdateReceivedPhone', params)
}
// 送达市修改
export const orderInUpdateSendCity = params => {
  return instance.post('/update/record/orderInUpdateSendCity', params)
}
// 送达省修改
export const orderInUpdateSendProvince = params => {
  return instance.post('/update/record/orderInUpdateSendProvince', params)
}
// 补件数量修改
export const orderInUpdateSupplyCount = params => {
  return instance.post('/update/record/orderInUpdateSupplyCount', params)
}
// 鬼刀数量修改
export const orderInUpdateTrackCount = params => {
  return instance.post('/update/record/orderInUpdateTrackCount', params)
}
// 托盘数量修改
export const orderInUpdateTrayCount = params => {
  return instance.post('/update/record/orderInUpdateTrayCount', params)
}

// 出库差异说明修改
export const orderOutUpdateDifferenceDetail = params => {
  return instance.post('/update/record/orderOutUpdateDifferenceDetail', params)
}
// 实际出库数量修改
export const orderOutUpdateDifferenceGoodsCount = params => {
  return instance.post('/update/record/orderOutUpdateDifferenceGoodsCount', params)
}
// 司机修改
export const orderOutUpdateDriverId = params => {
  return instance.post('/update/record/orderOutUpdateDriverId', params)
}
// 运费修改
export const orderOutUpdateFreight = params => {
  return instance.post('/update/record/orderOutUpdateFreight', params)
}
// 物流单修改
export const orderOutUpdateLogisticsImage = params => {
  return instance.post('/update/record/orderOutUpdateLogisticsImage', params)
}
// 出库日期修改
export const orderOutUpdateOutTime = params => {
  return instance.post('/update/record/orderOutUpdateOutTime', params)
}
// 实发物流修改
export const orderOutUpdateRealLogistics = params => {
  return instance.post('/update/record/orderOutUpdateRealLogistics', params)
}
// 木材费修改
export const orderOutUpdateWoodMoney = params => {
  return instance.post('/update/record/orderOutUpdateWoodMoney', params)
}// 木材费修改
export const getUpdateRecordList = params => {
  return instance.post('/update/record/getUpdateRecordList', params)
}

export const tableEdit = {
  orderInUpdateAgency,
  orderInUpdateBrand,
  orderInUpdateCustomer,
  orderInUpdateDoorCount,
  orderInUpdateLogistics,
  orderInUpdateLogisticsPark,
  orderInUpdatePlanTime,
  orderInUpdateReceivedMember,
  orderInUpdateReceivedPhone,
  orderInUpdateSendCity,
  orderInUpdateSendProvince,
  orderInUpdateSupplyCount,
  orderInUpdateTrackCount,
  orderInUpdateTrayCount,
  orderOutUpdateDifferenceDetail,
  orderOutUpdateDifferenceGoodsCount,
  orderOutUpdateDriverId,
  orderOutUpdateFreight,
  orderOutUpdateLogisticsImage,
  orderOutUpdateOutTime,
  orderOutUpdateRealLogistics,
  orderOutUpdateWoodMoney
}
