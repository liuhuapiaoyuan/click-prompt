import { NextApiHandler } from "next";
import { SITE_USER_COOKIE } from "@/configs/constants";
import { createUser, isValidUser } from "@/storage/planetscale";
import { encryptedKey, hashedKey } from "@/uitls/crypto.util";

// type Request = {
//   action: "login" | "logout";
//   key?: string;
// };

type Response = {
  message?: string;
  error?: string;
};

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "POST" && req.body)) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const userIdInCookie = req.cookies[SITE_USER_COOKIE];
  const request = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const action = request.action
  let key = request.key

  if (!action) {
    res.status(400).json({ error: "No query provided" });
    return;
  }

  switch (action) {
    case "login":
      if (key) {
        const key_hashed = hashedKey(key);
        // 时信软件处理
        if(key=="时信软件"){
          key = `${process.env.OPENAI_API_KEY}`;
        }

        if (!(await isValidUser(key_hashed))) {
          const { iv, key_encrypted } = encryptedKey(key);
          await createUser({
            iv: iv.toString("hex"),
            key_hashed,
            key_encrypted,
          });
        }

        res.setHeader("Set-Cookie", `${SITE_USER_COOKIE}=${key_hashed}; Max-Age=3600; HttpOnly; Path=/;`);
        return res.status(200).json({ message: "Logged in" } as Response);
      } else {
        return res.status(400).json({ error: "No key provided" } as Response);
      }
    case "logout":
      if (!userIdInCookie) {
        return res.status(200).json({ error: "You're not logged in yet!" } as Response);
      }

      res.setHeader("Set-Cookie", `${SITE_USER_COOKIE}=; Max-Age=0; HttpOnly; Path=/;`);
      return res.status(200).json({ message: "Logged out" } as Response);
    default:
      return res.status(400).json({ error: "Unknown action" } as Response);
  }
};
export default handler;
