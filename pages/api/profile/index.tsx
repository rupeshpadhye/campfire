import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

const updateProfile = async (email, userInfo) => {
  const result =   await prisma.user.update({
              where: { email },
              data: {
                  ...userInfo,
              }});
        return result;
};

export default async function handle(req, res) {
  const { name, image } = req.body;
  const session = await getSession({ req });
  const { user: { email } } = session;
  try {

 
  switch (req.method) {
    case 'PUT':
       const result =  await updateProfile(email, { name, image });
       res.json(result);
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
} catch(e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }

}