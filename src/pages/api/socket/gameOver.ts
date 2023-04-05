import { type NextApiRequest } from "next";
import { type NextApiResponseServerIO } from "~/types/next";

type Body = {
  id: string;
};

const gameOver = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    const body = req.body as Body;
    // get message
    const { id } = body;
    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("gameOver", { id });

    // return message
    res.status(201).json({ message: "success" });
  }
};

export default gameOver;
