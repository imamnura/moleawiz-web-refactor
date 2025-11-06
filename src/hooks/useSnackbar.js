/**
 * useSnackbar Hook
 * Shows snackbar/toast notifications
 */
import { message } from 'antd'

export const useSnackbar = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const showSnackbar = (content, type = 'info') => {
    messageApi[type](content)
  }

  return {
    showSnackbar,
    contextHolder,
  }
}
