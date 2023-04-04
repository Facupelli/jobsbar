import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "~/types/next";

const gameOver = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const { id }: { id: string } = req.body;
    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("gameOver", { id });

    // return message
    res.status(201).json({ message: "success" });
  }
};

export default gameOver;
