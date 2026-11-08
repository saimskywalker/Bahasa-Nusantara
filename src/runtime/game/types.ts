/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME DEVELOPMENT KIT (GAME SDK) - Tipe Dasar & Aljabar Linier
 * Target Milestone: Phase 47 (v0.47.0)
 */

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static one(): Vector2 {
    return new Vector2(1, 1);
  }

  public tambah(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  public add(v: Vector2): Vector2 {
    return this.tambah(v);
  }

  public kurang(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  public subtract(v: Vector2): Vector2 {
    return this.kurang(v);
  }

  public kali(skalar: number): Vector2 {
    return new Vector2(this.x * skalar, this.y * skalar);
  }

  public scale(skalar: number): Vector2 {
    return this.kali(skalar);
  }

  public bagi(skalar: number): Vector2 {
    if (skalar === 0) return new Vector2(0, 0);
    return new Vector2(this.x / skalar, this.y / skalar);
  }

  public panjang(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public length(): number {
    return this.panjang();
  }

  public panjangKuadrat(): number {
    return this.x * this.x + this.y * this.y;
  }

  public normalisasi(): Vector2 {
    const len = this.panjang();
    if (len === 0) return new Vector2(0, 0);
    return new Vector2(this.x / len, this.y / len);
  }

  public normalized(): Vector2 {
    return this.normalisasi();
  }

  public jarak(v: Vector2): number {
    return this.kurang(v).panjang();
  }

  public distanceTo(v: Vector2): number {
    return this.jarak(v);
  }

  public titik(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public dot(v: Vector2): number {
    return this.titik(v);
  }

  public salin(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public clone(): Vector2 {
    return this.salin();
  }

  public samaDengan(v: Vector2, toleransi = 1e-5): boolean {
    return Math.abs(this.x - v.x) <= toleransi && Math.abs(this.y - v.y) <= toleransi;
  }
}

export class Vector3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public static up(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  public static forward(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  public static right(): Vector3 {
    return new Vector3(1, 0, 0);
  }

  public tambah(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public add(v: Vector3): Vector3 {
    return this.tambah(v);
  }

  public kurang(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public subtract(v: Vector3): Vector3 {
    return this.kurang(v);
  }

  public kali(skalar: number): Vector3 {
    return new Vector3(this.x * skalar, this.y * skalar, this.z * skalar);
  }

  public scale(skalar: number): Vector3 {
    return this.kali(skalar);
  }

  public bagi(skalar: number): Vector3 {
    if (skalar === 0) return new Vector3(0, 0, 0);
    return new Vector3(this.x / skalar, this.y / skalar, this.z / skalar);
  }

  public panjang(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public length(): number {
    return this.panjang();
  }

  public normalisasi(): Vector3 {
    const len = this.panjang();
    if (len === 0) return new Vector3(0, 0, 0);
    return new Vector3(this.x / len, this.y / len, this.z / len);
  }

  public normalized(): Vector3 {
    return this.normalisasi();
  }

  public titik(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public dot(v: Vector3): number {
    return this.titik(v);
  }

  public silang(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  public cross(v: Vector3): Vector3 {
    return this.silang(v);
  }

  public jarak(v: Vector3): number {
    return this.kurang(v).panjang();
  }

  public distanceTo(v: Vector3): number {
    return this.jarak(v);
  }

  public salin(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public clone(): Vector3 {
    return this.salin();
  }
}

export class Color {
  constructor(
    public r: number = 1,
    public g: number = 1,
    public b: number = 1,
    public a: number = 1
  ) {}

  public static white(): Color {
    return new Color(1, 1, 1, 1);
  }

  public static putih(): Color {
    return Color.white();
  }

  public static black(): Color {
    return new Color(0, 0, 0, 1);
  }

  public static hitam(): Color {
    return Color.black();
  }

  public static red(): Color {
    return new Color(1, 0, 0, 1);
  }

  public static merah(): Color {
    return Color.red();
  }

  public static green(): Color {
    return new Color(0, 1, 0, 1);
  }

  public static hijau(): Color {
    return Color.green();
  }

  public static blue(): Color {
    return new Color(0, 0, 1, 1);
  }

  public static biru(): Color {
    return Color.blue();
  }

  public static transparent(): Color {
    return new Color(0, 0, 0, 0);
  }

  public toHex(includeAlpha: boolean = false): string {
    const toHexVal = (v: number) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, '0');
    if (includeAlpha || this.a < 1) {
      return `#${toHexVal(this.r)}${toHexVal(this.g)}${toHexVal(this.b)}${toHexVal(this.a)}`;
    }
    return `#${toHexVal(this.r)}${toHexVal(this.g)}${toHexVal(this.b)}`;
  }

  public toRgbaString(): string {
    return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
  }

  public clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  public static fromHex(hex: string): Color {
    let clean = hex.replace('#', '');
    if (clean.length === 6) clean += 'ff';
    if (clean.length !== 8) return Color.white();
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = parseInt(clean.substring(6, 8), 16) / 255;
    return new Color(r, g, b, a);
  }
}

export class Rect {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public lebar: number = 0,
    public tinggi: number = 0
  ) {}

  public get width(): number {
    return this.lebar;
  }
  public set width(v: number) {
    this.lebar = v;
  }

  public get height(): number {
    return this.tinggi;
  }
  public set height(v: number) {
    this.tinggi = v;
  }

  public get xMin(): number {
    return this.x;
  }
  public get xMax(): number {
    return this.x + this.lebar;
  }
  public get yMin(): number {
    return this.y;
  }
  public get yMax(): number {
    return this.y + this.tinggi;
  }

  public memuatTitik(titik: Vector2): boolean {
    return (
      titik.x >= this.xMin &&
      titik.x <= this.xMax &&
      titik.y >= this.yMin &&
      titik.y <= this.yMax
    );
  }

  public contains(xOrPt: number | Vector2, y?: number): boolean {
    if (typeof xOrPt === 'number') {
      const py = y !== undefined ? y : 0;
      return xOrPt >= this.xMin && xOrPt <= this.xMax && py >= this.yMin && py <= this.yMax;
    }
    return this.memuatTitik(xOrPt);
  }

  public tumpangTindih(r: Rect): boolean {
    return (
      this.xMin < r.xMax &&
      this.xMax > r.xMin &&
      this.yMin < r.yMax &&
      this.yMax > r.yMin
    );
  }

  public intersects(r: Rect): boolean {
    return this.tumpangTindih(r);
  }

  public clone(): Rect {
    return new Rect(this.x, this.y, this.lebar, this.tinggi);
  }
}
