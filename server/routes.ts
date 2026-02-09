import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });
  
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/analyze", (req, res) => {
    const text = String(req.body?.text || "").toLowerCase();
    let score = 0;
    const flags = [];

    if (/(urgent|immediately|asap|right away|act now)/.test(text)) {
      score += 25;
      flags.push("Urgency language detected");
    }
    if (/(check|cheque)/.test(text) && /(deposit|cash)/.test(text)) {
      score += 40;
      flags.push("Check deposit scam pattern");
    }
    if (/(ssn|social security|bank account|routing)/.test(text)) {
      score += 30;
      flags.push("Requests sensitive information");
    }

    score = Math.min(100, score);
    const next_steps = score >= 60 
      ? "Do not send money or personal info. Verify independently."
      : "Proceed with caution.";

    res.json({ score, flags, next_steps });
  });

  return httpServer;
}
  

