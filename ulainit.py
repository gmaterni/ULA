#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import ulalib.pathutils as ptu

__date__ = "10-01-2023"
__version__ = "0.1.0"
__author__ = "Marta Materni"


def make_dirs():
    try:
        ptu.make_dir("text")
        ptu.make_dir("text_src")
        ptu.make_dir("data")
        ptu.make_dir("dta_corpus")
        ptu.make_dir("data_back")
        ptu.make_dir("data_corpus_bak")
        ptu.make_dir("data_export")
    except Exception as e:
        sys.exit(e)


if __name__ == "__main__":
    make_dirs()
