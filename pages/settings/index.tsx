import AppLayout from "../../components/AppLayout";
import { Card, Tabs, Form, Input, Row, Col } from "antd";
import AddMembers from "../../containers/AddMembers";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import Plans from "../../components/Plans";
import styles from './settings.module.scss';
import get from 'lodash/get';
import { useMediaQuery } from 'react-responsive'

const { TabPane } = Tabs;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  const [members, { organization }] = await Promise.all([
    prisma.members.findMany({
      where: {
        createdBy: {
          is: {
            email: session.user.email,
          },
        },
      },
    }),
    prisma.user.findUnique({
      select: {
        organization: {
          select: {
            name: true,
            website: true,
            logo: true,
            planId: true
          }
        },
      },
      where: {
        email: session.user.email,
      },
    }),
  ]);
  const users = await prisma.user.findMany({
    where: { id: { in: members.map((member) => member.userId) } },
  });
  const addedMembers = JSON.parse(safeJsonStringify(users));
  return { props: { members: addedMembers, organization } };
};

const plans = {
  1: 'free',
  2: 'basic',
  3: 'pro'
}
const OrganizationInfo = ({ organization ={ name: '', website: '', planId: 1} }) => {

  const name = get(organization, 'name');
  const website = get(organization, 'website');
  const planId = get(organization, 'planId');

  return (
    <div>
      <Card title='Organization Info'>
        <Row>
          <Col md={12}>
          <h2>Company Name : </h2>
          </Col>
          <Col md={12}>
           {name}
          </Col>
        </Row>
        <Row>
        <Col  md={12}>
           <h2>Website :</h2>  
          </Col>
          <Col  md={12}>
          {website}
          </Col>
        </Row>
      </Card>
      <div className={styles.subscription}>
       <h1>Current Subscription : <span className={styles.plan}>{plans[planId]}</span></h1>
        <Plans selectedPlan={null} currentPlan={plans[planId]} />
      </div>
    </div>
  );
};

const Settings = ({ members, organization }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <AppLayout>
      <Tabs defaultActiveKey="1" size="middle" tabPosition={ isMobile ? 'top':'left'}>
        <TabPane tab="Organization" key="1">
          <OrganizationInfo  organization={organization}/>
        </TabPane>
        <TabPane tab="Members" key="2">
          <AddMembers members={members} />
        </TabPane>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;

Settings.defaultProps = {
  auth: {
    isPublic: true,
    redirect: "/",
    role: ["creator"],
  },
};
