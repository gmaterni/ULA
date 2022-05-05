#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import argparse
import pathlib as pth
import shutil
import os
from ulalib.ula_setting import *

__date__ = "02-05-2022"
__version__ = "0.0.1"
__author__ = "Marta Materni"


# name.txt => name.token.csv
def get_token_tmp_path(text_name, ext=""):
    token_name = text_name.replace(".txt", f".token{ext}.csv")
    token_tmp_path = os.path.join(TMP_DIR, token_name)
    return token_tmp_path

# text/name.txt => data/name.token{ext}.csv
def get_token_path(text_name):
    token_name = text_name.replace(".txt", f".token.csv")
    token_path = os.path.join(TEXT_DATA_DIR, token_name)
    return token_path

def move_path(path1, path2):
    shutil.move(path1, path2)

def readd_text_upd(self, text_path):
    text_name = os.path.basename(text_path)
    "text/name.txt => data/name.token.csv"
    token_path = get_token_path(text_name)
    token_path1 = get_token_tmp_path(text_name, "1")
    print(text_path)
    print(text_name)
    print(token_path)
    print(token_path1)

    # if ptu.exists(token_path1) is False:
    if pth.Path(token_path1).exists() is False:
        print(f"{token_path1} Non  esistente")
        sys.exit()
    
    # data/name.token.cv => tmp/name.token1.csv
    self.move_path(token_path1, token_path)


def do_main(text_path):
    readd_text_upd(text_path)


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
        help="-i <text_path>")

    args = parser.parse_args()
    do_main(args.src)
