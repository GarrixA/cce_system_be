import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sequelizeConnection } from "../database/config/db.config";
import borrower_model from "../database/models/Reply";
import { Info } from "../types/upload";
import { Compliants } from "../database/models/Compliants";

export interface ExpandedRequest extends Request {
  user?: JwtPayload;
}
const Reply = borrower_model(sequelizeConnection);

const create_reply = async (
  req: ExpandedRequest,
  res: Response
): Promise<void> => {
  const { reply_ownerId, reply_message, compliantId } = req.body;

  const compliant = await Compliants.findByPk(compliantId);
  if (!compliant) {
    res
      .status(400)
      .json({ message: "Invalid compliantId! Item does not exist." });
    return;
  }

  if (!reply_ownerId || !reply_message || !compliant) {
    res.status(400).json({ message: "Required fields are missing!" });
    return;
  }

  if ((req as Info<any>).info?.message) {
    res.status(400).json({ message: (req as Info<any>).info.message });
    return;
  }

  try {
    const reply = await Reply.create({
      reply_ownerId,
      reply_message,
      compliantId,
    });

    res.status(201).json({ message: `Reply sent`, reply });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update_reply = async (
  req: ExpandedRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { reply_ownerId, reply_message, compliantId } = req.body;

  try {
    const reply = await Reply.findByPk(id);
    if (!reply) {
      res.status(404).json({ message: "Reply not found!" });
      return;
    }

    await reply.update({
      reply_ownerId: reply_ownerId ?? reply.reply_ownerId,
      reply_message: reply_message ?? reply.reply_message,
      compliantId: compliantId ?? reply.compliantId,
    });

    res.status(200).json({ message: `Updated successfully`, reply });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const get_all_replies = async (req: Request, res: Response): Promise<void> => {
  try {
    const replies = await Reply.findAll();
    res.status(200).json(replies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const get_single_reply = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const reply = await Reply.findByPk(id);
    if (!reply) {
      res.status(404).json({ message: "Reply not found!" });
      return;
    }

    res.status(200).json(reply);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  create_reply,
  update_reply,
  get_all_replies,
  get_single_reply,
};
