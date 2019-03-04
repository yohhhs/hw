import { getTagsList, getCurrentRoute } from '@/common/js/cache'

const state = {
  tagsList: getTagsList(),
  currentRoute: getCurrentRoute()
}

export default state
