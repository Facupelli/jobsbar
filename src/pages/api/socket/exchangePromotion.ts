import { type NextApiRequest } from "next";
import { type NextApiResponseServerIO } from "~/types/next";

const exchangePromotion = (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (req.method === "POST") {
    // get message

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("exchangePromotion");

    // return message
    res.status(201).json({ message: "success" });
  }
};

export default exchangePromotion;
