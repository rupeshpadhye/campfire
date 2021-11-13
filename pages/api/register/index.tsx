import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { info } = req.body;
  try {
    const result = await prisma.pendingUser.create({
      data: {
          ...info,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({
      message: "Registered before? Sign in via same email to complete registration",
    });
  }
  
}