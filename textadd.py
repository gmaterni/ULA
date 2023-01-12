#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import ulalib.pathutils as ptu
from ulalib.ula_setting import TEXT_SRC_DIR, CORPUS_NAME
from texttodata import Text2Data
from textcleaner import TextCleaner

__date__ = "13-01-2023"
__version__ = "0.2.2"
__author__ = "Marta Materni"


def add_text_data(text_path, line_len):
    """
    pulisce il testo da file_path
    lo scrive TEXT_SRC_DIR
    esrae i dati 
    li scive in ./data
    pulisce file_path

    es.
    legge 
        ./text/file_nametxt
    TextCleaner pulisce dati e 
    scrive
        ./text_src/file_name.txt
    legge 
        ./text_src/file_nametxt
    Text2Data  estra i dati
    scrive 
     ./data/file_name.form.csv
     ./data/file_name.token.csv
     scrive
     ./data/text_list.txt

    """
    try:
        file_name = os.path.basename(text_path)
        # sistema il testo e salva
        out_path = ptu.join(TEXT_SRC_DIR, file_name)
        tcxclr = TextCleaner()
        tcxclr.clean_file_text(text_path, out_path, line_len)
        # estrae i dati csv e salva
        inp_path = out_path
        tx2dt = Text2Data()
        tx2dt.text2data(inp_path)
    except Exception as e:
        msg = f'ERROR \n{e}'
        sys.exit(msg)

if __name__ == "__main__":
    le = len(sys.argv)
    if le < 2:
        print(f"\nauthor: {__author__}")
        print(f"release: {__version__} { __date__}")
        h="""\n textadd.py <text_path> """
        print(h)
        sys.exit()
    text_path = sys.argv[1]
    # line_len = 0 if le < 3 else sys.argv[2]
    # n=int(line_len)
    n=0
    add_text_data(text_path,n)
