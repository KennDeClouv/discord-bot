# Discord Bot Leveling System  

## Overview  
Discord Bot Leveling System adalah bot yang dirancang untuk memberikan pengalaman interaktif dengan sistem leveling. Pengguna akan mendapatkan XP setiap kali mereka mengirim pesan, dengan hadiah berupa role khusus setiap mencapai level tertentu.  

## Features  
- **Leveling System**: Dapatkan XP berdasarkan aktivitas di channel.  
- **Cooldown XP**: Batasi pemberian XP dengan jeda waktu 1 menit.  
- **Role Rewards**: Berikan role spesial sebagai hadiah di level tertentu.  
- **Customizable**: Konfigurasi hadiah role dan perhitungan XP sesuai kebutuhan.  

## Prerequisites  
Sebelum menjalankan bot ini, pastikan kamu sudah memiliki:  
1. **Node.js** (Versi terbaru)  
2. **npm** (biasanya terinstal bersama Node.js)  
3. Token bot Discord dari [Discord Developer Portal](https://discord.com/developers/applications).  
4. **Discord.js** library terinstal.  

## Tutorial Instalasi Discord Bot Leveling System  

## 1. Siapkan Prasyarat  
pastikan kamu sudah menginstal software berikut:  
1. **Node.js**  
   - unduh [node.js](https://nodejs.org/) dan instal di komputer kamu.  
   - cek instalasi dengan perintah berikut di terminal:  
     ```bash  
     node -v  
     npm -v  
     ```  
     jika versi node.js dan npm muncul, berarti instalasi berhasil.  

2. **Git**  
   - unduh dan instal [git](https://git-scm.com/).  
   - cek instalasi dengan:  
     ```bash  
     git --version  
     ```  

3. **Token Discord Bot**  
   - buka [discord developer portal](https://discord.com/developers/applications).  
   - klik tombol **new application**, beri nama bot, dan buat.  
   - navigasi ke tab **bot**, klik **add bot**, lalu salin token bot.  

---

## 2. Clone Repository  
1. buka terminal atau command prompt.  
2. pindah ke folder tempat kamu ingin menyimpan bot:  
   ```bash  
   cd path/to/your/folder  
   ```  
3. clone repository:  
   ```bash  
   git clone https://github.com/KennDeClouv/discord-bot.git  
   cd discord-bot
   ```  

---

## 3. Install Dependencies  
1. pastikan kamu berada di dalam folder bot.  
2. jalankan perintah berikut untuk menginstal library yang dibutuhkan:  
   ```bash  
   npm install  
   ```  
3. tunggu sampai semua dependensi selesai terinstal.  

---

## 4. Setup File Environment  
1. buat file `.env` di folder root proyek.  
2. tambahkan konfigurasi berikut:  
   ```env  
   DISCORD_TOKEN=your-bot-token  
   GUILD_ID=your-server-id
   CLIENT_ID=bot-application-id
   DB_HOST=localhost
   DB_PORT=8888
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=discord

   SET_STATUS=online
   SET_ACTIVITY=Genshin Impact
   ```  
   **keterangan**:  
   - `DISCORD_TOKEN`: masukkan token bot yang sudah disalin sebelumnya.  
   - `GUILD_ID`: klik kanan server di discord (aktifkan developer mode), lalu salin id server.  
   - `DB_HOST`: alamat host database, biasanya 'localhost' untuk server lokal atau IP/domain untuk server remote
   - `DB_PORT`: port database, default untuk MySQL adalah '3306'
   - `DB_USER`: username untuk mengakses database (contoh: 'root')
   - `DB_PASSWORD`:password untuk username database yang digunakan
   - `DB_NAME`: nama database tempat menyimpan data bot (pastikan database sudah dibuat)
   - `SET_STATUS`:- status bot di discord, pilih salah satu:  
                  - 'online': aktif (default status)  
                  - 'idle': terlihat sedang tidak aktif  
                  - 'dnd': do not disturb (jangan ganggu)  
                  - 'invisible': bot terlihat offline (tetap berjalan)

   - `SET_ACTIVITY`: aktivitas bot

---

## 5. Jalankan Bot  
1. pastikan semua konfigurasi sudah benar.  
2. jalankan perintah berikut untuk memulai bot:  
   ```bash  
   node index.js  
   ```  
3. jika bot berhasil berjalan, akan muncul pesan seperti:  
   ```bash  
   Logged in as BotName#1234  
   ```  

---

## 6. Undang Bot ke Server  
1. kembali ke [discord developer portal](https://discord.com/developers/applications).  
2. pilih aplikasi bot kamu, lalu buka tab **OAuth2** > **URL Generator**.  
3. centang `bot` di scopes dan tambahkan permission yang dibutuhkan (misal: `Manage Roles`, `Send Messages`).  
4. salin url yang dihasilkan, lalu buka di browser untuk mengundang bot ke server kamu.  

---

## 7. Tes Bot  
1. buka server discord tempat bot sudah diundang.  
2. kirim pesan di salah satu channel untuk melihat apakah bot mulai menghitung xp.  
3. gunakan command `/level` untuk mengecek level kamu.  

---

made with 💘 by [kenndeclouv](https://kenndeclouv.rf.gd)
