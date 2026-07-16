from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    "index.html",
    "index-en.html",
)


class GalleryLinksTest(unittest.TestCase):
    def test_gallery_and_drive_links_are_removed_from_all_pages(self):
        forbidden_fragments = (
            "Galeriyi Görüntüle",
            "View Gallery",
            "openGalleryModal",
            "drive.google.com",
            "galleryModal",
        )

        for page_name in PAGES:
            page = (ROOT / page_name).read_text(encoding="utf-8")
            with self.subTest(page=page_name):
                for fragment in forbidden_fragments:
                    self.assertNotIn(fragment, page)

    def test_service_cards_do_not_look_clickable(self):
        stylesheet = (ROOT / "style.css").read_text(encoding="utf-8")
        self.assertNotIn(
            ".service-item {\n    cursor: pointer;\n}",
            stylesheet,
        )

    def test_stylesheet_url_busts_immutable_cache(self):
        expected = 'href="style.css?v=20260716-motion-v3"'
        for page_name in PAGES:
            page = (ROOT / page_name).read_text(encoding="utf-8")
            with self.subTest(page=page_name):
                self.assertIn(expected, page)

    def test_socialkas_link_is_preserved(self):
        for page_name in PAGES:
            page = (ROOT / page_name).read_text(encoding="utf-8")
            with self.subTest(page=page_name):
                self.assertIn(
                    "https://www.socialkas.com",
                    page,
                )

    def test_sensitive_bank_details_are_not_public(self):
        forbidden_fragments = ("IBAN", "Ziraat Bank", "bankModal")
        for page_name in PAGES:
            page = (ROOT / page_name).read_text(encoding="utf-8")
            with self.subTest(page=page_name):
                for fragment in forbidden_fragments:
                    self.assertNotIn(fragment, page)

    def test_legacy_php_endpoints_are_removed(self):
        for path in ("index.php", "index-en.php", "get_photos.php"):
            self.assertFalse((ROOT / path).exists(), path)


if __name__ == "__main__":
    unittest.main()
