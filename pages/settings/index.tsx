import AppLayout from "../../components/Layout";
import { Tabs } from "antd";
import AddMembers from "../../containers/AddMembers";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import Plans from "../../components/Plans";

const { TabPane } = Tabs;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

//  const result = await prisma.user.findUnique({ 
//     select: {
//       id: true,
//       organization: {
//         select: {
//           id: true,
//           name: true,
//       }
//     },
//       members: {
//         select: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               image: true,
//             }
//         },
//       },
//       where: {
//         createdBy: { connect: { email: session.user.email } } 
//     },
//   },
//   where: { email: session.user.email} 
//   });
//  console.log('result',result);
  const members = await prisma.members.findMany({ where: { user: { id: session.uid } } });
  const users = await prisma.user.findMany(
      { where: { id: { in: members.map(member => member.userId) } } });
   const addedMembers = JSON.parse(safeJsonStringify(users));
  return { props: { members: addedMembers } };
};

const OrganizationInfo = ({}) => {
  return (
    <div>
      <h1>Organization Info</h1>

    </div>);
};

const Settings = ({ members }) => {
  return (
    <AppLayout>
       <Tabs defaultActiveKey="1" size='middle' tabPosition='left'>
        <TabPane tab="Organization" key="1" >
          <OrganizationInfo />
        </TabPane> 
        <TabPane tab="Members" key="2" >
          <AddMembers members= {members}/>
        </TabPane>
        <TabPane tab="Subscriptions" key="3" >
            <h1>Subscription Information</h1>
            <Plans selectedPlan={null}/>
        </TabPane>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;