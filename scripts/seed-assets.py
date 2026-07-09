#!/usr/bin/env python3
"""
Seed placeholder assets for each publication.

Copies a selection of the real motorsport photos (optimized/main-1800) into
/public/publications/<slug>/ as cover.jpg + gallery/NN.jpg, and writes a
branded placeholder brochure.pdf per publication.

Swapping in real photography later = drop files into these folders. No code
changes needed. Re-run with:  python3 scripts/seed-assets.py
"""
from __future__ import annotations
import json
import shutil
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "media" / "optimized" / "main-1800"
OUT = ROOT / "public" / "publications"
MANIFEST = ROOT / "src" / "data" / "gallery-manifest.json"

# slug -> cover source + ordered (section label, [sources]) groups.
# Gallery files are numbered sequentially across sections in declared order.
# Only folders that contain photos are seeded. Empty event folders become
# "coming soon" publications (handled in src/data/publications.ts).
# Image filenames mirror public/media/<event>/ — sourced from the optimized
# variants for performance.
PUBLICATIONS = {
    "24h-nuerburgring-2025": {
        "title": "24H Nürburgring 2025",
        "meta": "Nürburgring · Germany · June 2025",
        "cover": "CK1A7823",
        "sections": [
            ("Arrival", [
                "CK1A1682", "CK1A2347", "CK1A2185",
                "Auto-0049", "amg-4363",
            ]),
            ("Race", [
                "CK1A8005", "CK1A7967", "CK1A6184-2 2", "CK1A2429",
                "Aston-5414", "Audi-5394", "Auto-1276", "Aston-5642",
                "NBR-4047",
            ]),
            ("Night", [
                "CK1A8575-Enhanced-NR", "CK1A9107",
                "NBR-1", "NBR--1", "NBR-6", "nbr-9-6963", "Aston-7715",
            ]),
            ("People", ["NBR-4272", "NBR-4368"]),
            ("Atmosphere", [
                "CK1A1879", "CK1A2044", "CK1A5161 2",
                "CK1A6916 2", "CK1A2572", "CK1A4624 2",
            ]),
        ],
    },
    "24h-nuerburgring-2024": {
        "title": "24H Nürburgring 2024",
        "meta": "Nürburgring · Germany · June 2024",
        "cover": "CK1A9919",
        "sections": [
            ("Arrival", ["bts-amg-9994"]),
            ("Race", [
                "ASTON-1183", "ASTON-1610", "aston-walkenhorst",
                "Aston-9381", "ferrari-1318", "porsche-1283",
                "lambo-9447", "CK1A9467", "CK1A9919",
                "Alle-9553", "Alle-9596", "Alle-9605",
            ]),
            ("Night", [
                "Aston-", "Porsche-1695", "car-1809",
                "CK1A0235", "CK1A0402-2-Enhanced-NR",
            ]),
            ("Atmosphere", [
                "Aston-2787", "cars-2711", "cars-2760",
                "cars-3078", "cars-3086", "aston-3110", "aston-3118",
            ]),
        ],
    },
    "24h-nuerburgring-2022": {
        "title": "24H Nürburgring 2022",
        "meta": "Nürburgring · Germany · May 2022",
        "cover": "IMG_3449-cover",
        "sections": [
            ("Race", [
                "AMG-4886", "AMG-5136", "Ferrari-5126",
                "IMG_3438", "IMG_3440", "AMG-5516",
                "IMG_3412", "IMG_3449",
            ]),
            ("Atmosphere", ["BMW-5065-BW"]),
        ],
    },
    "f1-monza-2024": {
        "title": "F1 Monza 2024",
        "meta": "Monza · Italy · September 2024",
        "cover": "CK1A7249",
        "sections": [
            ("Practice", ["CK1A6968", "_MG_9944"]),
            ("Race", ["CK1A6585", "CK1A7012"]),
            ("Atmosphere", ["_MG_9897", "CK1A7138"]),
        ],
    },
    "24h-le-mans-2026": {
        "title": "24H Le Mans 2026",
        "meta": "Le Mans · France · June 2026",
        "cover": "CK1A0426",
        "sections": [
            ("Race", [
                "CK1A0232", "CK1A3702",
                "CK1A0384", "CK1A1036", "CK1A7212",
            ]),
            ("Night", ["CK1A2589"]),
            ("Atmosphere", ["prosche-91-le-mans"]),
        ],
    },
}


def src_path(name: str) -> Path:
    for ext in (".JPG", ".jpg", ".jpeg"):
        p = SRC / f"{name}{ext}"
        if p.exists():
            return p
    raise FileNotFoundError(f"Missing source image: {SRC / name}.(JPG|jpg|jpeg)")


def image_size(path: Path) -> tuple[int, int]:
    """Read pixel dimensions via sips (macOS built-in, same tool as optimize)."""
    out = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout
    width = height = 0
    for line in out.splitlines():
        if "pixelWidth" in line:
            width = int(line.split()[-1])
        elif "pixelHeight" in line:
            height = int(line.split()[-1])
    return width, height


def ascii_text(s: str) -> str:
    """Transliterate to ASCII for the placeholder PDF (avoids font encoding)."""
    return (
        unicodedata.normalize("NFKD", s)
        .encode("ascii", "ignore")
        .decode("ascii")
    )


def write_pdf(path: Path, title: str, meta: str) -> None:
    """Minimal dark-themed single-page placeholder PDF with correct xref."""
    title = ascii_text(title)
    meta = ascii_text(meta)

    content = (
        "q 0.039 0.039 0.043 rg 0 0 595 842 re f Q\n"
        "q 0.808 0.169 0.216 rg 60 612 64 4 re f Q\n"
        "BT /F1 11 Tf 0.541 0.541 0.561 rg 0.22 Tc 60 650 Td (JXL-VISUALS) Tj ET\n"
        f"BT /F1 46 Tf 0.949 0.945 0.933 rg 0 Tc 60 545 Td ({pdf_escape(title)}) Tj ET\n"
        f"BT /F2 15 Tf 0.541 0.541 0.561 rg 60 500 Td ({pdf_escape(meta)}) Tj ET\n"
        "BT /F2 12 Tf 0.4 0.4 0.42 rg 60 90 Td (Placeholder brochure - replace at "
        "/public/publications/<slug>/brochure.pdf) Tj ET\n"
    )
    objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        "/Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        f"<< /Length {len(content.encode('latin-1'))} >>\nstream\n{content}endstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
        "/Encoding /WinAnsiEncoding >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
        "/Encoding /WinAnsiEncoding >>",
    ]

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for i, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n{body}\nendobj\n".encode("latin-1")

    xref_pos = len(out)
    n = len(objects) + 1
    out += f"xref\n0 {n}\n".encode("latin-1")
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += f"{off:010d} 00000 n \n".encode("latin-1")
    out += (
        f"trailer\n<< /Size {n} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n"
    ).encode("latin-1")

    path.write_bytes(out)


def pdf_escape(s: str) -> str:
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    manifest: dict[str, dict[str, int]] = {}
    for slug, pub in PUBLICATIONS.items():
        folder = OUT / slug
        gallery = folder / "gallery"
        gallery.mkdir(parents=True, exist_ok=True)

        cover_src = src_path(pub["cover"])
        shutil.copyfile(cover_src, folder / "cover.jpg")
        w, h = image_size(cover_src)
        manifest[f"/publications/{slug}/cover.jpg"] = {"width": w, "height": h}

        idx = 1
        for _label, sources in pub["sections"]:
            for s in sources:
                source = src_path(s)
                shutil.copyfile(source, gallery / f"{idx:02d}.jpg")
                w, h = image_size(source)
                manifest[f"/publications/{slug}/gallery/{idx:02d}.jpg"] = {
                    "width": w, "height": h,
                }
                idx += 1

        write_pdf(folder / "brochure.pdf", pub["title"], pub["meta"])
        print(f"  {slug}: cover + {idx - 1} gallery images + brochure.pdf")

    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(f"Wrote image dimensions for {len(manifest)} files to "
          f"{MANIFEST.relative_to(ROOT)}")
    print(f"Seeded {len(PUBLICATIONS)} publications into {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
