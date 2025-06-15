# Anti Rippers Bot

![Gambar Hero](https://i.imgur.com/IDotbWR.png) 

**Anti Rippers-Bot** adalah bot WhatsApp multifungsi yang dirancang untuk membantu mengelola grup, menyediakan fitur keamanan, dan berbagai utilitas langsung di dalam chat WhatsApp Anda. Bot ini dibangun menggunakan Node.js dan library Baileys.

---

## ✨ Fitur Unggulan

Bot ini dilengkapi dengan berbagai fitur canggih untuk memenuhi kebutuhan Anda:

-   **Manajemen Grup:**
    -   `Autokick Ripper`: Otomatis mengeluarkan anggota yang terdeteksi di database penipu saat bergabung atau melalui pemindaian penuh.

-   **Keamanan:**
    -   `Anti-Call`: Otomatis memblokir nomor yang menelepon bot untuk mencegah gangguan.

-   **Utilitas:**
    -   `Pencari Database`: Mencari data penipu berdasarkan nama atau nomor langsung dari chat.

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

-   [Node.js](https://nodejs.org/en/) (v16 atau yang lebih baru)
-   [Git](https://git-scm.com/downloads)
-   [FFmpeg](https://ffmpeg.org/download.html) (Untuk memproses media seperti stiker video)
-   [ImageMagick](https://imagemagick.org/script/download.php) (Untuk manipulasi gambar)

---

## ⚙️ Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan bot di server atau komputer Anda.

1.  **Clone Repositori**

    Buka terminal atau command prompt Anda dan jalankan perintah berikut:

    ```bash
    git clone https://github.com/DFansyah/Anti-Rippers.git
    cd Anti-Rippers
    ```

2.  **Instal Dependensi**

    Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan:

    ```bash
    npm install
    ```

3.  **Konfigurasi**

    -   Buka file `settings.js`.
    -   Ubah `global.owner` dengan nomor WhatsApp Anda (format: `['628xxxxxxxxxx']`).
    -   Atur pengaturan lain seperti nama bot (`botname`), nama pemilik (`ownername`), dll.

---

## 🚀 Menjalankan Bot

Setelah instalasi selesai, Anda bisa menjalankan bot dengan perintah:

```bash
npm start