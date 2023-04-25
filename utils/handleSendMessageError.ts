import { deleteUser } from "../controllers/user.controller.ts";

export default function handleSendMessageError(userID: number) {
  return async function (e: Error) {
    if (typeof e === "object" && typeof e.message === "string") {
      if (e.message.match(/chat not found|bot was blocked by the user/)) await deleteUser({ telegramID: userID });
    }
  };
}
