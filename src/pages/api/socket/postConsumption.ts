import { type NextApiRequest } from "next";
import { type NextApiResponseServerIO } from "~/types/next";

type Body = {
  consumptionType: string;
};

const postConsumption = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    const body = req.body as Body;
    // get message
    const { consumptionType } = body;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("addConsumption", { consumptionType });

    // return message
    res.status(201).json({ message: "success" });
  }
};

export default postConsumption;
