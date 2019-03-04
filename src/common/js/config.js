export const icons = {
  'develop-setting': 'gear-b',
  'permissions-setting': 'ionic',
  'school-permissions-setting': 'hammer',
  'system-setting': 'gear-a',
  'user-setting': 'ios-people',
  'circle-manager': 'ios-circle-outline',
  'interest-group': 'social-pinterest',
  'topic-manager': 'outlet',
  'trends-info': 'social-twitch',
  'type-manager': 'ios-keypad',
  'recommend-setting': 'thumbsup',
  're-account': 'person-stalker',
  're-active': 'film-marker',
  're-massgroup': 'ios-body',
  'role-setting': 'ionic',
  'account-setting': 'university',
  'school-message': 'chatbubbles',
  'school-setting': 'home',
  'base-setting': 'wrench',
  'version-control': 'flag',
  'active-manager': 'ios-flower',
  'h5-active': 'android-send',
  'game': 'playstation',
  'game-group': 'help-buoy',
  'game-list': 'android-list',
  'game-person': 'ios-people',
  'grade-manager': 'social-dropbox-outline',
  'message-center': 'ios-volume-high',
  'message-push': 'ios-pulse',
  'message-review': 'checkmark-circled'
}

let baseUri
if (process.env.NODE_ENV === 'development' || process.env.buildType === 'test') {
  baseUri = 'http://132.232.197.118/cms'
} else {
  baseUri = 'http://132.232.197.118/cms'
}
export const baseUrl = baseUri
