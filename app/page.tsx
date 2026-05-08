"use client";
import { useState, useEffect, useCallback } from "react";

const GOLD = "#C4975A";
const GOLDB = "#E8C98A";
const BG = "#070809";
const STRIPE = "https://buy.stripe.com/cNi7sN9iBfwQ7VG1HU4Vy03";
const goBuy = () => window.open(STRIPE, "_blank");

async function callGroq(prompt: string, maxTokens = 1200): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, max_tokens: maxTokens }),
  });
  const data = await res.json();
  return data.text || "";
}

async function callAI(prompt: string, maxTokens = 1200): Promise<any> {
  const text = await callGroq(prompt, maxTokens);
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json");
  return JSON.parse(match[0]);
}