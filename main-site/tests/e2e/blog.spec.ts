import { test, expect } from '@playwright/test';

test.describe('Blog listing page', () => {
  test('loads and displays the page heading', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /blog & resources/i })).toBeVisible();
  });

  test('shows a featured post after data loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('link', { name: /read more/i }).first()).toBeVisible({ timeout: 8000 });
  });

  test('search filters posts', async ({ page }) => {
    await page.goto('/blog');
    await page.fill('[placeholder="Search"]', 'xyzimpossiblequery12345');
    await expect(page.getByText(/no posts found/i)).toBeVisible();
  });

  test('prev/next carousel arrows are visible', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByLabel('Next featured post')).toBeVisible({ timeout: 8000 });
    await expect(page.getByLabel('Previous featured post')).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Blog post detail page', () => {
  test('navigates to a post by clicking "Read More"', async ({ page }) => {
    await page.goto('/blog');
    const link = page.getByRole('link', { name: /read more/i }).first();
    await link.waitFor({ timeout: 8000 });
    await link.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
  });

  test('shows "Post not found" for an invalid slug', async ({ page }) => {
    await page.goto('/blog/this-slug-does-not-exist-xyz');
    await expect(page.getByText(/post not found/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('link', { name: /back to blog/i })).toBeVisible();
  });

  test('"See All Blogs" returns to /blog', async ({ page }) => {
    await page.goto('/blog');
    const link = page.getByRole('link', { name: /read more/i }).first();
    await link.waitFor({ timeout: 8000 });
    await link.click();
    await page.getByRole('link', { name: /see all blogs/i }).click();
    await expect(page).toHaveURL('/blog');
  });
});

test.describe('Homepage BlogSection', () => {
  test('"View All Posts" CTA links to /blog', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /view all posts/i });
    await expect(cta).toBeVisible({ timeout: 8000 });
    await expect(cta).toHaveAttribute('href', '/blog');
  });
});
