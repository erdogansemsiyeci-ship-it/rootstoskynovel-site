# rootstoskynovel.com — SİTE KURULUMU (13 Ekim 2026)

**Durum:** Site canlı, alan adı bekleniyor (DNS sende) · **Onay gerektiren karar yok**, yalnız GoDaddy'de 5 DNS kaydı.

## Nerede yayında

| | |
|---|---|
| Yayın | **GitHub Pages** — repo: `erdogansemsiyeci-ship-it/rootstoskynovel-site` (public) |
| Alan adı | **rootstoskynovel.com** (repo'daki `CNAME` dosyası + Pages custom domain ayarlı) |
| Şimdiki adres | https://erdogansemsiyeci-ship-it.github.io/rootstoskynovel-site/ (CNAME nedeniyle özel alan adına yönlenir) |
| Kaynak (lokal) | `~/projects/rootstosky` — `index.html`, `style.css`, `site.js`, `vercel.json`, `README.md` |
| Doğrulama | Sayfa, stil ve script Pages üzerinden **200** dönüyor (Host: rootstoskynovel.com ile test edildi) |

### Neden Vercel/Netlify değil
- **Netlify:** bu sunucuda CLI yok, hesap yok — sıfırdan üyelik gerekiyordu.
- **Vercel:** CLI ve hesap var (`amritsangeet-6775`) ama deploy denemesi **"Your Team exceeded our fair use limits and has been blocked (402)"** ile reddedildi. Hesapta tek takım var (`boring`); kişisel kapsam bu CLI sürümünde deploy'a kapalı. **Vercel'in açılması için hesabında fair-use bloğunu kaldırman gerekir** — istersen oraya da geçebiliriz, ama GitHub Pages kurulu ve çalışıyor.

## DNS — UYGULANDI (GoDaddy API ile, 13 Ekim 2026)

GoDaddy hesabında `rootstoskynovel.com` bulundu; kayıtlar **API ile** yazıldı (kullanıcı adımı GEREKMEDİ):

| Tip | Ad | Önce | Sonra |
|-----|-----|------|-------|
| A | `@` | `WebsiteBuilder Site` (GoDaddy park) | `185.199.108.153` · `.109.153` · `.110.153` · `.111.153` |
| CNAME | `www` | `@` | `erdogansemsiyeci-ship-it.github.io` |

- Dokunulmayan kayıtlar: `NS` (ns55/ns56.domaincontrol.com), `CNAME pay`, `CNAME _domainconnect`, `TXT _dmarc`
- Yedek: `/tmp/gd_records_backup_rootstoskynovel.com.json` + `/tmp/gd_records_after_rootstoskynovel.com.json`
- Script'ler: `scripts/gd_dns_inspect.py` (salt okuma) · `scripts/gd_dns_apply_ghpages.py` (dry-run + `--apply`)
- Doğrulama (8.8.8.8 / 1.1.1.1 / yetkili NS): apex A kayıtları GitHub IP'lerine dönüyor ✅
- `http://rootstoskynovel.com` GitHub Pages'ten **200** dönüyor ✅

**TLS/HTTPS — TAMAM ✅** Let's Encrypt sertifikası çıktı (`CN=rootstoskynovel.com`, 13 Eki 2026 → 11 Oca 2027),
`https_enforced: true`. Testler (DNS önbelleği atlanarak): apex HTTPS **200**, apex HTTP **301 → https**,
www HTTPS **301 → apex**. Rapor: GitHub Pages sertifikayı hemen vermedi; tetiklemek için alan adı
kaldırılıp yeniden eklendi (`cname` PUT) → sertifika "approved", build "built".
**Not:** eski GoDaddy kaydının TTL'i 1 saat olduğu için, alan adını daha önce ziyaret etmiş tarayıcılar
bu süre boyunca eski GoDaddy sayfasını görebilir; yeni ziyaretçiler doğrudan yeni siteyi görür.

## (Arşiv) Önceki plan — kullanıcı adımı gerektiren sürüm

GoDaddy → My Products → **rootstoskynovel.com** → DNS (mevcut site kurucusu kayıtlarını SİL):

| Tip | Ad | Değer |
|-----|-----|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `erdogansemsiyeci-ship-it.github.io` |

Notlar:
- Eski GoDaddy site-kurucusu kayıtları (@ için A/CNAME, www) **silinmeli**; yoksa site açılmaz.
- DNS yayıldıktan sonra GitHub TLS sertifikasını kendi alır (~15-60 dk). Sertifika çıkınca **HTTPS'i zorunlu** kılacağım (`https_enforced`).
- `rootstosky.com` bizim olmadığı için site oraya bağlanmıyor; kitapta ve sitede doğru adres **rootstoskynovel.com**.

## Form akışı (test edildi)

```
POST https://hgwmloczvvviumbjheje.supabase.co/rest/v1/rts_subscribers
apikey + Authorization: <anon anahtar>   (site.js içinde GÖMÜLÜ — tasarımı gereği açık anahtar)
Prefer: return=minimal                    <-- ZORUNLU; yoksa RLS SELECT reddi 401 döner
{ "eposta": "<e-posta>", "kaynak": "site" }
```

- Canlı test (iki kez): gerçek tarayıcıdan form gönderildi → **201**, `rts_subscribers` tablosuna satır düştü
  (`kaynak='site'`) → test satırları silindi, tablo temiz (0 kayıt). Son test **canlı alan adı üzerinden**:
  `https://rootstoskynovel.com/` → "Thank you — you are on the list." (kayıt id 8, sonra silindi)
- Güvenlik: RLS açık; anon rolünün yalnız INSERT politikası var. SELECT/UPDATE/DELETE anon'a kapalı
  (SELECT denemesi boş liste döndü → okur e-postaları dışarıya sızmaz).
- Bot tuzağı (honeypot) + zorunlu onay kutusu + e-posta normalizasyonu kodda.

## Site içeriği (hepsi onaylı metinlerden)

- Hero: başlık, alt başlık, yazar, "Pre-order opens 23 October 2026 · Publication 24 November 2026",
  hook cümlesi (onaylı arka kapak hook'u)
- The Book: onaylı arka kapak metni (3 paragraf, NİHAİ 26 Eyl sürümü)
- Author: onaylı yazar biyografisi (VARYANT 1)
- Newsletter: "Be told when it is out" + form
- Footer: telif + rootstoskynovel.com
- Harici kaynak/izleyici/pazarlama pikseli **yok**; sistem serif yazı tipi; mobil öncelikli.

## Bekleyen (site tarafı)

1. **Kapak görseli** — tasarım gelince `assets/cover.jpg` olarak kopyalanır; sayfa dosyayı otomatik algılar
   (yer tutucu "Cover reveal coming soon" kaybolur). Kapak kırpımı: ön kapak, 2:3 oranı (ideal 1600×2400).
2. **Amazon ön sipariş + Goodreads adresleri** — yer tutucular hazır; adresler gelince `index.html`'de
   `%%AMAZON_URL%%` / `%%GOODREADS_URL%%` değişir, butonlar kendiliğinden görünür.
3. Türkçe sayfa (kitabın TR baskısı için) — istenirse eklenir.
