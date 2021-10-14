import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    res.redirect('/');
}
