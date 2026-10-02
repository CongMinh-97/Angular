# Du lieu vi du cho CTT, irtQ, mirt

Toan bo du lieu la **du lieu mo phong** (sinh bang `tao_du_lieu.py`, seed 2026),
khong phai du lieu that. Huong dan chay tung vi du nam trong `vi_du.R`.

| File | Kich thuoc | Dinh dang | Dung cho |
|---|---|---|---|
| `01_ctt_tracnghiem_ABCD.csv` + `01_ctt_dapan.csv` | 300 HS × 20 cau | Dap an A/B/C/D chua cham (co o trong = bo qua) | **CTT**: `score()`, `itemAnalysis()`, `distractorAnalysis()` |
| `02_nhiphan_01.csv` | 1000 × 25 | 0/1, sinh tu mo hinh 3PL | **mirt**: Rasch / 2PL / 3PL; **CTT**: alpha |
| `02_nhiphan_thamso_that.csv` | 25 item | a, b, c that | Doi chieu voi tham so uoc luong |
| `03_likert_5muc.csv` | 600 × 12 | Likert 1–5, sinh tu GRM | **mirt**: `graded`, `gpcm`; **CTT**: alpha |
| `04_hai_chieu_Toan_Van.csv` | 800 × 16 | 0/1, 2 nhan to (r ≈ 0.4) | **mirt**: mo hinh da chieu, `mirt.model()` |
| `05_dif_hai_nhom.csv` | 1000 × (Nhom + 15) | 0/1, cot `Nhom` = A/B | **mirt**: `multipleGroup()`, `DIF()` — item I03, I07 co DIF |
| `06_irtQ_thamso_item.csv` | 24 item | Metadata irtQ: `id, cats, model, par.1..par.5` | **irtQ**: `est_score()`, `info()`, `traceline()`, `simdat()` |
| `06_irtQ_traloi_hon_hop.csv` | 1000 × 24 | 15 × 3PLM, 3 × 2PLM, 4 × GRM (0–3), 2 × GPCM (0–4), co mot it NA | **irtQ**: `est_irt()`; **mirt** voi `itemtype` hon hop |

Luu y: tham so duoc sinh voi hang so ty le **D = 1**.
