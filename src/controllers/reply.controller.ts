import { Request, Response } from "express";
import { Replies } from "../database/models/Reply";
import { read_function, insert_function } from "../utils/db_methods";
import { sendResponse } from "../utils/httpRceptions";
import { BASE_URL } from "../utils/keys";
import HTML_TEMPLATE from "../utils/email_template";
import { sendEmail } from "../helpers/nodemailer";
import database_models from "../database/config/db.config";

const { Compliants } = database_models;

// Create a Reply
export const createReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const { compliantId, reply_message } = req.body;

    // Fetch user from DB to get organizationId
    const dbUser = await read_function<any>("User" as any, "findOne", {
      where: { id: user.id },
    });

    if (!dbUser || !dbUser?.dataValues?.organization) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "User or organizationId not found"
      );
      return;
    }

    // Fetch compliant and check organization match
    const compliant = await read_function<any>("Compliants" as any, "findOne", {
      where: {
        id: compliantId,
        organizationId: dbUser.dataValues.organization,
      },
    });

    if (!compliant) {
      sendResponse(
        res,
        404,
        "NOT FOUND",
        "Compliant not found or not in your organization"
      );
      return;
    }

    // Create the reply using insert_function
    const reply = await insert_function<any>("Replies" as any, "create", {
      reply_ownerId: user.id,
      reply_message,
      compliantId,
    });

    // Update compliant status to "answered"
    await Compliants.update(
      { status: "answered" },
      { where: { id: compliantId } }
    );

    // Send email to compliant creator
    const creatorEmail = compliant.dataValues?.email;
    const name = compliant.dataValues?.name || "User";
    if (creatorEmail) {
      const host = `${BASE_URL}/users`;
      const message = `Hello ${name},<br><br>
        Your compliant has received a reply:<br><br>
        <b>Reply:</b> ${reply_message}<br><br>
        Please check your dashboard for more details.<br><br>
        Thank you,<br><br>
        The cce_system Team`;

      const options = {
        to: creatorEmail,
        subject: "Your Compliant Has Been Answered",
        html: HTML_TEMPLATE(message, "Compliant Answered"),
      };

      await sendEmail(options);
    }

    sendResponse(res, 201, "SUCCESS", "Reply created successfully", reply);
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
    return;
  }
};
