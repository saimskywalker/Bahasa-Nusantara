/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ProjectOptions {
  name: string;
  template?: '2d' | '3d' | 'ecs';
  width?: number;
  height?: number;
  fps?: number;
}

export class GameProjectGenerator {
  public static generate(options: ProjectOptions): GeneratedFile[] {
    const name = options.name.trim();
    const template = options.template || '2d';
    const width = options.width || 800;
    const height = options.height || 600;
    const fps = options.fps || 60;

    const files: GeneratedFile[] = [];

    // 1. project.nusantara.toml
    const tomlContent = `[proyek]
nama = "${name}"
versi = "0.1.0"
tipe = "game"
target_bahasa = "v0.47.0"

[game]
judul = "${name} - Game Nusantara"
lebar = ${width}
tinggi = ${height}
fps = ${fps}
renderer = "canvas2d"
adegan_awal = "AdeganUtama"

[aset]
direktori = "assets"
maksimal_ukuran_mb = 50
`;
    files.push({ path: 'project.nusantara.toml', content: tomlContent });

    // 2. src/utama.nusantara
    const srcUtama = `// ============================================
// Proyek Game: ${name}
// Bahasa Pemrograman Nusantara v0.47.0
// ============================================

gunakan "std:game";
gunakan "std:uji";

tulis("Memulai game: ${name}");

fungsi mulaiGame() {
    var app = buatAplikasiGame("${name}", ${width}, ${height});
    tulis("Game diinisialisasi pada resolusi " + teks(${width}) + "x" + teks(${height}));
    kembalikan app;
}

var aplikasi = mulaiGame();
aplikasi.langkah(1 / ${fps});
tulis("Langkah pertama game selesai dengan sukses.");
`;
    files.push({ path: 'src/utama.nusantara', content: srcUtama });

    // 3. assets/README.md
    files.push({
      path: 'assets/README.md',
      content: `# Direktori Aset Game ${name}

Simpan berkas tekstur, audio, model 3D, dan konfigurasi JSON di sini:
- \`assets/textures/\`: Tekstur gambar (.png, .jpg, .webp)
- \`assets/audio/\`: Berkas audio (.wav, .mp3, .ogg)
- \`assets/scenes/\`: Adegan dan level JSON (.json)
`,
    });

    // 4. assets/scenes/adegan_utama.json
    files.push({
      path: 'assets/scenes/adegan_utama.json',
      content: JSON.stringify(
        {
          sceneName: 'AdeganUtama',
          entities: [
            {
              id: 'entitas_pemain',
              name: 'Pemain',
              components: [
                { type: 'Transform2D', x: 400, y: 300, rotation: 0, scaleX: 1, scaleY: 1 },
                { type: 'Sprite', width: 32, height: 32, color: '#3388ff' },
                { type: 'RigidBody2D', mass: 1, gravityScale: 1 },
              ],
            },
          ],
        },
        null,
        2
      ),
    });

    // 5. README.md
    files.push({
      path: 'README.md',
      content: `# ${name}

Proyek game berbasis **NUSANTARA Game Development Kit (v0.47.0)**.

## Menjalankan Game
\`\`\`bash
nusantara game run
\`\`\`

## Memeriksa Status & Tolok Ukur
\`\`\`bash
nusantara game inspect
nusantara game benchmark
\`\`\`
`,
    });

    return files;
  }
}
