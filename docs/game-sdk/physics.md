# Mesin Fisika 2D (2D Physics Engine)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Komponen Fisika

Mesin fisika 2D Nusantara menyediakan:
- **`PhysicsWorld2D`**: Mengatur gravitasi global (default `9.8 m/s²`), integrasi kecepatan Euler semi-implisit, deteksi benturan, dan resolusi impuls.
- **`RigidBody2D`**: Menyimpan massa, restitusi (kelentingan), redaman linear, dan status kinematik/dinamik.
- **`BoxCollider2D`**: Collider kotak berbasis AABB (Axis-Aligned Bounding Box).
- **`CircleCollider2D`**: Collider lingkaran berbasis radius.
- **Raycasting 2D**: Menembakkan sinar garis untuk mendeteksi garis pandang atau tabrakan laser.

---

## 2. Resolusi Impuls dan Restitusi

Benturan diselesaikan dengan membatalkan penetrasi overlapping dan menghitung perubahan momentum berdasarkan restitusi gabungan (`min(bodyA.restitution, bodyB.restitution)`).
