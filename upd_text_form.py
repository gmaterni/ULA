#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import argparse
from ulalib.update_data import UpdateData
from ulalib.ula_setting import CORPUS_NAME
import os

__date__ = "09-04-2022"
__version__ = "0.1.4"
__author__ = "Marta Materni"

"""Aggiorna data/text_name.form.csv
 con i dati di data_corpus/corpus_name.form.csv
"""

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    if len(sys.argv) == 1:
        print(f"\nauthor: {__author__}")
        print(f"release: {__version__} { __date__}")
        parser.print_help()
        sys.exit()
    parser.add_argument(
        '-i',
        dest="src",
        required=True,
        metavar="",
        help="-i text_src/<text_name>")
    args = parser.parse_args()
    text_name = os.path.basename(args.src)
    corpus_name = CORPUS_NAME
    print(text_name)
    # AAA verificare se salvare prima i files data
    #update_text_form_csv(corpus_name, text_name)
    upd = UpdateData()
    upd.set_text_name(text_name)
    upd.update_text_forms()
