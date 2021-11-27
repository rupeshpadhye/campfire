import AccessDeniedSvg from './../public/404.svg';
import { Row, Col, Typography, Button } from 'antd';
import Link from 'next/link';
const  AccessDenied = () => {
    return (
        <Row align='middle'>
            <Col span={24} style={{display: 'flex' , justifyContent: 'center'}}>
            <AccessDeniedSvg />
            </Col>
            <Col span={24} style={{display: 'flex' , justifyContent: 'center'}}>
            <Typography.Title level={4}>
                Access Denied
            </Typography.Title>
            </Col>
            <Col span={24} style={{display: 'flex' , justifyContent: 'center'}}>
            <Link href='/'>
            <Button type='primary' size='large' style={{marginTop: '20px'}}>
                Go Home
            </Button>
           </Link>
            </Col>
        </Row>
    );}

export default AccessDenied;



AccessDenied.defaultProps = {
    auth: {
      isPublic: true,
    }
};
  