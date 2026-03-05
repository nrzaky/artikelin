# Artikelin

Artikelin adalah platform blog modern yang memungkinkan admin membuat, mengelola, dan mempublikasikan artikel dengan mudah. Website ini menggunakan **React + TypeScript** untuk frontend dan **Supabase** sebagai backend service (database, storage, dan API).

Project ini dirancang sebagai **content management system (CMS) sederhana** untuk blog dengan fitur SEO, multi kategori, dan manajemen artikel.

---

# 🚀 Fitur Utama

### 📝 Manajemen Artikel
- Membuat artikel baru
- Mengedit artikel
- Menghapus artikel
- Status artikel (Draft / Published)
- Upload gambar artikel
- SEO meta title & description

### 🏷 Multiple Categories
- Satu artikel dapat memiliki **lebih dari satu kategori**
- Sistem relasi many-to-many
- Manajemen kategori di dashboard admin

### 🔎 Pencarian Artikel
- Search artikel berdasarkan judul
- Pagination halaman artikel

### 📰 Tampilan Blog
- Featured article di homepage
- Recent articles
- Related articles
- Estimated reading time
- Table of contents (TOC)

### 🖼 Media Storage
- Upload gambar menggunakan **Supabase Storage**
- Auto delete image saat artikel dihapus
- Auto replace image saat edit artikel

### 🔐 Admin Dashboard
- Login admin
- Dashboard statistik artikel
- CRUD artikel
- Manajemen kategori

### 🔍 SEO Optimization
- Meta title
- Meta description
- OpenGraph tags
- Canonical URL

---

# 🛠 Teknologi yang Digunakan

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Shadcn UI**
- **React Router**

### Backend / BaaS
- **Supabase**

Supabase digunakan untuk:

- PostgreSQL Database
- Storage (image upload)
- REST API
- Authentication (opsional)

---

# 🗄 Database

Database menggunakan **PostgreSQL (Supabase)** dengan struktur utama:

### Articles
Menyimpan data artikel.

| Field | Type |
|-----|-----|
| id | integer |
| title | text |
| slug | text |
| content | text |
| image | text |
| status | draft / published |
| meta_title | text |
| meta_description | text |
| created_at | timestamp |

---

### Categories
Kategori artikel.

| Field | Type |
|-----|-----|
| id | integer |
| name | text |

---

### Article Categories
Relasi many-to-many antara artikel dan kategori.

| Field | Type |
|-----|-----|
| article_id | integer |
| category_id | integer |

---

# 🗂 Struktur Project
