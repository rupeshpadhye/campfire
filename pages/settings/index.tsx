import AppLayout from "../../components/Layout";
import { Tabs } from "antd";
import AddMembers from "../../containers/AddMembers";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";

const { TabPane } = Tabs;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });


  const members = await prisma.members.findMany({ where: { user: { id: session.uid } } });
  const users = await prisma.user.findMany(
      { where: { id: { in: members.map(member => member.userId) } } });
   const addedMembers = JSON.parse(safeJsonStringify(users));
  return { props: { members: addedMembers } };
};


const Settings = ({ members }) => {
  return (
    <AppLayout>
       <Tabs defaultActiveKey="1" size='middle' tabPosition='left'>
        <TabPane tab="Members" key="1" >
          <AddMembers members= {members}/>
        </TabPane>
        <TabPane tab="Subscriptions" key="3" >

        </TabPane>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;