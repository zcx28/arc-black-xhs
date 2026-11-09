#!/usr/bin/env python3
"""Copy the editable Together starter into an empty output directory."""
import argparse
from pathlib import Path
import shutil


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="New or empty project directory")
    args = parser.parse_args()
    target = args.output.expanduser().resolve()
    skill = Path(__file__).resolve().parents[1]
    if target == skill or skill in target.parents:
        parser.error("Choose an output directory outside the installed skill.")
    if target.exists() and (not target.is_dir() or any(target.iterdir())):
        parser.error(f"Output must be new or empty: {target}")
    shutil.copytree(skill / "assets/template", target, dirs_exist_ok=True)
    print(f"Starter copied to {target}")
    print("Replace the example copy and page selection with the current source content.")
    print(f"Preview: {target / 'index.html'}")


if __name__ == "__main__":
    main()
