import random, math, csv, os
random.seed(2026)
OUT="/home/user/Angular/psychometrics-examples"
def w(name, header, rows):
    with open(os.path.join(OUT,name),"w",newline="") as f:
        c=csv.writer(f); c.writerow(header); c.writerows(rows)
def p3(t,a,b,g): return g+(1-g)/(1+math.exp(-a*(t-b)))
def grm(t,a,bs):
    ps=[1.0]+[1/(1+math.exp(-a*(t-b))) for b in bs]+[0.0]
    u=random.random(); k=0
    for i in range(len(ps)-1):
        if u < ps[i]-ps[i+1]+sum(ps[j]-ps[j+1] for j in range(i)): return i
    return len(ps)-2
def r(x,n=3): return round(x,n)

# 1) CTT: raw MCQ answers + key
N,J=300,20
items=[(r(random.uniform(.8,2.0)),r(random.uniform(-1.8,1.8)),r(random.uniform(.12,.25))) for _ in range(J)]
key=[random.choice("ABCD") for _ in range(J)]
rows=[]
for i in range(N):
    t=random.gauss(0,1); row=[f"HS{i+1:03d}", random.choice(["Nam","Nu"])]
    for j,(a,b,g) in enumerate(items):
        if random.random()<p3(t,a,b,g): row.append(key[j])
        else:
            row.append("" if random.random()<0.02 else random.choice([o for o in "ABCD" if o!=key[j]]))
    rows.append(row)
w("01_ctt_tracnghiem_ABCD.csv",["ID","GioiTinh"]+[f"Cau{j+1}" for j in range(J)],rows)
w("01_ctt_dapan.csv",["Cau","DapAn"],[[f"Cau{j+1}",k] for j,k in enumerate(key)])

# 2) Dichotomous 0/1 from 3PL (mirt Rasch/2PL/3PL, CTT reliability)
N,J=1000,25
items=[(r(random.uniform(.7,2.2)),r(random.uniform(-2,2)),r(random.uniform(.1,.25))) for _ in range(J)]
rows=[[1 if random.random()<p3(t,a,b,g) else 0 for a,b,g in items] for t in (random.gauss(0,1) for _ in range(N))]
w("02_nhiphan_01.csv",[f"I{j+1:02d}" for j in range(J)],rows)
w("02_nhiphan_thamso_that.csv",["Item","a","b","c"],[[f"I{j+1:02d}",*it] for j,it in enumerate(items)])

# 3) Likert 5 points from GRM (mirt graded/gpcm, CTT alpha)
N,J=600,12
items=[]
for _ in range(J):
    a=r(random.uniform(1,2.5)); base=random.uniform(-.6,.6)
    items.append((a,[r(base+d) for d in (-2.0,-.8,.4,1.6)]))
def grm_resp(t,a,bs):
    cum=[1/(1+math.exp(-a*(t-b))) for b in bs]
    u=random.random(); return sum(1 for c in cum if u<c)
rows=[[grm_resp(t,a,bs)+1 for a,bs in items] for t in (random.gauss(0,1) for _ in range(N))]
w("03_likert_5muc.csv",[f"Q{j+1:02d}" for j in range(J)],rows)

# 4) Two-factor dichotomous (mirt multidimensional)
N=800; rows=[]
it=[(r(random.uniform(1,2)),r(random.uniform(-1.5,1.5))) for _ in range(16)]
for _ in range(N):
    z1,z2=random.gauss(0,1),random.gauss(0,1); t1=z1; t2=.4*z1+math.sqrt(1-.16)*z2
    rows.append([1 if random.random()<1/(1+math.exp(-a*((t1 if j<8 else t2)-b))) else 0 for j,(a,b) in enumerate(it)])
w("04_hai_chieu_Toan_Van.csv",[f"Toan{j+1}" for j in range(8)]+[f"Van{j+1}" for j in range(8)],rows)

# 5) DIF: two groups, items 3 and 7 favour group A
N,J=1000,15; rows=[]
it=[(r(random.uniform(.8,2)),r(random.uniform(-1.5,1.5))) for _ in range(J)]
for i in range(N):
    grp="A" if i<N//2 else "B"; t=random.gauss(0 if grp=="A" else -.3,1); row=[grp]
    for j,(a,b) in enumerate(it):
        bb=b+(.8 if grp=="B" and j in (2,6) else 0)
        row.append(1 if random.random()<1/(1+math.exp(-a*(t-bb))) else 0)
    rows.append(row)
w("05_dif_hai_nhom.csv",["Nhom"]+[f"I{j+1:02d}" for j in range(J)],rows)

# 6) irtQ mixed format: item metadata + responses
meta=[]
for j in range(15):
    meta.append([f"MC{j+1:02d}",2,"3PLM",r(random.uniform(.8,2)),r(random.uniform(-1.8,1.8)),r(random.uniform(.12,.22)),"",""])
for j in range(3):
    meta.append([f"DR{j+1}",2,"2PLM",r(random.uniform(.8,1.8)),r(random.uniform(-1,1)),"","",""])
for j in range(4):
    a=r(random.uniform(1,2)); s=random.uniform(-.5,.5)
    meta.append([f"CR{j+1}",4,"GRM",a,r(s-1.3),r(s),r(s+1.3),""])
for j in range(2):
    a=r(random.uniform(.8,1.5)); s=random.uniform(-.5,.5)
    meta.append([f"PC{j+1}",5,"GPCM",a,r(s-1.5),r(s-.4),r(s+.5),r(s+1.6)])
w("06_irtQ_thamso_item.csv",["id","cats","model","par.1","par.2","par.3","par.4","par.5"],meta)
def gpcm_resp(t,a,bs):
    z=[0.0]; s=0
    for b in bs: s+=a*(t-b); z.append(s)
    m=max(z); e=[math.exp(v-m) for v in z]; u=random.random()*sum(e); c=0
    for k,v in enumerate(e):
        c+=v
        if u<c: return k
    return len(e)-1
rows=[]
for i in range(1000):
    t=random.gauss(0,1); row=[]
    for idn,cats,mod,*p in meta:
        p=[x for x in p if x!=""]
        if mod=="3PLM": row.append(1 if random.random()<p3(t,p[0],p[1],p[2]) else 0)
        elif mod=="2PLM": row.append(1 if random.random()<p3(t,p[0],p[1],0) else 0)
        elif mod=="GRM": row.append(grm_resp(t,p[0],p[1:]))
        else: row.append(gpcm_resp(t,p[0],p[1:]))
    if random.random()<.05: row[random.randrange(len(row))]=""   # a few missing
    rows.append(row)
w("06_irtQ_traloi_hon_hop.csv",[m[0] for m in meta],rows)
