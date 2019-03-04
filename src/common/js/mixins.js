export const message = {
  methods: {
    warningInfo(info) {
      this.$Message.warning({
        content: info
      })
    },
    successInfo(info) {
      this.$Message.success({
        content: info
      })
    }
  }
}
export const page = {
  data() {
    return {
      pageNo: 1,
      total: 0
    }
  },
  methods: {
    correctPageNo(no = 1) {
      let sumPageNo = Math.ceil((this.total - no) / 10)
      if (this.pageNo > sumPageNo) {
        this.pageNo = sumPageNo
      }
    }
  }
}
export const table = {
  data() {
    return {
      tableData: [],
      tableLoading: false
    }
  },
  methods: {
    openTableLoading() {
      this.tableLoading = true
    },
    closeTableLoading() {
      this.tableLoading = false
    }
  }
}
export const addModal = {
  data() {
    return {
      addModal: {
        isShow: false,
        loading: false
      }
    }
  },
  methods: {
    openAddModal() {
      this.addModal.isShow = true
    },
    closeAddModal() {
      this.addModal.isShow = false
    },
    openAddLoading() {
      this.addModal.loading = true
    },
    closeAddLoading() {
      this.addModal.loading = false
    }
  }
}
export const writeModal = {
  data() {
    return {
      writeModal: {
        isShow: false,
        loading: false
      }
    }
  },
  methods: {
    openWriteModal() {
      this.writeModal.isShow = true
    },
    closeWriteModal() {
      this.writeModal.isShow = false
    },
    openWriteLoading() {
      this.writeModal.loading = true
    },
    closeWriteLoading() {
      this.writeModal.loading = false
    }
  }
}
export const countPrice = {
  data () {
    return {
      showDateStr: '',
      requestDateStr: '',
      currentDate: [],
      countPrice: '',
      monthPrice: ''
    }
  },
  methods: {
    sumDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      this.currentDate= [year, month]
      this.formatTime()
    },
    formatTime () {
      this.showDateStr = `${this.currentDate[0]}年${this.currentDate[1]}月`
      this.requestDateStr = this.currentDate.map(this.formatNumber).join('-')
      this.getMonthCount()
    },
    formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    subtractDate () {
      this.currentDate[1]--
      if (this.currentDate[1] < 1) {
        this.currentDate[0]--
        this.currentDate[1] = 12
      }
      this.formatTime()
    },
    addDate () {
      this.currentDate[1]++
      if (this.currentDate[1] > 12) {
        this.currentDate[0]++
        this.currentDate[1] = 1
      }
      this.formatTime()
    }
  }
}
