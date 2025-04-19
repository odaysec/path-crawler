# Path Crawler CLI
📁 CLI tool sederhana untuk mengekstrak seluruh path atau direktori dari sebuah website menggunakan Node.js.

---

## 🔧 Fitur

- Ekstraksi semua path dari halaman utama website dan file eksternal (JS/CSS).
- Menyimpan hasil otomatis ke folder `results/<domain>/directory_list.txt`.
- Dapat dijalankan langsung dari terminal dengan satu perintah.

---

## 🚀 Cara Pakai

### 1. Clone & Install
```bash
git clone https://github.com/odaysec/path-crawler.git
cd path-crawler/project/recon/
npm install
```

### 2. Jadikan CLI
```bash
chmod +x index.js
npm link
```

### 3. Jalankan Tool
```bash
pathcrawler https://targetwebsite.com
```

Hasil akan otomatis disimpan di:
```
results/targetwebsite.com/directory_list.txt
```

---

## 📦 Contoh Output

```
/assets/js/main.js
/css/style.css
/uploads/images/logo.png
/admin/login.php
```
[![asciicast](https://asciinema.org/a/716340.svg)](https://asciinema.org/a/716340)

---

## 🛠 Dependencies

- [axios](https://www.npmjs.com/package/axios) - HTTP client
- [cheerio](https://www.npmjs.com/package/cheerio) - jQuery-like HTML parser

---

## ⚠️ Catatan

- Tool ini hanya bekerja pada website yang kontennya dapat diakses publik (tidak melalui JavaScript async rendering).
- Tidak merepresentasikan vulnerability checker, hanya digunakan untuk eksplorasi struktur URL.

---

## 🧑‍💻 License
MIT License.
