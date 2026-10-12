/* Extracted verbatim treatment/dose blocks from the user-provided UMC 2023 guide.
   Preserve page references. Always compare with the source PDF before clinical production use. */

export type ExactRegimenExtract = { id:string; sourceId:"UMC2023"; pdfPage:number; text:string };

export const umc2023RegimenExtracts: ExactRegimenExtract[] = [
  { id:"umc2023-p12-b1", sourceId:"UMC2023", pdfPage:12, text:`Kháng sinh gợi ý:                       Kháng sinh gợi ý:

Piperacillin-tazobactam 4.5g liều tải   Ampicillin-sulbactam 6g IV mỗi 8 giờ
IV trong 30 phút sau đó IV mỗi 6 giờ    trong 4 giờ
trong 4 giờ                             Hoặc
Hoặc                                    Meropenem 1-2g liều tải IV trong 30 phút
Cefepim 2g liều tải IV trong 30 phút    sau đó IV mỗi 8 giờ trong 3 giờ
sau đó IV mỗi 8 giờ trong 3-4 giờ       Hoặc
Có thể kết hợp1                         Imipenem-cilastatin 0,5-1g liều tải IV
Amikacin 15-25mg/kg IV mỗi 24 giờ       trong 30 phút sau đó IV mỗi 6-8 giờ trong
Hoặc                                    3 giờ
Gentamicin 4-6mg/kg IV mỗi 24 giờ       Kết hợp
Có thể kết hợp thêm2                    Amikacin 20-30mg/kg IV mỗi 24 giờ
Vancomycin liều tải 25-35mg/kg1 IV,     Hoặc
duy trì 15-20mg/kg IV mỗi 8–12 giờ,     Gentamicin 5-7mg/kg IV mỗi 24 giờ
                                        Hoặc` },
  { id:"umc2023-p13-b1", sourceId:"UMC2023", pdfPage:13, text:`Bệnh viện Đại học Y Dược TPHCM®
    Hướng dẫn sử dụng kháng sinh                                                    Năm 2023
điều chỉnh liều để AUC24h trong           Cân nhắc colistin liều tải theo cân nặng (4
                                                                     1

khoảng 400-600 mcg*h/mL                   x IBW (mg)), liều duy trì theo chức năng
Hoặc                                      thận chia thành mỗi 8-12 giờ
Daptomycin3 8-10mg/kg IV mỗi 24
                                              CrCL theo         Liều colistin   Liều colistin
giờ                                           Cockcroft-Gault   (mg/ngày)       (MIU/ngày)
Hoặc                                          (mL/phút)
Linezolid 600mg uống/IV mỗi 12 giờ
                                              0                          130          3,95
                                              5-<10                      145          4,40` },
  { id:"umc2023-p13-b2", sourceId:"UMC2023", pdfPage:13, text:`Có thể kết hợp thêm2
                                          Vancomycin liều tải 25-35mg/kg1 IV, duy
                                          trì 15-20mg/kg IV mỗi 8–12 giờ, điều
                                          chỉnh liều để AUC24h trong khoảng 400-
                                          600 mcg*h/mL
                                          Hoặc
                                          Daptomycin3 8-10mg/kg IV mỗi 24 giờ
                                          Hoặc
                                          Linezolid 600mg uống/IV mỗi 12 giờ
                                          1
                                            Cân nhắc dùng khi có yếu tố nhiễm` },
  { id:"umc2023-p15-b1", sourceId:"UMC2023", pdfPage:15, text:`Kháng sinh gợi ý:                          Kháng sinh gợi ý:

Ceftriaxon 2g IV mỗi 24 giờ                Piperacillin-tazobactam 4,5g liều tải IV
Hoặc                                       trong 30 phút sau đó IV mỗi 6 giờ trong 4
Ceftazidim 2g liều tải IV trong 30 phút    giờ
sau đó IV mỗi 8 giờ trong 3-4 giờ          Hoặc
Có thể kết hợp1                            Meropenem 1-2g liều tải IV trong 30 phút
Ciprofloxacin 400mg IV mỗi 8 giờ           sau đó IV mỗi 8 giờ trong 3 giờ
Hoặc                                       Hoặc
Levofloxacin 750mg IV mỗi 24 giờ           Imipenem-cilastatin 0,5-1g liều tải IV
Hoặc                                       trong 30 phút sau đó IV mỗi 6-8 giờ trong
Amikacin 15-20mg/kg IV mỗi 24 giờ          3 giờ
Hoặc                                       Có thể kết hợp1
Gentamicin 4-5mg/kg IV mỗi 24 giờ          Amikacin 15-25mg/kg IV mỗi 24 giờ
Có thể kết hợp thêm2                       Hoặc` },
  { id:"umc2023-p16-b1", sourceId:"UMC2023", pdfPage:16, text:`Bệnh viện Đại học Y Dược TPHCM®
      Hướng dẫn sử dụng kháng sinh                                           Năm 2023
Vancomycin liều tải 25-35mg/kg IV, 1
                                            Gentamicin 5-7mg/kg IV mỗi 24 giờ
duy trì 15-20mg/kg IV mỗi 8–12 giờ,         Có thể kết hợp thêm2
điều chỉnh liều để AUC24h trong khoảng      Vancomycin liều tải 25-35mg/kg1 IV, duy
400-600 mcg*h/mL                            trì 15-20mg/kg IV mỗi 8–12 giờ, điều
Hoặc                                        chỉnh liều để AUC24h trong khoảng 400-
Daptomycin3 8-10mg/kg IV mỗi 24 giờ         600 mcg*h/mL
Hoặc                                        Hoặc
Linezolid 600mg uống/IV mỗi 12 giờ          Daptomycin3 8-10mg/kg IV mỗi 24 giờ
                                            Hoặc
1
  Cân nhắc dùng khi cần mở rộng phổ         Linezolid 600mg uống/IV mỗi 12 giờ
diệt khuẩn, có sốc nhiễm khuẩn, cần
hiệu quả diệt khuẩn nhanh                   1` },
  { id:"umc2023-p19-b1", sourceId:"UMC2023", pdfPage:19, text:`Kháng sinh gợi ý:                           Kháng sinh gợi ý:
1. Viêm phổi cộng đồng                      1. Viêm phổi bệnh viện
Ceftriaxon 2g IV mỗi 24 giờ                 Ampicillin-sulbactam 6-9g IV trong 4 giờ
Hoặc                                        mỗi 8 giờ
Ceftazidim 2g liều tải1 IV trong 30 phút    Hoặc
sau đó IV mỗi 8 giờ trong 3-4 giờ           Meropenem 1-2g liều tải1 IV trong 30 phút
Hoặc                                        sau đó IV mỗi 8 giờ trong 3 giờ
Piperacillin-tazobactam 4,5g liều tải1 IV   Hoặc
trong 30 phút sau đó IV mỗi 6 giờ trong     Imipenem-cilastatin 0,5-1g liều tải1 IV trong
4 giờ                                       30 phút sau đó IV mỗi 6-8 giờ trong 3 giờ
Kết hợp                                     Hoặc
Clarithromycin 500mg IV mỗi 12 giờ          Ceftazidim/avibactam2 2.5g IV mỗi 8 giờ
Hoặc                                        trong 3 giờ
Azithromycin 500mg IV mỗi 24 giờ            Hoặc
Hoặc kết hợp                                Ceftolozan-tazobactam2 3g IV mỗi 8 giờ
Levofloxacin 750mg IV mỗi 24 giờ            trong 3 giờ
Hoặc                                        Hoặc3
Moxifloxacin 400mg IV mỗi 24 giờ            Ertapenem 1g IV mỗi 24 giờ kết hợp
Có thể kết hợp thêm2                        meropenem 2g IV mỗi 8 giờ truyền trong 3
Vancomycin liều tải 25-35mg/kg1 IV,         giờ
duy trì 15-20mg/kg IV mỗi 8–12 giờ,         Kết hợp thêm:
điều chỉnh liều để AUC24h trong khoảng      Amikacin 20-30mg/kg IV mỗi 24 giờ
                                            Hoặc
400-600 mcg*h/mL
                                            Gentamicin 5-7mg/kg IV mỗi 24 giờ
Hoặc                                        Hoặc
Linezolid 600mg uống/IV mỗi 12 giờ          Cân nhắc colistin4 liều tải theo cân nặng (4 x
Hoặc                                        IBW (mg)), liều duy trì theo chức năng thận
Teicoplanin 6mg/kg IV mỗi 12 giờ trong      chia thành mỗi 8-12 giờ, phun khí dung 1-2
3-5 liều, duy trì 6mg/kg IV mỗi 24 giờ      MIU mỗi 8 giờ
1
  Cân nhắc dùng liều tải trong trường        CrCL theo         Liều colistin   Liều colistin
hợp người bệnh nhiễm trùng nặng, sốc         Cockcroft-Gault   (mg/ngày)       (MIU/ngày)
nhiễm trùng..                                (mL/phút)
2` },
  { id:"umc2023-p19-b2", sourceId:"UMC2023", pdfPage:19, text:`40-<50                  220             6,65
2. Viêm phổi hít                             50-<60                  245             7,40
Ceftriaxon 2g IV mỗi 24 giờ kết hợp          60-<70                  275             8,35
clindamycin 600mg IV mỗi 8 giờ               70-<80                  300             9,00
Hoặc` },
  { id:"umc2023-p20-b1", sourceId:"UMC2023", pdfPage:20, text:`Bệnh viện Đại học Y Dược TPHCM®
      Hướng dẫn sử dụng kháng sinh                                         Năm 2023
Ceftazidim 2g liều tải IV trong 30 phút
                      1                         80-<90        340         10,30

sau đó IV mỗi 8 giờ trong 3-4 giờ kết           >= 90         360         10,90

hợp clindamycin 600mg IV mỗi 8 giờ
Hoặc                                        Có thể kết hợp thêm5
Piperacillin-tazobactam 4,5g liều tải1 IV   Vancomycin liều tải 25-35mg/kg1 IV, duy trì
trong 30 phút sau đó IV mỗi 6 giờ trong     15-20mg/kg IV mỗi 8–12 giờ, điều chỉnh liều
4 giờ                                       để AUC24h trong khoảng 400-600 mcg*h/mL
Có thể kết hợp thêm2
                                            Hoặc
Vancomycin liều tải 25-35mg/kg1 IV,
                                            Linezolid 600mg uống/IV mỗi 12 giờ
duy trì 15-20mg/kg IV mỗi 8–12 giờ,         Hoặc
điều chỉnh liều để AUC24h trong khoảng      Teicoplanin 12mg/kg IV mỗi 12 giờ trong 3-
400-600 mcg*h/mL                            5 liều, duy trì 12mg/kg IV mỗi 24 giờ
Hoặc
Linezolid 600mg uống/IV mỗi 12 giờ          * Theo kết quả thống kê dữ liệu vi sinh lâm
Hoặc                                        sàng tại các khoa ICU – Bệnh viện Đại học
Teicoplanin 6-12mg/kg IV mỗi 12 giờ         Y Dược TP. HCM năm 2022, 3 tác nhân gây
trong 3-5 liều, duy trì 6-12mg/kg IV mỗi    viêm phổi bệnh viện phổ biến nhất (CRE,
24 giờ                                      CRPA, CRAB) đều có tỷ lệ kháng beta-
                                            lactam như: carpapenem, piperacillin-
1
  Cân nhắc dùng liều tải trong trường       tazobactam trên 80%, gợi ý nên tránh đơn trị
hợp người bệnh nhiễm trùng nặng, sốc        các thuốc này liều thấp. Mức độ kháng của
nhiễm trùng..                               các beta-lactam này là tương tự nhau nên` },
  { id:"umc2023-p20-b2", sourceId:"UMC2023", pdfPage:20, text:`liên quan, hình ảnh x-quang gợi ý,
nhiễm cúm, chạy thận định kỳ.               1
                                              Cân nhắc dùng liều tải trong trường hợp
                                            người bệnh nhiễm trùng nặng, sốc nhiễm
                                            trùng.` },
  { id:"umc2023-p20-b3", sourceId:"UMC2023", pdfPage:20, text:`2. Viêm phổi hít
                                            Meropenem 1-2g liều tải1 IV trong 30 phút
                                            sau đó IV mỗi 8 giờ trong 3 giờ
                                            Hoặc` },
  { id:"umc2023-p21-b1", sourceId:"UMC2023", pdfPage:21, text:`Bệnh viện Đại học Y Dược TPHCM®
Hướng dẫn sử dụng kháng sinh                                              Năm 2023
                             Imipenem-cilastatin 0,5-1g liều tải1 IV trong
                             30 phút sau đó IV mỗi 6-8 giờ trong 3 giờ
                             Có thể kết hợp thêm
                             Amikacin 15-25mg/kg IV mỗi 24 giờ
                             Hoặc
                             Gentamicin 5-7mg/kg IV mỗi 24 giờ
                             Hoặc
                             Cân nhắc colistin2 liều tải theo cân nặng (4 x
                             IBW (mg)), liều duy trì theo chức năng thận
                             chia thành mỗi 8-12 giờ, phun khí dung 1-2
                             MIU mỗi 8 giờ
                                 CrCL theo         Liều colistin   Liều colistin
                                 Cockcroft-Gault   (mg/ngày)       (MIU/ngày)
                                 (mL/phút)
                                 0                       130             3,95` },
  { id:"umc2023-p21-b2", sourceId:"UMC2023", pdfPage:21, text:`Có thể kết hợp thêm3
                             Vancomycin liều tải 25-35mg/kg1 IV, duy trì
                             15-20mg/kg IV mỗi 8–12 giờ, điều chỉnh liều
                             để AUC24h trong khoảng 400-600 mcg*h/mL
                             Hoặc
                             Linezolid 600mg uống/IV mỗi 12 giờ
                             Hoặc
                             Teicoplanin 6-12mg/kg IV mỗi 12 giờ trong
                             3-5 liều, duy trì 6-12mg/kg IV mỗi 24 giờ
                             1
                               Cân nhắc dùng liều tải trong trường hợp
                             người bệnh nhiễm trùng nặng, sốc nhiễm
                             trùng.` },
  { id:"umc2023-p23-b1", sourceId:"UMC2023", pdfPage:23, text:`- Lú lẫn/mất định hướng
    - Ure máu ≥ 20mg/dl
    - Giảm bạch cầu < 4 G/L*
    - Giảm tiểu cầu < 100 G/L
    - Hạ thân nhiệt (< 36˚C)
    - Hạ huyết áp cần bù dịch tích cực` },
  { id:"umc2023-p23-b2", sourceId:"UMC2023", pdfPage:23, text:`Viêm phổi cộng đồng Viêm phổi cộng đồng nặng: Viêm phổi cộng đồng nặng,
không nặng:                 Ampicillin-sulbactam 1,5–3g nguy cơ nhiễm vi khuẩn đa
                            IV mỗi 6 giờ                     kháng:

                                         13` },
  { id:"umc2023-p24-b1", sourceId:"UMC2023", pdfPage:24, text:`Hướng dẫn sử dụng kháng sinh                                         Năm 2023
Ampicillin-sulbactam      Hoặc                          Piperacillin-tazobactam 4,5g
1,5–3g IV mỗi 6 giờ       Amoxicillin- acid clavulanic  IV QID
Hoặc                      Hoặc                          Hoặc
Amoxicillin-acid          Cefotaxim 1–2g IV mỗi 8 giờ   Cefepim 2g IV mỗi 8 giờ
clavulanic                Hoặc                          Hoặc
Hoặc                      Ceftriaxon 1–2g IV mỗi 24     Ceftazidim 2g IV mỗi 8 giờ
Cefotaxim 1–2g IV mỗi 8   giờ                           Hoặc
giờ                       Hoặc                          Imipenem 500mg IV mỗi 6
Hoặc                      Ertapenem 1g IV mỗi 24 giờ    giờ
Ceftriaxon 1–2g IV mỗi    Phối hợp với                  Hoặc
24 giờ                    Azithromycin 500mg PO mỗi     Meropenem 1g IV mỗi 8 giờ
Hoặc                      24 giờ                        Hoặc
Ertapenem 1g IV IV mỗi    Hoặc                          Ceftaroline 600mg IV mỗi 12
24 giờ                    Clarithromycin 500mg PO       giờ
Phối hợp hay không với    hoặc IV mỗi 12 giờ            Phối hợp với
Azithromycin 500mg PO     Hoặc                          Levofloxacin 750mg IV mỗi
IV mỗi 24 giờ             Ceftaroline 600mg IV mỗi 12   24 giờ
Hoặc                      giờ                           Hoặc
Clarithromycin 500mg PO   Hoặc phối hợp với             Ciprofloxacin 400mg IV mỗi
hoặc IV mỗi 12 giờ        Levofloxacin 750mg IV mỗi     8 giờ
Hoặc đơn trị              24 giờ                        Hoặc
Levofloxacin 750mg IV     Hoặc                          Amikacin 15 – 20mg/kg IV
mỗi 24 giờ                Moxifloxacin 400mg IV mỗi     mỗi 24 giờ, điều chỉnh liều
Hoặc                      24 giờ                        amikacin để nồng độ đỉnh từ
Moxifloxacin 400mg IV                                   60-80mg/L
mỗi 24 giờ                Có thể kết hợp thêm 1         Hoặc
                          Vancomycin 25-30mg/kg IV Cân nhắc colistin 1 (liều tải
Có thể kết hợp thêm 1     liều tải, liều duy trì 15- 4mg/kg IV, liều duy trì điều
Vancomycin 25-30mg/kg     20mg/kg IV mỗi 8-12 giờ, chỉnh theo chức năng thận)
                          điều chỉnh liều duy trì để
IV liều tải, liều duy trì 15-
20mg/kg IV mỗi 8-12 giờ,  nồng độ đáy vancomycin CrCL theo Liều               Liều colistin

điều chỉnh liều duy trì đểtrong khoảng 15-20mcg/mL       Cockcroft- colistin  dạng base

nồng độ đáy vancomycin    hoặc AUC24h trong khoảng từ Gault         dạng base (MUI/ngày)

trong       khoảng        15-
                          400-600 mcg*h/mL               (mL/phút)  (mg/ngày)

20mcg/mL hoặc AUC24h      Hoặc                           0          130       3,95

trong khoảng từ 400-600   Linezolid 600mg PO/IV mỗi      5-<10      145       4,40

mcg*h/mL                  12 giờ                         10-<20     160       4,85

Hoặc                      Hoặc                           20-<30     175       5,30
Linezolid 600mg PO/IV     Teicoplanin (liều tải 400mg    30-<40     195       5,90
mỗi 12 giờ                IV mỗi 12 giờ trong 1-4 ngày, 40-<50      220       6,65
Hoặc                      liều duy trì 400mg IV mỗi 24   50-<60     245       7,40
Teicoplanin       (liều tải
                          giờ)                           60-<70     275       8,35
400mg IV mỗi 12 giờ                                      70-<80 300     9,00
trong 1-4 ngày, liều duy trì 1 Cân nhắc khi bệnh nhân có 80-<90 340     10,30
400mg IV mỗi 24 giờ)          yếu tố nguy cơ nhiễm MRSA >= 90   360     10,90
                              như bệnh nhân khỏe mạnh
1` },
  { id:"umc2023-p25-b1", sourceId:"UMC2023", pdfPage:25, text:`Bệnh viện Đại học Y Dược TPHCM®
      Hướng dẫn sử dụng kháng sinh                              Năm 2023
MRSA như bệnh nhân ý, nhiễm cúm, chạy thận định   Vancomycin 25-30mg/kg IV
khỏe mạnh trước đây, phát kỳ                      liều tải, liều duy trì 15-
ban có liên quan, hình ảnh                        20mg/kg IV mỗi 8-12 giờ,
X-quang gợi ý, nhiễm                              điều chỉnh liều duy trì để
cúm, chạy thận định kỳ                            nồng độ đáy vancomycin
                                                  trong khoảng 15-20mcg/mL
                                                  hoặc AUC24h trong khoảng từ
                                                  400-600 mcg*h/mL
                                                  Hoặc
                                                  Linezolid 600mg PO/IV mỗi
                                                  12 giờ
                                                  Hoặc
                                                  Teicoplanin (liều tải 400mg
                                                  IV mỗi 12 giờ trong 1-4 ngày,
                                                  liều duy trì 400mg IV mỗi 24
                                                  giờ)
                                                  1` },
  { id:"umc2023-p26-b1", sourceId:"UMC2023", pdfPage:26, text:`-Từng nhiễm MDR, vi khuẩn MDR tần suất >
                                          25%
Piperacillin-tazobactam 4,5g IV mỗi 6 Ceftolozan-tazobactam 3g mỗi 8 giờ
giờ                                       Hoặc
Hoặc                                      Ceftazidim-avibactam 1.5g mỗi 8 giờ
Levofloxacin 750mg IV mỗi 24 giờ          Hoặc
                                          Meropenem 2g IV mỗi 8 giờ
                                          Hoặc
                                          Imipenem-cilastatin sodium: 500mg IV mỗi 6
                                          giờ hoặc 1 g IV mỗi 8 giờ
                                          Hoặc
                                          Cefoperazon-sulbactam: 4g (tính theo
                                          cefoperazon) IV mỗi 12 giờ
                                          Phối hợp với
                                          Amikacin 15 – 20mg/kg IV mỗi 24 giờ, điều
                                          chỉnh liều amikacin để nồng độ đỉnh từ 60-
                                          80mg/L
                                          Hoặc
                                          Levofloxacin 750-1000mg IV mỗi 24 giờ
                                          Hoặc
                                          Ciprofloxacin 400mg IV mỗi 8 giờ
                                          Hoặc
                                          Aztreonam 2g mỗi 8 giờ

                                          16` },
  { id:"umc2023-p27-b1", sourceId:"UMC2023", pdfPage:27, text:`Hướng dẫn sử dụng kháng sinh                                                     Năm 2023
                                       Hoặc
                                       Cefiderocol 2g mỗi 8 giờ truyền trong 3 giờ
                                       Hoặc
                                       Cân nhắc colistin 1 (liều tải 4mg/kg IV, liều duy
                                       trì điều chỉnh theo chức năng thận)
                                         CrCL theo         Liều colistin   Liều colistin
                                         Cockcroft-Gault   dạng base       dạng base
                                         (mL/phút)         (mg/ngày)       (MUI/ngày)
                                         0                       130             3,95
                                         5-<10                   145             4,40` },
  { id:"umc2023-p27-b2", sourceId:"UMC2023", pdfPage:27, text:`>= 90                   360            10,90

                                        Cân nhắc tigecyclin (liều tải 200mg IV, liều duy
                                        trì 100mg IV mỗi 12 giờ)
                                        Có thể kèm thêm ± colistin khí dung 2-4MUI
                                        mỗi 8-12 giờ.` },
  { id:"umc2023-p27-b3", sourceId:"UMC2023", pdfPage:27, text:`bệnh nhiễm khuẩn nặng có nguy cơ tử vong >20%  thêm kháng sinh Gram dương
linezolid tốt hơn vancomycin
Vancomycin 25-30mg/kg IV liều tải, liều duy trì 15mg/kg IV mỗi 8-12 giờ, điều chỉnh
liều duy trì để nồng độ đáy vancomycin trong khoảng 15-20mcg/mL hoặc AUC24h trong
khoảng từ 400-600 mcg*h/mL
Hoặc
Linezolid 600mg PO/IV mỗi 12 giờ
Hoặc
Teicoplanin 6-12mg/kg IV mỗi 12 giờ trong 3-5 liều, duy trì 6-12mg/kg IV mỗi 24 giờ
Hoặc
Ceftaroline* 600mg mỗi 12 giờ
Hoặc
Ceftobiprole* 500mg mỗi 8 giờ
*chưa được lưu hành tại Việt Nam` },
  { id:"umc2023-p28-b1", sourceId:"UMC2023", pdfPage:28, text:`aminoglycosid, tigecyclin hoặc fosfomycin hoặc trong trường hợp không có BLBLI
      mới, chúng tôi đề xuất điều trị bằng nhiều hơn một thuốc nhạy. Meropenem
      truyền kéo dài liều cao có thể được sử dụng như một phần của liệu pháp phối hợp
      nếu không sử dụng BLBLI mới và MIC của meropenem là ≤ 8mg/L; nếu nhiễm
      trùng không nặng, sử dụng một loại kháng sinh cũ, còn nhạy, có phân bố tốt đến` },
  { id:"umc2023-p28-b2", sourceId:"UMC2023", pdfPage:28, text:`sulbactam).
    Đối với những bệnh nhân bị nhiễm CRAB với MIC meropenem 8mg/L, chúng tôi
      xem xét liệu pháp phối hợp carbapenem, sử dụng liều cao carbapenem truyền kéo
      dài, như một thực hành lâm sàng tốt
    Đối với tất cả bệnh nhân bị nhiễm CRAB, chúng tôi không khuyến nghị liệu pháp` },
  { id:"umc2023-p29-b1", sourceId:"UMC2023", pdfPage:29, text:`nhắc đến nhưng do không đặc hiệu và tần suất thấp nên không thể dựa vào nguy cơ này
thêm kháng sinh bao phủ: được điều trị bằng cephalosporin phổ rộng, carbapenem,
aminoglycosid hoặc colistin gần đây; sử dụng ống thông nội mạch hoặc các đường truyền
tĩnh mạch trung tâm bên trong hoặc các thiết bị không xâm lấn khác (ví dụ: máy tạo độ
ẩm); có các bệnh đồng mắc tiềm ẩn của bệnh ác tính hoặc đái tháo đường ở người lớn tuổi;
điều kiện ức chế miễn dịch, hóa trị liệu gần đây hoặc giảm bạch cầu trung tính bất kể tuổi` },
  { id:"umc2023-p33-b1", sourceId:"UMC2023", pdfPage:33, text:`Hướng dẫn sử dụng kháng sinh                                          Năm 2023
Kháng sinh gợi ý:                           Kháng sinh gợi ý:
Piperacillin-tazobactam 4,5g liều tải1      Meropenem 1-2g liều tải1 IV trong 30 phút
IV trong 30 phút sau đó IV mỗi 6 giờ        sau đó IV mỗi 8 giờ trong 3 giờ
trong 4 giờ                                 Hoặc
Hoặc                                        Imipenem-cilastatin 0,5-1g liều tải1 IV
Ertapenem 1g IV mỗi 24 giờ                  trong 30 phút sau đó IV mỗi 6-8 giờ trong 3
                                            giờ
Có thể kết hợp thêm2                        Hoặc
Amikacin3 15-20mg/kg IV mỗi 24 giờ          Fosfomycin 6g IV mỗi 6-8 giờ trong 4 giờ
Hoặc                                        Kết hợp thêm
Gentamicin3 4-5mg/kg IV mỗi 24 giờ          Amikacin2 15-25mg/kg IV mỗi 24 giờ
                                            Hoặc
1
  Cân nhắc dùng liều tải trong trường       Gentamicin2 5-7mg/kg IV mỗi 24 giờ
hợp người bệnh nhiễm trùng nặng, sốc
nhiễm trùng..                               1
                                              Cân nhắc dùng liều tải trong trường hợp
2
  Cân nhắc khi cần mở rộng phổ diệt         người bệnh nhiễm trùng nặng, sốc nhiễm` },
  { id:"umc2023-p35-b1", sourceId:"UMC2023", pdfPage:35, text:`1. Khuẩn niệu không triệu chứng                  4. Nhiễm khuẩn niệu phức tạp
Tiêu chuẩn chẩn đoán:                            Thời gian điều trị kháng sinh 7-14 ngày
Khuẩn niệu không triệu chứng được xác định            Ertapenem 1g IV mỗi 24 giờ ±
trên người bệnh không có triệu chứng trên                Aminoglycosid
đường tiết niệu và thỏa điều kiện sau:                   (Amikacin 15mg/kg IV mỗi 24 giờ
      Ở nữ giới: Có 02 mẫu cấy nước tiểu                hoặc gentamicin 5mg/kg IV mỗi
        liên tiếp dương tính (tối ưu trong vòng          24 giờ)
        2 tuần) với số lượng khóm vi khuẩn ≥          Xét ngưng sớm sau 48-72h nếu có` },
  { id:"umc2023-p35-b2", sourceId:"UMC2023", pdfPage:35, text:`khuẩn ≥ 10^5 CFU/ml.                     + tình trạng bệnh nặng hoặc nhiễm
Khuẩn niệu không triệu chứng có chỉ định khuẩn Pseudomonas trước đó
điều trị trong các trường hợp:                        Imipenem-cilastatin 0,5g IV mỗi 6
a. Phụ nữ có thai (PNCT):                                giờ
                                                      Meropenem 1g IV mỗi 8 giờ
      Lựa chọn kháng sinh: Dựa trên bằng
                                                 5. Nhiễm khuẩn huyết từ đường niệu` },
  { id:"umc2023-p35-b3", sourceId:"UMC2023", pdfPage:35, text:`kháng sinh: nhóm beta-lactam,
                                                 sàng chậm
        fosfomycin      (PO),     nitrofurantoin
                                                      Amikacin 15mg/kg IV mỗi 24 giờ
        (không dùng cho người bệnh có tiền
        căn thiếu men G6PD, người bệnh ở              Gentamicin 5mg/kg IV mỗi 24 giờ
        giai     đoạn     cuối      thai    kỳ),      Một trong các kháng sinh dưới đây
        sulfamethoxazol-trimethroprim                   ± Aminoglycosid (Amikacin
        (không dùng cho người bệnh ở tam cá             15mg/kg IV mỗi 24 giờ hoặc
        nguyệt thứ nhất). Lưu ý cần lựa chọn            gentamicin 5mg/kg IV mỗi 24 giờ)
        kháng sinh dựa trên kết quả nhạy cảm            o   Ertapenem 1g IV mỗi 24 giờ
        từ kháng sinh đồ.                               o Piperacillin-tazobactam 4,5g
      Thời gian điều trị: 2 – 7 ngày.                      IV mỗi 8 giờ
                                                        o Cefepim 2g IV mỗi 12 giờ
b. Trước một số thủ thuật/phẫu thuật đường
                                                       Nếu có nguy cơ nhiễm khuẩn đa
tiết niệu:
                                                       kháng
      Lựa chọn kháng sinh điều trị dựa trên            o Imipenem-cilastatin 0,5g IV
        kết quả kháng sinh đồ của mẫu nước                  mỗi 6 giờ
        tiểu phân lập được vi khuẩn.                    o   Meropenem 1g IV mỗi 8 giờ
      Thời gian điều trị: 5 – 7 ngày trước
        phẫu thuật/thủ thuật.` },
  { id:"umc2023-p36-b1", sourceId:"UMC2023", pdfPage:36, text:`2. Viêm bàng quang không phức tạp
Ở nữ
     Fosfomycin calcium 1g PO mỗi 8 giờ,
      thời gian điều trị: 2 ngày hoặc theo tình
      trạng viêm bàng quang của người bệnh
     Nitrofurantoin macrocrystal, 50-
      100mg PO mỗi 6 giờ, 5 ngày
     Nitrofurantoin monohydrat 100mg PO
      mỗi 12 giờ, 5 ngày
Kháng sinh thay thế (lưu ý E.coli nhạy cảm
các kháng sinh này <30% năm 2022):
    Cefadroxil 500mg PO mỗi 12 giờ, 5-7
      ngày hoặc
    Cefixim 400mg PO mỗi 24 giờ, 7
      ngày hoặc
    Cefpodoxim 100mg PO mỗi 12 giờ, 5-
      7 ngày hoặc` },
  { id:"umc2023-p37-b1", sourceId:"UMC2023", pdfPage:37, text:`Bệnh viện Đại học Y Dược TPHCM®
       Hướng dẫn sử dụng kháng sinh               Năm 2023
    Cefdinir 300mg PO mỗi 12 giờ, 5-7
       ngày hoặc
    Sulfamethoxazol-trimethroprim
       160/800mg PO mỗi 12 giờ, 3 ngày
       hoặc
    Ciprofloxacin 250mg PO mỗi 12 giờ,
       3 ngày hoặc
    Levofloxacin 250mg PO mỗi 24 giờ, 3
       ngày
Ở nam` },
  { id:"umc2023-p37-b2", sourceId:"UMC2023", pdfPage:37, text:`bàng quang không phức tạp ở nam:
     Sulfamethoxazol-trimethroprim
        160/800mg PO mỗi 12 giờ, 7 ngày
Kháng sinh thay thế:
    Cefadroxil 1 g PO mỗi 12 giờ, 10-14
       ngày hoặc
    Cefixim 400mg PO mỗi 24 giờ, 10-
       14 ngày hoặc
    Cefpodoxim 200mg PO mỗi 12 giờ,
       10-14 ngày
    Cefdinir 300mg PO mỗi 12 giờ, 10-14
       ngày hoặc
     Ciprofloxacin 500mg PO mỗi 12 giờ,
        5-7 ngày hoặc
     Levofloxacin 750mg PO mỗi 24 giờ,
        5-7 ngày
3. Viêm bể thận, thận không phức tạp
Kháng sinh đường tĩnh mạch
Có thể chuyển từ kháng sinh đường tiêm sang
đường uống nếu đáp ứng lâm sàng tốt, tổng
thời gian điều trị kháng sinh: ở nữ: 7-10 ngày,
ở nam: ít nhất 14 ngày
     Ertapenem 1g IV mỗi 24 giờ
     Piperacillin-tazobactam 2,5-4,5g IV
        mỗi 8 giờ
     Cefepim 1-2g IV mỗi 12 giờ
     Amikacin 15mg/kg IV mỗi 24 giờ
     Gentamicin 5mg/kg IV mỗi 24 giờ
 Kháng sinh thay thế (lưu ý E.coli nhạy cảm
 các kháng sinh này < 30% năm 2022):
    Cefotaxim 2g IV mỗi 8 giờ hoặc
    Ceftriaxon 1-2g IV mỗi 24 giờ hoặc
    Ciprofloxacin 400mg IV mỗi 12 giờ
       hoặc` },
  { id:"umc2023-p38-b1", sourceId:"UMC2023", pdfPage:38, text:`Bệnh viện Đại học Y Dược TPHCM®
       Hướng dẫn sử dụng kháng sinh                                          Năm 2023
    Levofloxacin 750mg IV mỗi 24 giờ
Nếu có nguy cơ nhiễm khuẩn đa kháng
    Imipenem-cilastatin 0,5g IV mỗi 6 giờ
    Meropenem 1g IV mỗi 8 giờ

Tài liệu tham khảo` },
  { id:"umc2023-p38-b2", sourceId:"UMC2023", pdfPage:38, text:`of Asymptomatic Bacteriuria: 2019 Update by the Infectious Diseases Society of
      America. Clin Infect Dis. 2019;68(10):e83-e110.
   3. G. Bonkat, R. Bartoletti, F. Bruyère, et al. EAU Guidelines on Urological Infections.
      European Association of Urology. 2023. https://uroweb.org/guidelines/urological-
      infections.` },
  { id:"umc2023-p40-b1", sourceId:"UMC2023", pdfPage:40, text:`Kháng sinh gợi ý:                            Kháng sinh gợi ý:

Piperacillin-tazobactam 4,5g liều tải1 IV    Meropenem 1-2g liều tải1 IV trong 30 phút
trong 30 phút sau đó IV mỗi 6 giờ trong 4    sau đó IV mỗi 8 giờ trong 3 giờ
giờ                                          Hoặc
Hoặc                                         Imipenem-cilastatin 0,5-1g liều tải1 IV
Cefepim 2g liều tải1 IV trong 30 phút sau    trong 30 phút sau đó IV mỗi 6-8 giờ trong
đó IV mỗi 8-12 giờ trong 3-4 giờ kết hợp     3 giờ
metronidazol 500mg IV mỗi 8 giờ              Hoặc
Hoặc                                         Doripenem 0,5-1g liều tải1 IV trong 30
Ertapenem 1g IV mỗi 24 giờ                   phút sau đó IV mỗi 8 giờ trong 3-4 giờ` },
  { id:"umc2023-p41-b1", sourceId:"UMC2023", pdfPage:41, text:`Hoặc        2

Meropenem 1-2g liều tải1 IV trong 30 phút     Ceftolozan-tazobactam2 1,5-3g IV mỗi 8
sau đó IV mỗi 8 giờ trong 3 giờ               giờ trong 3 giờ kết hợp metronidazol
Hoặc2                                         500mg IV mỗi 8 giờ
Imipenem-cilastatin 0,5-1g liều tải1 IV       Hoặc
trong 30 phút sau đó IV mỗi 6-8 giờ trong     Ceftazidim-avibactam2 2.5g IV mỗi 8 giờ
3 giờ                                         trong 3 giờ kết hợp metronidazol 500mg IV
Có thể cân nhắc thêm1                         mỗi 8 giờ
Amikacin2 15-20mg/kg IV mỗi 24 giờ            Hoặc3
Hoặc                                          Ertapenem 1g IV mỗi 24 giờ kết hợp
Gentamicin2 4-5mg/kg IV mỗi 24 giờ            meropenem 2g IV mỗi 8 giờ truyền trong 3
Có thể kết hợp thêm3                          giờ
Vancomycin liều tải 25-35mg/kg1 IV, duy       Kết hợp thêm
trì 15-20mg/kg IV mỗi 8–12 giờ, điều          Amikacin 15-25mg/kg IV mỗi 24 giờ
chỉnh liều để AUC24h trong khoảng 400-        Hoặc
                                              Gentamicin 5-7mg/kg IV mỗi 24 giờ
600 mcg*h/mL
                                              Hoặc
Hoặc                                          Tigecyclin4 200-400mg liều tải IV, sau đó
Linezolid 600mg uống/IV mỗi 12 giờ            100-200mg mỗi 12-24 giờ
Hoặc                                          Hoặc
Teicoplanin 6-12mg/kg IV mỗi 12 giờ           Colistin liều tải theo cân nặng (4 x IBW
trong 3-5 liều, duy trì 6-12mg/kg IV mỗi      (mg)), liều duy trì theo chức năng thận chia
24 giờ                                        thành mỗi 8-12 giờ, phun khí dung 1-2
                                              MIU mỗi 8 giờ
1
  Cân nhắc dùng liều tải trong trường hợp
người bệnh nhiễm trùng nặng, sốc nhiễm            CrCL theo         Liều colistin   Liều colistin
trùng..                                           Cockcroft-Gault   (mg/ngày)       (MIU/ngày)
2
  Cân nhắc khi sốc nhiễm trùng, nguy cơ đa        (mL/phút)` },
  { id:"umc2023-p41-b2", sourceId:"UMC2023", pdfPage:41, text:`Có thể kết hợp thêm5
                                              Vancomycin liều tải 25-35mg/kg1 IV, duy
                                              trì 15-20mg/kg IV mỗi 8–12 giờ, điều
                                              chỉnh liều để AUC24h trong khoảng 400-
                                              600 mcg*h/mL
                                              Hoặc
                                              Linezolid 600mg uống/IV mỗi 12 giờ

                                             31` },
  { id:"umc2023-p42-b1", sourceId:"UMC2023", pdfPage:42, text:`Hướng dẫn sử dụng kháng sinh                                         Năm 2023
                                             Hoặc
                                             Teicoplanin 12mg/kg IV mỗi 12 giờ trong
                                             3-5 liều, duy trì 12mg/kg IV mỗi 24 giờ

                                             * Các tác nhân nhiễm khuẩn ổ bụng bệnh` },
  { id:"umc2023-p42-b2", sourceId:"UMC2023", pdfPage:42, text:`trị.
                                             1
                                               Cân nhắc dùng liều tải trong trường hợp
                                             người bệnh nhiễm trùng nặng, sốc nhiễm
                                             trùng.` },
  { id:"umc2023-p43-b1", sourceId:"UMC2023", pdfPage:43, text:`- Có điều trị ngắn hạn tại các cơ sở y tế
                                                trong vòng 30 ngày trước đó.
                                            - Có điều trị bằng đường tĩnh mạch,
                                                chăm sóc vết thương hoặc điều trị thay
                                                thế thận trong vòng 30 ngày trước đó.` },
  { id:"umc2023-p44-b1", sourceId:"UMC2023", pdfPage:44, text:`nguy cơ thấp
Kháng sinh gợi ý     Kháng sinh gợi ý         Kháng sinh gợi ý:
Ertapenem 1g IV      Piperacillin-            Imipenem-cilastatin 500mg IV mỗi 6 giờ
mỗi 24 giờ           tazobactam 4,5g IV       hoặc 1g IV mỗi 8 giờ
Hoặc                 mỗi 6 giờ                Hoặc
Cefoperazon-         Hoặc                     Meropenem 1g IV mỗi 8 giờ  ampicillin
sulbactam 2-4g       Imipenem-cilastatin      2g IV mỗi 4-6 giờ
IV mỗi 12 giờ        0,5g IV mỗi 6 giờ        Hoặc
Điều trị thay thế    hoặc 1g IV mỗi 8 giờ     Doripenem* 0,5g IV mỗi 8 giờ 
                                              ampicillin 2g IV mỗi 4-6 giờ
(dị ứng với beta-    Hoặc
                                              Hoặc
lactam)              Meropenem 1g IV          Piperacillin-tazobactam 4,5g IV mỗi 6 giờ
Ciprofloxacin        mỗi 8 giờ                + tigecyclin liều tải 100mg IV, duy trì
400mg IV mỗi 12      Hoặc                     50mg IV mỗi 12 giờ
giờ/ 500mg PO        Doripenem 0,5g IV        Điều trị kết hợp
mỗi 12 giờ +         mỗi 8 giờ                   a. Điều trị Enterococcus spp.
metronidazol         Lưu ý:                   Đối tượng nguy cơ: nhiễm khuẩn hậu
500mg      IV/PO     - Lựa chọn kháng sinh    phẫu, điều trị kháng sinh phổ rộng trong
mỗi 8 giờ            ban đầu có phổ kháng     thời gian gần đây, dấu hiệu nhiễm khuẩn
Hoặc                 khuẩn rộng, đảm bảo      huyết nặng hoặc sốc nhiễm khuẩn, có VRE
Moxifloxacin         phủ những chủng          thường trú.
400mg      PO/IV     gram âm ít phổ biến.     Vancomycin 15–20mg/kg IV mỗi 8 – 12
mỗi 24 giờ đơn trị   - Không kết hợp          giờ, điều chỉnh liều để nồng độ đáy
Hoặc                 aminoglycosid hoặc       vancomycin trong khoảng 10-15mcg/mL
Levofloxacin         fluoroquinolon     với   hoặc AUC24h trong khoảng từ 400-600
750mg      PO/IV     beta-lactam trong điều   mcg*h/mL
mỗi 24 giờ +         trị ban đầu ở bệnh       Hoặc
metronidazol         nhân nguy cơ cao.        Teicoplanin liều tải 6mg/kg IV mỗi 12 giờ
500mg IV mỗi 8       - Cân nhắc kết hợp       cho 3 liều duy trì 6mg/kg IV mỗi 24 giờ.
giờ.                 ampicillin       hoặc    Nếu bệnh nhân có nguy cơ cao nhiễm
Lưu ý:               vancomycin điều trị      VRE hoặc có VRE thường trú:
- Lựa chọn kháng     Enterococcus ban đầu     Linezolid 600mg PO/IV mỗi 12 giờ
sinh ban đầu có      ở bệnh nhân nguy cơ` },
  { id:"umc2023-p45-b1", sourceId:"UMC2023", pdfPage:45, text:`ae, Streptococci    imipenem-cilastatin.       thuật, sử dụng kháng sinh trong thời gian
và kỵ khí.          - Không sử dụng            gần đây, có MRSA thường trú.
- Không sử dụng     kháng nấm thường           Vancomycin 15-20mg/kg IV mỗi 8 – 12
thường quy kháng    quy cho điều trị ban       giờ, điều chỉnh liều để nồng độ đáy
sinh phổ rộng,      đầu ở bệnh nhân nguy       vancomycin trong khoảng 10-15mcg/mL
kháng sinh phủ                                 hoặc AUC24h trong khoảng từ 400-600
                    cơ cao. Xem xét sử
Pseudomonas,                                   mcg*h/mL
Enterococcus        dụng thuốc kháng           Hoặc
hoặc kháng nấm.     nấm ở bệnh nhân nặng       Teicoplanin liều tải 6mg/kg IV mỗi 12 giờ
                    với nguồn từ đường         cho 3 liều duy trì 6mg/kg IV mỗi 24 giờ
                    tiêu hóa trên.             Hoặc
                                               Linezolid 600mg PO/IV mỗi 12 giờ
                                                   c. Điều trị vi khuẩn gram âm kháng
                                                       thuốc` },
  { id:"umc2023-p45-b2", sourceId:"UMC2023", pdfPage:45, text:`- Nghi ngờ nhiễm Enterobacteriaceae tiết
                                               ESBL hoặc AmpC β-lactamase:
                                               Imipenem-cilastatin 0,5g IV mỗi 6 giờ
                                               hoặc 1g IV mỗi 8 giờ
                                               Hoặc
                                               Meropenem 1-2g IV mỗi 8 giờ
                                               Hoặc
                                               Doripenem 0,5g IV mỗi 8 giờ
                                               - Nghi ngờ nhiễm Enterobacteriaceae
                                               kháng carbapenem:
                                               Ceftazidim-avibactam 2,5g IV mỗi 8 giờ
                                               (truyền trên 3 giờ) đơn trị.
                                               Hoặc
                                               Imipenem-cilastatin 500mg IV mỗi 6 giờ
                                               hoặc 1g IV mỗi 8 giờ
                                               Hoặc
                                               Meropenem 2g IV mỗi 8 giờ (truyền trên
                                               3 giờ)
                                               Kết hợp
                                               Aminoglycosid
                                               (Amikacin 15-20mg/kg IV mỗi 24 giờ
                                               Hoặc` },
  { id:"umc2023-p46-b1", sourceId:"UMC2023", pdfPage:46, text:`Bệnh viện Đại học Y Dược TPHCM®
Hướng dẫn sử dụng kháng sinh                                                    Năm 2023
                              Gentamicin 5-7mg/kg mỗi 24 giờ Hoặc
                              Netilmicin ** 3-7mg/kg IV mỗi 24 giờ
                              Hoặc
                              Tobramycin ** 5mg/kg mỗi 24 giờ)2
                              Hoặc
                              Colistin (liều tải 4mg/kg IV, liều duy trì
                              điều chỉnh theo chức năng thận)
                                  CrCL        theo   Liều    colistin   Liều colistin
                                  Cockcroft-Gault    (mg/ngày)          (MUI/ngày)
                                  (mL/phút)
                                  0                  130                3,95` },
  { id:"umc2023-p46-b2", sourceId:"UMC2023", pdfPage:46, text:`Hoặc
                              Tigecyclin 200mg IV liều tải, liều duy trì
                              100mg mỗi 12 giờ
                              - Nghi ngờ nhiễm Pseudomonas
                              aeruginosa đa kháng (MDR), kháng diện
                              rộng (XDR) hoặc toàn kháng (PDR)
                              Ceftazidim-avibactam 2,5g IV mỗi 8 giờ
                              (truyền trên 3 giờ)
                              Hoặc
                              Ceftolozan-tazobactam* 3g IV mỗi 8 giờ
                              (truyền trên 3 giờ)
                              Kết hợp
                              Aminoglycosid
                              (Amikacin 15mg/kg IV mỗi 24 giờ Hoặc
                              Gentamicin 5-7mg/kg mỗi 24 giờ Hoặc
                              Netilmicin ** 3-7mg/kg IV mỗi 24 giờ
                              Hoặc
                              Tobramycin ** 5mg/kg mỗi 24 giờ)2
                              Hoặc
                              Colistin (liều tải 4mg/kg IV, liều duy trì
                              điều chỉnh theo chức năng thận)` },
  { id:"umc2023-p47-b1", sourceId:"UMC2023", pdfPage:47, text:`Hướng dẫn sử dụng kháng sinh                                                    Năm 2023
                                  CrCL        theo   Liều    colistin   Liều colistin
                                  Cockcroft-Gault    (mg/ngày)          (MUI/ngày)
                                  (mL/phút)
                                  0                  130                3,95` },
  { id:"umc2023-p47-b2", sourceId:"UMC2023", pdfPage:47, text:`hoặc toàn kháng (PDR)
                              Ampicilin-sulbactam 9g (6g ampicillin, 3g
                              sulbactam) IV mỗi 8 giờ + colistin (liều
                              tải 4mg/kg IV, liều duy trì điều chỉnh theo
                              chức năng thận)
                                  CrCL        theo   Liều    colistin   Liều colistin
                                  Cockcroft-Gault    (mg/ngày)          (MUI/ngày)
                                  (mL/phút)
                                  0                  130                3,95` },
  { id:"umc2023-p47-b3", sourceId:"UMC2023", pdfPage:47, text:`Hoặc
                              Ampicilin-sulbactam 9g (6g ampicillin, 3g
                              sulbactam) IV mỗi 8 giờ + minocyclin
                              200mg PO mỗi 12 giờ (hoặc thay thế
                              tigecyclin 200mg IV liều tải, liều duy trì
                              100mg mỗi 12 giờ.` },
  { id:"umc2023-p48-b1", sourceId:"UMC2023", pdfPage:48, text:`rộng kéo dài và có Candida spp. thường
                                     trú, đáp ứng kém với điều trị kháng sinh.
                                       - Nhẹ: fluconazol liều tải 800mg IV/PO
                                          vào ngày đầu, duy trì 400mg IV/PO
                                          mỗi 24 giờ
                                       - Nặng: caspofungin liều tải 70mg IV
                                          vào ngày đầu, duy trì 50mg IV mỗi 24
                                          giờ hoặc micafungin* liều 100mg IV
                                          mỗi 24 giờ hoặc anidulafungin* liều
                                          tải 200mg IV vào ngày đầu, duy trì
                                          100mg IV mỗi 24 giờ hoặc
                                          amphotericin B phức hợp lipid 3-
                                          5mg/kg IV mỗi 24 giờ.
                                       - Candida         kháng       fluconazol:
                                          caspofungin,           anidulafungin*,` },
  { id:"umc2023-p50-b1", sourceId:"UMC2023", pdfPage:50, text:`-   Có điều trị ngắn hạn tại các cơ sở y tế trong
                                             vòng 30 ngày trước đó.
                                         -   Có điều trị bằng đường tĩnh mạch, chăm sóc
                                             vết thương hoặc điều trị thay thế thận trong
                                             vòng 30 ngày trước đó.` },
  { id:"umc2023-p51-b1", sourceId:"UMC2023", pdfPage:51, text:`Mức độ I          Mức độ II                Mức độ III      Kháng sinh gợi ý
Kháng sinh gợi    Kháng sinh gợi ý         Kháng sinh      Piperacillin-tazobactam 4,5g
ý                 Piperacillin-            gợi ý           IV mỗi 6-8 giờ
Cefoperazon-      tazobactam 4,5g IV       Piperacillin-   Hoặc
sulbactam 2-4g    mỗi 6-8 giờ              tazobactam      Imipenem-cilastatin 500mg IV
IV mỗi 12 giờ     Hoặc                     4,5g IV mỗi     mỗi 6 giờ hoặc 1g IV mỗi 8
Hoặc              Cefoperazon-             6-8 giờ         giờ
Ertapenem 1g IV   sulbactam 2-4g IV        Hoặc            Hoặc
mỗi 24 giờ        mỗi 12 giờ               Imipenem-       Meropenem 1g IV mỗi 8 giờ
                  Hoặc                     cilastatin      Hoặc
                  Ertapenem 1g IV          500mg IV        Ertapenem 1g IV mỗi 24 giờ
                  mỗi 24 giờ               mỗi 6 giờ       Hoặc
                                           hoặc 1g IV      Doripenem 500mg IV mỗi 8
                                                           giờ
                                           mỗi 8 giờ
                                           Hoặc
                                           Meropenem
                                           1g IV mỗi 8
                                           giờ
                                           Hoặc` },
  { id:"umc2023-p52-b1", sourceId:"UMC2023", pdfPage:52, text:`Hướng dẫn sử dụng kháng sinh                                    Năm 2023
                                    Ertapenem
                                    1g IV mỗi 24
                                    giờ
                                    Hoặc
                                    Doripenem
                                    500mg IV
                                    mỗi 8 giờ
Điều trị thay thế (dị ứng với beta- Lưu ý:
lactam)                             - Đối với viêm đường mật và viêm túi mật cộng
Ciprofloxacin 400mg IV mỗi 12 giờ/  đồng mức độ III hoặc các nhiễm khuẩn hệ mật
500mg PO mỗi 12 giờ + metronidazol liên quan đến chăm sóc y tế, khuyến cáo sử
500mg IV/PO mỗi 8 giờ               dụng vancomycin 15-20mg/kg IV mỗi 8-12 giờ
Hoặc                                để bao phủ Enterococcus spp.
Moxifloxacin 400mg PO/ IV mỗi 24    - Nếu trước đó đã điều trị với vancomycin và
giờ                                 cấy ra Enterococcus kháng vancomycin (VRE),
Hoặc                                khuyến cáo sử dụng linezolid 600mg PO/IV
Levofloxacin 750mg PO/IV mỗi 24 giờ mỗi 12 giờ.
+ metronidazol 500mg IV mỗi 8 giờ   - Đối với nhiễm khuẩn liên quan đến chăm sóc
                                    y tế, cân nhắc sử dụng kháng sinh có hoạt tính
                                    trên Pseudomonas aeruginosa như meropenem` },
  { id:"umc2023-p52-b2", sourceId:"UMC2023", pdfPage:52, text:`kháng sinh đồ.

- Đối với nhiễm khuẩn hệ mật mức độ I và II, khi NB có thể ăn uống, cân nhắc chuyển
sang kháng sinh uống:
Amoxicillin- acid clavulanic 1g PO mỗi 8 giờ
Hoặc
Ciprofloxacin 500mg PO mỗi 12 giờ ± metronidazol 500mg PO mỗi 8 giờ
Hoặc
Moxifloxacin 400mg PO mỗi 24 giờ` },
  { id:"umc2023-p53-b1", sourceId:"UMC2023", pdfPage:53, text:`Hướng dẫn sử dụng kháng sinh                                      Năm 2023
Hoặc
Levofloxacin 750mg PO mỗi 24 giờ ± metronidazol 500mg PO mỗi 8 giờ

- Nếu tác nhân gây bệnh là vi khuẩn gram âm sinh men ESBL hoặc AmpC β-lactamase,` },
  { id:"umc2023-p53-b2", sourceId:"UMC2023", pdfPage:53, text:`MIC của kháng sinh, gen kháng thuốc của vi khuẩn và lâm sàng người bệnh mà có thể
sử dụng liệu pháp kháng sinh sau:
Ceftazidim-avibactam 2,5g IV mỗi 8 giờ đơn trị
Hoặc
Phối hợp ít nhất 2 lựa chọn kháng sinh sau:
Colistin (liều tải 4mg/kg IV (theo cân nặng lý tưởng), liều duy trì điều chỉnh theo chức
năng thận):
 CrCL theo         Liều colistin   Liều colistin
 Cockcroft-Gault   (mg/ngày)       (MUI/ngày)
 (mL/phút)
 0                       130             3,95` },
  { id:"umc2023-p53-b3", sourceId:"UMC2023", pdfPage:53, text:`Hoặc
Aminoglycosid1 (Amikacin 15-20mg/kg IV mỗi 24 giờ hoặc gentamicin 5-7mg/kg IV
mỗi 24 giờ)
Hoặc
Carbapenem liều cao (Meropenem 2g IV mỗi 8 giờ truyền kéo dài ± Ertapenem 1g IV
mỗi 24 giờ dùng trước meropenem)
Hoặc
Tigecyclin 200mg IV liều tải, liều duy trì 100mg IV mỗi 12 giờ hoặc 200mg IV mỗi 24
giờ
Hoặc
Fosfomycin 12-24g IV, mỗi liều không quá 8g, chia thành mỗi 8-12 giờ

- Nếu tác nhân gây bệnh là Enterococcus spp. hoặc Streptococcus spp. hoặc
Staphylococcus spp., sử dụng:
Vancomycin2 15-20mg/kg IV mỗi 8-12 giờ, điều chỉnh liều để AUC24h 400-600mg*h/L
Hoặc` },
  { id:"umc2023-p54-b1", sourceId:"UMC2023", pdfPage:54, text:`Bệnh viện Đại học Y Dược TPHCM®
        Hướng dẫn sử dụng kháng sinh                                            Năm 2023
Teicoplanin liều tải 6mg/kg IV mỗi 12 giờ cho 3 liều, duy trì 6mg/kg IV mỗi 24 giờ
Hoặc
Linezolid 600mg IV/PO mỗi 12 giờ

- Nếu tác nhân gây bệnh là Candida spp., sử dụng:
Caspofungin 70mg IV liều tải, liều duy trì 50mg IV mỗi 24 giờ
Hoặc
Micafungin 100mg IV mỗi 24 giờ
Hoặc
Fluconazol 12mg/kg IV/PO liều tải, liều duy trì 6mg/kg IV/PO mỗi 24 giờ
Hoặc
Amphotericin B phức hợp lipid 3-5mg/kg IV mỗi 24 giờ

Lưu ý:` },
  { id:"umc2023-p59-b1", sourceId:"UMC2023", pdfPage:59, text:`1. Viêm mô tế bào                             1. Viêm mô tế bào
Vancomycin liều tải 25-35mg/kg1 IV, duy       Vancomycin liều tải 25-35mg/kg1 IV,
trì 15-20mg/kg IV mỗi 8–12 giờ, điều          duy trì 15-20mg/kg IV mỗi 8–12 giờ,
chỉnh liều để AUC24h trong khoảng 400-        điều chỉnh liều để AUC24h trong khoảng
600mcg*h/mL                                   400-600 mcg*h/mL
Hoặc                                          Hoặc
Linezolid 600mg uống/IV mỗi 12 giờ            Linezolid 600mg uống/IV mỗi 12 giờ
Hoặc                                          Hoặc
Teicoplanin 6mg/kg IV mỗi 12 giờ trong        Teicoplanin 6-12mg/kg IV mỗi 12 giờ
3-5 liều, duy trì 6mg/kg IV mỗi 24 giờ        trong 3-5 liều, duy trì 6mg/kg IV mỗi
Hoặc                                          24 giờ
Daptomycin 4-6mg/kg hoặc 8-10mg/kg1           Hoặc
IV mỗi 24 giờ                                 Daptomycin 4-6mg/kg hoặc 8-
Có thể kết hợp thêm2:                         10mg/kg1 IV mỗi 24 giờ
Piperacillin-tazobactam 4,5g liều tải1 IV     Có thể kết hợp thêm2:
trong 30 phút sau đó IV mỗi 6 giờ trong 4     Meropenem 1-2g liều tải1 IV trong 30
giờ                                           phút sau đó IV mỗi 8 giờ trong 3 giờ
Hoặc                                          Hoặc
Cefepime 2g liều tải1 IV trong 30 phút sau    Imipenem-cilastatin 0,5-1g liều tải1 IV
đó IV mỗi 8-12 giờ trong 3-4 giờ kết hợp      trong 30 phút sau đó IV mỗi 6-8 giờ
metronidazol 500mg IV mỗi 8 giờ               trong 3 giờ
Hoặc                                          Hoặc
Ertapenem 1g IV mỗi 24 giờ                    Doripenem 0,5-1g liều tải1 IV trong 30
                                              phút sau đó IV mỗi 8 giờ trong 3-4 giờ
1
  Cân nhắc dùng liều tải trong trường hợp
người bệnh nhiễm trùng nặng, sốc nhiễm        1
                                                Cân nhắc dùng liều tải trong trường
trùng..                                       hợp người bệnh nhiễm trùng nặng, sốc
2` },
  { id:"umc2023-p59-b2", sourceId:"UMC2023", pdfPage:59, text:`kháng sinh phủ gram âm phù hợp
2. Áp xe cơ/Hoại tử cơ
Vancomycin liều tải 25-35mg/kg1 IV, duy       2. Áp xe cơ/hoại tử cơ
trì 15-20mg/kg IV mỗi 8–12 giờ, điều          Vancomycin liều tải 25-35mg/kg1 IV,
chỉnh liều để AUC24h trong khoảng 400-        duy trì 15-20mg/kg IV mỗi 8–12 giờ,
600 mcg*h/mL                                  điều chỉnh liều để AUC24h trong khoảng
Hoặc                                          400-600 mcg*h/mL
Linezolid 600mg uống/IV mỗi 12 giờ            Hoặc
Hoặc                                          Linezolid 600mg uống/IV mỗi 12 giờ
Teicoplanin 6mg/kg IV mỗi 12 giờ trong        Hoặc
3-5 liều, duy trì 6mg/kg IV mỗi 24 giờ        Teicoplanin 6-12mg/kg IV mỗi 12 giờ
Hoặc                                          trong 3-5 liều, duy trì 6mg/kg IV mỗi
Daptomycin 4-6mg/kg hoặc 8-10mg/kg1           24 giờ
IV mỗi 24 giờ                                 Hoặc

                                         49` },
  { id:"umc2023-p60-b1", sourceId:"UMC2023", pdfPage:60, text:`2
                                              Daptomycin 4-6mg/kg hoặc 8-
Piperacillin-tazobactam 4,5g liều tải1 IV     10mg/kg1 IV mỗi 24 giờ
trong 30 phút sau đó IV mỗi 6 giờ trong 4     Có thể kết hợp thêm2:
giờ                                           Piperacillin-tazobactam 4,5g liều tải1
Hoặc                                          IV trong 30 phút sau đó IV mỗi 6 giờ
Cefepime 2g liều tải1 IV trong 30 phút sau    trong 4 giờ
đó IV mỗi 8-12 giờ trong 3-4 giờ kết hợp      Hoặc
metronidazol 500mg IV mỗi 8 giờ               Ertapenem 1g IV mỗi 24 giờ
Hoặc                                          Hoặc
Ertapenem 1g IV mỗi 24 giờ                    Meropenem 1-2g liều tải IV trong 30
                                              phút sau đó IV mỗi 8 giờ trong 3 giờ
1
  Cân nhắc dùng liều tải trong trường hợp     Hoặc
người bệnh nhiễm trùng nặng, sốc nhiễm        Imipenem-cilastatin 0,5-1g liều tải IV
trùng..                                       trong 30 phút sau đó IV mỗi 6-8 giờ
2
  Cân nhắc áp xe cơ psoas, sốc nhiễm          trong 3 giờ
trùng.
                                              1
                                                Cân nhắc dùng liều tải trong trường
                                              hợp người bệnh nhiễm trùng nặng, sốc
3. Viêm cân mạc hoại tử/Hoại thư sinh         nhiễm trùng..
hơi/Hoại tử Fournier                          2
                                                Cân nhắc áp xe cơ psoas, sốc nhiễm
Piperacillin-tazobactam 4,5g liều tải1 IV     trùng.
trong 30 phút sau đó IV mỗi 6 giờ trong 4
giờ                                           3. Viêm cân mạc hoại tử/ Hoại tử
Hoặc                                          Fournier
Ertapenem 1g IV mỗi 24 giờ                    Piperacillin-tazobactam 4,5g liều tải1
Hoặc                                          IV trong 30 phút sau đó IV mỗi 6 giờ
Meropenem1 1-2g liều tải IV trong 30 phút     trong 4 giờ
sau đó IV mỗi 8 giờ trong 3 giờ               Hoặc
Hoặc                                          Ertapenem 1g IV mỗi 24 giờ
Imipenem-cilastatin1 0,5-1g liều tải IV       Hoặc
trong 30 phút sau đó IV mỗi 6-8 giờ trong     Meropenem 1-2g liều tải IV trong 30
3 giờ                                         phút sau đó IV mỗi 8 giờ trong 3 giờ
Kết hợp                                       Hoặc
Vancomycin liều tải 25-35mg/kg1 IV, duy       Imipenem-cilastatin 0,5-1g liều tải IV
trì 15-20mg/kg IV mỗi 8–12 giờ, điều          trong 30 phút sau đó IV mỗi 6-8 giờ
chỉnh liều để AUC24h trong khoảng 400-        trong 3 giờ
                                              Kết hợp
600 mcg*h/mL + clindamycin2 600-
                                              Amikacin 15-25mg/kg IV mỗi 24 giờ
900mg IV mỗi 8 giờ                            Hoặc
Hoặc                                          Gentamicin 5-7mg/kg IV mỗi 24 giờ
Linezolid2 600mg uống/IV mỗi 12 giờ           Kết hợp
Hoặc                                          Vancomycin liều tải 25-35mg/kg1 IV,
Teicoplanin 6-12mg/kg IV mỗi 12 giờ           duy trì 15-20mg/kg IV mỗi 8–12 giờ,
trong 3-5 liều, duy trì 6-12mg/kg IV mỗi
                                              điều chỉnh liều để AUC24h trong khoảng
24 giờ + clindamycin2 600-900mg IV mỗi
8 giờ                                         400-600 mcg*h/mL + clindamycin 600-
Hoặc                                          900mg IV mỗi 8 giờ
                                              Hoặc` },
  { id:"umc2023-p61-b1", sourceId:"UMC2023", pdfPage:61, text:`Hướng dẫn sử dụng kháng sinh                                          Năm 2023
Daptomycin 4-6mg/kg hoặc 8-10mg/kg     1
                                                Linezolid 600mg uống/IV mỗi 12 giờ
IV mỗi 24 giờ + clindamycin2 600-900mg          Hoặc
IV mỗi 8 giờ                                    Teicoplanin 12mg/kg IV mỗi 12 giờ
Hoặc                                            trong 3-5 liều, duy trì 12mg/kg IV mỗi
Tigecycline 100-200mg liều tải, duy trì         24 giờ + clindamycin 600-900mg IV
50-100mg mỗi 12h                                mỗi 8 giờ
                                                Hoặc
1
  Cân nhắc dùng liều tải, sử dụng               Daptomycin 4-6mg/kg hoặc 8-
carbapenem trong trường hợp người bệnh          10mg/kg1 IV mỗi 24 giờ + clindamycin
nhiễm trùng nặng, sốc nhiễm trùng..             600-900mg IV mỗi 8 giờ
2
  Cân nhắc sử dụng khi nghi ngờ hội             Hoặc
chứng sốc nhiễm độc (TSS) do                    Tigecycline 100-200mg liều tải, duy trì
Streptococcus hoặc Staphylococcus               50-100mg mỗi 12h

4. Áp xe đầu mặt cổ, hoại tử da, loét tì        1
                                                 Cân nhắc dùng liều tải trong trường
đè và bàn chân đái tháo đường                   hợp người bệnh nhiễm trùng nặng, sốc
Vancomycin liều tải 25-35mg/kg1 IV, duy         nhiễm trùng.
trì 15-20mg/kg IV mỗi 8–12 giờ, điều
chỉnh liều để AUC24h trong khoảng 400-
                                                2
                                                  Tỉ lệ nhạy cảm của các beta lactam
                                                như Carpapenem, Piperacillin-
600 mcg*h/mL
                                                tazobactam đều thấp đối 2 vi khuẩn
Hoặc                                            thường gặp tại khối hồi sức của UMC
Linezolid 600mg uống/IV mỗi 12 giờ              là Klebsiella và Pseudomonas, cân nhắc
Hoặc                                            sử dụng dựa vào chi phí điều trị và bảo
Teicoplanin 6-12mg/kg IV mỗi 12 giờ             tồn kháng sinh.
trong 3-5 liều, duy trì 6-12mg/kg IV mỗi
24 giờ                                       4. Áp xe đầu mặt cổ, hậu môn, hoại
Hoặc                                         tử da, loét tì đè và bàn chân đái tháo
Daptomycin 4-6mg/kg hoặc 8-10mg/kg1          đường
IV mỗi 24 giờ                                Vancomycin liều tải 25-35mg/kg1 IV,
Kết hợp
                                             duy trì 15-20mg/kg IV mỗi 8–12 giờ,
Piperacillin-tazobactam 4,5g liều tải1 IV
trong 30 phút sau đó IV mỗi 6 giờ trong 4    điều chỉnh liều để AUC24h trong khoảng
giờ                                          400-600 mcg*h/mL
Hoặc                                         Hoặc
Cefepime 2g liều tải1 IV trong 30 phút sau   Linezolid 600mg uống/IV mỗi 12 giờ
đó IV mỗi 8-12 giờ trong 3-4 giờ kết hợp     Hoặc
metronidazol 500mg IV mỗi 8 giờ              Teicoplanin 12mg/kg IV mỗi 12 giờ
Hoặc                                         trong 3-5 liều, duy trì 12mg/kg IV mỗi
Ertapenem 1g IV mỗi 24 giờ                   24 giờ
                                             Hoặc
1
  Cân nhắc dùng liều tải trong trường hợp Daptomycin 4-6mg/kg hoặc 8-
người bệnh nhiễm trùng nặng, sốc nhiễm       10mg/kg1 IV mỗi 24 giờ
trùng..                                      Kết hợp
                                             Piperacillin-tazobactam 4,5g liều tải1
5. Nhiễm khuẩn vết mổ                        IV trong 30 phút sau đó IV mỗi 6 giờ
5.1. Phẫu thuật thân mình, đầu, cổ, chi (trừ trong 4 giờ
nách và đáy chậu)                            Hoặc` },
  { id:"umc2023-p62-b1", sourceId:"UMC2023", pdfPage:62, text:`Bệnh viện Đại học Y Dược TPHCM®
     Hướng dẫn sử dụng kháng sinh                                            Năm 2023
Vancomycin liều tải 25-35mg/kg IV, duy
                                1
                                                 Ertapenem 1g IV mỗi 24 giờ
trì 15-20mg/kg IV mỗi 8–12 giờ, điều             Hoặc
chỉnh liều để AUC24h trong khoảng 400-           Meropenem 1-2g liều tải IV trong 30
                                                 phút sau đó IV mỗi 8 giờ trong 3 giờ
600 mcg*h/mL
                                                 Hoặc
Hoặc                                             Imipenem-cilastatin 0,5-1g liều tải IV
Linezolid 600mg uống/IV mỗi 12 giờ               trong 30 phút sau đó IV mỗi 6-8 giờ
Hoặc                                             trong 3 giờ
Teicoplanin 6-12mg/kg IV mỗi 12 giờ
trong 3-5 liều, duy trì 6-12mg/kg IV mỗi         1
                                                  Cân nhắc dùng liều tải trong trường
24 giờ                                           hợp người bệnh nhiễm trùng nặng, sốc
Hoặc                                             nhiễm trùng..
Daptomycin 4-6mg/kg hoặc 8-10mg/kg1
IV mỗi 24 giờ                             5. Nhiễm khuẩn vết mổ
                                          5.1. Phẫu thuật thân mình, đầu, cổ, chi
1
  Cân nhắc dùng liều tải trong trường hợp (trừ nách và đáy chậu)
người bệnh nhiễm trùng nặng, sốc nhiễm    Vancomycin liều tải 25-35mg/kg1 IV,
trùng..
                                          duy trì 15-20mg/kg IV mỗi 8–12 giờ,
5.2. Phẫu thuật đường ruột, ổ bụng, đường điều chỉnh liều để AUC24h trong khoảng
sinh dục nữ, nách, đáy chậu               400-600 mcg*h/mL
Piperacillin-tazobactam 4,5g liều tải IV
                                     1
                                          Hoặc
trong 30 phút sau đó IV mỗi 6 giờ trong 4 Linezolid 600mg uống/IV mỗi 12 giờ
giờ                                       Hoặc
Hoặc                                      Teicoplanin 6-12mg/kg IV mỗi 12 giờ
Cefepim 2g liều tải IV trong 30 phút sau trong 3-5 liều, duy trì 6-12mg/kg IV
                   1

đó IV mỗi 8-12 giờ trong 3-4 giờ kết hợp mỗi 24 giờ
metronidazol 500mg IV mỗi 8 giờ           Hoặc
Hoặc                                      Daptomycin 4-6mg/kg hoặc 8-
Ertapenem 1g IV mỗi 24 giờ                10mg/kg1 IV mỗi 24 giờ
1
  Cân nhắc dùng liều tải trong trường hợp        1
                                                  Cân nhắc dùng liều tải trong trường
người bệnh nhiễm trùng nặng, sốc nhiễm           hợp người bệnh nhiễm trùng nặng, sốc
trùng..                                          nhiễm trùng..` },
  { id:"umc2023-p62-b2", sourceId:"UMC2023", pdfPage:62, text:`5.2. Phẫu thuật đường ruột, ổ bụng,
                                                 đường sinh dục nữ, nách, đáy chậu
                                                 Meropenem 1-2g liều tải1 IV trong 30
                                                 phút sau đó IV mỗi 8 giờ trong 3 giờ
                                                 Hoặc
                                                 Imipenem-cilastatin 0,5-1g liều tải1 IV
                                                 trong 30 phút sau đó IV mỗi 6-8 giờ
                                                 trong 3 giờ
                                                 1
                                                  Cân nhắc dùng liều tải trong trường
                                                 hợp người bệnh nhiễm trùng nặng, sốc
                                                 nhiễm trùng.` },
  { id:"umc2023-p64-b1", sourceId:"UMC2023", pdfPage:64, text:`    Tiền sử nhiễm trùng MRSA;
       Sử dụng kháng sinh gần đây;
       Sử dụng thuốc qua đường truyền tĩnh mạch;
       Sống nơi đông đúc, môi trường kém

2. Điều trị nhiễm trùng do MRSA
    Vancomycin 15-20mg/kg IV mỗi 8 – 12 giờ, điều chỉnh liều để nồng độ đáy
      vancomycin trong khoảng 10-15mcg/mL hoặc AUC24h trong khoảng từ 400-600
      mcg*h/mL
   Các lựa chọn điều trị thay thế:` },
  { id:"umc2023-p65-b1", sourceId:"UMC2023", pdfPage:65, text:`Bệnh viện Đại học Y Dược TPHCM®
       Hướng dẫn sử dụng kháng sinh                                       Năm 2023
     Teicoplanin IV 6mg/kg mỗi 12 giờ cho 3 liều đầu, sau đó 6mg/kg mỗi 24 giờ
     Doxycyclin 100mg PO mỗi 12 giờ
     Trimethoprim-sulfamethoxazol 960mg 1–2 viên PO mỗi 12 giờ
     Linezolid 600mg PO/IV mỗi 12 giờ hoặc 600mg PO mỗi 12 giờ
     Daptomycin 4mg/kg IV mỗi 24 giờ
3. Viêm mô tế bào trong hướng dẫn này không bao gồm:
     Loét mạn tính nhiễm trùng và loét tì đè (không đái tháo đường)` },
  { id:"umc2023-p65-b2", sourceId:"UMC2023", pdfPage:65, text:` Không đáp ứng
                                                                       với kháng sinh
                                                                       đường PO
                                                                    Bệnh nhân suy
                                                                       giảm miễn dịch,` },
  { id:"umc2023-p66-b1", sourceId:"UMC2023", pdfPage:66, text:`Cân nhắc không sử dụng kháng      Kháng sinh gợi ý:            Kháng sinh gợi ý:
sinh                              - Cephalexin 500mg PO        Vancomycin 15-
                                  mỗi 6 giờ                    20mg/kg IV mỗi 8 – 12
                                  Kháng sinh thay thế (dị      giờ, điều chỉnh liều để
                                  ứng penicillin)              nồng độ đáy
                                  - Clarithromycin 500mg
                                  PO mỗi 12 giờ                vancomycin trong
                                  Nguy cơ nhiễm MRSA           khoảng 10-15mcg/mL
                                  - Doxycyclin 100mg PO        hoặc AUC24h trong
                                  mỗi 12 giờ hoặc              khoảng từ 400-600
                                  - Trimethoprim-              mcg*h/mL
                                  sulfamethoxazol 960mg 1–
                                  2 viên PO mỗi 12 giờ            Các lựa chọn điều trị
                                                                 thay thế:
                                                                 - Teicoplanin IV
                                                                 6mg/kg mỗi 12 giờ cho
                                                                 3 liều đầu, sau đó
                                                                 6mg/kg mỗi 24 giờ
                                                                 - Linezolid 600mg
                                                                 PO/IV mỗi 12 giờ
                                                                 - Daptomycin 4mg/kg
                                                                 IV mỗi 24 giờ
                                                                 Nếu kết quả kháng sinh
                                                                 đồ là MSSA:
                                                                 - Cefazolin 1g IV mỗi 8
                                                                 giờ hoặc
                                                                 - Oxacillin 1-2g IV mỗi
                                                                 4 giờ
Thời gian điều trị kháng sinh theo đáp ứng của bệnh nhân: thời gian tham khảo 5-7 ngày` },
  { id:"umc2023-p66-b2", sourceId:"UMC2023", pdfPage:66, text:`3. Hướng dẫn sử dụng vancomycin cho người lớn - Bệnh viện Đại học Y Dược TP
           HCM 2018
       4. Theo Hướng dẫn chuyển đổi kháng sinh đường tiêm sang đường PO - Bệnh viện
           Đại học Y Dược TP HCM 2018
       5. Kết quả vi sinh Bệnh viện Đại học Y Dược năm 2022` },
  { id:"umc2023-p67-b1", sourceId:"UMC2023", pdfPage:67, text:` Không đáp ứng
                                                                với kháng sinh
                                                                đường PO
                                                             Bệnh nhân suy
                                                                giảm miễn dịch,` },
  { id:"umc2023-p68-b1", sourceId:"UMC2023", pdfPage:68, text:`Hướng dẫn sử dụng kháng sinh                                    Năm 2023
Kháng sinh gợi ý:             Kháng sinh gợi ý:             Kháng sinh gợi ý:
Cephalexin PO 500mg mỗi 6 giờ Cefazolin 1g IV mỗi 8 giờ     Vancomycin 15-
                              Hoặc                          20mg/kg IV mỗi 8 – 12
Kháng sinh thay thế (dị ứng   Oxacillin 1-2g IV mỗi 4       giờ, điều chỉnh liều để
penicillin)                   giờ
                                                            nồng độ đáy
Clindamycin 300–450mg PO      Hoặc
mỗi 6 giờ                     Ceftriaxon 1g IV mỗi 24       vancomycin trong
                              giờ                           khoảng 10-15mcg/mL
                                                            hoặc AUC24h trong
                               Kháng sinh thay thế (dị      khoảng từ 400-600
                               ứng penicillin)              mcg*h/mL
                               Clindamycin 600mg IV
                               mỗi 8 giờ                    Kết hợp
                                                            Piperacillin/ tazobactam
                               Nguy cơ nhiễm MRSA
                                                            IV 3,375g mỗi 6 giờ
                               - Vancomycin 15-20mg/kg
                                                            hoặc 4,5g mỗi 8 giờ.
                               IV mỗi 8 – 12 giờ, điều      Hoặc
                               chỉnh liều để nồng độ đáy    Imipenem-cilastatin IV
                               vancomycin trong khoảng      0,5g (imipenem) mỗi 6
                               10-15mcg/mL hoặc             giờ
                               AUC24h trong khoảng từ       Hoặc
                               400-600 mcg*h/mL             Meropenem IV 1g mỗi
                                                            8 giờ
                               Các lựa chọn điều trị
                               thay thế:
                               Teicoplanin IV 6mg/kg
                               mỗi 12 giờ cho 3 liều đầu,
                               sau đó 6mg/kg mỗi 24 giờ
                               Hoặc
                               Linezolid 600mg PO/IV
                               mỗi 12 giờ
                               Hoặc
                               Daptomycin 4mg/kg IV
                               mỗi 24 giờ` },
  { id:"umc2023-p69-b1", sourceId:"UMC2023", pdfPage:69, text:`hydrophila và Streptococci kỵ khí (Peptostreptococcus)
3. Kháng sinh gợi ý
Ertapenem 1g IV mỗi 24 giờ
Hoặc` },
  { id:"umc2023-p70-b1", sourceId:"UMC2023", pdfPage:70, text:`Bệnh viện Đại học Y Dược TPHCM®
       Hướng dẫn sử dụng kháng sinh                                            Năm 2023
Imipenem 1g IV mỗi 6-8 giờ
Hoặc
Meropenem 1g IV mỗi 8 giờ
Hoặc
Piperacillin-tazobactam 3,37g IV mỗi 6-8 giờ
Phối hợp với
Vancomycin liều tải 25-30mg/kg sau đó duy trì 15-20mg/kg IV mỗi 8 – 12 giờ, điều chỉnh
liều để AUC24h trong khoảng từ 400-600 mcg*h/mL
Hoặc
Linezolid 0,6g IV mỗi 12 giờ
Hoặc
Daptomycin 4 - 6mg/kg IV mỗi 24 giờ
Phối hợp với
Clindamycin 0,6g – 0,9g IV mỗi 8 giờ
Tài liệu tham khảo
   1. Gunderson CG. Cellulitis: definition, etiology, and clinical features. The American` },
  { id:"umc2023-p71-b1", sourceId:"UMC2023", pdfPage:71, text:`- Phổ kháng khuẩn phủ MRSA + trực khuẩn hiếu khí Gram âm
Kháng sinh gợi ý
     - MRSA: Vancomycin dùng liều tải 20mg/kg, sau đó sử dụng liều duy trì 15 -
        20mg/kg IV mỗi 8 – 12 giờ, điều chỉnh liều để nồng độ đáy vancomycin
        trong khoảng 15-20mcg/mL hoặc AUC24h trong khoảng từ 400-600
        mcg*h/mL
     - Trực khuẩn Gram âm: kháng sinh Cephalosporin 3,4
            o Ceftriaxon 2g IV mỗi 24 giờ
            o Ceftazidim 2g IV mỗi 8 giờ
            o Cefepim 2g IV mỗi 8 giờ
                            VIÊM XƯƠNG TỦY XƯƠNG
Viêm xương tuỷ xương không do khuẩn huyết: Do 1 hay nhiều loại vi khuẩn` },
  { id:"umc2023-p71-b2", sourceId:"UMC2023", pdfPage:71, text:`- Staphylococcus aureus
     - Trực khuẩn Gram âm (Pseudomonas aeruginosa, Serratia marcescens nếu là
        người sử dụng thuốc đường tiêm tĩnh mạch)
     - Các tác nhân khác: Aspergillus spp (ở bệnh nhân suy giảm miễn dịch),
        Streptococci tiêu huyết beta, trực khuẩn lao, Candida` },
  { id:"umc2023-p72-b1", sourceId:"UMC2023", pdfPage:72, text:`quả vi sinh.
 - Phổ kháng khuẩn phủ MRSA + trực khuẩn hiếu khí Gram âm
    - MRSA: Vancomycin 15 - 20mg/kg IV mỗi 8 – 12 giờ, điều chỉnh liều để
        nồng độ đáy vancomycin trong khoảng 15-20mcg/mL hoặc AUC24h trong
        khoảng từ 400-600 mcg*h/mL
    - Trực khuẩn Gram âm: kháng sinh Cephalosporin 3,4
            o Ceftriaxon 2g IV mỗi 24 giờ
            o Ceftazidim 2g IV mỗi 8 giờ
            o Cefepim 2g IV mỗi 8 giờ
Tài liệu tham khảo
    1. Osmon DR, Berbari EF, Berendt AR, et al. Diagnosis and Management of Prosthetic` },
  { id:"umc2023-p73-b1", sourceId:"UMC2023", pdfPage:73, text:` Phù bạch huyết
      o Đau, nhạy cảm đau tại chỗ
                                                             Suy động mạch hoặc tĩnh mạch
      o Ấm tại chỗ
                                                             Suy giảm miễn dịch` },
  { id:"umc2023-p74-b1", sourceId:"UMC2023", pdfPage:74, text:`1. Không có yếu tố phức tạp                   1. Không có yếu tố phức tạp
- Vi khuẩn: gram dương                        - Vi khuẩn: gram dương ± gram âm
   Cephalexin PO 500mg mỗi 6 giờ                 Cefuroxim IV 1,5g mỗi 8 giờ
   Amoxicillin-acid clavulanic PO 875mg mỗi      Cefoxitin IV 2g mỗi 8 giờ
   12 giờ                                        Cefotaxim IV 2g mỗi 6 giờ
2. Dị ứng hoặc không dung nạp β-lactam           Ceftriaxon IV 1-2g q24 giờ
- Vi khuẩn: gram dương                           Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ
   Clindamycin PO 450-600mg mỗi 8 giờ            (tính theo cefoperazon)
   Trimethoprim-sulfamethoxazol PO 1-2        2. Có yếu tố phức tạp
   viên 960mg mỗi 12 giờ                      - Vi khuẩn: gram dương ± gram âm
   Doxycyclin PO 100mg mỗi 12 giờ                 Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
   Levofloxacin PO 500mg mỗi 24 giờ               Cefotaxim IV 2g mỗi 6 giờ
   Moxifloxacin PO 400g mỗi 24 giờ                Ceftriaxon IV 1-2g q24 giờ
3. Có yếu tố phức tạp                            Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ
- Vi khuẩn: gram dương + gram âm                 (tính theo cefoperazon)
   Levofloxacin PO 500mg mỗi 24 giờ              Ertapenem IV 1g mỗi 24 giờ
                                              3. Nguy cơ nhiễm khuẩn gram âm đa kháng
   Moxifloxacin PO 400g mỗi 24 giờ
                                              - Vi khuẩn: ESBL
   Cefuroxim PO 500mg mỗi 12 giờ
                                                  Ertapenem IV 1g mỗi 24 giờ
   Cefdinir PO 300mg mỗi 12 giờ
                                                  Imipenem IV 500mg mỗi 6 giờ Hoặc 1g
   Cefpodoxim PO 400mg mỗi 12 giờ
                                                  mỗi 8 giờ
4. Nguy cơ nhiễm khuẩn MRSA
                                                  Meropenem IV 1g mỗi 8 giờ
- Đổi kháng sinh hoặc bổ sung
                                                  Cefoperazon-sulbactam IV 1-2g mỗi 12
  Ưu tiên
                                                  giờ (tính theo cefoperazon) ±
   Trimethoprim-sulfamethoxazol PO 1-2
                                                  Aminoglycosid IV
   viên 960mg mỗi 12 giờ
                                              4. Nguy cơ nhiễm khuẩn Pseudomonas
   Doxycylin PO 100mg mỗi 12 giờ
                                              - Vi khuẩn: gram dương ± gram âm, bao gồm
  Thay thế
                                              Pseudomonas
   Linezolid PO 600mg mỗi 12 giờ
                                                  Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
                                                  Cefepim IV 2g mỗi 8-12 giờ
                                                  Oxacillin IV 1-2g mỗi 4 giờ + Ceftazidim
                                                  IV 2g mỗi 8h
                                                  Imipenem IV 500mg mỗi 6 giờ Hoặc 1g
                                                  mỗi 8 giờ
                                                  Meropenem IV 1g mỗi 8 giờ
                                                 Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ
                                                 (tính theo cefoperazon) ± Aminoglycosid
                                                 IV

                                        64` },
  { id:"umc2023-p75-b1", sourceId:"UMC2023", pdfPage:75, text:`5. Thiếu máu chi/hoại tử/có sinh hơi
                                               - Vi khuẩn: gram dương ± gram âm ± kỵ khí
                                                   Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
                                                   Cefoxitin IV 2g mỗi 8 giờ
                                                  Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ
                                                  (tính theo cefoperazon)
                                                   Ertapenem IV 1g mỗi 24 giờ
                                                   Imipenem IV 500mg mỗi 6 giờ Hoặc 1g
                                                   mỗi 8 giờ
                                                   Meropenem IV 1g mỗi 8 giờ
                                                   Một trong các kháng sinh dưới đây kết hợp
                                                   với clindamycin IV 600 - 900mg mỗi 8 giờ
                                                   hoặc metronidazol IV 500mg mỗi 8 giờ
                                                        Cefuroxim IV 1,5g mỗi 8 giờ
                                                        Cefotaxim IV 2g mỗi 6 giờ
                                                        Ceftriaxon IV 1-2g q24 giờ
                                                        Ceftazidim IV 1-2g mỗi 8 giờ
                                                        Cefepim IV 2g mỗi 8-12 giờ
                                               6. Nguy cơ nhiễm khuẩn MRSA
                                               - Đổi kháng sinh hoặc bổ sung
                                                 Ưu tiên
                                                  Vancomycin liều tải 25-35mg/kg IV, duy
                                                  trì 15-20mg/kg IV mỗi 8–12 giờ, điều
                                                  chỉnh liều để AUC24h trong khoảng 400-
                                                  600 mcg*h/mL
                                                 Thay thế
                                                  Teicoplanin IV liều tải: 6 mg/kg mỗi 12
                                                  giờ, 3 liều; Liều duy trì: 6 mg/kg mỗi 24
                                                  giờ
                                                  Linezolid IV 600mg mỗi 12 giờ
                                                  Daptomycin IV 4-6 mg/kg mỗi 24 giờ
                    B. Nhiễm khuẩn bàn chân đái tháo đường kèm viêm xương
                                    (Mức độ trung bình/nặng)
1. Không có yếu tố phức tạp
- Vi khuẩn: gram dương ± gram âm
    Cefuroxim IV 1,5g mỗi 8 giờ
    Cefoxitin IV 2g mỗi 8 giờ
    Cefotaxim IV 2g mỗi 6 giờ
    Ceftriaxon IV 2g q24 giờ
   Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ (tính theo cefoperazon)
2. Có yếu tố phức tạp
- Vi khuẩn: gram dương ± gram âm
    Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
    Cefotaxim IV 2g mỗi 6 giờ
    Ceftriaxon IV 2g q24 giờ

                                          65` },
  { id:"umc2023-p76-b1", sourceId:"UMC2023", pdfPage:76, text:`Bệnh viện Đại học Y Dược TPHCM®
  Hướng dẫn sử dụng kháng sinh                                    Năm 2023
   Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ (tính theo cefoperazon)
    Ertapenem IV 1g mỗi 24 giờ
3. Nguy cơ nhiễm khuẩn gram âm đa kháng
- Vi khuẩn: ESBL
    Ertapenem IV 1g mỗi 24 giờ
    Imipenem IV 500mg mỗi 6 giờ Hoặc 1g mỗi 8 giờ
    Meropenem IV 1g mỗi 8 giờ
   Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ (tính theo cefoperazon)
4. Nguy cơ nhiễm khuẩn Pseudomonas
- Vi khuẩn: gram dương ± gram âm, bao gồm Pseudomonas
   Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ (tính theo cefoperazon)
    Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
    Cefepim IV 2g mỗi 8-12 giờ
    Oxacillin IV 2g mỗi 4 giờ + ceftazidim IV 2g mỗi 8giờ
    Imipenem IV 500mg mỗi 6 giờ hoặc 1g mỗi 8 giờ
    Meropenem IV 1g mỗi 8 giờ
5. Thiếu máu chi/hoại tử/có sinh hơi
- Vi khuẩn: gram dương ± gram âm ± kỵ khí
    Piperacillin-tazobactam IV 4,5g mỗi 6 giờ
    Cefoxitin IV 2g mỗi 8 giờ
   Cefoperazon-sulbactam IV 1-2g mỗi 12 giờ (tính theo cefoperazon)
    Ertapenem IV 1g mỗi 24 giờ
    Imipenem IV 500mg mỗi 6 giờ Hoặc 1g mỗi 8 giờ
    Meropenem IV 1g mỗi 8 giờ
    Một trong các kháng sinh dưới đây kết hợp với clindamycin IV 600 - 900mg mỗi 8 giờ hoặc
    metronidazol IV 500mg mỗi 8 giờ
        Cefuroxim IV 1,5g mỗi 8 giờ
        Cefotaxim IV 2g mỗi 6 giờ
        Ceftriaxon IV 2g q24 giờ
        Ceftazidim IV 2g mỗi 8 giờ
        Cefepim IV 2g mỗi 8-12 giờ
6. Nguy cơ nhiễm khuẩn MRSA
- Đổi kháng sinh hoặc bổ sung
Ưu tiên
   Vancomycin liều tải 25-35mg/kg IV, duy trì 15-20mg/kg IV mỗi 8–12 giờ, điều chỉnh liều
   để AUC24h trong khoảng 400-600 mcg*h/mL
Thay thế
   Teicoplanin IV Liều nạp: 12 mg/kg mỗi 12 giờ, 3-5 liều; Liều duy trì: 12 mg/kg mỗi 24 giờ
   Linezolid IV 600mg mỗi 12 giờ
   Daptomycin IV 6-10 mg/kg mỗi 24 giờ
Cân nhắc kết hợp rifampicin 450mg mỗi 12 giờ
                                   Kháng sinh đường uống
              (cân nhắc trong nhiễm khuẩn trung bình hoặc xuống thang kháng sinh)
1. Không có yếu tố phức tạp
- Vi khuẩn: gram dương
   Cephalexin PO 500mg mỗi 6 giờ hoặc 1000mg mỗi 8-12 giờ

                                          66` },
  { id:"umc2023-p77-b1", sourceId:"UMC2023", pdfPage:77, text:`2. Dị ứng hoặc không dung nạp β-lactam
- Vi khuẩn: gram dương
   Clindamycin PO 600mg mỗi 8 giờ
   Trimethoprim/sulfamethoxazol PO 1.5-2 viên 960mg mỗi 12 giờ
   Doxycyclin PO 100mg mỗi 12 giờ
   Levofloxacin PO 750mg mỗi 24 giờ
   Moxifloxacin PO 400g mỗi 24 giờ
3. Có yếu tố phức tạp
- Vi khuẩn: gram dương + gram âm
   Levofloxacin PO 750mg mỗi 24 giờ
   Moxifloxacin PO 400g mỗi 24 giờ
4. Nguy cơ nhiễm khuẩn MRSA
- Đổi kháng sinh hoặc bổ sung
Ưu tiên
   Trimethoprim-sulfamethoxazol PO 1-2 viên 960mg mỗi 12 giờ
   Doxycylin PO 100mg mỗi 12 giờ
Thay thế
   Linezolid PO 600mg mỗi 12 giờ
Cân nhắc kết hợp rifampicin 450mg mỗi 12 giờ
THỜI GIAN DỰ KIẾN SỬ DỤNG KHÁNG SINH
  Điều trị nâng bậc hay xuống thang kháng sinh theo đáp ứng lâm sàng và kết quả vi sinh` },
  { id:"umc2023-p78-b1", sourceId:"UMC2023", pdfPage:78, text:`Bệnh viện Đại học Y Dược TPHCM®
Hướng dẫn sử dụng kháng sinh                                          Năm 2023
 2. Kwon, Ki Tae, and David G. Armstrong. ‘Microbiology and Antimicrobial Therapy for Diabetic
 Foot Infections’. Infection & Chemotherapy 50, no. 1 (March 2018): 11–20.
 3. ‘Osteomyelitis’. Lancet (London, England) 364, no. 9431 (24 July 2004): 369–79.` },
  { id:"umc2023-p79-b1", sourceId:"UMC2023", pdfPage:79, text:`Pseudomonas aeruginosa
Kháng sinh gợi ý:
 Vancomycin liều tải 25 - 30mg/kg IV sau đó duy trì liều 15 – 20mg/kg IV mỗi 8 - 12
giờ, điều chỉnh liều duy trì để AUC24h trong khoảng từ 400 – 600 mcg*h/mL.
 Hoặc
 Linezolid 0,6g mỗi 12 giờ
 Kết hợp với
 Cefepim 2g IV mỗi 8 giờ
 Hoặc
 Ceftazidim 2g IV mỗi 8 giờ
 Thay thế trong trường hợp dị ứng với kháng sinh nhóm beta-lactam:
 Ciprofloxacin 400mg IV mỗi 8 giờ
 Sử dụng trong trường hợp không đáp ứng
 Meropenem 2g IV mỗi 8 giờ
 Kháng sinh theo kháng sinh đồ
Cấy dương tính với trực khuẩn gram âm nhạy cephalosporin thế hệ III:
Ceftriaxon 2g IV mỗi 12 giờ
Hoặc
Cefotaxim 2g IV mỗi 6 giờ.
Cấy dương tính Pseudomonas spp.:
Cefepim 2g IV mỗi 8 giờ` },
  { id:"umc2023-p80-b1", sourceId:"UMC2023", pdfPage:80, text:`Hoặc
Ceftazidim 2g IV mỗi 8 giờ
Hoặc
Meropenem 2g IV mỗi 8 giờ
Cấy dương tính trực khuẩn gram âm ESBL (+) hoặc AmpC (+) :
Meropenem 2g IV mỗi 8 giờ
Cấy dương tính Acinetobacter spp.:
Meropenem 2g IV mỗi 8 giờ
Nếu kháng với nhóm carbapenem, xét nghiệm MIC colistin và cân nhắc bổ sung
meropenem với colistin đường tĩnh mạch và bơm kênh tủy. 3
      Liều colistin:
         o Tĩnh mạch: khởi đầu 120.000 IU/kg CMS (sử dụng mức cân nặng thấp nhất
             trong cân nặng lí tưởng hoặc cân nặng thực tế); liều duy trì sau đó 12 giờ:
             75.000-150.000 IU/kg/ngày CMS chia thành 2 – 3 lần (CrCl > 90 ml/ph).
             Không vượt quá 150.000 IU/kg/ngày. Chỉnh liều theo chức năng thận:
         o Bơm kênh tủy: nạp 250.000 IU CMS, duy trì 125.000 IU CMS mỗi 24 giờ
             (khóa dẫn lưu trong vòng 30 – 60 phút).4
Tài liệu tham khảo` },
  { id:"umc2023-p81-b1", sourceId:"UMC2023", pdfPage:81, text:`Kháng sinh gợi ý:5
 Vancomycin liều tải 25 - 30mg/kg IV sau đó duy trì liều 15 – 20mg/kg IV mỗi 8 - 12 giờ,
điều chỉnh liều duy trì để AUC24h trong khoảng từ 400 – 600 mcg*h/mL.
 Hoặc
 Linezolid 0,6g mỗi 12 giờ
 Hoặc
 Daptomycin 10mg/kg mỗi 24 giờ.
 Kết hợp với
Cefepim 2g IV mỗi 8 giờ
Hoặc
Ceftazidim 2g IV mỗi 8 giờ
Hoặc
Ceftriaxon 2g IV mỗi 24 giờ
Hoặc
Ciprofloxacin 400mg IV mỗi 12 giờ
Hoặc
Levofloxacin 750mg IV mỗi 24 giờ
Sử dụng trong trường hợp không đáp ứng
Meropenem 1g IV mỗi 8 giờ
Hoặc
Ertapenem 1g IV mỗi 24 giờ
Kháng sinh theo kháng sinh đồ
Cấy dương tính với trực khuẩn gram âm nhạy cephalosporin thế hệ III:` },
  { id:"umc2023-p82-b1", sourceId:"UMC2023", pdfPage:82, text:`Hướng dẫn sử dụng kháng sinh                                         Năm 2023

Ceftriaxon 2g IV mỗi 24 giờ
Hoặc
Cefotaxim 2g IV mỗi 6 giờ.
Cấy dương tính Pseudomonas spp.:
Cefepim 2g IV mỗi 8 giờ
Hoặc
Ceftazidim 2g IV mỗi 8 giờ
Hoặc
Meropenem 1g mỗi 8 giờ
Cấy dương tính trực khuẩn gram âm ESBL (+):
Meropenem 1g mỗi 8 giờ
Thời gian: 1-2 tuần với nhiễm trùng nông và 4-8 tuần với nhiễm trùng sâu
Tài liệu tham khảo` },
  { id:"umc2023-p83-b1", sourceId:"UMC2023", pdfPage:83, text:`Kháng sinh gợi ý, có thể trì hoãn Kháng sinh gợi ý, có thể trì hoãn 1-2 tuần chờ kết quả
1-2 tuần chờ kết quả cấy. 7,8     cấy.7,8
Staphylococci nhạy oxacillin:     Staphylococci, MRSA: Vancomycin liều tải 25 -
oxacillin 2g IV mỗi 6 giờ         30mg/kg IV sau đó duy trì liều 15 – 20mg/kg IV mỗi 8
                                  - 12 giờ, điều chỉnh liều duy trì để AUC24h trong
Staphylococci kháng oxacillin,
                                  khoảng từ 400 – 600mcg*h/mL.
Enterococcus spp.: Vancomycin
liều tải 25 - 30mg/kg IV sau đó Streptococcal spp.: ceftriaxon 1 - 2 g IV mỗi 24 giờ
duy trì liều 15 – 20mg/kg IV mỗi
                                    Trực khuẩn gram âm ESBL (+):
8 - 12 giờ, điều chỉnh liều duy trì
để AUC24h trong khoảng từ 400 Ertapenem 1g IV mỗi 24 giờ
– 600mcg*h/mL.
                                    Hoặc
Streptococcal spp.: Ceftriaxon 1 -
2 g IV mỗi 24 giờ                   Meropenem 1g IV mỗi 8 giờ

Trực khuẩn gram âm:
Ceftriaxon 1 - 2g IV mỗi 24 giờ
Hoặc
Ceftazidim 2g IV mỗi 8 giờ
Hoặc
Cefotaxim 2g IV mỗi 6 giờ
Hoặc
Cefepim 2g IV mỗi 12 giờ
Hoặc
Ciprofloxacin 400mg IV mỗi 12
giờ

Pseudomonas aeruginosa:
Cefepim 2g IV mỗi 8 – 12 giờ
Hoặc
Meropenem 1g IV mỗi 8 giờ` },
  { id:"umc2023-p84-b1", sourceId:"UMC2023", pdfPage:84, text:`động kháng sinh ngay như nhiễm huyết, khiếm khuyết thần kinh tiến triển
trùng huyết, khiếm khuyết thần
                                  Vancomycin liều tải 25 - 30mg/kg IV sau đó duy trì
kinh tiến triển
                                  liều 15 – 20mg/kg IV mỗi 8 - 12 giờ, điều chỉnh liều
Vancomycin liều tải 25 -          duy trì để AUC24h trong khoảng từ 400 – 600
30mg/kg IV sau đó duy trì liều 15 mcg*h/mL.
– 20mg/kg IV mỗi 8 - 12 giờ,      Kết hợp với:
điều chỉnh liều duy trì để
AUC24h trong khoảng từ 400 – Cefepim 2g IV mỗi 12 giờ
600mcg*h/mL.
                                  Vi khuẩn kị khí ít gặp đối với viêm thân sống đĩa đệm.
Kết hợp với:                      Sử dụng khi có yếu tố nghi ngờ (hiện diện cùng lúc áp
                                  xe ổ bụng):
Ceftriaxon 1 - 2g IV mỗi 24 giờ
Hoặc                              Kết hợp:
Ceftazidim 2g IV mỗi 8 giờ
Hoặc                              Metronidazol 0,5g IV mỗi 8 giờ
Cefepim 2g IV mỗi 12 giờ
Vi khuẩn kị khí ít gặp đối với
viêm thân sống đĩa đệm. Sử dụng` },
  { id:"umc2023-p84-b2", sourceId:"UMC2023", pdfPage:84, text:`cùng lúc áp xe ổ bụng):
Kết hợp:
Metronidazol 0,5g IV mỗi 8 giờ

Thời gian: 6 tuần` },
  { id:"umc2023-p86-b1", sourceId:"UMC2023", pdfPage:86, text:` VNTMNK van tự nhiên diễn tiến bán          < 48 giờ, kèm các yếu tố:
   cấp (trong vài tuần)                  Chăm sóc y tế tại nhà, có thực hiện
 VNTMNK van nhân tạo muộn: > 1              truyền tĩnh mạch, chạy thận nhân tạo
   năm sau phẫu thuật thay van               hoặc hóa trị liệu qua đường tiêm tĩnh
                                             mạch trong vòng 30 ngày` },
  { id:"umc2023-p87-b1", sourceId:"UMC2023", pdfPage:87, text:` Lấy 3-4 mẫu máu cách nhau mỗi 30 phút
                            hoặc
                         Lấy 3 mẫu máu cách nhau mỗi 12 giờ
                Điều trị ban đầu (lựa chọn kháng sinh theo kinh nghiệm)
    Kháng sinh gợi ý:                          Kháng sinh gợi ý:
    Vancomycin IV 25-30mg/kg liều              Vancomycin IV 25-30mg/kg liều
       tải, liều duy trì 15-20mg/kg mỗi 8-        tải, liều duy trì 15-20mg/kg mỗi 8-
       12 giờ, điều chỉnh liều sao cho            12 giờ, điều chỉnh liều sao cho
       AUC24h trong khoảng từ 400-600             AUC24h trong khoảng từ 400-600
       mcg*h/mL                                   mcg*h/mL
       Kết hợp với                                Kết hợp với
       Ceftriaxon IV 2g mỗi 24 giờ                Gentamicin IV 3mg/kg mỗi 24
       Hoặc                                       giờ, điều chỉnh liều sao cho nồng
       Cefotaxim IV 2g mỗi 6 giờ                  độ đỉnh 10-12 mcg/mL và nồng độ
       Hoặc                                       đáy <1 mcg/mL
       Gentamicin IV 3mg/kg mỗi 24                Hoặc
       giờ, điều chỉnh liều sao cho nồng          Cefepim IV 2g mỗi 8 giờ
       độ đỉnh 10-12 mcg/mL và nồng độ            Hoặc
       đáy <1 mcg/mL                              Meropenem1 IV 2g mỗi 8 giờ
       Hoặc                                       Kết hợp với
       Ampicillin IV 2g mỗi 4 giờ hoặc            Rifampin IV/PO 300 mg mỗi 6-8
       3g mỗi 6 giờ (12g/ngày)                    giờ (900-1200mg/ngày) nếu có van
    Ceftriaxon IV 2g mỗi 24 giờ                  nhân tạo, thiết bị cấy ghép trong
       Kết hợp với                                tim và bắt đầu 3-5 ngày sau khởi
       Ampicillin IV 2g mỗi 4 giờ hoặc            trị vancomycin và gentamicin
       3g mỗi 6 giờ (12g/ngày)                  Liệu pháp thay thế:
    Liệu pháp thay thế:                          Daptomycin2 IV 8-10mg/kg mỗi 24
       Daptomycin 8-10mg/kg mỗi 24
                     1                            giờ
       giờ                                        Kết hợp với
       Kết hợp với                                Ceftriaxon IV 2g mỗi 24 giờ
       Ceftriaxon IV 2g mỗi 24 giờ                Hoặc
       Hoặc                                       Gentamicin IV 3mg/kg mỗi 24
       Ampicillin IV 2g mỗi 4 giờ hoặc            giờ, điều chỉnh liều sao cho nồng
       3g mỗi 6 giờ (12g/ngày)                    độ đỉnh 10-12 mcg/mL và nồng độ
1
  Cân nhắc khi người bệnh nhiễm khuẩn             đáy <1 mcg/mL
huyết (sepsis) nặng hay sốc nhiễm khuẩn           Kết hợp với
hay có yếu tố nguy cơ nhiễm MRSA như              Rifampin IV/PO 300 mg mỗi 6-8
nhiễm quần cư MRSA (phết mũi dương                giờ (900-1200mg/ngày)nếu có van
tính), tiêm chích ma túy/dùng thuốc               nhân tạo, thiết bị cấy ghép trong` },
  { id:"umc2023-p88-b1", sourceId:"UMC2023", pdfPage:88, text:`Hướng dẫn sử dụng kháng sinh                                    Năm 2023

đường tĩnh mạch và không sử dụng được          tim và bắt đầu 3-5 ngày sau khởi
vancomycin                                     trị vancomycin và gentamicin
                                         1` },
  { id:"umc2023-p88-b2", sourceId:"UMC2023", pdfPage:88, text:`quần cư vi khuẩn Enterobacteriaceae
                                         sinh ESBL, tiêm chích ma túy/dùng
                                         thuốc đường tĩnh mạch, đặt catheter tĩnh
                                         mạch trung tâm, suy gan nặng.
                                         2` },
  { id:"umc2023-p88-b3", sourceId:"UMC2023", pdfPage:88, text:`nhiễm quần cư MRSA (phết mũi dương
                                         tính), tiêm chích ma túy/dùng thuốc
                                         đường tĩnh mạch và không sử dụng được
                                         vancomycin
 Trường hợp xác định được tác nhân vi khuẩn gây VNTMNK và kháng sinh
  đồ:
   Điều chỉnh kháng sinh theo kháng sinh đồ
   Cấy lại ít nhất 2 mẫu máu mỗi 48 giờ kể từ khi dùng kháng sinh phù hợp cho
      đến khi cấy máu âm tính để đánh giá hiệu quả điều trị
 Trong trường hợp cấy máu ban đầu âm tính sau 5 ngày:` },
  { id:"umc2023-p88-b4", sourceId:"UMC2023", pdfPage:88, text:`Đặc điểm dịch tễ học                    Tác nhân gây bệnh gợi ý
 Tiêm chích ma túy/Dùng thuốc đường      Staphylococcus aureus, bao gồm các
 tiêm tĩnh mạch/Điều trị thay thế thận   chủng kháng oxacillin mắc phải trong
                                         cộng đồng
                                         Staphylococci coagulase âm tính` },
  { id:"umc2023-p90-b1", sourceId:"UMC2023", pdfPage:90, text:`Các chủng nhạy cảm với penicillin (MIC ≤0.125mg/L )
Điều trị tiêu chuẩn thời gian 4 tuần
Penicillin G     IV 3 MIU mỗi 4-6 giờ (12 – 4 tuần        Ưu tiên bệnh nhân trên 65
                 18 MIU/ngày)                             tuổi hoặc bị suy thận hoặc
                                                          bệnh lý tiền đình ốc tai
Hoặc                                                      Khuyến cáo điều trị 6 tuần
Amoxicillin    IV 25-50mg/kg mỗi 6 giờ                    cho bệnh nhân VNTMNK
                                                          van nhân tạo` },
  { id:"umc2023-p91-b1", sourceId:"UMC2023", pdfPage:91, text:`Hướng dẫn sử dụng kháng sinh                                       Năm 2023

Hoặc              IV 2g mỗi 24 giờ
Ceftriaxon
Điều trị tiêu chuẩn thời gian 2 tuần
Penicillin G      IV 3 MIU mỗi 4-6 giờ (12 – 2 tuần    Chỉ khuyến cáo ở bệnh
                  18 MIU/ngày)                         nhân NVE với chức năng
Hoặc              IV 25-50mg/kg mỗi 6 giờ              thận bình thường
Amoxicillin
Hoặc              IV 2g mỗi 24 giờ
Ceftriaxon
Kết hợp với       IV 3mg/kg mỗi 24 giờ, điều
Gentamicin        chỉnh liều sao cho nồng độ
                  đỉnh 10-12 mcg/mL và
                  nồng độ đáy <1 mcg/mL
Ở bệnh nhân dị ứng với beta – lactam
Vancomycin        IV 25-30mg/kg liều tải, liều 4 tuần  Khuyến cáo 6 tuần cho
                  duy trì 15-20mg/kg mỗi 8-            bệnh nhân VNTMNK van
                  12 giờ, điều chỉnh liều sao          nhân tạo
                  cho AUC24h trong khoảng từ
                  400-600 mcg*h/mL
Các chủng kháng tương đối penicillin (MIC 0,250 – 2mg/L)
Điều trị tiêu chuẩn
Penicillin G      IV 3 MIU mỗi 4-6 giờ (12 – 4 tuần    Khuyến cáo điều trị 6 tuần
Hoặc              18 MIU/ngày)                         đối với bệnh nhân
Amoxicillin       IV 50mg/kg mỗi 6 giờ         4 tuần  VNTMNK van nhân tạo
Hoặc
Ampicillin
Hoặc              IV 2g mỗi 24 giờ             4 tuần
Ceftriaxon
Kết hợp với
Gentamicin        IV 3mg/kg mỗi 24 giờ, điều 2 tuần
                  chỉnh liều sao cho nồng độ
                  đỉnh 10-12 mcg/mL và
                  nồng độ đáy <1 mcg/mL
Ở bệnh nhân dị ứng với beta – lactam
Vancomycin        IV 25-30mg/kg liều tải, liều 4 tuần  Khuyến cáo điều trị 6 tuần
                  duy trì 15-20mg/kg mỗi 8-            đối với bệnh nhân
                  12 giờ, điều chỉnh liều sao          VNTMNK van nhân tạo
                  cho AUC24h trong khoảng từ
                  400-600 mcg*h/mL

Kết hợp với    IV 3mg/kg mỗi 24 giờ, điều 2 tuần
Gentamicin     chỉnh liều sao cho nồng độ
               đỉnh 10-12 mcg/mL và
               nồng độ đáy <1 mcg/mL
Các chủng kháng penicillin (MIC > 2mg/L)
Các bệnh nhân VNTMNK do các vi khuẩn nhóm Streptococci kháng penicillin (MIC >` },
  { id:"umc2023-p92-b1", sourceId:"UMC2023", pdfPage:92, text:`Van tự nhiên
Staphylococci nhạy cảm với methicillin (MSSA)
Oxacillin              IV 2g mỗi 4 giờ (12g/ngày) 4 – 6 tuần     Bổ sung gentamicin không
Liệu pháp thay thế                                               được khuyến cáo vì lợi ích
Sullfamethoxazol-      1200mg                        1tuần IV, 5 lâm sàng chưa được chứng
trimethoprim           (sullfamethoxazol)/240mg tuần PO          minh và làm tăng nhiễm
                       (trimethoprim) mỗi 6 giờ                  độc thận
Kết hợp với            IV 600mg mỗi 8 giờ            1 tuần
Clindamycin
Bệnh nhân dị ứng với penicillin hoặc Staphylococci kháng methicillin (MRSA)
 Vancomycin            IV 25-30mg/kg liều tải,       4 – 6 tuần  Cefazolin 2g mỗi 8 giờ
                       liều duy trì 15-20mg/kg                   hoặc cefotaxim 2g mỗi 8
                       mỗi 8-12 giờ, điều chỉnh                  giờ khuyến cáo dùng cho
                       liều sao cho AUC24h trong                 bệnh nhân VNTMNK dị
                       khoảng từ 400-600                         ứng penicillin nhưng
                       mcg*h/mL                                  không có phản ứng phản
                                                                 vệ
Liệu pháp thay thế:                                              Daptomycin vượt trội so
Daptomycin             IV 10mg/kg mỗi 24 giờ         4 – 6 tuần  với vancomycin đối với
                                                                 nhiễm khuẩn huyết do
Liệu pháp thay thế:                                              MSSA và MRSA với
Sullfamethoxazol-      1200mg                        1tuần IV, 5 vancomycin MIC > 1mg/L
trimethoprim           (sullfamethoxazol)/240mg tuần PO          cho Staphylococcus
                       (trimethoprim) mỗi 6 giờ                  aureus

Kết hợp với             IV 600mg mỗi 8 giờ          1 tuần
Clindamycin
                                      Van nhân tạo
Staphylococci nhạy cảm với methicillin (MSSA)
Oxacillin             IV 2g mỗi 4 giờ (12g/ngày) ≥6 tuần         Rifampin được khuyến
                                                                 cáo bắt đầu muộn hơn 3 –
Kết hợp với             IV 3mg/kg mỗi 24 giờ,       2 tuần       5 ngày so với vancomycin
Gentamicin              điều chỉnh liều sao cho                  và gentamicin
                        nồng độ đỉnh 10-12
                        mcg/mL và nồng độ đáy <1
                        mcg/mL
Kết hợp với             PO/IV 300mg mỗi 6-8 giờ     ≥6 tuần
Rifampin
Bệnh nhân dị ứng với penicillin hoặc Staphylococci kháng methicillin (MRSA)
Vancomycin             IV 25-30mg/kg liều tải,      ≥6 tuần     Cefazolin 2g mỗi 8 giờ
                       liều duy trì 15-20mg/kg                  hoặc cefotaxim 2g mỗi 8
                       mỗi 8-12 giờ, điều chỉnh                 giờ khuyến cáo dùng cho
                       liều sao cho AUC24h trong                bệnh nhân VNTMNK dị
                       khoảng từ 400-600                        ứng penicillin nhưng
                       mcg*h/mL                                 không có phản ứng phản
Kết hợp với            IV 3mg/kg mỗi 24 giờ,        2 tuần      vệ Rifampin được khuyến
Gentamicin             điều chỉnh liều sao cho
                       nồng độ đỉnh 10-12
                       mcg/mL và nồng độ đáy <1
                       mcg/mL` },
  { id:"umc2023-p93-b1", sourceId:"UMC2023", pdfPage:93, text:`Hướng dẫn sử dụng kháng sinh                                               Năm 2023

Kết hợp với           PO/IV 300mg mỗi 6-8 giờ       ≥6 tuần     cáo bắt đầu muộn hơn 3 –
Rifampin                                                        5 ngày so với vancomycin
                                                                và gentamicin` },
  { id:"umc2023-p93-b2", sourceId:"UMC2023", pdfPage:93, text:`Kháng sinh       Liều lượng và đường dùng       Liệu trình              Ghi chú
Các chủng nhạy cảm với beta – lactam và gentamicin
Amoxicillin     IV 50mg/kg mỗi 6 giờ            4 – 6 tuần      Liệu trình 6 tuần được
Hoặc                                                            khuyến cáo đối với bệnh
Ampicillin                                                      nhân VNTMNK có triệu
Kết hợp với     IV 3mg/kg mỗi 24 giờ, điều      2 – 6 tuần      chứng > 3 tháng hoặc
Gentamicin      chỉnh liều sao cho nồng độ đỉnh                 VNTMNK van nhân tạo
                10-12 mcg/mL và nồng độ đáy
                <1 mcg/mL

Ampicillin      IV 50mg/kg mỗi 6 giờ               6 tuần       Phối hợp này có hoạt tính
Kết hợp với                                                     chống lại các chủng
Ceftriaxon      IV 2g mỗi 12 giờ                   6 tuần       Enterrococcus faecalis có
                                                                hoặc không HLAR. Là phối
                                                                hợp được ưu tiên lựa chọn` },
  { id:"umc2023-p93-b3", sourceId:"UMC2023", pdfPage:93, text:`dụng với Enterrococcus
                                                                faecium
Vancomycin      IV 25-30mg/kg liều tải, liều duy   6 tuần       Khuyến cáo 6 tuần cho
                trì 15-20mg/kg mỗi 8-12 giờ,                    bệnh nhân VNTMNK van
                điều chỉnh liều sao cho AUC24h                  nhân tạo
                trong khoảng từ 400-600
                mcg*h/mL
Kết hợp với     IV 3mg/kg mỗi 24 giờ, điều         6 tuần
Gentamicin      chỉnh liều sao cho nồng độ đỉnh
                10-12 mcg/mL và nồng độ đáy
                <1 mcg/mL` },
  { id:"umc2023-p93-b4", sourceId:"UMC2023", pdfPage:93, text:`nhân tạo khác)
Kháng sinh      Liều lượng và đường dùng           Liệu trình   Ghi chú
Ceftriaxon      IV 2g mỗi 24 giờ                   4 tuần với   Có thể thay thế với
                                                   VNTMNK       cefotaxim hoặc cefepim
Hoặc                                               van tự        Nếu phân lập vi khuẩn
Ampicillin      IV 2g mỗi 4 giờ                    nhiến;       nhạy cảm với ampicillin` },
  { id:"umc2023-p94-b1", sourceId:"UMC2023", pdfPage:94, text:`Hoặc                                              6 tuần với   Liệu pháp flouroquinolon
 Ciprofloxacin   IV 400mg mỗi 12 giờ               VNTMNK       được xem xét cho những
                                                   van nhân     bệnh nhân không dung nạp
                                                   tạo          cephalosporin và` },
  { id:"umc2023-p108-b1", sourceId:"UMC2023", pdfPage:108, text:`(nạo hạch trong ung thư), thời gian mổ kéo dài ≥ 90-120 phút, sử dụng mảnh ghép/vật lạ nhất là trong phẫu thuật mạch máu - chỉnh hình...

   Thời điểm, đường dùng kháng sinh dự phòng tối ưu là tiêm tĩnh mạch 30 phút trước khi rạch da.

                                                                                         Kháng sinh thay thế` },
  { id:"umc2023-p108-b2", sourceId:"UMC2023", pdfPage:108, text:`Ampicillin-sulbactam          fluoroquinolon              tối ưu là 60 - 120 phút trước
                 Lưu ý: Nếu có dấu hiệu của viêm túi
                 mật cấp: túi mật căng, to, thành túi                                  Metronidazol +              rạch da do thời gian truyền
                 mật dày, phù nề, có giả mạc hay dịch                                  Aminoglycosid hoặc          lâu
                 quanh túi mật, dịch túi mật đục hay                                   fluoroquinolon` },
  { id:"umc2023-p110-b1", sourceId:"UMC2023", pdfPage:110, text:`6     Phẫu thuật điều trị thoát vị bẹn - Cefazolin                    Clindamycin            Vancomycin: thời điểm tối
             thoát vị thành bụng (nhất là khi có                             Vancomycin             ưu là 60 - 120 phút trước
             yếu tố nguy cơ)                                                                        rạch da do thời gian truyền
                                                                                                    lâu` },
  { id:"umc2023-p111-b1", sourceId:"UMC2023", pdfPage:111, text:`ngược, cắt dạ dày điều trị béo phì.                                  clindamycin         + trước rạch da do thời gian
                                                  Amoxicillin-acid clavulanic
                                                                                  Fluroquinolon    hoặc truyền lâu).
             Cắt dạ dày hoặc tá tràng không điển
                                                  Ampicillin–sulbactam            aminoglycosid` },
  { id:"umc2023-p112-b1", sourceId:"UMC2023", pdfPage:112, text:`fluoroquinolon: thời điểm
                                                                            Metronidazol        + tối ưu là 120 phút trước
                                                                            Aminoglycosid    hoặc rạch da do thời gian truyền
                                                                            fluoroquinolon        lâu.` },
  { id:"umc2023-p113-b1", sourceId:"UMC2023", pdfPage:113, text:`Levofloxacin,              Riêng fluoroquinolon: thời
                                                   cefuroxim, cefoxitin.
                                                                               ciprofloxacin.             điểm truyền tối ưu là 60 -
                                                   Lựa chọn thay thế:                                     120 phút trước rạch da do
                                                                                                          thời gian truyền lâu.
                                                   Cephalosporin thế hệ 3**:
                                                   ceftriaxon, cefotaxim.` },
  { id:"umc2023-p114-b1", sourceId:"UMC2023", pdfPage:114, text:`Lựa chọn thay thế:          Fluoroquinolon**:       Riêng fluoroquinolon: thời
                                                                             levofloxacin,           điểm truyền tối ưu là 60 -
                                                 Cephalosporin thế hệ 3**:
                                                                             ciprofloxacin.          120 phút trước rạch da do
                                                 ceftriaxon, cefotaxim.
                                                                                                     thời gian truyền lâu.

       5     Nội soi niệu quản chẩn đoán         Lựa chọn hàng đầu:          Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p114-b2", sourceId:"UMC2023", pdfPage:114, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                 Lựa chọn thay thế:
                                                                             ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                 Cephalosporin thế hệ 3**:                           120 phút trước rạch da do
                                                 ceftriaxon, cefotaxim.                              thời gian truyền lâu.

       6     Nội soi niệu quản sinh thiết bướu   Lựa chọn hàng đầu:          Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p114-b3", sourceId:"UMC2023", pdfPage:114, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                 Lựa chọn thay thế:
                                                                             ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                 Cephalosporin thế hệ 3**:                           120 phút trước rạch da do
                                                 ceftriaxon, cefotaxim.                              thời gian truyền lâu.

       7     Nội soi niệu quản đặt thông JJ      Lựa chọn hàng đầu:          Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p114-b4", sourceId:"UMC2023", pdfPage:114, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                 Lựa chọn thay thế:
                                                                             ciprofloxacin.          điểm truyền tối ưu là 60 -` },
  { id:"umc2023-p115-b1", sourceId:"UMC2023", pdfPage:115, text:`Cephalosporin thế hệ 3**:                             120 phút trước rạch da do
                                                       ceftriaxon, cefotaxim.                                thời gian truyền lâu.

       8     Nội soi niệu quản tán sỏi                 Lựa chọn hàng đầu:            Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p115-b2", sourceId:"UMC2023", pdfPage:115, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                       Lựa chọn thay thế:
                                                                                     ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                       Cephalosporin thế hệ 3**:                             120 phút trước rạch da do
                                                       ceftriaxon, cefotaxim.                                thời gian truyền lâu.

       9     Nội soi niệu quản tán sỏi thận bằng       Lựa chọn hàng đầu:            Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p115-b3", sourceId:"UMC2023", pdfPage:115, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                       Lựa chọn thay thế:
                                                                                     ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                       Cephalosporin thế hệ 3**:                             120 phút trước rạch da do
                                                       ceftriaxon, cefotaxim.                                thời gian truyền lâu.

       10    Sinh thiết tuyến tiền liệt từ tầng sinh   Cephalosporin thế hệ 1:       Clindamycin             Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p115-b4", sourceId:"UMC2023", pdfPage:115, text:`trước rạch da do thời gian
                                                       ampicillin-sulbactam
                                                                                                             truyền lâu.
                                                       amoxicillin-acid clavulanic` },
  { id:"umc2023-p116-b1", sourceId:"UMC2023", pdfPage:116, text:`amikacin, gentamicin    Levofloxacin,
                                                   Cephalosporin thế hệ 3**:   +/- clindamycin         ciprofloxacin.: thời điểm
                                                   ceftriaxon, cefotaxim.                              truyền tối ưu là 60 - 120
                                                                               Fluoroquinolon**:
                                                                                                       phút trước rạch da do thời
                                                                               levofloxacin,
                                                                                                       gian truyền lâu.
                                                                               ciprofloxacin.` },
  { id:"umc2023-p117-b1", sourceId:"UMC2023", pdfPage:117, text:`Lựa chọn thay thế:
                                                                                ciprofloxacin.          ciprofloxacin.: thời điểm
                                                    Cephalosporin thế hệ 3**:                           truyền tối ưu là 60 - 120
                                                                                Clindamycin
                                                    ceftriaxon, cefotaxim.                              phút trước rạch da do thời
                                                                                                        gian truyền lâu.

       16    Tán sỏi ngoài cơ thể (nguy cơ cao:     Lựa chọn hàng đầu:          Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p117-b2", sourceId:"UMC2023", pdfPage:117, text:`ciprofloxacin           ciprofloxacin.: thời điểm
             soi)                                   ceftriaxon, cefotaxim.
                                                                                                        truyền tối ưu là 60 - 120
                                                                                Clindamycin
                                                                                                        phút trước rạch da do thời
                                                                                                        gian truyền lâu.` },
  { id:"umc2023-p118-b1", sourceId:"UMC2023", pdfPage:118, text:`Levofloxacin,           Riêng fluoroquinolon: thời
                                                 Cephalosporin thế hệ 3**:
                                                                               ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                 ceftriaxon, cefotaxim.
                                                                                                       120 phút trước rạch da do
                                                                                                       thời gian truyền lâu

       18    PTNS lấy sỏi bể thận                Lựa chọn hàng đầu:            Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p118-b2", sourceId:"UMC2023", pdfPage:118, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                 Cephalosporin thế hệ 3**:
                                                                               ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                 ceftriaxon, cefotaxim.
                                                                                                       120 phút trước rạch da do
                                                                                                       thời gian truyền lâu

       19    PTNS cắt thận bán phần              Cephalosporin thế hệ 1:       Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p118-b3", sourceId:"UMC2023", pdfPage:118, text:`trước rạch da do thời gian
                                                 Ampicillin-sulbactam
                                                                                                       truyền lâu.
                                                 Amoxicillin-acid clavulanic` },
  { id:"umc2023-p119-b1", sourceId:"UMC2023", pdfPage:119, text:`trước rạch da do thời gian
                                                Ampicillin-sulbactam
                                                                                                      truyền lâu.
                                                Amoxicillin-acid clavulanic` },
  { id:"umc2023-p119-b2", sourceId:"UMC2023", pdfPage:119, text:`levofloxacin,           Levofloxacin,
                                                Cephalosporin thế hệ 3**:     ciprofloxacin +/-       ciprofloxacin.: thời điểm
                                                ceftriaxon, cefotaxim.        clindamycin             truyền tối ưu là 60 - 120
                                                                                                      phút trước rạch da do thời
                                                                                                      gian truyền lâu

       22    PTNS tạo hình khúc nối bể thận -   Lựa chọn hàng đầu:            Aminoglycosid:          Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p119-b3", sourceId:"UMC2023", pdfPage:119, text:`levofloxacin,           Riêng fluoroquinolon: thời
                                                Lựa chọn thay thế:
                                                                              ciprofloxacin.          điểm truyền tối ưu là 60 -
                                                Cephalosporin thế hệ 3**:                             120 phút trước rạch da do
                                                ceftriaxon, cefotaxim.                                thời gian truyền lâu` },
  { id:"umc2023-p120-b1", sourceId:"UMC2023", pdfPage:120, text:`levofloxacin,            Riêng fluoroquinolon: thời
                                                Lựa chọn thay thế:
                                                                            ciprofloxacin.           điểm truyền tối ưu là 60 -
                                                Cephalosporin thế hệ 3**:                            120 phút trước rạch da do
                                                ceftriaxon, cefotaxim.                               thời gian truyền lâu

       24    PTNS cắt bàng quang tận gốc        Lựa chọn hàng đầu:          Aminoglycosid:           Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p120-b2", sourceId:"UMC2023", pdfPage:120, text:`levofloxacin,            Riêng fluoroquinolon: thời
                                                Lựa chọn thay thế:
                                                                            ciprofloxacin.           điểm truyền tối ưu là 60 -
                                                Cephalosporin thế hệ 3**:                            120 phút trước rạch da do
                                                ceftriaxon, cefotaxim.                               thời gian truyền lâu

       25    PTNS cắt bàng quang tận gốc (có    Lựa chọn hàng đầu:          Aminoglycosid:           Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p121-b1", sourceId:"UMC2023", pdfPage:121, text:`trước rạch da do thời gian
                                          Ampicillin-sulbactam
                                                                                               truyền lâu.
                                          Amoxicillin-acid clavulanic` },
  { id:"umc2023-p121-b2", sourceId:"UMC2023", pdfPage:121, text:`trước rạch da do thời gian
                                          Ampicillin-sulbactam
                                                                                               truyền lâu.
                                          Amoxicillin-aicd clavulanic` },
  { id:"umc2023-p121-b3", sourceId:"UMC2023", pdfPage:121, text:`trước rạch da do thời gian
                                          Ampicillin-sulbactam
                                                                                               truyền lâu.
                                          Amoxicillin-acid clavulanic` },
  { id:"umc2023-p122-b1", sourceId:"UMC2023", pdfPage:122, text:`trước rạch da do thời gian
                                        Ampicillin-sulbactam
                                                                                             truyền lâu.
                                        Amoxicillin-acid clavulanic` },
  { id:"umc2023-p122-b2", sourceId:"UMC2023", pdfPage:122, text:`levofloxacin,          Riêng fluoroquinolon: thời
                                        Lựa chọn thay thế:
                                                                      ciprofloxacin.         điểm truyền tối ưu là 60 -
                                        Cephalosporin thế hệ 3**:                            120 phút trước rạch da do
                                        ceftriaxon, cefotaxim.                               thời gian truyền lâu

       31    Mổ mở cắt thận             Cephalosporin thế hệ 1:       Aminoglycosid:         Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p122-b3", sourceId:"UMC2023", pdfPage:122, text:`trước rạch da do thời gian
                                        Ampicillin-sulbactam
                                                                                             truyền lâu.
                                        Amoxicillin-acid clavulanic` },
  { id:"umc2023-p123-b1", sourceId:"UMC2023", pdfPage:123, text:`Ampicillin-sulbactam          Clindamycin            trước rạch da do thời gian
                                                                                                      truyền lâu.
                                                 Amoxicillin-acid clavulanic` },
  { id:"umc2023-p123-b2", sourceId:"UMC2023", pdfPage:123, text:`ciprofloxacin.         Levofloxacin,
                                                 Cephalosporin thế hệ 3**:                            ciprofloxacin.: thời điểm
                                                 ceftriaxon, cefotaxim.                               truyền tối ưu là 60 - 120
                                                                                                      phút trước rạch da do thời
                                                                                                      gian truyền lâu

       34    Mổ mở tạo hình khúc nối bể thận -   Lựa chọn hàng đầu:            Aminoglycosid:         Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p123-b3", sourceId:"UMC2023", pdfPage:123, text:`levofloxacin,          Riêng fluoroquinolon: thời
                                                 Lựa chọn thay thế:
                                                                               ciprofloxacin.         điểm truyền tối ưu là 60 -
                                                 Cephalosporin thế hệ 3**:                            120 phút trước rạch da do
                                                 ceftriaxon, cefotaxim.                               thời gian truyền lâu

       35    Mổ mở cắt tuyến tiền liệt tận gốc   Lựa chọn hàng đầu:            Aminoglycosid:         Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p123-b4", sourceId:"UMC2023", pdfPage:123, text:`Riêng fluoroquinolon: thời
                                                 Lựa chọn thay thế:
                                                                                                      điểm truyền tối ưu là 60 -` },
  { id:"umc2023-p124-b1", sourceId:"UMC2023", pdfPage:124, text:`Cephalosporin thế hệ 3**:   Fluoroquinolon**:        120 phút trước rạch da do
                                                ceftriaxon, cefotaxim.      levofloxacin,            thời gian truyền lâu
                                                                            ciprofloxacin.` },
  { id:"umc2023-p124-b2", sourceId:"UMC2023", pdfPage:124, text:`levofloxacin,            Riêng fluoroquinolon: thời
                                                Lựa chọn thay thế:
                                                                            ciprofloxacin.           điểm truyền tối ưu là 60 -
                                                Cephalosporin thế hệ 3**:                            120 phút trước rạch da do
                                                ceftriaxon, cefotaxim.                               thời gian truyền lâu

       37    Mổ mở cắt bàng quang tận gốc (có   Lựa chọn hàng đầu:          Aminoglycosid:           Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p125-b1", sourceId:"UMC2023", pdfPage:125, text:`Ampicillin-sulbactam                                 trước rạch da do thời gian
                                                                                                truyền lâu.
                                           Amoxicillin-acid clavulanic` },
  { id:"umc2023-p125-b2", sourceId:"UMC2023", pdfPage:125, text:`trước rạch da do thời gian
                                           Ampicillin-sulbactam
                                                                                                truyền lâu.
                                           Amoxicillin-acid clavulanic` },
  { id:"umc2023-p125-b3", sourceId:"UMC2023", pdfPage:125, text:`trước rạch da do thời gian
                                           Ampicillin-sulbactam
                                                                                                truyền lâu.
                                           Amoxicillin-aicd clavulanic` },
  { id:"umc2023-p125-b4", sourceId:"UMC2023", pdfPage:125, text:`trước rạch da do thời gian
                                           Ampicillin-sulbactam
                                                                                                truyền lâu.` },
  { id:"umc2023-p126-b1", sourceId:"UMC2023", pdfPage:126, text:`Amoxicillin-acid clavulanic

       42    Cột tĩnh mạch tinh vi phẫu          Cephalosporin thế hệ 1:       Clindamycin            Dùng 1 liều duy nhất trước
                                                 Cefazolin                                            phẫu thuật 30 - 60 phút.
                                                                               Vancomycin` },
  { id:"umc2023-p126-b2", sourceId:"UMC2023", pdfPage:126, text:`trước rạch da do thời gian
                                                 Ampicillin-sulbactam
                                                                                                      truyền lâu.
                                                 Amoxicillin-acid clavulanic` },
  { id:"umc2023-p126-b3", sourceId:"UMC2023", pdfPage:126, text:`trước rạch da do thời gian
                                                 Ampicillin-sulbactam
                                                                                                      truyền lâu.
                                                 Amoxicillin-acid clavulanic` },
  { id:"umc2023-p126-b4", sourceId:"UMC2023", pdfPage:126, text:`phẫu thuật 30 - 60 phút.
                                                 sullfamethoxazol-           trimethoprim đường
                                                 trimethoprim đường uống     uống                     Riêng Fluoroquinolon**:
                                                 Amoxicillin-acid clavulanic                          Levofloxacin,` },
  { id:"umc2023-p127-b1", sourceId:"UMC2023", pdfPage:127, text:`Ampicillin-sulbactam          Aminoglycosid:           ciprofloxacin.: thời điểm
                                                 Lựa chọn thay thế:            amikacin, gentamicin.    truyền tối ưu là
                                                 Cephalosporin thế hệ 2:
                                                                               Fluoroquinolon**:` },
  { id:"umc2023-p127-b2", sourceId:"UMC2023", pdfPage:127, text:`ciprofloxacin.: thời điểm
                                                 ceftriaxon, cefotaxim.        ciprofloxacin.
                                                                                                        truyền tối ưu là

       48    Phẫu thuật (PT) đặt dải treo giữa   Cefazolin + metronidazol      Aminoglycosid:           Dùng 1 liều duy nhất trước` },
  { id:"umc2023-p128-b1", sourceId:"UMC2023", pdfPage:128, text:`levofloxacin,
                                                  Amoxicillin-acid clavulanic ciprofloxacin.             ciprofloxacin.: thời điểm
                                                                                                         truyền tối ưu là

       52    Phẫu thuật chuyển lưu nước tiểu                                    Aminoglycosid:` },
  { id:"umc2023-p129-b1", sourceId:"UMC2023", pdfPage:129, text:`Lựa chọn thay thế:                                        ciprofloxacin.: thời điểm
                                                                                  ciprofloxacin.
                                                   Cephalosporin thế hệ 3**:                                 truyền tối ưu là
                                                   ceftriaxon, cefotaxim.` },
  { id:"umc2023-p131-b1", sourceId:"UMC2023", pdfPage:131, text:`Thủ thuật điều trị nha khoa: dự phòng viêm nội tâm mạc đối với những bệnh nhân có bệnh lý tim mạch
                                                     Amoxicillin PO/IV: 2g
                                                     Ampicillin IV: 2g
                                                     Cephalexin* PO: 2g            Đường uống:
                                                 Cefazolin* IV: 1g                 Azithromycin       hoặc
             Tất cả thủ thuật điều trị răng liên                                   Clarithromycin: 500mg Liều duy nhất 30-60 phút
                                                 Ceftriaxon* IV: 1g                                        trước thủ thuật
        1    quan đến mô nướu, vùng quanh răng,
                                                                                   Doxycylin: 100mg` },
  { id:"umc2023-p132-b1", sourceId:"UMC2023", pdfPage:132, text:`Cefazolin                     Clindamycin
       3     Thay khớp thái dương hàm                                                                Riêng vancomycin: bắt đầu
                                                Cefuroxim                     Vancomycin             truyền trước 60-120 phút và
                                                                                                     hoàn thành truyền xong
                                                                                                     trước khi rạch ra.` },
  { id:"umc2023-p134-b1", sourceId:"UMC2023", pdfPage:134, text:`tạo kết hợp với vật liệu tự thân –
             phẫu thuật gây mê).                                                                     Riêng vancomycin: bắt đầu
                                                                                                     truyền trước 60-120 phút
       2     Các phẫu thuật có diện phẫu tích Cefazolin                       Clindamycin*,          và hoàn thành truyền xong
             rộng, thời gian mổ kéo trên dài trên                             Vancomycin*            trước khi rạch ra.
                                                  Ampicillin-sulbactam` },
  { id:"umc2023-p136-b1", sourceId:"UMC2023", pdfPage:136, text:`Amoxicilin-acid clavulanic   Clindamycin
             thuật nạo hạch nách)
                                                                                                   Vancomycin truyền trước
                                                                                                   rạch da 120 phút` },
  { id:"umc2023-p136-b2", sourceId:"UMC2023", pdfPage:136, text:`aminoglysid          da 30 -60 phút.
                                                Cefazolin + metronidazol
                                                                             Clindamycin      +/- Fluoroquinolone truyền
                                                Cefuroxim + metronidazol
                                                                             fluoroquinolon       trước rạch da 120 phút.` },
  { id:"umc2023-p138-b1", sourceId:"UMC2023", pdfPage:138, text:`levofloxacin)

             Hút buồng tử cung (nạo hút thai, gắp Azithromycin 1 g PO,                          1 liều duy nhất 120 phút
        6
             thai)                                doxycyclin 200mg PO                           trước thủ thuật

10    Chấn thương chỉnh hình` },
  { id:"umc2023-p138-b2", sourceId:"UMC2023", pdfPage:138, text:`trong vòng 60 phút
                                                                                                    trước khi rạch da (thời
             Phẫu thuật nội soi (có hoặc không                           Clindamycin,               gian truyền ít nhất 30-
             có sử dụng implant) khớp (khớp      Cefazolin
        2                                                                vancomycin                 60 phút).` },
  { id:"umc2023-p138-b3", sourceId:"UMC2023", pdfPage:138, text:`chân).                                                                                 trong vòng 60-120 phút
                                                                                                    trước khi rạch da (thời
                                                                         Clindamycin                gian truyền ít nhất 30
                                                 Cefazolin                                          phút khi sử dụng liều
        3    Phẫu thuật kết hợp xương.                                   Vancomycin                 500mg vancomycin).` },
  { id:"umc2023-p144-b1", sourceId:"UMC2023", pdfPage:144, text:`Phẫu thuật cắt u máu tủy sống, dị                                 Clindamycin
       13                                           Cefazolin
             dạng động tĩnh mạch trong tủy.                                    Vancomycin` },
  { id:"umc2023-p151-b1", sourceId:"UMC2023", pdfPage:151, text:`Ceftriaxon 2g pha NaCl
                                                                                                0,9% 100ml IV 70 giọt /ph,
       69    Phẫu thuật sàn sọ qua miệng           Ceftriaxon             Clindamycin
                                                                                                trong vòng 30-60 phút` },
  { id:"umc2023-p152-b1", sourceId:"UMC2023", pdfPage:152, text:`1     Can thiệp thủ thuật về tim mạch.                             Vancomycin                mạch chậm trong 3 – 5
                                                 Cefuroxim
                                                                                                    phút hoặc truyền tĩnh
                                                 Cefazolin                                          mạch trong vòng 30 –
       2     Mở xương ức đường giữa, ghép tim.                            Vancomycin` },
  { id:"umc2023-p152-b2", sourceId:"UMC2023", pdfPage:152, text:`ở bệnh nhân tiền sử có sử dụng                                                         mạch chậm trong 3 – 5
       3     dụng cụ hỗ trợ thất (VAD) hoặc có   Cefazolin + vancomycin   Vancomycin
                                                                                                    phút hoặc truyền tĩnh
             tụ cầu vàng kháng methicillin
             (MRSA) xâm nhập/nhiễm khuẩn.                                                           mạch trong vòng 30 –` },
  { id:"umc2023-p152-b3", sourceId:"UMC2023", pdfPage:152, text:`Đặt máy tạo nhịp hoặc máy khử                                Clindamycin               da
       4                                         Cefazolin
             rung tim.                                                    Vancomycin            -   Clindamycin: truyền
                                                                                                    tĩnh mạch trong vòng
             Đặt máy tạo nhịp hoặc máy khử                                                          60 phút trước khi rạch
             rung tim ở người bệnh có tụ cầu                                                        da
       5                                         Cefazolin + vancomycin   Vancomycin
             vàng kháng methicillin (MRSA)
                                                                                                -   Vancomycin: truyền
             xâm nhập/nhiễm khuẩn.
                                                                                                    tĩnh mạch trong vòng
       6     Đặt dụng cụ hỗ trợ thất (VAD).      Cefazolin                Vancomycin                60 – 120 phút trước khi
                                                                                                    rạch da (thời gian
             Đặt dụng cụ hỗ trợ thất (VAD) ở                                                        truyền ít nhất 30 phút
             người bệnh có tụ cầu vàng kháng
       7                                         Cefazolin + vancomycin   Vancomycin                cho mỗi 500mg` },
  { id:"umc2023-p154-b1", sourceId:"UMC2023", pdfPage:154, text:`thường, giờ            thuật)

                         3g(ampicillin            50 mg/kg           Tiêm tĩnh mạch chậm hoặc
Ampicillin - sulbactam                                                                          0.8 – 1.3          Mỗi 2 giờ
                         2g/sulbactam 1 g)        ampicillin         truyền tĩnh mạch

Amoxicilin - acid        1,2 g (Amoxicilin 1 g/                      Tiêm tĩnh mạch chậm hoặc
                                                                                                1 – 1.3            Mỗi 6 giờ
clavulanic               acid clavulanic 0,2 g)                      truyền tĩnh mạch

                                                                     Tiêm tĩnh mạch chậm hoặc
Ampicillin               2g                       50 mg/kg                                      1 – 1.9            Mỗi 2 giờ
                                                                     truyền tĩnh mạch

                                                                     Tiêm tĩnh mạch chậm hoặc                      Mỗi 4 giờ (mỗi
                         2 g (3g cho người cân
Cefazolin                                         30 mg/kg           truyền tĩnh mạch           1.2 – 2.2          2 giờ đối với
                         nặng ≥120 kg)
                                                                                                                   phẫu thuật tim)

                                                                     Tiêm tĩnh mạch chậm hoặc
Cefuroxim                1,5 g                    50 mg/kg                                      1–2                Mỗi 4 giờ
                                                                     truyền tĩnh mạch

                                                                     Tiêm tĩnh mạch chậm hoặc
Cefotaxim                1g                       50mg/kg                                       0,9 – 1,7          Mỗi 3 giờ
                                                                     truyền tĩnh mạch

                                                                     Tiêm tĩnh mạch chậm hoặc
Ceftriaxon               2g                       50-75mg/kg                                    5,4 – 10,9
                                                                     truyền tĩnh mạch

Ciprofloxacin            400mg                    10mg/kg            Truyền tĩnh mạch           3–7                Mỗi 8 giờ` },
  { id:"umc2023-p155-b1", sourceId:"UMC2023", pdfPage:155, text:`thường, giờ            thuật)

Clindamycin           900mg                  10mg/kg             Truyền tĩnh mạch    2–4                Mỗi 6 giờ

Ertapenem             1g                     15mg/kg             Truyền tĩnh mạch    3–5

Gentamicin            5mg/kg                 2,5mg/kg            Truyền tĩnh mạch    2–3

Levofloxacin          500mg                  10mg/kg             Truyền tĩnh mạch    6–8

                                             15mg/kg             Truyền tĩnh mạch
                                             (Trẻ sơ sinh cân
Metronidazol          500mg                  nặng < 1200g nên                        6–8                Mỗi 12 giờ
                                             nhận liều đơn là
                                             7,5 mg/kg).

Moxifloxacin          400mg                  10mg/kg             Truyền tĩnh mạch    8 – 15

Vancomycin            15mg/kg                15mg/kg             Truyền tĩnh mạch    4–8                Mỗi 12 giờ

Kháng sinh đường uống cho dự phòng phẫu thuật đại trực tràng

Metronidazol          1g                     15mg/kg             Truyền tĩnh mạch    6 – 10             Mỗi 12 giờ` },
  { id:"umc2023-p156-b1", sourceId:"UMC2023", pdfPage:156, text:`-   Liều đơn dự phòng thì thường là đủ, thời gian dự phòng cho tất cả các phẫu thuật nên ít hơn 24 giờ.
-   Cephalosporins tiêm tĩnh mạch trong 3 – 5 phút ngay trước thủ thuật và đạt nồng độ cần thiết ở da sau vài phút.
-   Vancomycin và ciprofloxacin cần phải được dùng trước MỘT GIỜ và HOÀN THÀNH việc truyền trước khi bắt đầu rạch da.
-   Clindamycin cần được truyền xong trước 10 – 20 phút.
-   Gentamicin cần được dùng 1 liều duy nhất 5mg/kg để tối da hóa sự thấm vào mô và giảm thiểu độc tính. Nếu người bệnh người
    bệnh lọc máu hoặc ClCr < 20 ml/phút, dùng liều 2 mg/kg.
-   Ðối với phẫu thuật mổ lấy thai, kháng sinh dự phòng có thể dùng trước khi rạch da hoặc sau khi kẹp dây rốn dể giảm biến chứng
    nhiễm khuẩn ở mẹ.` },
];
