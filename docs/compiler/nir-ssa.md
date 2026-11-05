# Rekayasa Bentuk SSA & Algoritma Mem2Reg pada NIR

## 1. Konsep Static Single Assignment (SSA)

Bentuk *Static Single Assignment* (SSA) adalah properti representasi perantara di mana:
1. Setiap variabel/register diinisialisasi atau didefinisikan tepat **satu kali**.
2. Setiap penggunaan variabel (*use*) merujuk secara unik ke satu definisi (*def*).

Keuntungan utama SSA pada NIR adalah memfasilitasi analisis aliran data (*data-flow analysis*) dan transformasi optimasi berkinerja tinggi, seperti *Dead Code Elimination*, *Constant Propagation*, dan alokasi register untuk generasi kode LLVM/native.

## 2. Pipa Transformasi Mem2Reg (`SSAConverter`)

Saat AST bahasa Nusantara pertama kali diturunkan (*lowered*), variabel lokal dialokasikan di stack menggunakan pola `alloca`, `store`, dan `load`. Pendekatan ini menghindari komplikasi SSA awal pada tahap AST, tetapi menghasilkan instruksi akses memori yang berlebihan.

Transformasi **Mem2Reg** (`src/compiler/nir/ssa/conversion.ts`) mempromosikan alokasi stack tersebut menjadi register SSA murni dengan algoritma berikut:

### Langkah 1: Klasifikasi Variabel yang Dapat Dipromosikan
Hanya alokasi `alloca` yang:
- Bukan alokasi struktur/array majemuk (scalar only).
- Alamatnya tidak pernah lolos (*escaped* atau dipassing sebagai pointer ke fungsi eksternal).
- Hanya disentuh oleh instruksi `load` dan `store`.

### Langkah 2: Konstruksi Dominator Tree & Dominance Frontier
1. Menghitung relasi dominasi $d \text{ dom } b$ (blok $d$ mendominasi blok $b$ jika setiap jalur dari *entry block* ke $b$ harus melewati $d$).
2. Membentuk pohon dominator (*Dominator Tree*) di mana setiap anak didominasi langsung oleh orang tuanya (*immediate dominator*).
3. Menghitung batas dominasi (*Dominance Frontier* / $DF$):
   $$DF(X) = \{ Y \mid \exists P \in \text{Pred}(Y) \text{ s.t. } X \text{ dom } P \land \neg(X \text{ sdom } Y) \}$$

### Langkah 3: Penempatan Simpul Phi (Iterated Dominance Frontier)
Untuk setiap variabel $v$ yang ditulis pada sekumpulan blok $W_v$, simpul Phi ($\phi$) dimasukkan pada batas dominasi iterasi ($IDF$):
$$IDF(W_v)$$
Simpul Phi berfungsi sebagai selektor nilai dari jalur pendahulu yang bertemu di titik kontrol gabungan.

### Langkah 4: Penamaan Ulang Variabel (Renaming via Tree Walk)
1. Menelusuri Dominator Tree secara *depth-first search* (DFS).
2. Memelihara tumpukan nilai definisi terkini (*definition stack*) untuk setiap variabel.
3. Menggantikan seluruh instruksi `load` dengan definisi teratas pada tumpukan.
4. Memperbarui operand simpul Phi pada blok penerus.
5. Menghapus instruksi `alloca`, `load`, dan `store` yang sudah tidak lagi digunakan.

## 3. Penyederhanaan Simpul Phi

Simpul Phi dapat disederhanakan atau dieliminasi jika:
- Seluruh operand masuk berasal dari definisi yang sama: $\phi(x, x) \rightarrow x$.
- Operand masuk adalah dirinya sendiri (siklus rekursif tunggal) dan satu nilai eksternal $x$: $\phi(x, \text{self}) \rightarrow x$.
- Simpul Phi tidak memiliki pengguna (*dead phi*).
