# =====================================================================
#  Vi du su dung cac file .csv voi CTT, irtQ va mirt
#  Dat thu muc lam viec vao thu muc chua cac file .csv:
#    setwd("duong/dan/toi/psychometrics-examples")
# =====================================================================
library(CTT)
library(irtQ)
library(mirt)

# ---------------------------------------------------------------------
# 1) CTT - bai trac nghiem A/B/C/D chua cham + dap an
# ---------------------------------------------------------------------
raw  <- read.csv("01_ctt_tracnghiem_ABCD.csv", stringsAsFactors = FALSE,
                 na.strings = "")
key  <- read.csv("01_ctt_dapan.csv", stringsAsFactors = FALSE)$DapAn
resp <- raw[, -(1:2)]                       # bo cot ID, GioiTinh

sc <- score(resp, key, output.scored = TRUE)
head(sc$score)                              # tong diem moi hoc sinh
scored <- sc$scored                         # ma tran 0/1

ia <- itemAnalysis(scored)                  # Cronbach alpha, do kho, do phan biet
ia
ia$itemReport                               # itemMean (p), pBis, bis, alphaIfDeleted
distractorAnalysis(resp, key)               # phan tich phuong an nhieu

# ---------------------------------------------------------------------
# 2) mirt - du lieu nhi phan 0/1: Rasch, 2PL, 3PL
#    (file 02_nhiphan_thamso_that.csv chua tham so that de doi chieu)
# ---------------------------------------------------------------------
bin <- read.csv("02_nhiphan_01.csv")

itemAnalysis(bin)                           # CTT cung dung duoc cho file nay

m_rasch <- mirt(bin, 1, itemtype = "Rasch")
m_2pl   <- mirt(bin, 1, itemtype = "2PL")
m_3pl   <- mirt(bin, 1, itemtype = "3PL")
anova(m_rasch, m_2pl)                       # so sanh mo hinh
anova(m_2pl, m_3pl)

coef(m_3pl, IRTpars = TRUE, simplify = TRUE)$items
itemfit(m_2pl)
M2(m_2pl)
theta <- fscores(m_2pl, method = "EAP")
plot(m_2pl, type = "trace")                 # duong cong dac trung item
plot(m_2pl, type = "info")                  # ham thong tin cua bai test

# ---------------------------------------------------------------------
# 3) mirt / CTT - thang Likert 5 muc: GRM, GPCM
# ---------------------------------------------------------------------
lik <- read.csv("03_likert_5muc.csv")

itemAnalysis(lik)                           # Cronbach alpha cho thang do

m_grm  <- mirt(lik, 1, itemtype = "graded")
m_gpcm <- mirt(lik, 1, itemtype = "gpcm")
anova(m_gpcm, m_grm)
coef(m_grm, IRTpars = TRUE, simplify = TRUE)$items
plot(m_grm, type = "trace", which.items = 1:4)

# ---------------------------------------------------------------------
# 4) mirt - mo hinh hai chieu (Toan, Van co tuong quan ~0.4)
# ---------------------------------------------------------------------
md <- read.csv("04_hai_chieu_Toan_Van.csv")

m_1d <- mirt(md, 1, itemtype = "2PL")
spec <- mirt.model("
  Toan = 1-8
  Van  = 9-16
  COV  = Toan*Van")
m_2d <- mirt(md, spec, itemtype = "2PL")
anova(m_1d, m_2d)
summary(m_2d)                               # he so tai + tuong quan nhan to
mirt(md, 2, itemtype = "2PL")               # EFA kham pha 2 nhan to

# ---------------------------------------------------------------------
# 5) mirt - DIF giua hai nhom (item I03, I07 duoc cai dat DIF)
# ---------------------------------------------------------------------
dif <- read.csv("05_dif_hai_nhom.csv")
grp <- dif$Nhom
dat <- dif[, -1]

mg <- multipleGroup(dat, 1, group = grp, itemtype = "2PL",
                    invariance = c("slopes", "intercepts",
                                   "free_means", "free_var"))
DIF(mg, which.par = c("a1", "d"), scheme = "drop")

# ---------------------------------------------------------------------
# 6) irtQ - bai test hon hop (3PLM, 2PLM, GRM, GPCM)
# ---------------------------------------------------------------------
meta <- read.csv("06_irtQ_thamso_item.csv", stringsAsFactors = FALSE)
mix  <- read.csv("06_irtQ_traloi_hon_hop.csv")

# 6a) Uoc luong tham so item tu du lieu tra loi
fit <- est_irt(data = mix, D = 1,
               model = meta$model, cats = meta$cats, item.id = meta$id)
summary(fit)
par_est <- getirt(fit, what = "par.est")
par_est

# 6b) Uoc luong nang luc khi da biet tham so item (file metadata)
sc_eap <- est_score(x = meta, data = mix, D = 1, method = "EAP")
head(sc_eap)

# 6c) Thong tin, duong cong dac trung va mo phong du lieu
th <- seq(-4, 4, 0.1)
inf <- info(x = meta, theta = th, D = 1)
plot(inf, item.loc = NULL)                  # thong tin cua ca bai test
tl <- traceline(x = meta, theta = th, D = 1)
plot(tl, item.loc = 19)                     # item CR1 (GRM)
sim <- simdat(x = meta, theta = rnorm(500), D = 1)
head(sim)

# 6d) Do phu hop item
irtfit(x = meta, score = sc_eap$est.theta, data = mix, D = 1,
       group.method = "equal.freq", n.width = 10)

# mirt cung xu ly duoc du lieu hon hop:
m_mix <- mirt(mix, 1, itemtype = c(rep("3PL", 15), rep("2PL", 3),
                                   rep("graded", 4), rep("gpcm", 2)))
coef(m_mix, IRTpars = TRUE, simplify = TRUE)$items
