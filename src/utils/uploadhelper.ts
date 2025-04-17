
import type { UploadFileItem } from 'lew-ui'
import myrequest from './request'


export default ({
  fileItem,
  setFileItem
}: {
  fileItem: UploadFileItem
  setFileItem: Function
}) => {
  // console.log('调用上传方法')
  // console.log(fileItem)
  const { id, file } = fileItem
  const formData = new FormData()
  formData.append('file', file as File)
  setFileItem({ id, status: '嘿嘿我刚刚上传' })
  setTimeout(() => {
    setFileItem({
      id,
      status: 'success'
    })
  }, 3000);
}