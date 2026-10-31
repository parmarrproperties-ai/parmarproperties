---
target: ads-manager
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/Parmar-properties-listing2/Frontend/components/ppc/AdsManager.tsx"
target_fingerprint: "sha256:4392a1bd800f2705ee77a45b394f122e5c5e7f2ddf6cd476521a7ad0fab0ce22"
target_path: /home/user/Parmar-properties-listing2/Frontend/components/ppc/AdsManager.tsx
timestamp: 2026-10-11T17-27-27Z
slug: frontend-components-ppc-adsmanager-tsx
---
# Critique: Ads Manager (Frontend/components/ppc/AdsManager.tsx, route /ads-manager)
Method: dual-agent. Score 21/40 (52%, Acceptable). Detector: 0 findings. No browser pass (app cannot run in session).

Heuristics: 1=2, 2=3, 3=2, 4=2, 5=2, 6=2, 7=2, 8=3, 9=1, 10=2.

Priority issues
1. [P1] Empty state hides fetch failures; no .catch (L34-36, L72-76). Fix: loading/ready/error state with Retry. /impeccable harden
2. [P1] Copy is blind and failure is silent (L16-24). Fix: show live tracking suffix block, "Copied" text + role=status, clipboard fallback. /impeccable harden, /impeccable clarify
3. [P2] Four equal buttons per row; "URL with tracking" contradicts guidance (L91-103, L111). Fix: one primary, shared suffix block. /impeccable distill
4. [P2] No domain validation/persistence; Preview ignores typed domain (L30-31, L38, L52-68, L96). /impeccable harden
5. [P3] Small type/targets, weak borders (~1.5:1), no focus styles, hard-coded hex, ambiguous aria names. /impeccable layout, /impeccable typeset

Personas: Alex (no search/copy-all, retyped inputs), Sam (no live region, identical button names, weak focus), Jordan (help buried, unclear which button).
Bugs: no .catch (L35); unguarded clipboard (L16-19); timer not cleared (L17-18); Preview ignores domain (L96); empty/scheme-less domain gives broken URLs (L38, L81); campaign silently lowercased (L40). Unverified: auth gate on /ads-manager.
