#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import argparse
import os
from ulalib.ualog import Log
import ulalib.pathutils as ptu
from ulalib.ula_setting import TEXT_SRC_DIR, CORPUS_NAME
from texttodata import Text2Data
from textcleaner import TextCleaner

__date__ = "06-05-2022"
__version__ = "0.2.1"
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
        path_err = "log/addt_text.ERR.log"
        logerr = Log("w").open(path_err, 1).log
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
        msg = f'ERROR add_text_data \n{e}'
        logerr(msg)
        sys.exit()


if __name__ == "__main__":
    le = len(sys.argv)
    if le < 2:
        print(f"\nauthor: {__author__}")
        print(f"release: {__version__} { __date__}")
        h=""" 
textadd.py <text_path>
        """
        print(h)
        sys.exit()
    text_path = sys.argv[1]
    line_len = 0 if le < 3 else sys.argv[2]
    n=int(line_len)
    add_text_data(text_path,n)

# if __name__ == "__main__":
#     parser = argparse.ArgumentParser()
#     if len(sys.argv) == 1:
#         print(f"\nauthor: {__author__}")
#         print(f"release: {__version__} { __date__}")
#         parser.print_help()
#         sys.exit()
#     parser.add_argument(
#         '-i',
#         dest="src",
#         required=True,
#         metavar="",
#         help="-i <text_path>")
#     parser.add_argument(
#         '-l',
#         dest="linelen",
#         required=False,
#         default=0,
#         metavar="",
#         help="-l <line length> -1:not split  0:paragraph >0:rows (default 0")

#     args = parser.parse_args()
#     ll = int(args.linelen)
#     add_text_data(args.src, ll)
