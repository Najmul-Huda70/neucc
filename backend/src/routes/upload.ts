import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";

export const uploadRouter = Router();

const uploadSchema = z.object({
  // Accepts either a raw base64 string or a data URL (data:image/png;base64,....)
  image: z.string().min(50),
});

// POST /api/upload — authenticated, proxies to ImgBB so the API key never
// reaches the browser. Used for event images and nomination candidate photos.
uploadRouter.post("/", requireAuth, async (req, res) => {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ ok: false, status: 500, error: "Image hosting is not configured on the server." });
  }

  // Strip a data-URL prefix if present — ImgBB's API wants raw base64.
  const base64 = parsed.data.image.replace(/^data:image\/\w+;base64,/, "");

  try {
    const form = new FormData();
    form.append("image", base64);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: form,
    });

    const json = (await imgbbRes.json()) as {
      success: boolean;
      data?: { url: string; display_url: string; delete_url: string };
      error?: { message: string };
    };

    if (!imgbbRes.ok || !json.success || !json.data) {
      return res.status(502).json({
        ok: false,
        status: 502,
        error: json.error?.message ?? "Image upload failed. Please try again.",
      });
    }

    res.status(201).json({
      ok: true,
      status: 201,
      data: { url: json.data.display_url ?? json.data.url },
    });
  } catch (err) {
    console.error("[upload] ImgBB request failed:", err);
    res.status(502).json({ ok: false, status: 502, error: "Image upload service unreachable." });
  }
});
