// /* eslint-disable */
export const sysApiHost = process.env.NODE_ENV === 'development' ? '/sys_service' : '/sys_service'
export const webApiHost = process.env.NODE_ENV === 'development' ? '/web_service' : '/web_service'
export const loginApiHost = process.env.NODE_ENV === 'development' ? '/login' : '/login'
export const apiHost = process.env.NODE_ENV === 'development' ? '' : ''
