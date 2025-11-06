import { Col } from 'antd'

/**
 * HomeTitle Component
 * Displays page title with responsive sizing
 */
export default function HomeTitle({
  textTitle,
  attrTextTitle,
  usrDataName,
  dynamic,
  isMobileVersion = false,
}) {
  return (
    <>
      <Col span={18}>
        <div
          className="general-title"
          text-title={
            attrTextTitle !== undefined ? attrTextTitle : 'default-title'
          }
          style={{
            fontSize:
              dynamic === true && usrDataName === undefined
                ? 'inherit'
                : isMobileVersion
                  ? '18px'
                  : '22px',
            textAlign: 'left',
            fontWeight: '500',
            color: '#212121',
            lineHeight: isMobileVersion ? '100%' : 'unset',
          }}
        >
          {textTitle}
        </div>
      </Col>
      <Col span={6}></Col>
    </>
  )
}
