# =====================================================================
#  Vi du CTT (Ly thuyet khao thi co dien)
#  Can 2 file: 01_ctt_tracnghiem_ABCD.csv va 01_ctt_dapan.csv
# =====================================================================
library(CTT)

# Buoc 1: Doc du lieu ------------------------------------------------
raw <- read.csv("01_ctt_tracnghiem_ABCD.csv", stringsAsFactors = FALSE)
key <- read.csv("01_ctt_dapan.csv", stringsAsFactors = FALSE)$DapAn
head(raw)                 # 6 hoc sinh dau tien
key                       # 20 dap an dung

resp <- raw[, -(1:2)]     # chi giu cac cot Cau1..Cau20

# Buoc 2: Cham diem ---------------------------------------------------
sc <- score(resp, key, output.scored = TRUE)
diem   <- sc$score        # tong diem moi hoc sinh (0-20)
scored <- sc$scored       # ma tran 0/1 (1 = dung)
summary(diem)
hist(diem, main = "Pho diem", xlab = "Tong diem", col = "lightblue")

# Buoc 3: Phan tich cau hoi va do tin cay -----------------------------
ia <- itemAnalysis(scored)
ia                        # Cronbach alpha cua ca bai
ia$itemReport             # itemMean = do kho (p), pBis = do phan biet,
                          # alphaIfDeleted = alpha neu bo cau do

# Danh dau cau hoi can xem lai
rep <- ia$itemReport
rep$DanhGia <- ifelse(rep$pBis < 0.2, "Phan biet kem",
               ifelse(rep$itemMean < 0.2 | rep$itemMean > 0.9,
                      "Qua kho/de", "Tot"))
rep

# Buoc 4: Phan tich phuong an nhieu ------------------------------------
da <- distractorAnalysis(resp, key)
da$Cau1                   # xem cau 1: ti le chon A/B/C/D theo nhom diem

# Buoc 5: Luu ket qua ra file -----------------------------------------
write.csv(data.frame(ID = raw$ID, GioiTinh = raw$GioiTinh, TongDiem = diem),
          "ket_qua_diem.csv", row.names = FALSE)
write.csv(rep, "ket_qua_phan_tich_cau_hoi.csv", row.names = FALSE)

# Them: so sanh diem trung binh Nam/Nu
tapply(diem, raw$GioiTinh, mean)
t.test(diem ~ raw$GioiTinh)
