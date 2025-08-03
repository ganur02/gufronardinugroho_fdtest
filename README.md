## 📚 Proyek: gufronardinugroho_fdtest

Proyek ini merupakan aplikasi **Laravel 10.x** dengan front-end **React** dan **Inertia.js**, serta menggunakan **PostgreSQL** sebagai basis data.

---

## 🔧 Persyaratan Sistem

* **PHP** >= 8.2
* **Composer**
* **Node.js** (v16+)
* **PostgreSQL**
* **Git**

---

## 🚀 Instalasi & Setup

1. **Clone repository**:

   ```bash
   git clone https://github.com/ganur02/gufronardinugroho_fdtest.git
   cd gufronardinugroho_fdtest
   ```

2. **Install dependencies**:

   * Backend (Laravel):

     ```bash
     composer install
     ```
   * Frontend (React/Inertia.js):

     ```bash
     npm install
     ```

3. **Konfigurasi environment**:

   ```bash
   cp .env.example .env
   ```

   Sesuaikan pengaturan database di file `.env`:

   ```dotenv
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=gufronardinugroho_fdtest
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   ```

4. **Generate application key**:

   ```bash
   php artisan key:generate
   ```

5. **Migrasi database**:

   ```bash
   php artisan migrate
   ```

6. **Jalankan development server**:

   * Terminal 1 (Laravel API):

     ```bash
     php artisan serve
     ```
   * Terminal 2 (Vite dev server untuk React):

     ```bash
     npm run dev
     ```

7. **Akses aplikasi** di browser:

   ```
   http://localhost:8000
   ```

---

## 🖥️ Menjalankan Build Production

```bash
npm run build
```

---

## 🔐 Keamanan

* Password user di-hash menggunakan **bcrypt** (Laravel default).
* **Jangan** commit file `.env` ke repository publik.

---

## 🛠️ Teknologi & Dependensi Utama

| Bagian      | Teknologi              |
| ----------- | ---------------------- |
| Backend     | Laravel 10.x (PHP 8.2) |
| Frontend    | React 18 + Inertia.js  |
| Bundler     | Vite                   |
| Database    | PostgreSQL             |
| Styling     | Tailwind CSS           |
| HTTP Client | Axios                  |
| Animations  | Framer Motion          |
| Notifikasi  | React Toastify         |
| Ikon        | Lucide React           |

---

## 📑 Git & Repository

* Nama repository: **gufronardinugroho_fdtest**
* Branch utama: **main**

---

## 🚨 Catatan Tambahan

* Pastikan PostgreSQL sudah berjalan dan kredensial di `.env` sesuai.
* Untuk menjalankan tets, gunakan:

  ```bash
  php artisan test
  ```

Selamat mencoba dan **Happy Coding!** 🎉