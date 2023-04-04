import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "~/types/next";

const postConsumption = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const { consumptionType }: { consumptionType: string } = req.body;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("addConsumption", { consumptionType });

    // return message
    res.status(201).json({ message: "success" });
  }
};

export default postConsumption;
