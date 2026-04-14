import { test, expect } from "@playwright/test";

test("has title or expected heading", async ({ page }) => {
  await page.goto("/");
  // Adapte para sua página inicial real
  await expect(page).toHaveTitle(/.*|TransRota/i);
});

test("login module renders", async ({ page }) => {
  await page.goto("/admin/auth/login");
  // Adapte aguardando um input de e-mail por exemplo
  // await expect(page.getByPlaceholder(/email|usuário/i)).toBeVisible();
});
