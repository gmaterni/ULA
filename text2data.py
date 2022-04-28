#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pdb import set_trace
import sys
import os
import argparse
import re
from ulalib.ualog import Log
import ulalib.pathutils as ptu
#from ulalib.write_path import write_file_path
from ulalib.ula_setting import TEXT_DATA_DIR, NAME_TEXT_LIST
from ulalib.ula_setting import ENCODING, PUNCTS

__date__ = "21-03-2022"
__version__ = "0.3.6"
__author__ = "Marta Materni"


class Text2Data(object):
    """
    text2data(text_path) 
    estrai dati li scrive in formato csv
    aggiorna data/text_list.txt
    es.
    txt_path =   text_src/<name_file>.txt

    estrae i dati e scrive in
    data/<name_file>.form.csv
    data/<name_file.token.csv
    aggorna
    data/text_lst.txt
    """

    def __init__(self):
        path_err = "log/text2data.ERR.log"
        self.logerr = Log("w").open(path_err, 1).log

    def text2token_list(self, text):
        text = text.replace(os.linesep, ' ')
        lst = re.split(" ", text)
        token_lst = []
        for token in lst:
            if token.strip() == '':
                continue
            token = token.lower()
            s = f"{token}|{token}"
            token_lst.append(s)
        return token_lst

    def token_list2form_list(self, token_lst):
        #lst = sorted(list(set(token_lst)))
        lst = list(set(token_lst))
        form_lst = []
        for item in lst:
            if item.strip() == '':
                continue
            if item[0] in PUNCTS:
                continue
            if item[0].isnumeric():
                continue
            form = f'{item.strip()}||||||'
            form_lst.append(form)
        form_lst = sorted(form_lst, key=lambda x: (x.split('|')[0]))
        return form_lst

    def write_tokens_forms(self, f_inp):
        # scrive ./data/text_name.form.csv
        #         ./data/txt_name.token.csv
        try:
            fr = open(f_inp, 'r', encoding=ENCODING)
            text = fr.read()
            fr.close()
        except Exception as e:
            msg = f'ERROR 1 write_tokens_forms \n{e}'
            self.logerr(msg)
            sys.exit()

        token_lst = self.text2token_list(text)
        form_lst = self.token_list2form_list(token_lst)
        file_name = os.path.basename(f_inp)

        try:
            f_name_token = file_name.replace(".txt", ".token.csv")
            f_out = ptu.join(TEXT_DATA_DIR, f_name_token)
            tokens = os.linesep.join(token_lst)
            fw = open(f_out, "w", encoding=ENCODING)
            fw.write(tokens)
            fw.close()
        except Exception as e:
            msg = f'ERROR 2 write_tokens_forms \n{e}'
            self.logerr(msg)
            sys.exit()
        print(f"{f_inp} => {f_out}")

        try:
            f_name_form = file_name.replace(".txt", ".form.csv")
            f_out = ptu.join(TEXT_DATA_DIR, f_name_form)
            forms = os.linesep.join(form_lst)
            fw = open(f_out, "w", encoding=ENCODING)
            fw.write(forms)
            fw.close()
        except Exception as e:
            msg = f'ERROR 3 write_tokens_forms \n{e}'
            self.logerr(msg)
            sys.exit()
        print(f"{f_inp} => {f_out}")

    def write_text_list(self):
        try:
            src = ptu.str2path(TEXT_DATA_DIR)
            file_text_lst = ptu.list_path(src, "*.form.csv")
            text_lst = sorted([x.name.replace(".form.csv", "")
                              for x in file_text_lst])
            text = os.linesep.join(text_lst)
            fw = open(NAME_TEXT_LIST, "w", encoding=ENCODING)
            fw.write(text)
            fw.close()
        except Exception as e:
            msg = f'ERROR write_text_list \n{e}'
            self.logerr(msg)
            sys.exit(e)

    def text2data(self, text_path):
        self.write_tokens_forms(text_path)
        self.write_text_list()

def do_main(text_path):
    Text2Data().text2data(text_path)

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
    args = parser.parse_args()
    do_main(args.src)
