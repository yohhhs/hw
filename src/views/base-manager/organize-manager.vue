<template>
  <div class="organize-manager">
    <!--<btn-wrapper @btnClick="btnClick"></btn-wrapper>-->
    <div class="organize-wrapper">
      <Tree :data="organizeData" :load-data="loadData" :render="renderContent"></Tree>
    </div>
    <Modal
      v-model="addModal.isShow"
      :mask-closable="false"
      width="800"
      title="添加">
      <organize-edit v-if="addModal.isShow && editType !== 3" :editType="editType" ref='addEdit'></organize-edit>
      <department-edit v-if="addModal.isShow && editType === 3" ref="addSale"></department-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addModal.loading" @click="addConfirm">确定</Button>
      </div>
    </Modal>

    <Modal
      v-model="writeModal.isShow"
      :mask-closable="false"
      width="800"
      title="修改">
      <organize-edit v-if="writeModal.isShow && editType !== 3" ref='writeEdit' :isWrite="true" :detail="currentNode.data"></organize-edit>
      <department-edit v-if="writeModal.isShow && editType === 3" ref="writeSale" :isWrite="true" :detail="currentNode.data"></department-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import btnWrapper from '@/components/btn-wrapper'
  import organizeEdit from './components/organize-edit'
  import departmentEdit from './components/department-edit'
  import {organizeManager} from '@/api/request'
  import {message, addModal, writeModal} from '@/common/js/mixins'

  export default {
    data() {
      return {
        editType: 1,
        organizeList: [],
        organizeData: [],
        buttonProps: {
          type: 'ghost',
          size: 'small',
        },
        currentNode: null,
        currentParentNode: null
      }
    },
    components: {
      btnWrapper,
      organizeEdit,
      departmentEdit
    },
    mixins: [message, addModal, writeModal],
    created() {
      this.getOrganizeList()
    },
    methods: {
      getOrganizeList() {
        organizeManager.getOrganizeUserList({
          pageNo: 1,
          pageSize: 100
        }).then(data => {
          if (data !== 'isError') {
            this.organizeList = data.list
            this.getInitOranizeData()
          }
        })
      },
      btnClick(handleName) {
        switch (handleName) {
          case '新增分公司':
            this.editType = 1
            this.openAddModal()
            break
          case '新增市级子公司':
            break
          case '新增运营部':
            break
        }
      },
      writeConfirm() {
        if (this.editType === 3) {
          let returnData = this.$refs.writeSale.returnData()
          if (returnData) {
            returnData.companyId = this.currentNode.data.companyId
            organizeManager.updateSaleDepartment({
              saleDepartmentId: this.currentNode.data.saleDepartmentId,
              ...returnData
            }).then(data => {
              if (data !== 'isError') {
                this.successInfo('修改成功')
                this.getChildrenNode(this.currentParentNode)
                this.closeWriteModal()
              }
            })
          }
        } else {
          let returnData = this.$refs.writeEdit.returnData()
          if (returnData) {
            if (this.editType === 2) {
              returnData.parentId = this.currentParentNode.data.companyId
            } else {
              returnData.parentId = 0
            }
            returnData.organizeId = this.currentNode.data.organizeId
          }
          organizeManager.updateCompany({
            companyId: this.currentNode.data.companyId,
            ...returnData
          }).then(data => {
            if (data !== 'isError') {
              this.successInfo('更新成功')
              this.getChildrenNode(this.currentParentNode)
              this.closeWriteModal()
            }
          })
        }
      },
      addConfirm() {
        if (this.editType === 3) {
          let returnData = this.$refs.addSale.returnData()
          if (returnData) {
            returnData.companyId = this.currentNode.data.companyId
            organizeManager.addSaleDepartment({
              ...returnData
            }).then(data => {
              if (data !== 'isError') {
                this.successInfo('添加成功')
                this.getChildrenNode(this.currentNode)
                this.closeAddModal()
              }
            })
          }
        } else {
          let returnData = this.$refs.addEdit.returnData()
          if (returnData) {
            if (this.editType === 2) {
              returnData.parentId = this.currentNode.data.companyId
            } else {
              returnData.parentId = 0
            }
            returnData.organizeId = this.currentNode.data.organizeId
            organizeManager.addCompany({
              ...returnData
            }).then(data => {
              if (data !== 'isError') {
                this.successInfo('添加成功')
                this.getChildrenNode(this.currentNode)
                this.closeAddModal()
              }
            })
          }
        }
      },
      renderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            fontSize: '14px'
          }
        }, [
          h('span', [
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.editType = 2
                  this.addChildCompany(data)
                }
              }
            }, '添加子公司'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.editType = 3
                  this.currentNode = data
                  this.openAddModal()
                }
              }
            }, '添加营业部'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  if (data.data.parentId === 0) {
                    this.editType = 1
                  } else {
                    this.editType = 2
                  }
                  this.currentNode = data
                  const parentKey = root.find(el => el === node).parent;
                  const parent = root.find(el => el.nodeKey === parentKey).node;
                  this.currentParentNode = parent
                  this.openWriteModal()
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.removeCompany(root, node, data)
                }
              }
            }, '删除')
          ])
        ]);
      },
      renderSaleDepartmentContent(h, {root, node, data}) {
        let info = data.data
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            fontSize: '14px'
          }
        }, [
          h('span', [
            h('span', data.title)
          ]),
          h('span', [
            h('span', {
              style: {
                marginLeft: '20px'
              }
            }, `${info.provinceName} ${info.cityName} ${info.districtName} ${info.addressDetail} ${info.postCode}`)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.editType = 3
                  this.currentNode = data
                  const parentKey = root.find(el => el === node).parent;
                  const parent = root.find(el => el.nodeKey === parentKey).node;
                  this.currentParentNode = parent
                  this.openWriteModal()
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.removeSaleDepartment(root, node, data)
                }
              }
            }, '删除')
          ])
        ]);
      },
      topRenderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            fontSize: '14px'
          }
        }, [
          h('span', [
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.editType = 1
                  this.currentNode = data
                  this.openAddModal()
                }
              }
            }, '添加分公司')
          ])
        ])
      },
      addChildCompany(data) {
        this.currentNode = data
        this.editType = 2
        this.openAddModal()
      },
      removeCompany(root, node, data) {
        this.$Modal.confirm({
          content: '确定要删除吗？',
          loading: true,
          onOk: () => {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            organizeManager.deleteCompany({
              companyId: data.data.companyId
            }).then(data => {
              this.$Modal.remove()
              if (data !== 'isError') {
                this.successInfo('删除成功')
                parent.children.splice(index, 1);
              }
            })
          }
        })
      },
      removeSaleDepartment(root, node, data) {
        this.$Modal.confirm({
          content: '确定要删除吗？',
          loading: true,
          onOk: () => {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            console.log(index)
            organizeManager.deleteSaleDepartment({
              saleDepartmentId: data.data.saleDepartmentId
            }).then(data => {
              this.$Modal.remove()
              if (data !== 'isError') {
                this.successInfo('删除成功')
                parent.children.splice(index, 1);
              }
            })
          }
        })
      },
      loadData(item, callback) {
        let organizeId = ''
        let parentId = ''
        let isTop = false
        organizeId = item.data.organizeId
        if (item.data.companyId) {
          parentId = item.data.companyId
        } else {
          isTop = true
          parentId = 0
        }
        let children = []
        organizeManager.companyList({
          organizeId,
          parentId
        }).then(data => {
          if (data !== 'isError') {
            data.forEach(item => {
              children.push(
                {
                  title: item.companyName,
                  loading: false,
                  data: item,
                  children: []
                }
              )
            })
          }
          if (!isTop) {
            organizeManager.getSaleDepartmentList({
              companyId: item.data.companyId
            }).then(data => {
              if (data !== 'isError') {
                data.forEach(item => {
                  children.push(
                    {
                      title: item.saleDepartmentName,
                      data: item,
                      render: this.renderSaleDepartmentContent
                    }
                  )
                })
                if (children.length === 0) {
                  this.warningInfo('没有相关数据')
                }
                callback(children)
              }
            })
          } else {
            if (children.length === 0) {
              this.warningInfo('没有相关数据')
            }
            callback(children)
          }
        })
      },
      getInitOranizeData() {
        let init = []
        this.organizeList.forEach(item => {
          init.push(
            {
              title: item.organizeName,
              loading: false,
              data: item,
              render: this.topRenderContent,
              children: []
            }
          )
        })
        this.organizeData = init
      },
      getChildrenNode (parentNode) {
        let organizeId = ''
        let parentId = ''
        let isTop = false
        organizeId = parentNode.data.organizeId
        if (parentNode.data.companyId) {
          parentId = parentNode.data.companyId
        } else {
          isTop = true
          parentId = 0
        }
        let children = []
        organizeManager.companyList({
          organizeId,
          parentId
        }).then(data => {
          if (data !== 'isError') {
            data.forEach(item => {
              children.push(
                {
                  title: item.companyName,
                  loading: false,
                  data: item,
                  children: []
                }
              )
            })
          }
          if (!isTop) {
            organizeManager.getSaleDepartmentList({
              companyId: parentNode.data.companyId
            }).then(data => {
              if (data !== 'isError') {
                data.forEach(item => {
                  children.push(
                    {
                      title: item.saleDepartmentName,
                      data: item,
                      render: this.renderSaleDepartmentContent
                    }
                  )
                })
                this.$set(parentNode, 'children', children);
              }
            })
          } else {
            this.$set(parentNode, 'children', children);
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .organize-wrapper {
    padding: 10px;
    font-size: 16px;
    background-color: #fff;
  }
</style>
