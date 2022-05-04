#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import argparse
from ulalib.ualog import Log
import ulalib.pathutils as ptu
import os
from ulalib.ula_setting import TEXT_SRC_DIR, CORPUS_NAME
from text2data import Text2Data
from text_cleaner import TextCleaner

__date__ = "02-05-2022"
__version__ = "0.0.1"
__author__ = "Marta Materni"


def correct_text_data(file_path, line_len):
    """
    legge
        data/file_name_token.csv
    scrive
        data/file_name_token_err.csv

    invocda
        add_text

    confonrta
        data/file_name_token.csv (nuovo)
    con
        data/file_name_token_err.csv (nuovo)

    modifica
        data/file_name_token.csv (nuovo)

    """
    try:
        path_err = "log/addt_text.ERR.log"
        logerr = Log("w").open(path_err, 1).log
        file_name = os.path.basename(file_path)
        
        #sistema il testo e salva
        out_path = ptu.join(TEXT_SRC_DIR, file_name)
        tcxclr = TextCleaner()  
        tcxclr.clean_file_text(file_path, out_path, line_len)

        #estrae i dati csv e salva
        inp_path = out_path
        tx2dt = Text2Data()
        tx2dt.text2data(inp_path)

    except Exception as e:
        msg = f'ERROR add_text_data \n{e}'
        logerr(msg)
        sys.exit()


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
        help="-i <file_path>")
    parser.add_argument(
        '-l',
        dest="linelen",
        required=False,
        default=0,
        metavar="",
        help="-l <line length> -1:not split  0:paragraph >0:rows (default 0")

    args = parser.parse_args()
    ll = int(args.linelen)
    correct_text_data(args.src, ll)
