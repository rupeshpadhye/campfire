import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { info } = req.body;
  try {
    const result = await Promise.all([
      prisma.pendingUser.create({
        data: {
            ...info,
        },
      }),
    ]) ;
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
  
}