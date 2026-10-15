"""Prepare reviewed concept pairs. Run with --check to verify the outputs."""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PAIRS = [
    ("anti-acne-gel", "Anti Acne Gel", 9, 10),
    ("glow-brightening-lotion", "Glow & Brightening Lotion", 11, 12),
    ("herbal-hair-powder", "Herbal Hair Powder", 13, 14),
    ("onion-bhringraj-hair-mask", "Onion & Bhringraj Hair Mask", 15, 16),
    ("kojic-night-cream", "Kojic Night Cream", 17, 18),
]


def prepare():
    sources = json.loads((ROOT.parent / "belif-image-index.json").read_text(encoding="utf-8-sig"))
    products = []
    used = set()
    for slug, name, front, info in PAIRS:
        entry = {
            "slug": slug, "name": name, "hoverApproved": False,
            "assetType": "user-supplied AI-generated concept artwork",
            "note": "Pair identity visually matched. Packaging, ingredients, efficacy and SPF claims are unverified; do not present information artwork as verified product facts.",
        }
        for role, index in (("front", front), ("info", info)):
            source = ROOT.parent / sources[index]
            target = ROOT / "dist" / "images" / "products" / slug / f"{role}.webp"
            target.parent.mkdir(parents=True, exist_ok=True)
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image).convert("RGB")
                image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                image.save(target, "WEBP", quality=90, method=6)
                entry[role] = {
                    "src": target.relative_to(ROOT / "dist").as_posix(),
                    "source": source.relative_to(ROOT).as_posix(),
                    "width": image.width, "height": image.height,
                }
            used.add(index)
        products.append(entry)
    manifest = {
        "version": 1,
        "sourceStatus": "User-supplied concept artwork, not verified brand photography",
        "products": products,
        "unmatched": [
            {"index": i, "source": (ROOT.parent / source).relative_to(ROOT).as_posix(),
             "reason": "Not assigned: product identity or matching alternate needs catalog confirmation."}
            for i, source in enumerate(sources) if i not in used
        ],
    }
    (ROOT / "image-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def check():
    manifest = json.loads((ROOT / "image-manifest.json").read_text(encoding="utf-8"))
    assert len(manifest["products"]) == 5
    assert len(manifest["unmatched"]) == 19
    for product in manifest["products"]:
        assert product["hoverApproved"] is False
        for role in ("front", "info"):
            asset = product[role]
            assert (ROOT / asset["source"]).is_file()
            with Image.open(ROOT / "dist" / asset["src"]) as image:
                assert image.format == "WEBP"
                assert image.size == (asset["width"], asset["height"])
                assert 0 < min(image.size) <= max(image.size) <= 1200
    print("PASS: 5 pairs / 10 WebP assets; source paths, dimensions and unapproved claims checked; 19 unmatched files recorded.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if not args.check:
        prepare()
    check()
