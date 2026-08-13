import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";

// 静的アプリなのでサーバ不要。kojo の visualGate と同じ file:// 方式で開く
const APP_URL = pathToFileURL("public/index.html").href;

test("ページがロードできページエラーが出ない", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(APP_URL);
  await expect(page.locator("body")).toBeVisible();
  expect(errors).toEqual([]);
});

// このスモークは削除しないこと。機能テストは PLAN.md の受け入れ条件ごとに追記する

test("AC1: 初期状態は結果が空で案内文が表示される", async ({ page }) => {
  await page.goto(APP_URL);

  await expect(page.locator("#result .diff-line")).toHaveCount(0);
  await expect(page.locator("#status")).toBeVisible();
  await expect(page.locator("#status")).toContainText("テキストを入力して比較してください");
});

test("AC2: 追加・削除・変更が色分けされて表示される", async ({ page }) => {
  await page.goto(APP_URL);

  await page.locator("#text-a").fill("keep\nonly-del\nold\ntail");
  await page.locator("#text-b").fill("keep\nnew\ntail\nonly-add");
  await page.locator("#compare-btn").click();

  const added = page.locator("#result .diff-line.added");
  const removed = page.locator("#result .diff-line.removed");
  const changed = page.locator("#result .diff-line.changed");

  await expect(added).toHaveCount(1);
  await expect(added).toContainText("only-add");
  await expect(removed).toHaveCount(1);
  await expect(removed).toContainText("old");
  await expect(changed).toHaveCount(1);
  await expect(changed).toContainText("new");

  const addedBg = await added.first().evaluate((el) => getComputedStyle(el).backgroundColor);
  const removedBg = await removed.first().evaluate((el) => getComputedStyle(el).backgroundColor);
  const changedBg = await changed.first().evaluate((el) => getComputedStyle(el).backgroundColor);
  const sameBg = await page
    .locator("#result .diff-line:not(.added):not(.removed):not(.changed)")
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(addedBg).not.toBe(removedBg);
  expect(addedBg).not.toBe(changedBg);
  expect(removedBg).not.toBe(changedBg);
  expect(addedBg).not.toBe(sameBg);
  expect(removedBg).not.toBe(sameBg);
  expect(changedBg).not.toBe(sameBg);
});

test("AC3: 同一テキスト比較では差分0件と分かる", async ({ page }) => {
  await page.goto(APP_URL);

  const text = "alpha\nbeta\ngamma";
  await page.locator("#text-a").fill(text);
  await page.locator("#text-b").fill(text);
  await page.locator("#compare-btn").click();

  await expect(page.locator("#result .diff-line.added")).toHaveCount(0);
  await expect(page.locator("#result .diff-line.removed")).toHaveCount(0);
  await expect(page.locator("#result .diff-line.changed")).toHaveCount(0);
  await expect(page.locator("#status")).toContainText("差分はありません");
});

test("AC4: 左が空で右に内容がある場合は全行が追加", async ({ page }) => {
  await page.goto(APP_URL);

  await page.locator("#text-a").fill("");
  await page.locator("#text-b").fill("one\ntwo\nthree");
  await page.locator("#compare-btn").click();

  await expect(page.locator("#result .diff-line.added")).toHaveCount(3);
  await expect(page.locator("#result .diff-line.removed")).toHaveCount(0);
  await expect(page.locator("#result .diff-line.changed")).toHaveCount(0);
});

test("AC5: 右が空で左に内容がある場合は全行が削除", async ({ page }) => {
  await page.goto(APP_URL);

  await page.locator("#text-a").fill("one\ntwo\nthree");
  await page.locator("#text-b").fill("");
  await page.locator("#compare-btn").click();

  await expect(page.locator("#result .diff-line.removed")).toHaveCount(3);
  await expect(page.locator("#result .diff-line.added")).toHaveCount(0);
  await expect(page.locator("#result .diff-line.changed")).toHaveCount(0);
});
