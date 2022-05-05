#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import argparse
from ulalib.ualog import Log
import ulalib.pathutils as ptu
from ulalib.save_back import save_text_data_back
import shutil
import os
import re
from difflib import *
from ulalib.ula_setting import *
from text2data import Text2Data
from text_cleaner import TextCleaner
import datetime

__date__ = "02-05-2022"
__version__ = "0.0.1"
__author__ = "Marta Materni"


class AddUpdText(object):

    def __init__(self):
        pass

    def read_data(self, path):
        try:
            fr = open(path, 'r', encoding=ENCODING)
            text = fr.read()
            fr.close()
        except Exception as e:
            msg = f'ERROR {path} Not Found.\n{e}'
            sys.exit(msg)
        text = text.replace(os.linesep, ' ')
        rows = re.split(" ", text)
        lst = []
        for row in rows:
            if row.strip() == '':
                continue
            lst.append(row)
        return lst

    def write_data(self, path, lst):
        try:
            text = os.linesep.join(lst)
            fw = open(path, "w", encoding=ENCODING)
            fw.write(text)
            fw.close()
        except Exception as e:
            msg = f'ERROR {path} \n{e}'
            sys.exit(msg)

    def set_diff_list(self, lst1, lst2):
        d = Differ()
        diff = d.compare(lst1, lst2)
        diff_lst = list(diff)
        dlst = [x for x in diff_lst if len(x.strip()) > 0 and x[0] != '?']
        dlstda = [x for x in dlst if x[0] in ('-', '+', '^')]
        self.write_data("tmp/diff.txt", dlst)
        self.write_data("tmp/diffupd.txt", dlstda)
        over_lst = []
        new_lst = []
        s_p = ""
        for r in dlst:
            s = r[1:].strip()
            if r.find("-") == 0:
                s_p = s
                continue
            if r.find("+") == 0 and len(s_p) > 1:
                f_p, k_p = s_p.split("|")
                if f_p != k_p:
                    f, k = s.split("|")
                    if f == f_p:
                        s = f'{f}|{k_p}'
                        over_lst.append(s)
            new_lst.append(s)
            s_p = ""

        self.write_data("diff_over.txt",over_lst)
        over = os.linesep.join(over_lst)
        print(over)
        return new_lst

    def set_diff_token(self, path1, path2, path3):
        lst1 = self.read_data(path1)
        lst2 = self.read_data(path2)
        lst3 = self.set_diff_list(lst1, lst2)
        self.write_data(path3, lst3)

    # def save_token_back(self, token_path):
    #     ymdh = str(datetime.datetime.today().strftime('%y%m%d_%H'))
    #     token_bak = token_path.replace(".csv", f"_{ymdh}.csv")
    #     shutil.copyfile(token_path, token_bak)

    # name.txt => name.token.csv
    def get_token_tmp_path(self, text_name, ext=""):
        token_name = text_name.replace(".txt", f".token{ext}.csv")
        token_tmp_path = os.path.join(TMP_DIR, token_name)
        return token_tmp_path

    # text/name.txt => data/name.token{ext}.csv
    def get_token_path(self, text_name):
        token_name = text_name.replace(".txt", f".token.csv")
        token_path = os.path.join(TEXT_DATA_DIR, token_name)
        return token_path

    def move_path(self, path1, path2):
        shutil.move(path1, path2)

    def add_text(self, text_path, line_len=0):
        try:
            path_err = "log/addt_text.ERR.log"
            logerr = Log("w").open(path_err, 1).log
            text_name = os.path.basename(text_path)

            # sistema il testo e salva
            out_path = ptu.join(TEXT_SRC_DIR, text_name)
            tcxclr = TextCleaner()
            tcxclr.clean_file_text(text_path, out_path, line_len)

            # estrae i dati csv e salva
            inp_path = out_path
            tx2dt = Text2Data()
            tx2dt.text2data(inp_path)
        except Exception as e:
            msg = f'ERROR add_text \n{e}'
            logerr(msg)
            sys.exit()

    """
    1) .token.csv => .token1.csv
    2) add_text (testo modifico) salva
    .token.csv
    3) .token.csv => .token2.csv
    4) merge dell diff e omografi diisambguizzati
    .token1.csv token2.csv => token.csv
    stampa lista disamb.sovrascritti.
    5) sistemazione omografi disamb. sovrascritti
    6) update corpus

    """

    def add_text_upd(self, text_path, line_len=0):
        text_name = os.path.basename(text_path)

        "text/name.txt => data/name.token.csv"
        token_path = self.get_token_path(text_name)
        if ptu.exists(token_path) is False:
            print(f"{token_path} Non  esistente")
            print("Lanciare prima add_text con il testo originale")
            sys.exit()

        # crea se non esiste la dir tmp
         # se esiste la svuota
        ptu.make_dir(TMP_DIR)
        tmp_lst = ptu.list_path(TMP_DIR, "*")
        for pth in tmp_lst:
            os.remove(pth)

        token_path1 = self.get_token_tmp_path(text_path, "1")
        token_path2 = self.get_token_tmp_path(token_path, "2")
        token_path3 = self.get_token_tmp_path(token_path, "3")
        # crea se non esiste la dir tmp
        ptu.make_dir_of_file(token_path1, 0o777)

        # data/name.token.cv => tmp/name.token1.csv
        self.move_path(token_path, token_path1)

        # elabora e salva data/name.token.csv
        # data/name.token.csv => tmp/name.token2.csv
        self.add_text(text_path, line_len)
        self.move_path(token_path, token_path2)

        # salva data/name.token.csv
        self.set_diff_token(token_path1, token_path2, token_path3)


def do_main(text_path, ll):
    aut = AddUpdText()
    aut.add_text_upd(text_path, ll)


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
    parser.add_argument(
        '-l',
        dest="linelen",
        required=False,
        default=0,
        metavar="",
        help="-l <line length> -1:not split  0:paragraph >0:rows (default 0")

    args = parser.parse_args()
    ll = int(args.linelen)
    do_main(args.src, ll)
